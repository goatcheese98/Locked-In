<script lang="ts">
	import TimerDisplay from '$lib/components/TimerDisplay.svelte';
	import TimerControls from '$lib/components/TimerControls.svelte';
	import { timerState, timerSettings } from '$lib/stores/timerStore';
	import type { SessionType, TimerSettings as TimerSettingsType } from '$lib/stores/timerStore';
	import {
		backgroundSettings,
		resetBackgroundSettingsToDefaults
	} from '$lib/stores/backgroundSettingsStore';
	import type { BackgroundSettings as BackgroundSettingsType } from '$lib/stores/backgroundSettingsStore';
	import InteractiveBackground from '$lib/components/InteractiveBackground.svelte';
	import FloatingDock from '$lib/components/FloatingDock.svelte';
	import { onMount, onDestroy } from 'svelte';

	// --- Component State ---
	let hasMounted = false;

	// --- Local Timer Settings State ---
	let localWorkDuration = $timerSettings.workDuration / 60;
	let localShortBreakDuration = $timerSettings.shortBreakDuration / 60; // Convert to minutes for UI
	let localLongBreakDuration = $timerSettings.longBreakDuration / 60;
	let localSessionsBeforeLongBreak = $timerSettings.sessionsBeforeLongBreak;
	let localAutoCycle = $timerSettings.autoCycle;

	// --- Local Background Settings State ---
	let localIsFloatingEnabled = $backgroundSettings.isFloatingEnabled;


	onMount(() => {
		hasMounted = true;

		// Initialize Background Settings
		localIsFloatingEnabled = $backgroundSettings.isFloatingEnabled;

	});


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

	// Update Background Settings store when local values change
	$: if (hasMounted) {
		if ($backgroundSettings.isFloatingEnabled !== localIsFloatingEnabled) {
			backgroundSettings.update((currentSettings) => ({
				...currentSettings,
				isFloatingEnabled: localIsFloatingEnabled
			}));
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

	// Subscribe to Background Settings store for external changes
	backgroundSettings.subscribe((settings) => {
		if (settings.isFloatingEnabled !== localIsFloatingEnabled) {
			localIsFloatingEnabled = settings.isFloatingEnabled;
		}
	});

	// Format session display text
	function formatSessionDisplay(session: SessionType): string {
		switch (session) {
			case 'work':
				return 'Focus Session';
			case 'shortBreak':
				return 'Short Break';
			case 'longBreak':
				return 'Long Break';
			default:
				return 'Session';
		}
	}

	// Reset function
	function handleResetDefaults() {
		resetBackgroundSettingsToDefaults();
	}
</script>

<svelte:head>
	<title>Locked-In Pomodoro Timer</title>
	<meta name="description" content="A beautiful Pomodoro timer with interactive background effects" />
</svelte:head>

<!-- Interactive Background -->
<InteractiveBackground 
	gradientColor1={$backgroundSettings.gradientColor1} 
	gradientColor2={$backgroundSettings.gradientColor2} 
/>

<!-- Floating Dock -->
<FloatingDock />

<!-- Main Content Container -->
<main
	class="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-8 transition-all duration-1000 ease-in-out"
>
	<div class="w-full max-w-md space-y-8 text-center">
		<!-- Timer Display -->
		<TimerDisplay />

		<!-- Session Info -->
		{#if $timerState.currentSession}
			<div class="text-lg font-medium text-white/80">
				{formatSessionDisplay($timerState.currentSession.type)}
				{#if $timerState.currentSession.type === 'work'}
					<span class="text-sm text-white/60 block mt-1">
						Session {$timerState.completedSessions + 1} of {$timerSettings.sessionsBeforeLongBreak}
					</span>
				{/if}
			</div>
		{/if}

		<!-- Timer Controls -->
		<TimerControls />

		<!-- Timer Settings -->
		<div class="space-y-4 rounded-2xl bg-black/20 p-6 backdrop-blur-sm">
			<h3 class="text-lg font-semibold text-white/90">Timer Settings</h3>
			
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="work-duration" class="block text-sm font-medium text-white/70">
						Work (min)
					</label>
					<input
						id="work-duration"
						type="number"
						bind:value={localWorkDuration}
						min="1"
						max="120"
						class="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-white placeholder-white/50 backdrop-blur-sm focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
					/>
				</div>
				<div>
					<label for="short-break-duration" class="block text-sm font-medium text-white/70">
						Short Break (min)
					</label>
					<input
						id="short-break-duration"
						type="number"
						bind:value={localShortBreakDuration}
						min="1"
						max="60"
						class="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-white placeholder-white/50 backdrop-blur-sm focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
					/>
				</div>
				<div>
					<label for="long-break-duration" class="block text-sm font-medium text-white/70">
						Long Break (min)
					</label>
					<input
						id="long-break-duration"
						type="number"
						bind:value={localLongBreakDuration}
						min="1"
						max="120"
						class="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-white placeholder-white/50 backdrop-blur-sm focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
					/>
				</div>
				<div>
					<label for="sessions-before-long-break" class="block text-sm font-medium text-white/70">
						Sessions Before Long Break
					</label>
					<input
						id="sessions-before-long-break"
						type="number"
						bind:value={localSessionsBeforeLongBreak}
						min="1"
						max="10"
						class="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-white placeholder-white/50 backdrop-blur-sm focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
					/>
				</div>
			</div>
			
			<div class="flex items-center justify-between">
				<label for="auto-cycle" class="text-sm font-medium text-white/70">
					Auto-cycle sessions
				</label>
				<input
					id="auto-cycle"
					type="checkbox"
					bind:checked={localAutoCycle}
					class="h-4 w-4 rounded border-white/30 bg-white/10 text-blue-600 focus:ring-blue-500/50"
				/>
			</div>

			<div class="flex items-center justify-between">
				<label for="floating-enabled" class="text-sm font-medium text-white/70">
					Enable floating effects
				</label>
				<input
					id="floating-enabled"
					type="checkbox"
					bind:checked={localIsFloatingEnabled}
					class="h-4 w-4 rounded border-white/30 bg-white/10 text-blue-600 focus:ring-blue-500/50"
				/>
			</div>

			<button
				type="button"
				on:click={handleResetDefaults}
				class="w-full rounded-lg bg-red-600/20 px-4 py-2 text-red-300 backdrop-blur-sm hover:bg-red-600/30 focus:outline-none focus:ring-2 focus:ring-red-500/50"
			>
				Reset to Defaults
			</button>
		</div>
	</div>
</main>

<style>
	/* Custom number input styles to hide spinners */
	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	input[type='number'] {
		-moz-appearance: textfield; /* Firefox */
	}
</style>