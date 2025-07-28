<script lang="ts">
	import TimerDisplay from '$lib/components/TimerDisplay.svelte';
	import TimerControls from '$lib/components/TimerControls.svelte';
	// import SoundSelector from '$lib/components/SoundSelector.svelte'; // REMOVED
	// import VolumeControl from '$lib/components/VolumeControl.svelte'; // REMOVED
	import { timerState, timerSettings } from '$lib/stores/timerStore';
	import type { SessionType, TimerSettings as TimerSettingsType } from '$lib/stores/timerStore';
	import {
		backgroundSettings,
		resetBackgroundSettingsToDefaults,
		randomizeGradientColor1,
		randomizeGradientColor2,
		setGradientColor1,
		setGradientColor2,
		previousGradientColor1,
		nextGradientColor1,
		previousGradientColor2,
		nextGradientColor2,
		// NEW: Auto-cycle imports
		toggleAutoCycleColor1,
		toggleAutoCycleColor2,
		// REMOVED stepAutoCycleColor1,
		// REMOVED stepAutoCycleColor2
		generateControlledRandomStep // NEW import
	} from '$lib/stores/backgroundSettingsStore';
	import type { BackgroundSettings as BackgroundSettingsType } from '$lib/stores/backgroundSettingsStore';
	import InteractiveBackground from '$lib/components/InteractiveBackground.svelte';
	import BackgroundSettingsPanel from '$lib/components/BackgroundSettingsPanel.svelte'; // NEW Import
	import { onMount, onDestroy } from 'svelte';
	import { get } from 'svelte/store'; // NEW Import for immediate read

	// --- HSL/Hex Conversion Utilities ---
	function hslToHex(h: number, s: number, l: number): string {
		s /= 100;
		l /= 100;
		const k = (n: number) => (n + h / 30) % 12;
		const a = s * Math.min(l, 1 - l);
		const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
		return `#${Math.round(255 * f(0))
			.toString(16)
			.padStart(2, '0')}${Math.round(255 * f(8))
			.toString(16)
			.padStart(2, '0')}${Math.round(255 * f(4))
			.toString(16)
			.padStart(2, '0')}`;
	}
	function hexToHsl(hex: string): string | null {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		if (!result) return null;
		let r = parseInt(result[1], 16) / 255,
			g = parseInt(result[2], 16) / 255,
			b = parseInt(result[3], 16) / 255;
		const max = Math.max(r, g, b),
			min = Math.min(r, g, b);
		let h = 0,
			s = 0,
			l = (max + min) / 2;
		if (max === min) h = s = 0;
		else {
			const d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;
				case g:
					h = (b - r) / d + 2;
					break;
				case b:
					h = (r - g) / d + 4;
					break;
			}
			h /= 6;
		}
		return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
	}
	function parseHslString(
		hslStr: string | null | undefined
	): { h: number; s: number; l: number } | null {
		if (!hslStr) return null;
		const match = hslStr.match(/hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/);
		return match ? { h: parseInt(match[1]), s: parseInt(match[2]), l: parseInt(match[3]) } : null;
	}

	// --- Component State ---
	let showSettings = false;
	let hasMounted = false;

	// DOM element references for click-outside logic
	let settingsPanelElement: HTMLDivElement;
	let settingsButtonElement: HTMLButtonElement;

	// --- Dynamic Main Container Background Colors ---
	const mainStartBg = { h: 222, s: 20, l: 22 }; // Dark slate-like base
	const mainEndBg = { h: 230, s: 25, l: 30 }; // Slightly more purplish/bluish and lighter

	let currentMainBgH = mainStartBg.h;
	let currentMainBgS = mainStartBg.s;
	let currentMainBgL = mainStartBg.l;

	// --- Timer Settings Local State ---
	let localWorkDuration = $timerSettings.workDuration / 60;
	let localShortBreakDuration = $timerSettings.shortBreakDuration / 60;
	let localLongBreakDuration = $timerSettings.longBreakDuration / 60;
	let localSessionsBeforeLongBreak = $timerSettings.sessionsBeforeLongBreak;
	let localAutoCycle = $timerSettings.autoCycle;

	// --- Background Settings Local State (HSL for store, Hex for pickers) ---
	let localGradientColor1Hsl = $backgroundSettings.gradientColor1;
	let localGradientColor2Hsl = $backgroundSettings.gradientColor2;
	// let localGradientColor1Hex = ''; // REMOVED
	// let localGradientColor2Hex = ''; // REMOVED
	let localIsFloatingEnabled = $backgroundSettings.isFloatingEnabled;

	// NEW: Local HSL components for inputs
	let localGradientColor1H = 0;
	let localGradientColor1S = 0;
	let localGradientColor1L = 0;
	let localGradientColor2H = 0;
	let localGradientColor2S = 0;
	let localGradientColor2L = 0;

	// Auto-cycle state
	let localIsAutoCyclingColor1 = $backgroundSettings.isAutoCyclingColor1;
	let localIsAutoCyclingColor2 = $backgroundSettings.isAutoCyclingColor2;

	// NEW: Animation State for Auto-Cycle
	let targetH1 = 0,
		targetS1 = 0,
		targetL1 = 0;
	let startH1 = 0,
		startS1 = 0,
		startL1 = 0;
	let cycleStartTime1: number | undefined;

	let targetH2 = 0,
		targetS2 = 0,
		targetL2 = 0;
	let startH2 = 0,
		startS2 = 0,
		startL2 = 0;
	let cycleStartTime2: number | undefined;

	const AUTO_CYCLE_DURATION = 15000; // Changed to 15 seconds

	// --- Floating Animation State ---
	let floatX = 0;
	let floatY = 0;
	let floatRotate = 0;
	let animationFrameId: number;

	// --- Dynamic Tagline State ---
	const taglineSuffixes = [
		'a Notification Badge.',
		'an Unfinished Task.',
		'a Distraction.',
		'My To-Do List.',
		"Yesterday's Excuses."
	];
	let currentTaglineSuffixIndex = 0;
	let currentTaglineSuffix = taglineSuffixes[0];
	let taglineIntervalId: number | undefined;

	// Auto-cycle interval ID (purpose changed: now triggers new target generation)
	let autoCycleIntervalId: number | undefined;

	// NEW: Animation Frame ID for interpolation loop
	let colorAnimationId: number | undefined;

	// NEW: Timeout IDs for slider interaction auto-resume
	let sliderInteractionTimeoutId1: number | undefined;
	let sliderInteractionTimeoutId2: number | undefined;

	// NEW: Flags to track if auto-cycle was on before slider drag
	let wasAutoCyclingBeforeInteraction1 = false;
	let wasAutoCyclingBeforeInteraction2 = false;

	// --- Dynamic Header Text Color State ---
	let headerTextColorClass = 'text-teal-400'; // Default for title
	let subHeaderTextColorClass = 'text-gray-400'; // Default for subtitle
	const LIGHTNESS_THRESHOLD = 60; // If average lightness > this, use dark text

	// --- Lifecycle ---
	onMount(() => {
		// Initialize Timer Settings
		const currentStoreTimerSettings = $timerSettings;
		localWorkDuration = currentStoreTimerSettings.workDuration / 60;
		localShortBreakDuration = currentStoreTimerSettings.shortBreakDuration / 60;
		localLongBreakDuration = currentStoreTimerSettings.longBreakDuration / 60;
		localSessionsBeforeLongBreak = currentStoreTimerSettings.sessionsBeforeLongBreak;
		localAutoCycle = currentStoreTimerSettings.autoCycle;

		// Initialize Background Colors & Floating Setting
		const currentStoreBackgroundSettings = $backgroundSettings;
		localGradientColor1Hsl = currentStoreBackgroundSettings.gradientColor1;
		localGradientColor2Hsl = currentStoreBackgroundSettings.gradientColor2;
		localIsFloatingEnabled = currentStoreBackgroundSettings.isFloatingEnabled;
		// const hsl1 = parseHslString(localGradientColor1Hsl);
		// if (hsl1) localGradientColor1Hex = hslToHex(hsl1.h, hsl1.s, hsl1.l); // REMOVED
		// const hsl2 = parseHslString(localGradientColor2Hsl);
		// if (hsl2) localGradientColor2Hex = hslToHex(hsl2.h, hsl2.s, hsl2.l); // REMOVED

		// NEW: Initialize local HSL components
		function initializeHslComponents() {
			const hsl1 = parseHslString($backgroundSettings.gradientColor1);
			if (hsl1) {
				localGradientColor1H = hsl1.h;
				localGradientColor1S = hsl1.s;
				localGradientColor1L = hsl1.l;
			}
			const hsl2 = parseHslString($backgroundSettings.gradientColor2);
			if (hsl2) {
				localGradientColor2H = hsl2.h;
				localGradientColor2S = hsl2.s;
				localGradientColor2L = hsl2.l;
			}
		}
		initializeHslComponents();

		// Initialize animation targets/starts
		targetH1 = startH1 = localGradientColor1H;
		targetS1 = startS1 = localGradientColor1S;
		targetL1 = startL1 = localGradientColor1L;
		targetH2 = startH2 = localGradientColor2H;
		targetS2 = startS2 = localGradientColor2S;
		targetL2 = startL2 = localGradientColor2L;

		hasMounted = true;

		// Start Floating Animation Loop
		const floatStartTime = performance.now();
		function floatLoop(currentTime: number) {
			const elapsedTime = currentTime - floatStartTime;
			if ($backgroundSettings.isFloatingEnabled) {
				floatX = Math.sin(elapsedTime / 2000) * 7;
				floatY = Math.cos(elapsedTime / 2800) * 5;
				floatRotate = Math.sin(elapsedTime / 3500) * 1.5;
			} else {
				floatX = 0;
				floatY = 0;
				floatRotate = 0;
			}
			// Combined animation frame request below
			// animationFrameId = requestAnimationFrame(floatLoop);
		}
		// Removed initial call, will be part of combined loop

		// Start Tagline Rotation
		currentTaglineSuffix = taglineSuffixes[currentTaglineSuffixIndex]; // Set initial
		taglineIntervalId = window.setInterval(() => {
			currentTaglineSuffixIndex = (currentTaglineSuffixIndex + 1) % taglineSuffixes.length;
			currentTaglineSuffix = taglineSuffixes[currentTaglineSuffixIndex];
		}, 30000); // 30 seconds

		// Start Auto-cycle TARGET Generation Interval
		autoCycleIntervalId = window.setInterval(() => {
			if (localIsAutoCyclingColor1) {
				const currentHsl1 = $backgroundSettings.gradientColor1; // Get current color
				const targetHslString1 = generateControlledRandomStep(currentHsl1); // Use new function
				const targetHsl1 = parseHslString(targetHslString1);
				if (targetHsl1) {
					// console.log(`New target 1: ${targetHsl1.h}, ${targetHsl1.s}%, ${targetHsl1.l}%`);
					startH1 = localGradientColor1H;
					startS1 = localGradientColor1S;
					startL1 = localGradientColor1L;
					targetH1 = targetHsl1.h;
					targetS1 = targetHsl1.s;
					targetL1 = targetHsl1.l;
					cycleStartTime1 = performance.now();
				}
			}
			if (localIsAutoCyclingColor2) {
				const currentHsl2 = $backgroundSettings.gradientColor2; // Get current color
				const targetHslString2 = generateControlledRandomStep(currentHsl2); // Use new function
				const targetHsl2 = parseHslString(targetHslString2);
				if (targetHsl2) {
					// console.log(`New target 2: ${targetHsl2.h}, ${targetHsl2.s}%, ${targetHsl2.l}%`);
					startH2 = localGradientColor2H;
					startS2 = localGradientColor2S;
					startL2 = localGradientColor2L;
					targetH2 = targetHsl2.h;
					targetS2 = targetHsl2.s;
					targetL2 = targetHsl2.l;
					cycleStartTime2 = performance.now();
				}
			}
		}, AUTO_CYCLE_DURATION); // Generate new target every 15 seconds

		// --- Combined Animation Frame Loop ---
		function animationLoop(currentTime: number) {
			// Floating animation part
			floatLoop(currentTime);

			// Color Auto-Cycle Interpolation Part
			if (localIsAutoCyclingColor1 && cycleStartTime1 !== undefined) {
				const elapsed = currentTime - cycleStartTime1;
				const progress = Math.min(1, elapsed / AUTO_CYCLE_DURATION);

				localGradientColor1H = lerpAngle(startH1, targetH1, progress);
				localGradientColor1S = lerp(startS1, targetS1, progress);
				localGradientColor1L = lerp(startL1, targetL1, progress);

				if (progress >= 1) cycleStartTime1 = undefined; // End cycle
			}
			if (localIsAutoCyclingColor2 && cycleStartTime2 !== undefined) {
				const elapsed = currentTime - cycleStartTime2;
				const progress = Math.min(1, elapsed / AUTO_CYCLE_DURATION);

				localGradientColor2H = lerpAngle(startH2, targetH2, progress);
				localGradientColor2S = lerp(startS2, targetS2, progress);
				localGradientColor2L = lerp(startL2, targetL2, progress);

				if (progress >= 1) cycleStartTime2 = undefined; // End cycle
			}

			colorAnimationId = requestAnimationFrame(animationLoop);
		}
		colorAnimationId = requestAnimationFrame(animationLoop); // Start the combined loop
	});

	onDestroy(() => {
		// if (animationFrameId) { // Now handled by colorAnimationId
		//   cancelAnimationFrame(animationFrameId);
		// }
		if (taglineIntervalId) {
			clearInterval(taglineIntervalId);
		}
		// Clear auto-cycle target generation interval
		if (autoCycleIntervalId) {
			clearInterval(autoCycleIntervalId);
		}
		// NEW: Clear combined animation frame loop
		if (colorAnimationId) {
			cancelAnimationFrame(colorAnimationId);
		}
		// NEW: Clear interaction timeouts and reset flags
		if (sliderInteractionTimeoutId1) clearTimeout(sliderInteractionTimeoutId1);
		if (sliderInteractionTimeoutId2) clearTimeout(sliderInteractionTimeoutId2);
		wasAutoCyclingBeforeInteraction1 = false;
		wasAutoCyclingBeforeInteraction2 = false;
		// Note: click listeners are cleaned up by Svelte's reactive statement return function
	});

	// --- Interpolation Helpers ---
	function lerp(start: number, end: number, t: number): number {
		return Math.round(start * (1 - t) + end * t);
	}

	function lerpAngle(start: number, end: number, t: number): number {
		const shortest_angle = ((((end - start) % 360) + 540) % 360) - 180;
		return Math.round((start + shortest_angle * t + 360) % 360);
	}

	// --- Click Outside Handler ---
	function handleClickOutside(event: MouseEvent) {
		if (showSettings) {
			if (
				settingsPanelElement &&
				!settingsPanelElement.contains(event.target as Node) &&
				settingsButtonElement &&
				!settingsButtonElement.contains(event.target as Node)
			) {
				showSettings = false;
			}
		}
	}

	// --- Reactive Statements & Store Subscriptions ---

	// Add/Remove click listeners for Settings Panel
	$: if (typeof window !== 'undefined' && hasMounted && showSettings) {
		const handler = (e: MouseEvent) => handleClickOutside(e);
		window.addEventListener('click', handler, true);
		// This function expression, as the last statement, becomes the cleanup function.
		() => {
			window.removeEventListener('click', handler, true);
		};
	}

	// Update main background color based on timer progress
	$: {
		const state = $timerState;
		const settings = $timerSettings;
		let totalDurationForCurrentSession = settings.workDuration;
		if (state.currentSession === 'Short Break') {
			totalDurationForCurrentSession = settings.shortBreakDuration;
		} else if (state.currentSession === 'Long Break') {
			totalDurationForCurrentSession = settings.longBreakDuration;
		}
		totalDurationForCurrentSession = Math.max(1, totalDurationForCurrentSession);
		const progressRatio =
			state.isRunning || state.timeRemaining < totalDurationForCurrentSession
				? Math.max(0, state.timeRemaining / totalDurationForCurrentSession)
				: 1;
		const interpolationFactor = 1 - progressRatio;
		currentMainBgH = mainStartBg.h + (mainEndBg.h - mainStartBg.h) * interpolationFactor;
		currentMainBgS = mainStartBg.s + (mainEndBg.s - mainStartBg.s) * interpolationFactor;
		currentMainBgL = mainStartBg.l + (mainEndBg.l - mainStartBg.l) * interpolationFactor;
	}

	// Update Timer Settings store when local values change
	$: if (hasMounted) {
		const newTimerSettings: TimerSettingsType = {
			workDuration: Math.max(1, localWorkDuration) * 60,
			shortBreakDuration: Math.max(1, localShortBreakDuration) * 60,
			longBreakDuration: Math.max(1, localLongBreakDuration) * 60,
			sessionsBeforeLongBreak: Math.max(1, localSessionsBeforeLongBreak),
			autoCycle: localAutoCycle
		};
		if (
			$timerSettings.workDuration !== newTimerSettings.workDuration ||
			$timerSettings.shortBreakDuration !== newTimerSettings.shortBreakDuration ||
			$timerSettings.longBreakDuration !== newTimerSettings.longBreakDuration ||
			$timerSettings.sessionsBeforeLongBreak !== newTimerSettings.sessionsBeforeLongBreak ||
			$timerSettings.autoCycle !== newTimerSettings.autoCycle
		) {
			timerSettings.set(newTimerSettings);
		}
	}

	// Subscribe to Timer Settings store for external changes
	timerSettings.subscribe((settings) => {
		if (settings.workDuration / 60 !== localWorkDuration)
			localWorkDuration = settings.workDuration / 60;
		if (settings.shortBreakDuration / 60 !== localShortBreakDuration)
			localShortBreakDuration = settings.shortBreakDuration / 60;
		if (settings.longBreakDuration / 60 !== localLongBreakDuration)
			localLongBreakDuration = settings.longBreakDuration / 60;
		if (settings.sessionsBeforeLongBreak !== localSessionsBeforeLongBreak)
			localSessionsBeforeLongBreak = settings.sessionsBeforeLongBreak;
		if (settings.autoCycle !== localAutoCycle) localAutoCycle = settings.autoCycle;
	});

	// NEW: HSL inputs to HSL string for store
	$: if (hasMounted) {
		const constructedHsl1 = `hsl(${localGradientColor1H}, ${localGradientColor1S}%, ${localGradientColor1L}%)`;
		if (constructedHsl1 !== localGradientColor1Hsl) {
			// console.log("Updating store color 1 from HSL inputs");
			setGradientColor1(constructedHsl1);
			// localGradientColor1Hsl will be updated via subscription below
		}
	}
	$: if (hasMounted) {
		const constructedHsl2 = `hsl(${localGradientColor2H}, ${localGradientColor2S}%, ${localGradientColor2L}%)`;
		if (constructedHsl2 !== localGradientColor2Hsl) {
			// console.log("Updating store color 2 from HSL inputs");
			setGradientColor2(constructedHsl2);
			// localGradientColor2Hsl will be updated via subscription below
		}
	}

	// Background Settings: Local changes to Background Settings store (only floating enabled now)
	$: if (hasMounted) {
		// if ($backgroundSettings.gradientColor1 !== localGradientColor1Hsl || // Color handled by dedicated reactive blocks above
		//     $backgroundSettings.gradientColor2 !== localGradientColor2Hsl || // Color handled by dedicated reactive blocks above
		if ($backgroundSettings.isFloatingEnabled !== localIsFloatingEnabled) {
			backgroundSettings.update((currentSettings) => ({
				...currentSettings,
				// gradientColor1: localGradientColor1Hsl, // Managed elsewhere
				// gradientColor2: localGradientColor2Hsl, // Managed elsewhere
				isFloatingEnabled: localIsFloatingEnabled
			}));
		}
	}

	// Subscribe to Background Settings store for external changes
	backgroundSettings.subscribe((settings) => {
		// Update local HSL string reference
		let needsHslComponentUpdate1 = false;
		if (settings.gradientColor1 !== localGradientColor1Hsl) {
			localGradientColor1Hsl = settings.gradientColor1;
			needsHslComponentUpdate1 = true;
			// const hslParts = parseHslString(localGradientColor1Hsl); // Moved below
			// if (hslParts) {
			// const newHex = hslToHex(hslParts.h, hslParts.s, hslParts.l);
			// if (newHex !== localGradientColor1Hex) {
			// localGradientColor1Hex = newHex;
			// }
			// }
		}
		// Update local HSL string reference
		let needsHslComponentUpdate2 = false;
		if (settings.gradientColor2 !== localGradientColor2Hsl) {
			localGradientColor2Hsl = settings.gradientColor2;
			needsHslComponentUpdate2 = true;
			// const hslParts = parseHslString(localGradientColor2Hsl);
			// if (hslParts) {
			// const newHex = hslToHex(hslParts.h, hslParts.s, hslParts.l);
			// if (newHex !== localGradientColor2Hex) {
			// localGradientColor2Hex = newHex;
			// }
			// }
		}

		// NEW: Update HSL component inputs if the HSL string changed
		if (needsHslComponentUpdate1) {
			const hslParts = parseHslString(localGradientColor1Hsl);
			if (hslParts) {
				// Check before assigning to prevent feedback loop with reactive updates
				if (hslParts.h !== localGradientColor1H) localGradientColor1H = hslParts.h;
				if (hslParts.s !== localGradientColor1S) localGradientColor1S = hslParts.s;
				if (hslParts.l !== localGradientColor1L) localGradientColor1L = hslParts.l;
			}
		}
		if (needsHslComponentUpdate2) {
			const hslParts = parseHslString(localGradientColor2Hsl);
			if (hslParts) {
				// Check before assigning to prevent feedback loop with reactive updates
				if (hslParts.h !== localGradientColor2H) localGradientColor2H = hslParts.h;
				if (hslParts.s !== localGradientColor2S) localGradientColor2S = hslParts.s;
				if (hslParts.l !== localGradientColor2L) localGradientColor2L = hslParts.l;
			}
		}

		if (settings.isFloatingEnabled !== localIsFloatingEnabled) {
			localIsFloatingEnabled = settings.isFloatingEnabled;
		}

		// Update header text color based on background brightness
		const hsl1 = parseHslString(settings.gradientColor1);
		const hsl2 = parseHslString(settings.gradientColor2);
		let avgLightness = 25; // Default to a dark background value if parsing fails

		if (hsl1 && hsl2) {
			avgLightness = (hsl1.l + hsl2.l) / 2;
		} else if (hsl1) {
			avgLightness = hsl1.l;
		} else if (hsl2) {
			avgLightness = hsl2.l;
		}

		if (avgLightness > LIGHTNESS_THRESHOLD) {
			headerTextColorClass = 'text-slate-700'; // Darker text for light background
			subHeaderTextColorClass = 'text-slate-700'; // Changed from text-slate-600 for better contrast
		} else {
			headerTextColorClass = 'text-teal-400'; // Default light text for dark background
			subHeaderTextColorClass = 'text-gray-200'; // Changed from text-gray-400 for better visibility
		}

		// NEW: Update local auto-cycle flags
		if (settings.isAutoCyclingColor1 !== localIsAutoCyclingColor1) {
			localIsAutoCyclingColor1 = settings.isAutoCyclingColor1;
		}
		if (settings.isAutoCyclingColor2 !== localIsAutoCyclingColor2) {
			localIsAutoCyclingColor2 = settings.isAutoCyclingColor2;
		}

		// Stop interpolation if auto-cycle is toggled off externally
		if (!settings.isAutoCyclingColor1) cycleStartTime1 = undefined;
		if (!settings.isAutoCyclingColor2) cycleStartTime2 = undefined;
	});

	// --- NEW: Handlers for BackgroundSettingsPanel Component Events ---
	type HslColor = { h: number; s: number; l: number };

	// Renamed from handleHsl1Change - now triggered by on:input from child
	function handleSliderInput1(hsl: HslColor) {
		// console.log(`handleSliderInput1: H=${hsl.h}, S=${hsl.s}, L=${hsl.l}`);
		// Auto-cycle pause/resume logic is now handled by pointer events.
		// Just update the store for real-time background changes.
		setGradientColor1(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
	}

	// Renamed from handleHsl2Change
	function handleSliderInput2(hsl: HslColor) {
		// console.log(`handleSliderInput2: H=${hsl.h}, S=${hsl.s}, L=${hsl.l}`);
		setGradientColor2(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
	}

	// NEW: Pointer down handler for color 1 sliders
	function handleSliderPointerDown1() {
		// console.log("handleSliderPointerDown1");
		if (localIsAutoCyclingColor1) {
			console.log('PointerDown1: AC was on, turning off.');
			wasAutoCyclingBeforeInteraction1 = true;
			toggleAutoCycleColor1(); // Turn off AC in store
			cycleStartTime1 = undefined; // Stop animation
		}
		// Clear any existing resume timeout if user starts new interaction
		if (sliderInteractionTimeoutId1) {
			clearTimeout(sliderInteractionTimeoutId1);
			sliderInteractionTimeoutId1 = undefined;
		}
	}

	// NEW: Pointer up handler for color 1 sliders
	function handleSliderPointerUp1() {
		// console.log("handleSliderPointerUp1");
		if (wasAutoCyclingBeforeInteraction1) {
			console.log('PointerUp1: AC was on before drag, setting timeout to resume.');
			sliderInteractionTimeoutId1 = window.setTimeout(() => {
				sliderInteractionTimeoutId1 = undefined;
				// Check if still off (user hasn't manually toggled it back on/off quickly)
				if (!get(backgroundSettings).isAutoCyclingColor1) {
					console.log('PointerUp1 TIMEOUT: Resuming auto-cycle for color 1.');
					toggleAutoCycleColor1(); // Turn it back on in store
					// Animation start will be handled by the existing logic in handleToggleAutoCycle1
					// or the backgroundSettings.subscribe block
				}
			}, 1000);
		}
		wasAutoCyclingBeforeInteraction1 = false; // Reset for next interaction
	}

	// NEW: Pointer down handler for color 2 sliders
	function handleSliderPointerDown2() {
		// console.log("handleSliderPointerDown2");
		if (localIsAutoCyclingColor2) {
			console.log('PointerDown2: AC was on, turning off.');
			wasAutoCyclingBeforeInteraction2 = true;
			toggleAutoCycleColor2();
			cycleStartTime2 = undefined;
		}
		if (sliderInteractionTimeoutId2) {
			clearTimeout(sliderInteractionTimeoutId2);
			sliderInteractionTimeoutId2 = undefined;
		}
	}

	// NEW: Pointer up handler for color 2 sliders
	function handleSliderPointerUp2() {
		// console.log("handleSliderPointerUp2");
		if (wasAutoCyclingBeforeInteraction2) {
			console.log('PointerUp2: AC was on before drag, setting timeout to resume.');
			sliderInteractionTimeoutId2 = window.setTimeout(() => {
				sliderInteractionTimeoutId2 = undefined;
				if (!get(backgroundSettings).isAutoCyclingColor2) {
					console.log('PointerUp2 TIMEOUT: Resuming auto-cycle for color 2.');
					toggleAutoCycleColor2();
				}
			}, 1000);
		}
		wasAutoCyclingBeforeInteraction2 = false;
	}

	function handleRandomClick1() {
		// If AC is on, turn it off. No auto-resume for random click.
		if (localIsAutoCyclingColor1) {
			toggleAutoCycleColor1();
			cycleStartTime1 = undefined;
		}
		// Clear any pending slider auto-resume timeout and reset flag
		if (sliderInteractionTimeoutId1) clearTimeout(sliderInteractionTimeoutId1);
		sliderInteractionTimeoutId1 = undefined;
		wasAutoCyclingBeforeInteraction1 = false;

		const randomHsl = randomizeGradientColor1();
		setGradientColor1(randomHsl);
	}

	function handleRandomClick2() {
		if (localIsAutoCyclingColor2) {
			toggleAutoCycleColor2();
			cycleStartTime2 = undefined;
		}
		if (sliderInteractionTimeoutId2) clearTimeout(sliderInteractionTimeoutId2);
		sliderInteractionTimeoutId2 = undefined;
		wasAutoCyclingBeforeInteraction2 = false;

		const randomHsl = randomizeGradientColor2();
		setGradientColor2(randomHsl);
	}

	function handleToggleAutoCycle1() {
		// Clear any pending slider auto-resume timeout and reset flag
		if (sliderInteractionTimeoutId1) clearTimeout(sliderInteractionTimeoutId1);
		sliderInteractionTimeoutId1 = undefined;
		wasAutoCyclingBeforeInteraction1 = false;

		toggleAutoCycleColor1();

		if (get(backgroundSettings).isAutoCyclingColor1) {
			const currentHsl1 = $backgroundSettings.gradientColor1;
			const targetHslString1 = generateControlledRandomStep(currentHsl1);
			const targetHsl1 = parseHslString(targetHslString1);
			if (targetHsl1) {
				startH1 = localGradientColor1H;
				startS1 = localGradientColor1S;
				startL1 = localGradientColor1L;
				targetH1 = targetHsl1.h;
				targetS1 = targetHsl1.s;
				targetL1 = targetHsl1.l;
				cycleStartTime1 = performance.now();
			}
		} else {
			cycleStartTime1 = undefined;
		}
	}

	function handleToggleAutoCycle2() {
		if (sliderInteractionTimeoutId2) clearTimeout(sliderInteractionTimeoutId2);
		sliderInteractionTimeoutId2 = undefined;
		wasAutoCyclingBeforeInteraction2 = false;

		toggleAutoCycleColor2();

		if (get(backgroundSettings).isAutoCyclingColor2) {
			const currentHsl2 = $backgroundSettings.gradientColor2;
			const targetHslString2 = generateControlledRandomStep(currentHsl2);
			const targetHsl2 = parseHslString(targetHslString2);
			if (targetHsl2) {
				startH2 = localGradientColor2H;
				startS2 = localGradientColor2S;
				startL2 = localGradientColor2L;
				targetH2 = targetHsl2.h;
				targetS2 = targetHsl2.s;
				targetL2 = targetHsl2.l;
				cycleStartTime2 = performance.now();
			}
		} else {
			cycleStartTime2 = undefined;
		}
	}

	function handleToggleFloating(checked: boolean) {
		// Update the store directly as there's no dedicated toggle function
		backgroundSettings.update((settings) => ({ ...settings, isFloatingEnabled: checked }));
	}

	// NEW: Wrapper for Previous Color 1
	function handlePrev1Click() {
		if (localIsAutoCyclingColor1) {
			toggleAutoCycleColor1();
			cycleStartTime1 = undefined; // Stop current animation
		}
		if (sliderInteractionTimeoutId1) {
			// Clear pending slider-resume
			clearTimeout(sliderInteractionTimeoutId1);
			sliderInteractionTimeoutId1 = undefined;
		}
		wasAutoCyclingBeforeInteraction1 = false; // Reset flag
		previousGradientColor1(); // Call original store function
	}

	// NEW: Wrapper for Next Color 1
	function handleNext1Click() {
		if (localIsAutoCyclingColor1) {
			toggleAutoCycleColor1();
			cycleStartTime1 = undefined;
		}
		if (sliderInteractionTimeoutId1) {
			clearTimeout(sliderInteractionTimeoutId1);
			sliderInteractionTimeoutId1 = undefined;
		}
		wasAutoCyclingBeforeInteraction1 = false;
		nextGradientColor1();
	}

	// NEW: Wrapper for Previous Color 2
	function handlePrev2Click() {
		if (localIsAutoCyclingColor2) {
			toggleAutoCycleColor2();
			cycleStartTime2 = undefined;
		}
		if (sliderInteractionTimeoutId2) {
			clearTimeout(sliderInteractionTimeoutId2);
			sliderInteractionTimeoutId2 = undefined;
		}
		wasAutoCyclingBeforeInteraction2 = false;
		previousGradientColor2();
	}

	// NEW: Wrapper for Next Color 2
	function handleNext2Click() {
		if (localIsAutoCyclingColor2) {
			toggleAutoCycleColor2();
			cycleStartTime2 = undefined;
		}
		if (sliderInteractionTimeoutId2) {
			clearTimeout(sliderInteractionTimeoutId2);
			sliderInteractionTimeoutId2 = undefined;
		}
		wasAutoCyclingBeforeInteraction2 = false;
		nextGradientColor2();
	}
</script>

<InteractiveBackground
	gradientColor1={$backgroundSettings.gradientColor1}
	gradientColor2={$backgroundSettings.gradientColor2}
/>

<div
	class="relative z-0 flex min-h-screen flex-col items-center justify-center bg-transparent p-4 text-gray-100 selection:bg-teal-500 selection:text-teal-900"
	style="user-select: none; -webkit-user-select: none; -ms-user-select: none;"
>
	<!-- Top Right Buttons Container -->
	<div class="fixed top-4 right-4 z-20 flex space-x-2">
		<!-- Settings Button (was Timer Settings Button) -->
		<button
			bind:this={settingsButtonElement}
			on:click={() => {
				showSettings = !showSettings;
			}}
			class="rounded-full border border-slate-400/20 bg-white/5 p-2 text-gray-300 shadow-lg backdrop-blur-sm transition-all hover:bg-white/10 hover:text-teal-300"
			aria-label="Toggle Settings Panel"
			title="Settings"
			aria-expanded={showSettings}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="h-5 w-5"
			>
				<path
					fill-rule="evenodd"
					d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.532 1.532 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.532 1.532 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106A1.532 1.532 0 0111.49 3.17zM10 13a3 3 0 100-6 3 3 0 000 6z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>
	</div>

	<!-- Combined Settings Panel -->
	<div
		bind:this={settingsPanelElement}
		class="settings-panel-container {showSettings ? 'open' : 'closed'}"
		aria-hidden={!showSettings}
		style="width: 24rem;"
	>
		<div
			class="settings-panel-content rounded-lg p-6 shadow-xl backdrop-blur-lg"
			style="background: linear-gradient(160deg, hsla(0,0%,100%,0.07) 0%, hsla(0,0%,100%,0.02) 30%, hsla(0,0%,100%,0) 70%), hsla(0, 0%, 100%, 0.05); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid hsla(0,0%,100%,0.1);"
		>
			<!-- Background Effects Section (Now uses Component) -->
			<h3 class="mb-6 border-b border-slate-600 pb-3 text-xl font-semibold text-teal-400">
				Background Effects
			</h3>
			<BackgroundSettingsPanel
				color1H={localGradientColor1H}
				color1S={localGradientColor1S}
				color1L={localGradientColor1L}
				color1HslString={localGradientColor1Hsl}
				canGoPrev1={$backgroundSettings.gradientColor1HistoryIndex > 0}
				canGoNext1={$backgroundSettings.gradientColor1HistoryIndex <
					$backgroundSettings.gradientColor1History.length - 1}
				isAutoCycling1={localIsAutoCyclingColor1}
				color2H={localGradientColor2H}
				color2S={localGradientColor2S}
				color2L={localGradientColor2L}
				color2HslString={localGradientColor2Hsl}
				canGoPrev2={$backgroundSettings.gradientColor2HistoryIndex > 0}
				canGoNext2={$backgroundSettings.gradientColor2HistoryIndex <
					$backgroundSettings.gradientColor2History.length - 1}
				isAutoCycling2={localIsAutoCyclingColor2}
				isFloatingEnabled={localIsFloatingEnabled}
				onPrev1={handlePrev1Click}
				onNext1={handleNext1Click}
				onRandom1={handleRandomClick1}
				onPrev2={handlePrev2Click}
				onNext2={handleNext2Click}
				onRandom2={handleRandomClick2}
				onHsl1Change={handleSliderInput1}
				onHsl2Change={handleSliderInput2}
				onToggleAutoCycle1={handleToggleAutoCycle1}
				onToggleAutoCycle2={handleToggleAutoCycle2}
				onToggleFloating={handleToggleFloating}
				onResetDefaults={resetBackgroundSettingsToDefaults}
				onPointerDown1={handleSliderPointerDown1}
				onPointerUp1={handleSliderPointerUp1}
				onPointerDown2={handleSliderPointerDown2}
				onPointerUp2={handleSliderPointerUp2}
			/>

			<!-- Timer Settings Section -->
			<h3 class="mt-8 mb-6 border-b border-slate-600 pb-3 text-xl font-semibold text-teal-400">
				Timer Settings
			</h3>
			<form on:submit|preventDefault class="mb-8 space-y-6">
				<!-- Timer Duration Inputs -->
				<div>
					<label for="work-duration" class="mb-1 block text-sm font-medium text-gray-300"
						>Work Duration (minutes)</label
					>
					<input
						type="number"
						id="work-duration"
						bind:value={localWorkDuration}
						min="1"
						class="mt-1 block w-full rounded-md border-slate-500/70 bg-slate-600/80 px-3 py-2 text-gray-200 shadow-sm focus:border-teal-500 focus:ring-teal-500 focus:outline-none sm:text-sm"
					/>
				</div>
				<div>
					<label for="short-break-duration" class="mb-1 block text-sm font-medium text-gray-300"
						>Short Break (minutes)</label
					>
					<input
						type="number"
						id="short-break-duration"
						bind:value={localShortBreakDuration}
						min="1"
						class="mt-1 block w-full rounded-md border-slate-500/70 bg-slate-600/80 px-3 py-2 text-gray-200 shadow-sm focus:border-teal-500 focus:ring-teal-500 focus:outline-none sm:text-sm"
					/>
				</div>
				<div>
					<label for="long-break-duration" class="mb-1 block text-sm font-medium text-gray-300"
						>Long Break (minutes)</label
					>
					<input
						type="number"
						id="long-break-duration"
						bind:value={localLongBreakDuration}
						min="1"
						class="mt-1 block w-full rounded-md border-slate-500/70 bg-slate-600/80 px-3 py-2 text-gray-200 shadow-sm focus:border-teal-500 focus:ring-teal-500 focus:outline-none sm:text-sm"
					/>
				</div>
				<div>
					<label
						for="sessions-before-long-break"
						class="mb-1 block text-sm font-medium text-gray-300">Sessions before Long Break</label
					>
					<input
						type="number"
						id="sessions-before-long-break"
						bind:value={localSessionsBeforeLongBreak}
						min="1"
						class="mt-1 block w-full rounded-md border-slate-500/70 bg-slate-600/80 px-3 py-2 text-gray-200 shadow-sm focus:border-teal-500 focus:ring-teal-500 focus:outline-none sm:text-sm"
					/>
				</div>
				<div class="mt-6 flex items-center">
					<input
						id="auto-cycle"
						type="checkbox"
						bind:checked={localAutoCycle}
						class="h-4 w-4 cursor-pointer rounded border-slate-500/70 bg-slate-600/80 text-teal-600 focus:ring-teal-500"
					/>
					<label
						for="auto-cycle"
						class="ml-2 block cursor-pointer text-sm text-gray-300 select-none"
						>Automatically start next session?</label
					>
				</div>
			</form>
		</div>
	</div>

	<header class="mb-8 w-full max-w-md text-center">
		<h1
			class="text-5xl font-thin tracking-wider {headerTextColorClass} transition-colors duration-500"
		>
			Locked In
		</h1>
		<p class="text-sm {subHeaderTextColorClass} mt-1 transition-colors duration-500">
			Bad Day to Be {currentTaglineSuffix}
		</p>
	</header>

	<main
		class="relative w-full max-w-md overflow-hidden rounded-lg border border-slate-400/20 px-6 pt-4 pb-6 shadow-[0_15px_25px_-5px_rgba(0,0,0,0.3),_0_8px_10px_-6px_rgba(0,0,0,0.2),_inset_0_1px_0px_hsla(0,0%,100%,0.07),_inset_0_0px_1px_hsla(0,0%,100%,0.05)] transition-colors transition-shadow duration-1000 duration-[2000ms] ease-linear ease-out hover:shadow-[0_20px_30px_-5px_rgba(0,0,0,0.35),_0_10px_15px_-6px_rgba(0,0,0,0.25),_inset_0_1px_0px_hsla(0,0%,100%,0.07),_inset_0_0px_1px_hsla(0,0%,100%,0.05)]"
		style="--main-bg-h: {currentMainBgH}; --main-bg-s: {currentMainBgS}%; --main-bg-l: {currentMainBgL}%;
           background: 
             linear-gradient(160deg, hsla(0,0%,100%,0.07) 0%, hsla(0,0%,100%,0.02) 30%, hsla(0,0%,100%,0) 70%),
             hsla(var(--main-bg-h), var(--main-bg-s), 100%, 0.1);
           backdrop-filter: blur(12px);
           -webkit-backdrop-filter: blur(12px);
           transform: translate({floatX}px, {floatY}px) rotate({floatRotate}deg);"
	>
		<section aria-labelledby="timer-heading" class="mb-6">
			<h2 id="timer-heading" class="sr-only">Pomodoro Timer</h2>
			<TimerDisplay />
			<TimerControls />
		</section>

		<!-- REMOVED Sound Section -->
		<!-- <section aria-labelledby="sounds-heading" class="mb-6"> -->
		<!--   <h2 id="sounds-heading" class="sr-only">Ambient Sounds</h2> -->
		<!--   <SoundSelector /> -->
		<!--   <div class="mt-4"> -->
		<!--      <VolumeControl /> -->
		<!--   </div> -->
		<!-- </section> -->
	</main>

	<footer class="mt-12 text-center text-xs text-gray-500">
		<!-- <p>Minimalist Pomodoro Timer & Ambient Sounds</p> -->
	</footer>
</div>

<style lang="postcss">
	.settings-panel-container {
		position: fixed; /* Changed from absolute */
		top: 4.5rem; /* Approx. 72px: top-4 (1rem) + button height ~2.5rem + 1rem space */
		right: 1rem; /* Aligns with right-4 (1rem) */
		/* left: 0; Removed */
		width: 24rem; /* w-96 (384px) - Adjust as needed */
		z-index: 50;
		transform-origin: top right; /* Animation origin */
		will-change: transform, opacity;
		/* Transition properties updated for dropdown effect */
		transition:
			transform 250ms cubic-bezier(0.4, 0, 0.2, 1),
			opacity 250ms cubic-bezier(0.4, 0, 0.2, 1);
	}

	.settings-panel-container.closed {
		transform: scale(0.95) translateY(-10px);
		opacity: 0;
		pointer-events: none;
	}

	.settings-panel-container.open {
		transform: scale(1) translateY(0);
		opacity: 1;
		pointer-events: auto;
	}

	/* Styles copied from SettingsPanel.svelte for number inputs */
	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	input[type='number'] {
		-moz-appearance: textfield; /* Firefox */
	}
	input[type='color'] {
		-webkit-appearance: none; /* Try to remove default browser styling for color input */
		padding: 0; /* Remove padding if any */
		border: none; /* Remove border if any */
	}
	input[type='color']::-webkit-color-swatch-wrapper {
		padding: 0;
	}
	input[type='color']::-webkit-color-swatch {
		border: none;
		border-radius: 0.25rem; /* md */
	}
	/* For Firefox, styling color inputs is trickier, these might not fully work */
	input[type='color']::-moz-color-swatch {
		border: none;
		border-radius: 0.25rem;
	}

	/* Custom Range Slider Styles (Optional - Tailwind provides some defaults) */
	input[type='range'] {
		-webkit-appearance: none; /* Override default appearance */
		appearance: none;
		/* width: 100%; /* Full width */
		/* height: 8px; /* Slider track height */
		/* background: #4A5568; /* Track color (slate-700) */
		/* border-radius: 5px; /* Track border radius */
		/* outline: none; /* Remove outline */
	}

	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 16px; /* Thumb width */
		height: 16px; /* Thumb height */
		background: #14b8a6; /* Thumb color (teal-500) */
		cursor: pointer;
		border-radius: 50%; /* Circular thumb */
		border: 2px solid #e2e8f0; /* Thumb border (slate-200) */
	}

	input[type='range']::-moz-range-thumb {
		width: 16px;
		height: 16px;
		background: #14b8a6;
		cursor: pointer;
		border-radius: 50%;
		border: 2px solid #e2e8f0;
	}

	/* The problematic commented-out block for input[type="color"] will be removed. */
</style>
