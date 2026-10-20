<script lang="ts">
	import { onMount } from 'svelte';

	import {
		AMBIENT_RIPPLE_INTERVAL,
		MAX_SHIMMER_SPOTS,
		MOUSE_MOVE_THROTTLE,
		LONG_PRESS_DURATION,
		LONG_PRESS_MOVE_THRESHOLD,
		MAX_RARE_SIGHTINGS,
		RARE_SIGHTING_CHECK_INTERVAL,
		NUM_WAVE_SHIMMER_SPOTS,
		GRADIENT_DIRECTION_CHANGE_INTERVAL,
		GRADIENT_TRANSITION_DURATION,
		GRADIENT_DIRECTIONS,
		MAX_FOAM_STREAKS,
		FOAM_STREAK_CHANCE_PER_FRAME,
		RARE_SIGHTING_CONFIGS
	} from './background/constants';
	import { easeInOutQuad } from './background/utils';
	import {
		getShimmerSpots,
		getSunGlows,
		getRareSightings,
		getWaterGrains,
		getFoamStreaks
	} from './background/animationState';
	import { createRipple, updateAndDrawRipples } from './background/effects/ripples';
	import {
		createShimmerSpot,
		updateAndDrawShimmerSpots,
		handleResizeShimmerSpots
	} from './background/effects/shimmerSpots';
	import {
		createSunGlow as createSunGlowEffect,
		updateAndDrawSunGlows,
		updateAndDrawSunGlints,
		handleResizeSunGlows
	} from './background/effects/sunGlow';
	import {
		createRareSighting as createRareSightingEffect,
		updateAndDrawRareSightings as updateAndDrawRareSightingsEffect
	} from './background/effects/rareSightings';
	import {
		initializeWaterGrains as initializeWaterGrainsEffect,
		updateAndDrawWaterGrains as updateAndDrawWaterGrainsEffect,
		handleResizeWaterGrains
	} from './background/effects/waterGrains';
	import {
		createFoamStreak as createFoamStreakEffect,
		updateAndDrawFoamStreaks as updateAndDrawFoamStreaksEffect
	} from './background/effects/foamStreaks';

	import { backgroundSettings, type BackgroundSettings } from '$lib/stores/backgroundSettingsStore';

	export let settings: BackgroundSettings;

	// Extract gradient colors from settings with fallbacks
	$: gradientColor1 = settings?.gradientColor1 || 'hsl(210, 70%, 50%)';
	$: gradientColor2 = settings?.gradientColor2 || 'hsl(200, 68%, 50%)';

	let canvasRef: HTMLCanvasElement;
	// To help TypeScript and linters, we'll use local non-null vars inside functions after checks

	let animationFrameId: number;
	let globalTime = 0; // For global animations like warping

	// Dynamic Gradient State
	let currentGradientAngleIndex = 0; // Start with Top-Left to Bottom-Right
	let targetGradientAngleIndex = 0;
	let gradientTransitionProgress = 1; // Start fully at the initial angle
	let lastGradientDirectionChangeTime = 0;
	let interpolatedGradientCoords = { ...GRADIENT_DIRECTIONS[0] }; // Initial coordinates
	let gradientTransitionStartTime = 0;

	onMount(() => {
		const canvas = canvasRef;
		if (!canvas) {
			console.error('Canvas not available onMount');
			return;
		}
		// console.log(`[onMount Start] Canvas: ${canvas.width}x${canvas.height}`); // Log at start of onMount - remove, resizeCanvas will log
		const ctx = canvas.getContext('2d');
		if (!ctx) {
			console.error('Context not available onMount');
			return;
		}

		resizeCanvas(); // Ensure canvas dimensions are set first
		console.log(`[onMount after initial resize] Canvas: ${canvas.width}x${canvas.height}`);

		let lastMouseMoveTime = 0;
		let mouseDownTime = 0;
		let mouseDownPos: { x: number; y: number } | null = null;
		let ambientRippleIntervalId: number | undefined;
		let isDraggingBeyondThreshold = false; // New flag

		let timeSinceLastSightingAttempt = 0;

		// --- HELPER & DRAWING FUNCTIONS (NOW INSIDE ONMOUNT, USING LOCAL CTX & CANVAS) ---
		function updateDynamicGradient() {
			const now = Date.now();
			if (lastGradientDirectionChangeTime === 0) {
				// Initialize first time
				lastGradientDirectionChangeTime = now;
				gradientTransitionStartTime = now;
				// Start transition to the next angle in sequence
				targetGradientAngleIndex = (currentGradientAngleIndex + 1) % GRADIENT_DIRECTIONS.length;
				gradientTransitionProgress = 0;
			}

			// Check if it's time to pick a new target direction and current transition is complete
			if (
				now - lastGradientDirectionChangeTime >= GRADIENT_DIRECTION_CHANGE_INTERVAL &&
				gradientTransitionProgress >= 1
			) {
				currentGradientAngleIndex = targetGradientAngleIndex; // Current transition target is now the stable one
				// Set next target in clockwise sequence
				targetGradientAngleIndex = (currentGradientAngleIndex + 1) % GRADIENT_DIRECTIONS.length;
				gradientTransitionProgress = 0; // Reset progress for the new transition
				lastGradientDirectionChangeTime = now; // Record time of this direction change decision
				gradientTransitionStartTime = now; // Start the new transition timing
			}

			if (gradientTransitionProgress < 1) {
				const elapsedTransitionTime = now - gradientTransitionStartTime;
				gradientTransitionProgress = Math.min(
					1,
					elapsedTransitionTime / GRADIENT_TRANSITION_DURATION
				);

				const easedProgress = easeInOutQuad(gradientTransitionProgress);

				const currentCoords = GRADIENT_DIRECTIONS[currentGradientAngleIndex];
				const targetCoords = GRADIENT_DIRECTIONS[targetGradientAngleIndex];

				interpolatedGradientCoords.x1 =
					currentCoords.x1 + (targetCoords.x1 - currentCoords.x1) * easedProgress;
				interpolatedGradientCoords.y1 =
					currentCoords.y1 + (targetCoords.y1 - currentCoords.y1) * easedProgress;
				interpolatedGradientCoords.x2 =
					currentCoords.x2 + (targetCoords.x2 - currentCoords.x2) * easedProgress;
				interpolatedGradientCoords.y2 =
					currentCoords.y2 + (targetCoords.y2 - currentCoords.y2) * easedProgress;
			} else {
				// Ensure it snaps to target if transition is done
				interpolatedGradientCoords = { ...GRADIENT_DIRECTIONS[targetGradientAngleIndex] };
				currentGradientAngleIndex = targetGradientAngleIndex; // Update current index once stable
			}
		}

		// --- Event Handlers (now local to onMount) ---
		const handleMouseMove = (event: MouseEvent) => {
			if (mouseDownPos) {
				if (!isDraggingBeyondThreshold) {
					const dx = event.pageX - mouseDownPos.x;
					const dy = event.pageY - mouseDownPos.y;
					if (Math.sqrt(dx * dx + dy * dy) > LONG_PRESS_MOVE_THRESHOLD) {
						isDraggingBeyondThreshold = true;
					}
				}

				// Create ripples during drag regardless of threshold status
				const n = Date.now();
				if (n - lastMouseMoveTime > MOUSE_MOVE_THROTTLE) {
					createRipple(event.pageX, event.pageY, 'mouseMove', $backgroundSettings);
					lastMouseMoveTime = n;
				}
			}
		};

		const handleMouseDown = (event: MouseEvent) => {
			mouseDownTime = Date.now();
			mouseDownPos = { x: event.pageX, y: event.pageY };
			isDraggingBeyondThreshold = false;
		};

		const handleMouseUp = (event: MouseEvent) => {
			if (!mouseDownPos || mouseDownTime === 0) {
				return;
			}

			const pressDuration = Date.now() - mouseDownTime;
			if (!isDraggingBeyondThreshold) {
				if (pressDuration >= LONG_PRESS_DURATION) {
					createRipple(event.pageX, event.pageY, 'longPress', $backgroundSettings);
				} else {
					createRipple(event.pageX, event.pageY, 'mouseMove', $backgroundSettings);
				}
			}

			mouseDownPos = null;
			mouseDownTime = 0;
			isDraggingBeyondThreshold = false;
		};

		const tryCreateAmbientRipple = () => {
			if (!canvas) return;
			// For now, always create ripples to test
			createRipple(
				Math.random() * canvas.width,
				Math.random() * canvas.height,
				'ambient',
				settings
			);
		};

		// --- Setup & Animation Loop ---
		function resizeCanvas() {
			if (!canvas) return;
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			console.log(`[resizeCanvas] Canvas: ${canvas.width}x${canvas.height}`);

			// Call the dedicated resize handler for shimmer spots
			handleResizeShimmerSpots(canvas.width, canvas.height);

			// Call the dedicated resize handler for sun glows
			handleResizeSunGlows(canvas.width, canvas.height);

			// Call the dedicated resize handler for water grains
			handleResizeWaterGrains(canvas.width, canvas.height);
		}
		window.addEventListener('resize', resizeCanvas);

		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mousedown', handleMouseDown);
		window.addEventListener('mouseup', handleMouseUp);

		// Set up initial ambient ripple interval
		if (typeof window !== 'undefined') {
			const rippleInterval = settings?.rippleFrequency || AMBIENT_RIPPLE_INTERVAL;
			ambientRippleIntervalId = window.setInterval(tryCreateAmbientRipple, rippleInterval);
		}

		// Initialize effects
		// Use the imported createShimmerSpot and pass canvas dimensions
		if (canvas) {
			// Initialize shimmer spots (only if enabled)
			if (settings?.shimmerEnabled) {
				for (let k = 0; k < MAX_SHIMMER_SPOTS - NUM_WAVE_SHIMMER_SPOTS; k++)
					createShimmerSpot(canvas.width, canvas.height, false);
				for (let k = 0; k < NUM_WAVE_SHIMMER_SPOTS; k++)
					createShimmerSpot(canvas.width, canvas.height, true);
			}
			// Use the imported createSunGlowEffect (only if enabled)
			if (settings?.sunGlowEnabled) {
				createSunGlowEffect(canvas.width, canvas.height);
			}
			// Use the imported initializeWaterGrainsEffect (only if enabled)
			if (settings?.waterGrainsEnabled) {
				initializeWaterGrainsEffect(canvas.width, canvas.height, settings);
			}
		}

		console.log(
			`[onMount End] Canvas: ${canvas.width}x${canvas.height}, ShimmerSpots: ${getShimmerSpots().length}, Grains: ${getWaterGrains().length}, SunGlows: ${getSunGlows().length}`
		);

		function animate() {
			if (!ctx || !canvas) {
				animationFrameId = requestAnimationFrame(animate);
				return;
			}
			globalTime += 0.002;
			updateDynamicGradient();

			// Draw background gradient
			const gradX1 = interpolatedGradientCoords.x1 * canvas.width;
			const gradY1 = interpolatedGradientCoords.y1 * canvas.height;
			const gradX2 = interpolatedGradientCoords.x2 * canvas.width;
			const gradY2 = interpolatedGradientCoords.y2 * canvas.height;
			const gradient = ctx.createLinearGradient(gradX1, gradY1, gradX2, gradY2);
			// Validate color values before using them
			const color1 =
				typeof gradientColor1 === 'string' && gradientColor1.includes('hsl')
					? gradientColor1
					: 'hsl(210, 70%, 50%)';
			const color2 =
				typeof gradientColor2 === 'string' && gradientColor2.includes('hsl')
					? gradientColor2
					: 'hsl(200, 68%, 50%)';

			gradient.addColorStop(0, color1);
			gradient.addColorStop(1, color2);
			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			// ---

			// Update and draw ripples (only if enabled)
			if (settings?.ripplesEnabled) {
				updateAndDrawRipples(ctx);
			}
			// Update and draw shimmer spots (only if enabled)
			if (settings?.shimmerEnabled) {
				updateAndDrawShimmerSpots(ctx, canvas.width, canvas.height, globalTime);
			}
			// Call imported water grain update function (only if enabled)
			if (settings?.waterGrainsEnabled) {
				updateAndDrawWaterGrainsEffect(ctx, canvas.width, canvas.height, settings);
			}
			// Only update sun effects if enabled
			if (settings?.sunGlowEnabled) {
				updateAndDrawSunGlows(ctx, settings);
				updateAndDrawSunGlints(ctx);
			}

			const FRAME_TIME_MS = 16.67;
			timeSinceLastSightingAttempt += FRAME_TIME_MS;
			if (timeSinceLastSightingAttempt >= RARE_SIGHTING_CHECK_INTERVAL) {
				for (const typeKey in RARE_SIGHTING_CONFIGS) {
					const sightingType = typeKey as keyof typeof RARE_SIGHTING_CONFIGS;
					const config = RARE_SIGHTING_CONFIGS[sightingType];
					if (
						typeof config.chancePerInterval === 'number' &&
						Math.random() < config.chancePerInterval
					) {
						if (getRareSightings().length < MAX_RARE_SIGHTINGS) {
							// Use imported function
							createRareSightingEffect(canvas.width, canvas.height, sightingType);
						}
					}
				}
				timeSinceLastSightingAttempt = 0;
			}
			// Use imported function
			updateAndDrawRareSightingsEffect(ctx, canvas.width, canvas.height);

			// Foam streak creation (only if enabled)
			if (settings?.foamEnabled) {
				if (
					Math.random() < (settings?.foamFrequency || FOAM_STREAK_CHANCE_PER_FRAME) &&
					getFoamStreaks().length < MAX_FOAM_STREAKS
				) {
					// Use imported function with settings
					createFoamStreakEffect(canvas.width, canvas.height, settings);
				}
				// Update/Draw Foam Streaks with settings
				updateAndDrawFoamStreaksEffect(ctx, canvas.width, canvas.height, settings);
			}

			animationFrameId = requestAnimationFrame(animate);
		}

		animate(); // Start animation after setup

		return () => {
			window.removeEventListener('resize', resizeCanvas);
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mousedown', handleMouseDown);
			window.removeEventListener('mouseup', handleMouseUp);
			if (ambientRippleIntervalId) clearInterval(ambientRippleIntervalId);
			if (animationFrameId) cancelAnimationFrame(animationFrameId);
		};
	});
</script>

<canvas bind:this={canvasRef} class="pointer-events-none fixed top-0 left-0 -z-10 h-full w-full"
></canvas>
