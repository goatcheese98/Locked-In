<script lang="ts">
	import { onMount, tick } from 'svelte';
	import TimerDisplay from '$lib/components/TimerDisplay.svelte';
	import TimerControls from '$lib/components/TimerControls.svelte';
	import TimerSettings from '$lib/components/TimerSettings.svelte';
	import {
		timerState,
		timerSettings,
		timerAnnouncement,
		storageNotice,
		resetTimer,
		initializeTimer,
		refreshTimer,
		disposeTimer
	} from '$lib/stores/timerStore';
	import type { SessionType } from '$lib/stores/timerStore';
	import { backgroundSettings, backgroundNotice } from '$lib/stores/backgroundSettingsStore';
	import InteractiveBackground from '$lib/components/InteractiveBackground.svelte';
	import FloatingDock from '$lib/components/FloatingDock.svelte';
	let ready = false;
	let dialog: HTMLDialogElement;
	let settingsOpen = false;
	async function openSettings() {
		settingsOpen = true;
		await tick();
		dialog.showModal();
	}
	let appearance: HTMLDialogElement;
	let reduced = false;
	let effects = false;
	let theme = 'system';
	let notice = '';
	const modes: { value: SessionType; label: string }[] = [
		{ value: 'Work', label: 'Focus' },
		{ value: 'Short Break', label: 'Short break' },
		{ value: 'Long Break', label: 'Long break' }
	];
	function applyAppearance() {
		document.documentElement.dataset.theme =
			theme === 'system'
				? matchMedia('(prefers-color-scheme: dark)').matches
					? 'dark'
					: 'light'
				: theme;
	}
	function saveAppearance() {
		applyAppearance();
		try {
			localStorage.setItem('lockedInAppearance', JSON.stringify({ theme, effects }));
		} catch {
			notice = "Appearance works for this visit; preferences won't persist.";
		}
	}
	function trapFocus(event: KeyboardEvent) {
		if (event.key !== 'Tab' || !(event.currentTarget instanceof HTMLDialogElement)) return;
		const controls = Array.from(
			event.currentTarget.querySelectorAll<HTMLElement>(
				'button:not(:disabled),input:not(:disabled),select:not(:disabled)'
			)
		);
		const first = controls[0];
		const last = controls[controls.length - 1];
		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last?.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first?.focus();
		}
	}
	function modeKey(event: KeyboardEvent, index: number) {
		const offset =
			event.key === 'ArrowRight' || event.key === 'ArrowDown'
				? 1
				: event.key === 'ArrowLeft' || event.key === 'ArrowUp'
					? -1
					: 0;
		if (!offset) return;
		event.preventDefault();
		const next = (index + offset + modes.length) % modes.length;
		resetTimer(modes[next].value);
		document.getElementById(`mode-${next}`)?.focus();
	}
	onMount(() => {
		initializeTimer();
		const motion = matchMedia('(prefers-reduced-motion: reduce)');
		const color = matchMedia('(prefers-color-scheme: dark)');
		const updateMotion = () => {
			reduced = motion.matches;
		};
		updateMotion();
		try {
			const raw = localStorage.getItem('lockedInAppearance');
			if (raw !== null) {
				const value: unknown = JSON.parse(raw);
				if (
					!value ||
					typeof value !== 'object' ||
					!('theme' in value) ||
					!['system', 'light', 'dark'].includes(String(value.theme)) ||
					!('effects' in value) ||
					typeof value.effects !== 'boolean'
				)
					throw new Error('Invalid appearance');
				theme = String(value.theme);
				effects = value.effects;
			}
		} catch {
			notice = 'Saved appearance could not be read. Using a neutral background.';
		}
		applyAppearance();
		motion.addEventListener('change', updateMotion);
		color.addEventListener('change', applyAppearance);
		document.addEventListener('visibilitychange', refreshTimer);
		window.addEventListener('focus', refreshTimer);
		ready = true;
		return () => {
			disposeTimer();
			motion.removeEventListener('change', updateMotion);
			color.removeEventListener('change', applyAppearance);
			document.removeEventListener('visibilitychange', refreshTimer);
			window.removeEventListener('focus', refreshTimer);
		};
	});
</script>

<svelte:head>
	<title>Locked-In Pomodoro Timer</title>
	<meta
		name="description"
		content="A little space to focus, with a Pomodoro timer and optional background effects."
	/>
</svelte:head>
{#if effects && !reduced}<InteractiveBackground settings={$backgroundSettings} />{/if}
<div class="focus-screen" class:with-effects={effects && !reduced}>
	<header>
		<h1>Locked-In</h1>
		<div class="header-actions">
			<button disabled={!ready} class="quiet" on:click={() => appearance.showModal()}
				>Appearance</button
			>
			<button disabled={!ready} on:click={openSettings}>Timer settings</button>
		</div>
	</header>
	<main class="workspace">
		<div class="modes" role="radiogroup" aria-label="Session mode">
			{#each modes as mode, index (mode.value)}
				<button
					id={`mode-${index}`}
					role="radio"
					aria-checked={$timerState.currentSession === mode.value}
					tabindex={$timerState.currentSession === mode.value ? 0 : -1}
					on:keydown={(event) => modeKey(event, index)}
					on:click={() => resetTimer(mode.value)}>{mode.label}</button
				>
			{/each}
		</div>
		<TimerDisplay />
		<TimerControls />
		<p class="sr-only" role="status">{$timerAnnouncement}</p>
		{#if $storageNotice || $backgroundNotice || notice}<p class="notice" role="status">
				{$storageNotice || $backgroundNotice || notice}
			</p>{/if}
	</main>
	<footer>
		<span
			>{$timerSettings.workDuration / 60} min focus / {$timerSettings.shortBreakDuration / 60} min short
			break / {$timerSettings.longBreakDuration / 60} min long break</span
		>
		<span
			>Background effects · {reduced && effects
				? 'Off (reduced motion)'
				: effects
					? 'On'
					: 'Off'}</span
		>
	</footer>
</div>
<dialog
	on:keydown={trapFocus}
	bind:this={dialog}
	on:close={() => (settingsOpen = false)}
	aria-label="Timer settings"
>
	{#if settingsOpen}<TimerSettings on:close={() => dialog.close()} />{/if}
</dialog>
<dialog on:keydown={trapFocus} bind:this={appearance} aria-labelledby="appearance-title">
	<div class="settings-form">
		<h2 id="appearance-title">Appearance</h2>
		<label for="theme">Theme</label>
		<select id="theme" bind:value={theme} on:change={saveAppearance}>
			<option value="system">System</option><option value="light">Light</option><option value="dark"
				>Dark</option
			>
		</select>
		<label class="check"
			><input type="checkbox" bind:checked={effects} on:change={saveAppearance} /> Background effects</label
		>
		<p>
			{reduced
				? 'Reduced motion is enabled. Effects stay off; your choice is preserved.'
				: 'Optional effects use your dock settings. Off by default.'}
		</p>
		<div class="dialog-actions"><button on:click={() => appearance.close()}>Done</button></div>
	</div>
</dialog>
<FloatingDock onTimerSettings={openSettings} />
