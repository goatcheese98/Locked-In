<script lang="ts">
	import { formattedTime, timerState, timerSettings } from '$lib/stores/timerStore';
</script>

<div class="timer-display">
	<p>A little space to do your best work.</p>
	<div class="digits" role="timer" aria-label="Time remaining">{$formattedTime}</div>
	<p>
		{$timerState.currentSession === 'Work' ? 'Focus session' : $timerState.currentSession} · {$timerState.currentCycleCount +
			1} of {$timerSettings.sessionsBeforeLongBreak}
	</p>
</div>
