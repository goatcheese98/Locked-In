<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import {
		backgroundSettings,
		getGradientColor1HSL,
		getGradientColor2HSL,
		setGradientColor1,
		setGradientColor2
	} from '$lib/stores/backgroundSettingsStore';
	const dispatch = createEventDispatcher<{ close: void }>();
	type Component = 'h' | 's' | 'l';
	let gradient: 1 | 2 = 1;
	let synced = false;
	let locked = false;
	$: first = getGradientColor1HSL($backgroundSettings);
	$: second = getGradientColor2HSL($backgroundSettings);
	$: current = gradient === 1 ? first : second;
	const controls: { key: Component; label: string; max: number }[] = [
		{ key: 'h', label: 'Hue', max: 360 },
		{ key: 's', label: 'Saturation', max: 100 },
		{ key: 'l', label: 'Lightness', max: 100 }
	];
	function update(component: Component, event: Event) {
		if (locked || !(event.currentTarget instanceof HTMLInputElement)) return;
		const value = event.currentTarget.valueAsNumber;
		const maximum = component === 'h' ? 360 : 100;
		if (!Number.isFinite(value) || value < 0 || value > maximum) return;
		const targets = synced ? ([1, 2] as const) : [gradient];
		for (const target of targets) {
			const color = { ...(target === 1 ? first : second), [component]: value };
			(target === 1 ? setGradientColor1 : setGradientColor2)(color.h, color.s, color.l);
		}
	}
	function reset() {
		if (locked) return;
		setGradientColor1(210, 70, 50);
		setGradientColor2(200, 68, 50);
	}
</script>

<section class="palette" aria-labelledby="palette-title">
	<div class="palette-header">
		<h2 id="palette-title">Color palette</h2>
		<button on:click={() => dispatch('close')}>Close</button>
	</div>
	<fieldset class="gradient-choice">
		<legend>Edit gradient</legend>
		<label><input type="radio" bind:group={gradient} value={1} /> Color 1</label>
		<label><input type="radio" bind:group={gradient} value={2} /> Color 2</label>
	</fieldset>
	<label class="check"><input type="checkbox" bind:checked={synced} /> Sync both gradients</label>
	<label class="check"><input type="checkbox" bind:checked={locked} /> Lock colors</label>
	{#each controls as control (control.key)}
		<div class="channel">
			<label for={`palette-${control.key}`}
				>{control.label} <span>{current[control.key]}{control.key === 'h' ? '°' : '%'}</span></label
			>
			<input
				id={`palette-${control.key}`}
				type="range"
				min="0"
				max={control.max}
				step="1"
				value={current[control.key]}
				disabled={locked}
				on:input={(event) => update(control.key, event)}
			/>
		</div>
	{/each}
	{#each [first, second] as color, index (index)}
		<p class="preview">
			<span class="swatch" style:background={`hsl(${color.h}, ${color.s}%, ${color.l}%)`}
			></span>Color {index + 1}: {color.h}°, {color.s}%, {color.l}%
		</p>
	{/each}
	<button disabled={locked} on:click={reset}>Reset colors</button>
</section>

<style>
	.palette {
		width: min(360px, calc(100vw - 32px));
		padding: 16px;
		border: 1px solid var(--line);
		border-radius: var(--r-lg);
		background: var(--panel);
		color: var(--fg);
	}
	.palette-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}
	h2 {
		font-size: 16px;
	}
	.gradient-choice {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin: 12px 0;
		border: 0;
		padding: 0;
	}
	legend {
		padding-bottom: 8px;
	}
	.gradient-choice label {
		display: flex;
		gap: 8px;
		align-items: center;
		min-height: 44px;
	}
	input {
		accent-color: var(--acc);
	}
	.channel {
		margin-block: 12px;
	}
	.channel label {
		display: flex;
		justify-content: space-between;
		gap: 12px;
	}
	.channel span,
	.preview {
		font-family: var(--font-mono);
		font-size: 13px;
	}
	input[type='range'] {
		display: block;
		width: 100%;
		min-height: 44px;
	}
	.preview {
		display: flex;
		align-items: center;
		gap: 8px;
		margin: 8px 0;
		color: var(--fg);
	}
	.swatch {
		width: 24px;
		height: 24px;
		border: 1px solid var(--line);
		border-radius: var(--r-xs);
		flex-shrink: 0;
	}
</style>
