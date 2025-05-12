<script lang="ts">
  import { timerState, timerSettings, startTimer, pauseTimer, skipSession, resetTimer } from '$lib/stores/timerStore';

  // We will add functions for skip, reset here later

  let isTimerAtInitialState: boolean;
  $: {
    const state = $timerState;
    const settings = $timerSettings;
    isTimerAtInitialState = !state.timeRemaining || 
                           (state.currentSession === 'Work' && state.timeRemaining === settings.workDuration) ||
                           (state.currentSession === 'Short Break' && state.timeRemaining === settings.shortBreakDuration) ||
                           (state.currentSession === 'Long Break' && state.timeRemaining === settings.longBreakDuration);
  }

  // We will add function for reset here later
</script>

<div class="flex justify-center space-x-2 mt-6">
  {#if !$timerState.isRunning}
    <button 
      on:click={startTimer}
      class="px-6 py-3 text-base font-semibold rounded-md transition-all ease-in-out duration-150 
             bg-white/10 hover:bg-white/20 text-slate-200 hover:text-teal-300 border border-slate-400/30
             disabled:opacity-50 disabled:cursor-not-allowed
             focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-900/50"
      aria-label={isTimerAtInitialState ? 'Start timer' : 'Resume timer'}
    >
      {isTimerAtInitialState ? 'Start' : 'Resume'}
    </button>
  {:else}
    <button 
      on:click={pauseTimer}
      class="px-6 py-3 text-base font-semibold rounded-md transition-all ease-in-out duration-150 
             bg-white/10 hover:bg-white/20 text-slate-200 hover:text-amber-300 border border-slate-400/30
             disabled:opacity-50 disabled:cursor-not-allowed
             focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-900/50"
      aria-label="Pause timer"
    >
      Pause
    </button>
  {/if}

  <button
    on:click={skipSession}
    class="px-6 py-3 text-base font-semibold rounded-md transition-all ease-in-out duration-150 
           bg-white/10 hover:bg-white/20 text-slate-200 hover:text-sky-300 border border-slate-400/30
           disabled:opacity-50 disabled:cursor-not-allowed
           focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-900/50"
    aria-label="Skip to next session"
    title="Skip to next session"
    disabled={$timerState.isRunning} 
  >
    Skip
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 inline ml-1 align-text-bottom">
      <path fill-rule="evenodd" d="M2 10a.75.75 0 0 1 .75-.75h12.59l-2.1-1.95a.75.75 0 1 1 1.02-1.1l3.5 3.25a.75.75 0 0 1 0 1.1l-3.5 3.25a.75.75 0 1 1-1.02-1.1l2.1-1.95H2.75A.75.75 0 0 1 2 10Z" clip-rule="evenodd" />
      <path fill-rule="evenodd" d="M18 10a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1 0-1.5h.008A.75.75 0 0 1 18 10Z" clip-rule="evenodd" />
    </svg>
  </button>

  <button
    on:click={resetTimer}
    class="px-6 py-3 text-base font-semibold rounded-md transition-all ease-in-out duration-150 
           bg-white/10 hover:bg-white/20 text-slate-200 hover:text-rose-300 border border-slate-400/30
           disabled:opacity-50 disabled:cursor-not-allowed
           focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 focus:ring-offset-slate-900/50"
    aria-label="Reset current session timer"
    title="Reset current session"
    disabled={$timerState.isRunning && isTimerAtInitialState} 
  >
    Reset 
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 inline ml-1 align-text-bottom">
      <path fill-rule="evenodd" d="M15.323 3.407a.75.75 0 0 1 0 1.06l-2.096 2.096A6.5 6.5 0 0 1 10 16.5a6.501 6.501 0 0 1-6.414-5.523.75.75 0 0 1 1.482-.236A5.001 5.001 0 0 0 10 15a5 5 0 0 0 4.19-2.402l-1.618 1.617a.75.75 0 1 1-1.06 1.061l3.25-3.25a.75.75 0 0 1 0-1.06l-3.25-3.25a.75.75 0 0 1-1.06 0Z" clip-rule="evenodd" />
      <path fill-rule="evenodd" d="M4.677 12.593a.75.75 0 0 1 0-1.06l2.096-2.096A6.5 6.5 0 0 1 10 3.5a6.501 6.501 0 0 1 6.414 5.523.75.75 0 0 1-1.482.236A5.001 5.001 0 0 0 10 5a5 5 0 0 0-4.19 2.402l1.618-1.617a.75.75 0 1 1 1.06-1.061L5.238 8.075a.75.75 0 0 1 0 1.06l3.25 3.25a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" />
    </svg>
  </button>

  <!-- Placeholder for Reset button (PRD F1.3) -->
  <!-- 
  <button class="px-6 py-2 rounded-md bg-slate-600 hover:bg-slate-500">Reset</button>
  -->
</div>

<style>
  /* TimerControls specific styles */
</style> 