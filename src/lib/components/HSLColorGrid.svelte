<script lang="ts">
	import { 
		backgroundSettings, 
		setGradientColor1, 
		setGradientColor2,
		getGradientColor1HSL,
		getGradientColor2HSL
	} from '$lib/stores/backgroundSettingsStore';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	// Grid configuration
	const HUE_STEPS = 12; // 30° increments
	const SATURATION_STEPS = 6; // ~17% increments
	const LIGHTNESS_STEPS = 6; // ~17% increments

	// Control states
	let selectedComponent: 'hue' | 'saturation' | 'lightness' = 'hue';
	let isLocked = false;
	let isSynced = false;
	let isDragging = false;
	let activeGradient: 1 | 2 | null = null;

	$: color1HSL = getGradientColor1HSL();
	$: color2HSL = getGradientColor2HSL();
	$: color1H = color1HSL.h;
	$: color1S = color1HSL.s;
	$: color1L = color1HSL.l;
	$: color2H = color2HSL.h;
	$: color2S = color2HSL.s;
	$: color2L = color2HSL.l;

	// Generate grid values based on selected component
	function getGridValues() {
		switch (selectedComponent) {
			case 'hue':
				return Array.from({ length: HUE_STEPS }, (_, i) => (i * 360) / HUE_STEPS);
			case 'saturation':
				return Array.from({ length: SATURATION_STEPS }, (_, i) => (i * 100) / (SATURATION_STEPS - 1));
			case 'lightness':
				return Array.from({ length: LIGHTNESS_STEPS }, (_, i) => 20 + (i * 60) / (LIGHTNESS_STEPS - 1));
		}
	}

	// Get color for grid cell
	function getCellColor(value: number): string {
		let h, s, l;
		
		switch (selectedComponent) {
			case 'hue':
				h = value;
				s = 70; // Fixed saturation for hue grid
				l = 50; // Fixed lightness for hue grid
				break;
			case 'saturation':
				// For saturation, use average hue from both gradients for better representation
				h = (color1H + color2H) / 2;
				s = value;
				l = 50; // Fixed lightness for saturation grid
				break;
			case 'lightness':
				// For lightness, use average hue and saturation from both gradients
				h = (color1H + color2H) / 2;
				s = (color1S + color2S) / 2;
				l = value;
				break;
		}
		
		return `hsl(${h}, ${s}%, ${l}%)`;
	}

	// Get indicator position for gradient
	function getIndicatorPosition(gradient: 1 | 2) {
		const values = getGridValues();
		let currentValue;
		
		if (gradient === 1) {
			currentValue = selectedComponent === 'hue' ? color1H :
						   selectedComponent === 'saturation' ? color1S : color1L;
		} else {
			currentValue = selectedComponent === 'hue' ? color2H :
						   selectedComponent === 'saturation' ? color2S : color2L;
		}
		
		// Find closest value in grid
		const closestIndex = values.reduce((closest, value, index) => {
			return Math.abs(value - currentValue) < Math.abs(values[closest] - currentValue) ? index : closest;
		}, 0);
		
		return closestIndex;
	}

	// Handle cell click
	function handleCellClick(value: number, event: MouseEvent) {
		if (event.shiftKey || activeGradient === 2) {
			updateGradientColor(2, value);
		} else {
			updateGradientColor(1, value);
		}
		
		if (isSynced) {
			updateGradientColor(activeGradient === 1 ? 2 : 1, value);
		}
	}

	// Update gradient color
	function updateGradientColor(gradient: 1 | 2, value: number) {
		const currentColor = gradient === 1 ? 
			{ h: color1H, s: color1S, l: color1L } :
			{ h: color2H, s: color2S, l: color2L };
		
		let newColor = { ...currentColor };
		
		switch (selectedComponent) {
			case 'hue':
				newColor.h = value;
				break;
			case 'saturation':
				newColor.s = value;
				break;
			case 'lightness':
				newColor.l = value;
				break;
		}
		
		if (gradient === 1) {
			setGradientColor1(newColor.h, newColor.s, newColor.l);
		} else {
			setGradientColor2(newColor.h, newColor.s, newColor.l);
		}
	}

	// Handle drag start
	function handleDragStart(gradient: 1 | 2, event: MouseEvent) {
		isDragging = true;
		activeGradient = gradient;
		event.preventDefault();
		
		// Add mouse move and mouse up listeners for dragging
		const handleMouseMove = (e: MouseEvent) => {
			if (!isDragging) return;
			
			// Find the grid cell under the mouse
			const gridContainer = (event.target as HTMLElement).closest('.color-grid');
			if (!gridContainer) return;
			
			const rect = gridContainer.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			
			// Calculate which cell the mouse is over
			const cellsPerRow = 6;
			const cellWidth = rect.width / cellsPerRow;
			const cellHeight = cellWidth; // Assuming square cells
			
			const col = Math.floor(x / cellWidth);
			const row = Math.floor(y / cellHeight);
			const cellIndex = row * cellsPerRow + col;
			
			const values = getGridValues();
			if (cellIndex >= 0 && cellIndex < values.length) {
				const value = values[cellIndex];
				updateGradientColor(gradient, value);
			}
		};
		
		const handleMouseUp = () => {
			isDragging = false;
			activeGradient = null;
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
		
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
	}

	// Toggle sync mode
	function toggleSync() {
		isSynced = !isSynced;
	}

	// Toggle lock mode
	function toggleLock() {
		isLocked = !isLocked;
	}

	// Reset to defaults
	function resetColors() {
		setGradientColor1(210, 70, 25); // Default blue (matching store defaults)
		setGradientColor2(200, 68, 27); // Default teal (matching store defaults)
	}
</script>

<div class="hsl-grid-container">
	<!-- Header Controls -->
	<div class="grid-header">
		<div class="component-selector">
			<button 
				class="component-btn" 
				class:active={selectedComponent === 'hue'}
				on:click={() => selectedComponent = 'hue'}
			>
				H
			</button>
			<button 
				class="component-btn" 
				class:active={selectedComponent === 'saturation'}
				on:click={() => selectedComponent = 'saturation'}
			>
				S
			</button>
			<button 
				class="component-btn" 
				class:active={selectedComponent === 'lightness'}
				on:click={() => selectedComponent = 'lightness'}
			>
				L
			</button>
		</div>
		
		<div class="control-buttons">
			<button 
				class="control-btn" 
				class:active={isSynced}
				on:click={toggleSync}
				title="Sync both gradients"
			>
				🔗
			</button>
			<button 
				class="control-btn" 
				class:active={isLocked}
				on:click={toggleLock}
				title="Lock current selection"
			>
				🔒
			</button>
			<button 
				class="control-btn reset-btn" 
				on:click={resetColors}
				title="Reset to defaults"
			>
				↺
			</button>
		</div>
	</div>

	<!-- Color Grid -->
	<div class="color-grid">
		{#each getGridValues() as value, index}
			<div 
				class="grid-cell"
				style="background-color: {getCellColor(value)}"
				on:click={(e) => handleCellClick(value, e)}
				role="button"
				tabindex="0"
				title="{selectedComponent.toUpperCase()}: {Math.round(value)}"
			>
				<!-- Gradient 1 Indicator -->
				{#if getIndicatorPosition(1) === index}
					<div 
						class="gradient-indicator gradient-1"
						on:mousedown={(e) => {
							e.stopPropagation();
							handleDragStart(1, e);
						}}
						role="button"
						tabindex="0"
						title="Gradient 1 - Drag to move"
					>
						1
					</div>
				{/if}
				
				<!-- Gradient 2 Indicator -->
				{#if getIndicatorPosition(2) === index}
					<div 
						class="gradient-indicator gradient-2"
						on:mousedown={(e) => {
							e.stopPropagation();
							handleDragStart(2, e);
						}}
						role="button"
						tabindex="0"
						title="Gradient 2 - Drag to move"
					>
						2
					</div>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Current Colors Preview -->
	<div class="color-preview">
		<div class="preview-item">
			<div 
				class="preview-swatch"
				style="background-color: hsl({color1H}, {color1S}%, {color1L}%)"
			></div>
			<span class="preview-label">
				Gradient 1: {Math.round(color1H)}°, {Math.round(color1S)}%, {Math.round(color1L)}%
			</span>
		</div>
		<div class="preview-item">
			<div 
				class="preview-swatch"
				style="background-color: hsl({color2H}, {color2S}%, {color2L}%)"
			></div>
			<span class="preview-label">
				Gradient 2: {Math.round(color2H)}°, {Math.round(color2S)}%, {Math.round(color2L)}%
			</span>
		</div>
	</div>

	<!-- Instructions -->
	<div class="instructions">
		<p>Click: Set Gradient 1 • Shift+Click: Set Gradient 2 • Drag indicators to move</p>
	</div>
</div>

<style>
	.hsl-grid-container {
		background: rgba(0, 0, 0, 0.9);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 16px;
		padding: 16px;
		backdrop-filter: blur(20px);
		min-width: 320px;
		max-width: 400px;
	}

	.grid-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12px;
	}

	.component-selector {
		display: flex;
		gap: 4px;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 8px;
		padding: 2px;
	}

	.component-btn {
		background: transparent;
		border: none;
		color: rgba(255, 255, 255, 0.7);
		padding: 8px 12px;
		border-radius: 6px;
		cursor: pointer;
		font-weight: 600;
		font-size: 14px;
		transition: all 0.2s ease;
	}

	.component-btn:hover {
		color: white;
		background: rgba(255, 255, 255, 0.1);
	}

	.component-btn.active {
		background: rgba(255, 255, 255, 0.15);
		color: white;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	}

	.control-buttons {
		display: flex;
		gap: 4px;
	}

	.control-btn {
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		color: rgba(255, 255, 255, 0.7);
		padding: 6px 8px;
		border-radius: 6px;
		cursor: pointer;
		font-size: 12px;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 28px;
		height: 28px;
	}

	.control-btn:hover {
		background: rgba(255, 255, 255, 0.1);
		border-color: rgba(255, 255, 255, 0.2);
		color: white;
	}

	.control-btn.active {
		background: rgba(59, 130, 246, 0.2);
		border-color: rgba(59, 130, 246, 0.5);
		color: #60a5fa;
	}

	.reset-btn:hover {
		background: rgba(239, 68, 68, 0.2);
		border-color: rgba(239, 68, 68, 0.5);
		color: #f87171;
	}

	.color-grid {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 4px;
		margin-bottom: 12px;
	}

	.grid-cell {
		aspect-ratio: 1;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		transition: transform 0.1s ease;
		border: 1px solid rgba(255, 255, 255, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.grid-cell:hover {
		transform: scale(1.05);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		z-index: 10;
	}

	.gradient-indicator {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 10px;
		font-weight: bold;
		color: white;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
		cursor: grab;
		transition: transform 0.1s ease;
		position: absolute;
	}

	.gradient-indicator:active {
		cursor: grabbing;
		transform: scale(1.1);
	}

	.gradient-1 {
		background: rgba(59, 130, 246, 0.9);
		border: 2px solid white;
		top: -2px;
		left: -2px;
	}

	.gradient-2 {
		background: rgba(236, 72, 153, 0.9);
		border: 2px solid white;
		bottom: -2px;
		right: -2px;
	}

	.color-preview {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-bottom: 12px;
	}

	.preview-item {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.preview-swatch {
		width: 24px;
		height: 24px;
		border-radius: 4px;
		border: 1px solid rgba(255, 255, 255, 0.2);
		flex-shrink: 0;
	}

	.preview-label {
		color: rgba(255, 255, 255, 0.8);
		font-size: 12px;
		font-family: monospace;
	}

	.instructions {
		text-align: center;
		color: rgba(255, 255, 255, 0.5);
		font-size: 11px;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		padding-top: 8px;
	}

	/* Mobile adjustments */
	@media (max-width: 480px) {
		.hsl-grid-container {
			min-width: 280px;
			padding: 12px;
		}
		
		.color-grid {
			grid-template-columns: repeat(4, 1fr);
		}
		
		.component-btn {
			padding: 6px 10px;
			font-size: 12px;
		}
	}
</style>