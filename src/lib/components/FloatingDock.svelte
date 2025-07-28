<script lang="ts">
	import { onMount } from 'svelte';
	import ProfessionalHSLPicker from './ProfessionalHSLPicker.svelte';
	import TimerSettings from './TimerSettings.svelte';
	import WaterEffectsPanel from './WaterEffectsPanel.svelte';

	let dockElement: HTMLDivElement;
	let isVisible = false;
	let hideTimeout: number;
	let mouseY = 0;
	let windowHeight = 0;
	let showColorGrid = false;
	let showTimerSettings = false;
	let showWaterEffects = false;
	let showLightEffects = false;
	let showParticleEffects = false;
	let showMasterSettings = false;

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

	function closeAllPanels() {
		showColorGrid = false;
		showTimerSettings = false;
		showWaterEffects = false;
		showLightEffects = false;
		showParticleEffects = false;
		showMasterSettings = false;
	}

	function toggleColorGrid() {
		closeAllPanels();
		showColorGrid = true;
		showDock();
	}

	function toggleTimerSettings() {
		closeAllPanels();
		showTimerSettings = true;
		showDock();
	}

	function toggleWaterEffects() {
		closeAllPanels();
		showWaterEffects = true;
		showDock();
	}

	function toggleLightEffects() {
		closeAllPanels();
		showLightEffects = true;
		showDock();
	}

	function toggleParticleEffects() {
		closeAllPanels();
		showParticleEffects = true;
		showDock();
	}

	function toggleMasterSettings() {
		closeAllPanels();
		showMasterSettings = true;
		showDock();
	}

	function handleDockItemClick(item: string) {
		switch (item) {
			case 'colors':
				toggleColorGrid();
				break;
			case 'timer':
				toggleTimerSettings();
				break;
			case 'water':
				toggleWaterEffects();
				break;
			case 'light':
				toggleLightEffects();
				break;
			case 'particles':
				toggleParticleEffects();
				break;
			case 'settings':
				toggleMasterSettings();
				break;
			default:
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
		
		<!-- Water Effects -->
		<div 
			class="dock-item"
			class:active={showWaterEffects}
			title="Water Effects"
			on:click={() => handleDockItemClick('water')}
		>
			<div class="dock-icon">🌊</div>
		</div>
		
		<!-- Light Effects -->
		<div 
			class="dock-item"
			class:active={showLightEffects}
			title="Light Effects"
			on:click={() => handleDockItemClick('light')}
		>
			<div class="dock-icon">✨</div>
		</div>
		
		<!-- Particle Effects -->
		<div 
			class="dock-item"
			class:active={showParticleEffects}
			title="Particle Effects"
			on:click={() => handleDockItemClick('particles')}
		>
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
		<div 
			class="dock-item"
			class:active={showMasterSettings}
			title="Master Settings"
			on:click={() => handleDockItemClick('settings')}
		>
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

	<!-- Water Effects Panel -->
	{#if showWaterEffects}
		<div 
			class="panel-container water-effects-panel"
			class:visible={showWaterEffects}
		>
			<WaterEffectsPanel />
		</div>
	{/if}

	<!-- Light Effects Panel -->
	{#if showLightEffects}
		<div 
			class="panel-container light-effects-panel"
			class:visible={showLightEffects}
		>
			<div class="placeholder-panel">
				<h3>Light Effects</h3>
				<p>Coming soon...</p>
			</div>
		</div>
	{/if}

	<!-- Particle Effects Panel -->
	{#if showParticleEffects}
		<div 
			class="panel-container particle-effects-panel"
			class:visible={showParticleEffects}
		>
			<div class="placeholder-panel">
				<h3>Particle Effects</h3>
				<p>Coming soon...</p>
			</div>
		</div>
	{/if}

	<!-- Master Settings Panel -->
	{#if showMasterSettings}
		<div 
			class="panel-container master-settings-panel"
			class:visible={showMasterSettings}
		>
			<div class="placeholder-panel">
				<h3>Master Settings</h3>
				<p>Coming soon...</p>
			</div>
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

	/* Placeholder panel styles */
	.placeholder-panel {
		background: rgba(0, 0, 0, 0.95);
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 20px;
		padding: 40px;
		backdrop-filter: blur(25px);
		box-shadow: 
			0 20px 40px rgba(0, 0, 0, 0.4),
			0 8px 16px rgba(0, 0, 0, 0.2),
			inset 0 1px rgba(255, 255, 255, 0.1);
		min-width: 300px;
		text-align: center;
	}

	.placeholder-panel h3 {
		color: rgba(255, 255, 255, 0.9);
		font-size: 20px;
		font-weight: 600;
		margin-bottom: 12px;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.placeholder-panel p {
		color: rgba(255, 255, 255, 0.6);
		font-size: 14px;
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