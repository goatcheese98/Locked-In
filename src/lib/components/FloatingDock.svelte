<script lang="ts">
	import { onMount } from 'svelte';
	import ProfessionalHSLPicker from './ProfessionalHSLPicker.svelte';
	import TimerSettings from './TimerSettings.svelte';

	let dockElement: HTMLDivElement;
	let isVisible = false;
	let hideTimeout: number;
	let mouseY = 0;
	let windowHeight = 0;
	let showColorGrid = false;
	let showTimerSettings = false;

	const TRIGGER_ZONE_HEIGHT = 100; // pixels from bottom to trigger
	const AUTO_HIDE_DELAY = 3000; // ms before auto-hide

	onMount(() => {
		const handleMouseMove = (e: MouseEvent) => {
			mouseY = e.clientY;
			checkVisibility();
		};

		const handleResize = () => {
			windowHeight = window.innerHeight;
		};

		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('resize', handleResize);
		handleResize();

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('resize', handleResize);
			if (hideTimeout) clearTimeout(hideTimeout);
		};
	});

	function checkVisibility() {
		const distanceFromBottom = windowHeight - mouseY;
		const shouldShow = distanceFromBottom <= TRIGGER_ZONE_HEIGHT;

		if (shouldShow && !isVisible) {
			showDock();
		} else if (!shouldShow && isVisible) {
			scheduleHide();
		}
	}

	function showDock() {
		isVisible = true;
		if (hideTimeout) {
			clearTimeout(hideTimeout);
			hideTimeout = 0;
		}
	}

	function hideDock() {
		isVisible = false;
	}

	function scheduleHide() {
		if (hideTimeout) clearTimeout(hideTimeout);
		hideTimeout = setTimeout(hideDock, AUTO_HIDE_DELAY);
	}

	function handleDockMouseEnter() {
		showDock();
	}

	function handleDockMouseLeave() {
		scheduleHide();
	}

	function toggleColorGrid() {
		showColorGrid = !showColorGrid;
		showTimerSettings = false;
		if (showColorGrid) {
			showDock(); // Keep dock visible when grid is open
		}
	}

	function toggleTimerSettings() {
		showTimerSettings = !showTimerSettings;
		showColorGrid = false;
		if (showTimerSettings) {
			showDock(); // Keep dock visible when settings are open
		}
	}

	function handleDockItemClick(item: string) {
		switch (item) {
			case 'colors':
				toggleColorGrid();
				break;
			case 'timer':
				toggleTimerSettings();
				break;
			default:
				// Handle other dock items
				break;
		}
	}
</script>

<div
	bind:this={dockElement}
	class="floating-dock"
	class:visible={isVisible}
	on:mouseenter={handleDockMouseEnter}
	on:mouseleave={handleDockMouseLeave}
	role="toolbar"
	aria-label="Background Effects Dock"
>
	<div class="dock-container">
		<!-- Color Grid Picker -->
		<div 
			class="dock-item" 
			class:active={showColorGrid}
			title="Professional HSL Color Picker"
			on:click={() => handleDockItemClick('colors')}
		>
			<div class="dock-icon">🎨</div>
		</div>
		
		<!-- Placeholder dock items - will be replaced with background effect controls -->
		<div class="dock-item" title="Water Effects">
			<div class="dock-icon">🌊</div>
		</div>
		<div class="dock-item" title="Light Effects">
			<div class="dock-icon">✨</div>
		</div>
		<div class="dock-item" title="Particle Effects">
			<div class="dock-icon">💫</div>
		</div>
		<div 
			class="dock-item"
			class:active={showTimerSettings}
			title="Timer Settings"
			on:click={() => handleDockItemClick('timer')}
		>
			<div class="dock-icon">⏱️</div>
		</div>
		<div class="dock-item" title="Settings">
			<div class="dock-icon">⚙️</div>
		</div>
	</div>

	<!-- Color Grid Panel -->
	{#if showColorGrid}
		<div 
			class="panel-container color-grid-panel"
			class:visible={showColorGrid}
		>
			<ProfessionalHSLPicker />
		</div>
	{/if}

	<!-- Timer Settings Panel -->
	{#if showTimerSettings}
		<div 
			class="panel-container timer-settings-panel"
			class:visible={showTimerSettings}
		>
			<TimerSettings />
		</div>
	{/if}
</div>

<style>
	.floating-dock {
		position: fixed;
		bottom: 16px;
		left: 50%;
		transform: translateX(-50%) translateY(100px);
		z-index: 1000;
		opacity: 0;
		transition: 
			transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
			opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		pointer-events: none;
	}

	.floating-dock.visible {
		transform: translateX(-50%) translateY(0);
		opacity: 1;
		pointer-events: auto;
	}

	.dock-container {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 12px 16px;
		background: rgba(0, 0, 0, 0.85);
		backdrop-filter: blur(20px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 24px;
		box-shadow: 
			0 8px 32px rgba(0, 0, 0, 0.3),
			0 4px 16px rgba(0, 0, 0, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
	}

	.dock-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 12px;
		cursor: pointer;
		transition: 
			transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
			background 0.2s cubic-bezier(0.4, 0, 0.2, 1),
			border-color 0.2s cubic-bezier(0.4, 0, 0.2, 1),
			box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		overflow: hidden;
	}

	.dock-item::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
		opacity: 0;
		transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.dock-item:hover {
		transform: translateY(-4px) scale(1.05);
		background: rgba(255, 255, 255, 0.1);
		border-color: rgba(255, 255, 255, 0.2);
		box-shadow: 
			0 8px 24px rgba(0, 0, 0, 0.4),
			0 4px 12px rgba(0, 0, 0, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.2);
	}

	.dock-item:hover::before {
		opacity: 1;
	}

	.dock-item:active {
		transform: translateY(-2px) scale(1.02);
		transition-duration: 0.1s;
	}

	.dock-item.active {
		background: rgba(59, 130, 246, 0.2);
		border-color: rgba(59, 130, 246, 0.4);
		box-shadow: 
			0 0 20px rgba(59, 130, 246, 0.3),
			0 8px 24px rgba(0, 0, 0, 0.4),
			inset 0 1px 0 rgba(255, 255, 255, 0.2);
	}

	.dock-item.active .dock-icon {
		filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.6));
	}

	.dock-icon {
		font-size: 20px;
		user-select: none;
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
	}

	/* Hover zone indicator (optional, for development) */
	.floating-dock::after {
		content: '';
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 100px;
		pointer-events: none;
		/* Uncomment for debugging: */
		/* background: rgba(255, 0, 0, 0.1); */
		z-index: -1;
	}

	/* Panel Container - shared styles for all panels */
	.panel-container {
		position: absolute;
		bottom: 80px;
		left: 50%;
		transform: translateX(-50%) translateY(20px);
		opacity: 0;
		pointer-events: none;
		transition: 
			transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
			opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		z-index: 999;
	}

	.panel-container.visible {
		transform: translateX(-50%) translateY(0);
		opacity: 1;
		pointer-events: auto;
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.floating-dock {
			bottom: 12px;
		}
		
		.dock-container {
			padding: 10px 12px;
			gap: 6px;
		}
		
		.dock-item {
			width: 44px;
			height: 44px;
		}
		
		.dock-icon {
			font-size: 18px;
		}
	}

	@media (max-width: 480px) {
		.dock-container {
			padding: 8px 10px;
			gap: 4px;
		}
		
		.dock-item {
			width: 40px;
			height: 40px;
		}
		
		.dock-icon {
			font-size: 16px;
		}
	}
</style>