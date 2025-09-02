<script lang="ts">
	import TimerDisplay from '$lib/components/TimerDisplay.svelte';
	import TimerControls from '$lib/components/TimerControls.svelte';
	import { timerState, timerSettings } from '$lib/stores/timerStore';
	import type { SessionType } from '$lib/stores/timerStore';
	import { backgroundSettings } from '$lib/stores/backgroundSettingsStore';
	import InteractiveBackground from '$lib/components/InteractiveBackground.svelte';
	import FloatingDock from '$lib/components/FloatingDock.svelte';


	// Format session display text
	function formatSessionDisplay(session: SessionType): string {
		switch (session) {
			case 'Work':
				return 'Focus Session';
			case 'Short Break':
				return 'Short Break';
			case 'Long Break':
				return 'Long Break';
			default:
				return 'Session';
		}
	}
</script>

<svelte:head>
	<title>Locked-In Pomodoro Timer</title>
	<meta name="description" content="A beautiful Pomodoro timer with interactive background effects" />
</svelte:head>

<!-- Interactive Background -->
<InteractiveBackground 
	settings={$backgroundSettings}
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
				{formatSessionDisplay($timerState.currentSession)}
				{#if $timerState.currentSession === 'Work'}
					<span class="text-sm text-white/60 block mt-1">
						Session {$timerState.currentCycleCount + 1} of {$timerSettings.sessionsBeforeLongBreak}
					</span>
				{/if}
			</div>
		{/if}

		<!-- Timer Controls -->
		<TimerControls />
	</div>
</main>

