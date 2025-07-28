<script lang="ts">
	import { timerSettings } from '$lib/stores/timerStore';
	import type { TimerSettings } from '$lib/stores/timerStore';
	import { onMount } from 'svelte';

	let localWorkDuration = $timerSettings.workDuration / 60;
	let localShortBreakDuration = $timerSettings.shortBreakDuration / 60;
	let localLongBreakDuration = $timerSettings.longBreakDuration / 60;
	let localSessionsBeforeLongBreak = $timerSettings.sessionsBeforeLongBreak;
	let localAutoCycle = $timerSettings.autoCycle;

	let hasMounted = false;
	onMount(() => {
		// Update local state from store one last time on mount,
		// in case store was updated between script setup and actual mount.
		// This helps ensure inputs reflect the absolute latest store state at render time.
		const currentStoreSettings = $timerSettings;
		localWorkDuration = currentStoreSettings.workDuration / 60;
		localShortBreakDuration = currentStoreSettings.shortBreakDuration / 60;
		localLongBreakDuration = currentStoreSettings.longBreakDuration / 60;
		localSessionsBeforeLongBreak = currentStoreSettings.sessionsBeforeLongBreak;
		localAutoCycle = currentStoreSettings.autoCycle;

		hasMounted = true;
	});

	// When local values change (due to user input), update the store, but only after mount
	$: if (hasMounted) {
		const newSettings: TimerSettings = {
			workDuration: Math.max(1, localWorkDuration) * 60,
			shortBreakDuration: Math.max(1, localShortBreakDuration) * 60,
			longBreakDuration: Math.max(1, localLongBreakDuration) * 60,
			sessionsBeforeLongBreak: Math.max(1, localSessionsBeforeLongBreak),
			autoCycle: localAutoCycle
		};
		// To prevent an infinite loop if $timerSettings itself triggers this block,
		// we should ideally only set if newSettings is different from $timerSettings.
		// However, direct comparison of objects is tricky.
		// The hasMounted flag prevents the initial call. Subsequent calls are due to input changes.
		timerSettings.set(newSettings);
	}

	// If store changes externally, update local reactive variables.
	timerSettings.subscribe((settings) => {
		// Only update local variables if they are actually different from the new store values.
		// This prevents feedback loops if this subscription is triggered by the reactive block above.
		if (settings.workDuration / 60 !== localWorkDuration) {
			localWorkDuration = settings.workDuration / 60;
		}
		if (settings.shortBreakDuration / 60 !== localShortBreakDuration) {
			localShortBreakDuration = settings.shortBreakDuration / 60;
		}
		if (settings.longBreakDuration / 60 !== localLongBreakDuration) {
			localLongBreakDuration = settings.longBreakDuration / 60;
		}
		if (settings.sessionsBeforeLongBreak !== localSessionsBeforeLongBreak) {
			localSessionsBeforeLongBreak = settings.sessionsBeforeLongBreak;
		}
		if (settings.autoCycle !== localAutoCycle) {
			localAutoCycle = settings.autoCycle;
		}
	});
</script>

<div
	class="mt-6 rounded-lg border border-slate-600/50 bg-slate-700/50 p-6 shadow-xl backdrop-blur-sm"
>
	<h3 class="mb-6 border-b border-slate-600 pb-3 text-xl font-semibold text-teal-400">
		Timer Settings
	</h3>

	<form on:submit|preventDefault class="space-y-6">
		<div>
			<label for="work-duration" class="mb-1 block text-sm font-medium text-gray-300"
				>Work Duration (minutes)</label
			>
			<input
				type="number"
				id="work-duration"
				bind:value={localWorkDuration}
				min="1"
				class="mt-1 block w-full rounded-md border-slate-500 bg-slate-600 px-3 py-2 text-gray-200 shadow-sm focus:border-teal-500 focus:ring-teal-500 focus:outline-none sm:text-sm"
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
				class="mt-1 block w-full rounded-md border-slate-500 bg-slate-600 px-3 py-2 text-gray-200 shadow-sm focus:border-teal-500 focus:ring-teal-500 focus:outline-none sm:text-sm"
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
				class="mt-1 block w-full rounded-md border-slate-500 bg-slate-600 px-3 py-2 text-gray-200 shadow-sm focus:border-teal-500 focus:ring-teal-500 focus:outline-none sm:text-sm"
			/>
		</div>

		<div>
			<label for="sessions-before-long-break" class="mb-1 block text-sm font-medium text-gray-300"
				>Sessions before Long Break</label
			>
			<input
				type="number"
				id="sessions-before-long-break"
				bind:value={localSessionsBeforeLongBreak}
				min="1"
				class="mt-1 block w-full rounded-md border-slate-500 bg-slate-600 px-3 py-2 text-gray-200 shadow-sm focus:border-teal-500 focus:ring-teal-500 focus:outline-none sm:text-sm"
			/>
		</div>

		<div class="mt-6 flex items-center">
			<input
				id="auto-cycle"
				type="checkbox"
				bind:checked={localAutoCycle}
				class="h-4 w-4 cursor-pointer rounded border-slate-500 bg-slate-600 text-teal-600 focus:ring-teal-500"
			/>
			<label for="auto-cycle" class="ml-2 block cursor-pointer text-sm text-gray-300 select-none"
				>Automatically start next session?</label
			>
		</div>
	</form>
</div>

<style>
	/* SettingsPanel specific styles */
	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	input[type='number'] {
		-moz-appearance: textfield; /* Firefox */
	}
</style>
