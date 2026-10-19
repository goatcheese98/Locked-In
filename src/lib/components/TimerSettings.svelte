<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import {
		timerState,
		timerSettings,
		saveTimerSettings,
		validSettings
	} from '$lib/stores/timerStore';
	const dispatch = createEventDispatcher<{ close: void }>();
	let focus: number | undefined = $timerSettings.workDuration / 60;
	let short: number | undefined = $timerSettings.shortBreakDuration / 60;
	let long: number | undefined = $timerSettings.longBreakDuration / 60;
	let sessions: number | undefined = $timerSettings.sessionsBeforeLongBreak;
	let auto = $timerSettings.autoCycle;
	let error = '';
	$: draft = {
		workDuration: (focus ?? NaN) * 60,
		shortBreakDuration: (short ?? NaN) * 60,
		longBreakDuration: (long ?? NaN) * 60,
		sessionsBeforeLongBreak: sessions ?? NaN,
		autoCycle: auto
	};
	function save() {
		if (!validSettings(draft)) {
			error = 'Enter whole minutes in the ranges shown and 1–10 sessions.';
			return;
		}
		if (!saveTimerSettings(draft)) {
			error = 'Pause the timer before saving changes.';
			return;
		}
		dispatch('close');
	}
</script>

<form class="settings-form" on:submit|preventDefault={save} novalidate>
	<h2>Timer settings</h2>
	<p id="settings-help">Saving resets the current session. Reload starts a fresh focus session.</p>
	<label for="focus-duration">Focus · 1–120 minutes</label>
	<input
		id="focus-duration"
		type="number"
		min="1"
		max="120"
		step="1"
		bind:value={focus}
		aria-describedby="settings-help settings-error"
	/>
	<label for="short-duration">Short break · 1–60 minutes</label>
	<input
		id="short-duration"
		type="number"
		min="1"
		max="60"
		step="1"
		bind:value={short}
		aria-describedby="settings-error"
	/>
	<label for="long-duration">Long break · 1–120 minutes</label>
	<input
		id="long-duration"
		type="number"
		min="1"
		max="120"
		step="1"
		bind:value={long}
		aria-describedby="settings-error"
	/>
	<label for="session-count">Sessions before long break · 1–10</label>
	<input
		id="session-count"
		type="number"
		min="1"
		max="10"
		step="1"
		bind:value={sessions}
		aria-describedby="settings-error"
	/>
	<label class="check"><input type="checkbox" bind:checked={auto} /> Auto-cycle sessions</label>
	<p id="settings-error" class="error" role="alert">{error}</p>
	{#if $timerState.isRunning}<p>Pause the timer before saving changes.</p>{/if}
	<div class="dialog-actions">
		<button type="button" on:click={() => dispatch('close')}>Cancel</button>
		<button class="primary" disabled={$timerState.isRunning} type="submit">Save</button>
	</div>
</form>
