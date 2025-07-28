<script lang="ts">
	type HslColor = { h: number; s: number; l: number };

	// Define props using let declarations (Svelte 5 infers these as props)
	let {
		color1H,
		color1S,
		color1L,
		color1HslString,
		canGoPrev1,
		canGoNext1,
		isAutoCycling1,
		color2H,
		color2S,
		color2L,
		color2HslString,
		canGoPrev2,
		canGoNext2,
		isAutoCycling2,
		isFloatingEnabled,
		onPrev1,
		onNext1,
		onRandom1,
		onPrev2,
		onNext2,
		onRandom2,
		onHsl1Change,
		onHsl2Change,
		onToggleAutoCycle1,
		onToggleAutoCycle2,
		onToggleFloating,
		onResetDefaults,
		onPointerDown1,
		onPointerUp1,
		onPointerDown2,
		onPointerUp2
	} = $props<{
		// Define the type inline with $props
		color1H: number;
		color1S: number;
		color1L: number;
		color1HslString: string;
		canGoPrev1: boolean;
		canGoNext1: boolean;
		isAutoCycling1: boolean;
		color2H: number;
		color2S: number;
		color2L: number;
		color2HslString: string;
		canGoPrev2: boolean;
		canGoNext2: boolean;
		isAutoCycling2: boolean;
		isFloatingEnabled: boolean;
		onPrev1: () => void;
		onNext1: () => void;
		onRandom1: () => void;
		onPrev2: () => void;
		onNext2: () => void;
		onRandom2: () => void;
		onHsl1Change: (hsl: HslColor) => void;
		onHsl2Change: (hsl: HslColor) => void;
		onToggleAutoCycle1: () => void;
		onToggleAutoCycle2: () => void;
		onToggleFloating: (checked: boolean) => void;
		onResetDefaults: () => void;
		onPointerDown1: () => void;
		onPointerUp1: () => void;
		onPointerDown2: () => void;
		onPointerUp2: () => void;
	}>();

	// Combined handler for H, S, L slider INPUT -> report full HSL change to parent immediately
	function handleSliderInput1(event: Event) {
		const target = event.target as HTMLInputElement;
		const value = parseInt(target.value);
		const type = target.id.split('-')[1]; // 'h', 's', or 'l'

		// Construct new HSL based on which slider changed - READ CURRENT PROPS
		let newH = color1H,
			newS = color1S,
			newL = color1L;
		if (type === 'h') newH = value;
		else if (type === 's') newS = value;
		else if (type === 'l') newL = value;

		// Update local H value if it was the Hue slider, needed for reactive sat gradient
		if (type === 'h') {
			color1H = value;
		}

		// Call parent handler immediately for real-time background update
		onHsl1Change({ h: newH, s: newS, l: newL });
	}

	function handleSliderInput2(event: Event) {
		const target = event.target as HTMLInputElement;
		const value = parseInt(target.value);
		const type = target.id.split('-')[1]; // 'h', 's', or 'l'

		let newH = color2H,
			newS = color2S,
			newL = color2L;
		if (type === 'h') newH = value;
		else if (type === 's') newS = value;
		else if (type === 'l') newL = value;

		// Update local H value if it was the Hue slider
		if (type === 'h') {
			color2H = value;
		}

		onHsl2Change({ h: newH, s: newS, l: newL });
	}

	// Internal handler for floating toggle
	function handleToggleFloating(event: Event) {
		const target = event.target as HTMLInputElement;
		onToggleFloating(target.checked); // Pass the boolean state up
	}

	// Reactive styles for dynamic slider backgrounds using $derived
	const saturationGradient1 = $derived(
		`linear-gradient(to right, hsl(${color1H}, 0%, 50%), hsl(${color1H}, 100%, 50%))`
	); // Use fixed 50% L for preview
	const saturationGradient2 = $derived(
		`linear-gradient(to right, hsl(${color2H}, 0%, 50%), hsl(${color2H}, 100%, 50%))`
	); // Use fixed 50% L for preview
</script>

<!-- Moved HTML Form Structure -->
<form on:submit|preventDefault class="mb-8 space-y-4">
	<!-- Gradient Color 1 Controls -->
	<div>
		<label class="mb-1 block text-sm font-medium text-gray-300">Gradient Color 1 (HSL)</label>
		<div class="mb-1.5 flex items-center space-x-1.5">
			<button
				type="button"
				on:click={onPrev1}
				disabled={!canGoPrev1}
				title="Previous Color 1"
				class="control-button icon-button"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="h-5 w-5"
					><path
						fill-rule="evenodd"
						d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
						clip-rule="evenodd"
					/></svg
				>
			</button>
			<div class="color-preview" style="--preview-bg: {color1HslString};">
				<div class="hsl-values">
					{color1H}, {color1S}%, {color1L}%
				</div>
			</div>
			<button
				type="button"
				on:click={onNext1}
				disabled={!canGoNext1}
				title="Next Color 1"
				class="control-button icon-button"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="h-5 w-5"
					><path
						fill-rule="evenodd"
						d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
						clip-rule="evenodd"
					/></svg
				>
			</button>
			<button
				type="button"
				on:click={onRandom1}
				title="Randomize Color 1"
				class="control-button icon-button random-button"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="h-5 w-5"
					><path
						fill-rule="evenodd"
						d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.39-3.423 3.252c-.772.732-.297 2.041.678 2.041h4.475l1.83 4.401c.321.772 1.415.772 1.736 0l1.83-4.401h4.475c.975 0 1.45-1.309.678-2.041L12.698 7.675l-4.753-.39-1.83-4.401z"
						clip-rule="evenodd"
					/></svg
				>
			</button>
		</div>
		<div class="grid grid-cols-3 gap-2">
			<div>
				<label for="c1-h" class="block text-xs font-medium text-gray-400">H</label>
				<input
					type="range"
					id="c1-h"
					bind:value={color1H}
					on:input={handleSliderInput1}
					on:pointerdown={onPointerDown1}
					on:pointerup={onPointerUp1}
					min="0"
					max="360"
					class="slider hue-slider"
					style="background: linear-gradient(to right, hsl(0, 100%, 35%), hsl(60, 100%, 35%), hsl(120, 100%, 35%), hsl(180, 100%, 35%), hsl(240, 100%, 35%), hsl(300, 100%, 35%), hsl(360, 100%, 35%));"
				/>
			</div>
			<div>
				<label for="c1-s" class="block text-xs font-medium text-gray-400">S%</label>
				<input
					type="range"
					id="c1-s"
					bind:value={color1S}
					on:input={handleSliderInput1}
					on:pointerdown={onPointerDown1}
					on:pointerup={onPointerUp1}
					min="0"
					max="100"
					class="slider saturation-slider"
					style="background: {saturationGradient1};"
				/>
			</div>
			<div>
				<label for="c1-l" class="block text-xs font-medium text-gray-400">L%</label>
				<input
					type="range"
					id="c1-l"
					bind:value={color1L}
					on:input={handleSliderInput1}
					on:pointerdown={onPointerDown1}
					on:pointerup={onPointerUp1}
					min="0"
					max="100"
					class="slider lightness-slider"
					style="background: linear-gradient(to right, black, white);"
				/>
			</div>
		</div>
		<div class="mt-2 mb-4 flex items-center pt-2">
			<!-- Animated Toggle Switch for Auto-Cycle 1 -->
			<label for="auto-cycle-1" class="toggle-switch">
				<input
					id="auto-cycle-1"
					type="checkbox"
					bind:checked={isAutoCycling1}
					on:change={onToggleAutoCycle1}
					class="toggle-input"
				/>
				<span class="toggle-track">
					<span class="toggle-thumb"></span>
				</span>
				<span class="toggle-label">Auto-Cycle Color 1</span>
			</label>
		</div>
	</div>

	<!-- Gradient Color 2 Controls -->
	<div>
		<label class="mb-1 block text-sm font-medium text-gray-300">Gradient Color 2 (HSL)</label>
		<div class="mb-1.5 flex items-center space-x-1.5">
			<button
				type="button"
				on:click={onPrev2}
				disabled={!canGoPrev2}
				title="Previous Color 2"
				class="control-button icon-button"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="h-5 w-5"
					><path
						fill-rule="evenodd"
						d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
						clip-rule="evenodd"
					/></svg
				>
			</button>
			<div class="color-preview" style="--preview-bg: {color2HslString};">
				<div class="hsl-values">
					{color2H}, {color2S}%, {color2L}%
				</div>
			</div>
			<button
				type="button"
				on:click={onNext2}
				disabled={!canGoNext2}
				title="Next Color 2"
				class="control-button icon-button"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="h-5 w-5"
					><path
						fill-rule="evenodd"
						d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
						clip-rule="evenodd"
					/></svg
				>
			</button>
			<button
				type="button"
				on:click={onRandom2}
				title="Randomize Color 2"
				class="control-button icon-button random-button"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="h-5 w-5"
					><path
						fill-rule="evenodd"
						d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.39-3.423 3.252c-.772.732-.297 2.041.678 2.041h4.475l1.83 4.401c.321.772 1.415.772 1.736 0l1.83-4.401h4.475c.975 0 1.45-1.309.678-2.041L12.698 7.675l-4.753-.39-1.83-4.401z"
						clip-rule="evenodd"
					/></svg
				>
			</button>
		</div>
		<div class="grid grid-cols-3 gap-2">
			<div>
				<label for="c2-h" class="block text-xs font-medium text-gray-400">H</label>
				<input
					type="range"
					id="c2-h"
					bind:value={color2H}
					on:input={handleSliderInput2}
					on:pointerdown={onPointerDown2}
					on:pointerup={onPointerUp2}
					min="0"
					max="360"
					class="slider hue-slider"
					style="background: linear-gradient(to right, hsl(0, 100%, 35%), hsl(60, 100%, 35%), hsl(120, 100%, 35%), hsl(180, 100%, 35%), hsl(240, 100%, 35%), hsl(300, 100%, 35%), hsl(360, 100%, 35%));"
				/>
			</div>
			<div>
				<label for="c2-s" class="block text-xs font-medium text-gray-400">S%</label>
				<input
					type="range"
					id="c2-s"
					bind:value={color2S}
					on:input={handleSliderInput2}
					on:pointerdown={onPointerDown2}
					on:pointerup={onPointerUp2}
					min="0"
					max="100"
					class="slider saturation-slider"
					style="background: {saturationGradient2};"
				/>
			</div>
			<div>
				<label for="c2-l" class="block text-xs font-medium text-gray-400">L%</label>
				<input
					type="range"
					id="c2-l"
					bind:value={color2L}
					on:input={handleSliderInput2}
					on:pointerdown={onPointerDown2}
					on:pointerup={onPointerUp2}
					min="0"
					max="100"
					class="slider lightness-slider"
					style="background: linear-gradient(to right, black, white);"
				/>
			</div>
		</div>
		<div class="mt-2 mb-4 flex items-center pt-2">
			<!-- Animated Toggle Switch for Auto-Cycle 2 -->
			<label for="auto-cycle-2" class="toggle-switch">
				<input
					id="auto-cycle-2"
					type="checkbox"
					bind:checked={isAutoCycling2}
					on:change={onToggleAutoCycle2}
					class="toggle-input"
				/>
				<span class="toggle-track">
					<span class="toggle-thumb"></span>
				</span>
				<span class="toggle-label">Auto-Cycle Color 2</span>
			</label>
		</div>
	</div>

	<!-- Floating Effect Toggle (using toggle switch style) -->
	<div class="flex items-center pt-4">
		<label for="enable-floating" class="toggle-switch">
			<input
				id="enable-floating"
				type="checkbox"
				bind:checked={isFloatingEnabled}
				on:change={handleToggleFloating}
				class="toggle-input"
			/>
			<span class="toggle-track">
				<span class="toggle-thumb"></span>
			</span>
			<span class="toggle-label">Enable floating effect?</span>
		</label>
	</div>

	<!-- Reset Button -->
	<div class="pt-2">
		<button type="button" on:click={onResetDefaults} class="control-button reset-button">
			Reset to Defaults
		</button>
	</div>
</form>

<style>
	/* Base Styles - Keeping slider styles */
	.slider {
		margin-top: 0.25rem;
		display: block;
		width: 100%;
		height: 0.75rem;
		border-radius: 9999px;
		appearance: none;
		-webkit-appearance: none;
		cursor: pointer;
		outline: none;
		border: 1px solid hsla(0, 0%, 100%, 0.15);
		transition: border-color 0.2s ease-in-out;
	}
	.slider:focus {
		border-color: hsla(174, 72%, 56%, 0.6);
	}
	.slider::-webkit-slider-runnable-track {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 100%;
		border-radius: inherit;
		background: inherit;
	}
	.slider::-moz-range-track {
		appearance: none;
		width: 100%;
		height: 100%;
		border-radius: inherit;
		background: inherit;
	}
	.slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 1rem;
		height: 1rem;
		background-color: #cbd5e1;
		border-radius: 9999px;
		border: 1px solid #64748b;
		cursor: pointer;
		margin-top: -0.125rem;
		transition: background-color 0.2s ease-in-out;
	}
	.slider::-moz-range-thumb {
		appearance: none;
		width: 1rem;
		height: 1rem;
		background-color: #cbd5e1;
		border-radius: 9999px;
		border: 1px solid #64748b;
		cursor: pointer;
		transition: background-color 0.2s ease-in-out;
	}
	.slider:hover::-webkit-slider-thumb,
	.slider:focus::-webkit-slider-thumb {
		background-color: #f1f5f9;
	}
	.slider:hover::-moz-range-thumb,
	.slider:focus::-moz-range-thumb {
		background-color: #f1f5f9;
	}
	.slider:active::-webkit-slider-thumb {
		background-color: #94a3b8;
	}
	.slider:active::-moz-range-thumb {
		background-color: #94a3b8;
	}

	/* NEW Control Button Base */
	.control-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		font-weight: 500;
		outline: none;
		transition:
			color 0.15s ease-in-out,
			background-color 0.15s ease-in-out,
			border-color 0.15s ease-in-out,
			box-shadow 0.15s ease-in-out;
		cursor: pointer;
	}
	.control-button:focus-visible {
		outline: none;
		box-shadow:
			0 0 0 2px hsl(215, 27%, 17%),
			0 0 0 4px hsl(174, 72%, 56%, 0.6);
	}
	.control-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		pointer-events: none;
	}

	/* Icon Button Specific Styles */
	.icon-button {
		padding: 0.5rem;
		width: 2.25rem;
		height: 2.25rem;
		background-color: hsla(220, 13%, 45%, 0.5);
		color: #d1d5db;
		border: 1px solid hsla(217, 19%, 35%, 0.4);
	}
	.icon-button:hover:not(:disabled) {
		background-color: hsla(220, 13%, 45%, 0.7);
		color: #5eead4;
	}
	/* Random Button Specific */
	.random-button {
		background-color: hsla(168, 76%, 42%, 0.3);
		color: #99f6e4;
		border-color: hsla(168, 60%, 50%, 0.4);
	}
	.random-button:hover:not(:disabled) {
		background-color: hsla(168, 76%, 42%, 0.5);
		color: #ffffff;
	}

	/* Reset Button Specific Styles */
	.reset-button {
		width: 100%;
		padding: 0.5rem 1rem;
		background-color: hsla(220, 13%, 45%, 0.7);
		color: #d1d5db;
		border: 1px solid hsla(217, 33%, 50%, 0.6);
		box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
	}
	.reset-button:hover:not(:disabled) {
		background-color: hsla(220, 13%, 45%, 0.9);
		color: #5eead4;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -1px rgba(0, 0, 0, 0.06);
	}

	/* Color Preview Box */
	.color-preview {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-grow: 1;
		height: 2.5rem;
		border-radius: 0.375rem;
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
		border: 1px solid hsla(217, 33%, 50%, 0.7);
		font-size: 0.75rem;
		color: hsla(0, 0%, 100%, 0.9);
		font-family: monospace;
		user-select: none;
		background-color: var(--preview-bg, transparent);
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
	}

	/* Checkbox Styles */
	.custom-checkbox {
		appearance: none;
		-webkit-appearance: none;
		height: 1rem;
		width: 1rem;
		display: inline-block;
		vertical-align: middle;
		position: relative;
		cursor: pointer;
		border-radius: 0.25rem;
		background-color: hsla(220, 13%, 45%, 0.8);
		border: 1px solid hsla(217, 33%, 50%, 0.7);
		outline: none;
		transition:
			background-color 0.15s ease-in-out,
			border-color 0.15s ease-in-out,
			box-shadow 0.15s ease-in-out;
		/* Checkmark SVG (white) */
		background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
		background-size: 0% 0%;
		background-position: 50% 50%;
		background-repeat: no-repeat;
	}

	.custom-checkbox:checked {
		background-color: #0d9488;
		border-color: #0f766e;
		background-size: 100% 100%;
	}

	.custom-checkbox:focus-visible {
		box-shadow:
			0 0 0 2px hsl(215, 27%, 17%),
			0 0 0 4px hsla(174, 72%, 56%, 0.6);
	}

	.checkbox-label {
		margin-left: 0.75rem;
		display: block;
		font-size: 0.875rem;
		color: #d1d5db;
		cursor: pointer;
		user-select: none;
	}

	/* NEW Animated Toggle Switch Styles */
	.toggle-switch {
		display: inline-flex;
		align-items: center;
		cursor: pointer;
		user-select: none;
		-webkit-tap-highlight-color: transparent; /* Prevent tap highlight on mobile */
	}

	.toggle-input {
		/* Hide the actual checkbox but keep it accessible */
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
	}

	.toggle-track {
		position: relative;
		width: 2.5rem; /* Adjusted width */
		height: 1.25rem; /* Adjusted height */
		background-color: hsla(220, 13%, 45%, 0.8); /* Off state background */
		border: 1px solid hsla(217, 33%, 50%, 0.7);
		border-radius: 9999px; /* Fully rounded */
		transition: background-color 0.3s ease-in-out;
		display: flex;
		align-items: center;
	}

	.toggle-thumb {
		position: absolute;
		left: 2px; /* Initial position (left) */
		width: 1rem; /* Adjusted Thumb size */
		height: 1rem; /* Adjusted Thumb size */
		background-color: #cbd5e1; /* Thumb color */
		border-radius: 50%; /* Circular thumb */
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
		transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); /* Smooth sliding animation */
	}

	.toggle-input:checked + .toggle-track {
		background-color: #0d9488; /* Teal 'on' state background */
		border-color: #0f766e;
	}

	.toggle-input:checked + .toggle-track > .toggle-thumb {
		transform: translateX(calc(2.5rem - 1rem - 4px)); /* Adjusted Move thumb to the right */
		/* Calculation: track width - thumb width - (2 * left padding) */
		background-color: #f0fdfa; /* Lighter thumb when on */
	}

	.toggle-input:focus-visible + .toggle-track {
		/* Focus style similar to buttons/checkboxes */
		box-shadow:
			0 0 0 2px hsl(215, 27%, 17%),
			0 0 0 4px hsla(174, 72%, 56%, 0.6);
	}

	.toggle-label {
		margin-left: 0.75rem; /* Space between switch and label text */
		font-size: 0.875rem;
		color: #d1d5db;
	}
</style>
