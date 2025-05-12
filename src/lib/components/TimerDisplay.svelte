<script lang="ts">
  import { timerState, formattedTime, timerSettings, updateCurrentSessionDuration } from '$lib/stores/timerStore';
  import type { SessionType, TimerSettings } from '$lib/stores/timerStore';

  let progressPercentage = 0;

  $: {
    const state = $timerState;
    const settings = $timerSettings;
    
    let totalDurationForCurrentSession = settings.workDuration;
    if (state.currentSession === 'Short Break') {
      totalDurationForCurrentSession = settings.shortBreakDuration;
    } else if (state.currentSession === 'Long Break') {
      totalDurationForCurrentSession = settings.longBreakDuration;
    }
    totalDurationForCurrentSession = Math.max(1, totalDurationForCurrentSession); // Ensure at least 1 to avoid div by zero

    if (totalDurationForCurrentSession > 0) {
      progressPercentage = Math.max(0, 100 - (state.timeRemaining / totalDurationForCurrentSession) * 100);
    } else {
      progressPercentage = state.timeRemaining > 0 ? 0 : 100; // If duration is 0, show full if time is also 0
    }
  }

  function incrementMinutes() {
    if ($timerState.isRunning) return;
    const currentMinutes = Math.floor($timerState.timeRemaining / 60);
    const currentSeconds = $timerState.timeRemaining % 60;
    const newTotalSeconds = (currentMinutes + 1) * 60 + currentSeconds;
    updateCurrentSessionDuration(newTotalSeconds);
  }

  function decrementMinutes() {
    if ($timerState.isRunning) return;
    const currentMinutes = Math.floor($timerState.timeRemaining / 60);
    const currentSeconds = $timerState.timeRemaining % 60;
    const newTotalSeconds = Math.max(0, (currentMinutes - 1)) * 60 + currentSeconds; 
    // updateCurrentSessionDuration will enforce minimum 60s
    updateCurrentSessionDuration(newTotalSeconds);
  }

  $: minutesStr = $formattedTime.substring(0, 2);
  $: secondsStr = $formattedTime.substring(3, 5);

</script>

<div class="text-center mt-2 mb-8">
  <p class="text-xl font-semibold text-teal-400 mb-2" id="current-session-label">
    {$timerState.currentSession}
  </p>
  <div class="flex items-center justify-center text-8xl font-mono tracking-tighter text-gray-100 tabular-nums select-none relative" aria-live="polite" aria-atomic="true">
    
    {#if !$timerState.isRunning}
      <div class="flex flex-col items-center justify-center mx-2 scale-75 opacity-60 hover:opacity-100 transition-opacity">
        <button title="Increase minutes" aria-label="Increase minutes" on:click={incrementMinutes} class="p-1 text-gray-300 hover:text-teal-300 disabled:opacity-30" disabled={$timerState.isRunning}>
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>
        </button>
        <button title="Decrease minutes" aria-label="Decrease minutes" on:click={decrementMinutes} class="p-1 text-gray-300 hover:text-teal-300 disabled:opacity-30" disabled={$timerState.isRunning || ($timerState.timeRemaining < 120 && $timerState.timeRemaining % 60 === 0 && $timerState.timeRemaining / 60 <=1) || $timerState.timeRemaining < 60 }>
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </button>
      </div>
    {/if}

    <span class="w-32 text-center">{minutesStr}</span>
    <span class="w-8 text-center">:</span>
    <span class="w-32 text-center">{secondsStr}</span>
    
    <!-- Placeholder for second controls if needed, could mirror minute controls structure -->

  </div>
  
  <div class="w-full bg-slate-700 rounded-full h-2.5 mt-6 overflow-hidden shadow-inner">
    <div 
      class="bg-teal-500 h-2.5 rounded-full transition-all duration-1000 ease-linear"
      style="width: {progressPercentage}%;"
      aria-valuenow={progressPercentage}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-labelledby="current-session-label"
      role="progressbar"
    >
    </div>
  </div>
</div>

<style>
  /* TimerDisplay specific styles */
  .tabular-nums {
    font-variant-numeric: tabular-nums;
  }
</style> 