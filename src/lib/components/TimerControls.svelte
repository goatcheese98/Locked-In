<script lang="ts">
	import {
		timerState,
		startTimer,
		pauseTimer,
		resetTimer,
		skipSession
	} from '$lib/stores/timerStore';
</script>

<div class="timer-actions">
	<button class="primary" on:click={() => ($timerState.isRunning ? pauseTimer() : startTimer())}>
		{$timerState.isRunning
			? 'Pause'
			: $timerState.hasStarted
				? 'Resume'
				: $timerState.currentSession === 'Work'
					? 'Start focus'
					: 'Start break'}
	</button>
	<button on:click={() => resetTimer()}>Reset</button>
</div>
<button class="quiet" on:click={skipSession} disabled={$timerState.isRunning}
	>Skip to next session</button
>
