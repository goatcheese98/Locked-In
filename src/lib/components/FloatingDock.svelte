<script lang="ts">
	import { onMount } from 'svelte';
	import ProfessionalHSLPicker from './ProfessionalHSLPicker.svelte';
	import TimerSettings from './TimerSettings.svelte';
	import WaterEffectsPanel from './WaterEffectsPanel.svelte';
	import ParticleEffectsPanel from './ParticleEffectsPanel.svelte';
	import LightEffectsPanel from './LightEffectsPanel.svelte';

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
	let hoveredIndex = -1;
	let dockItems: HTMLButtonElement[] = [];

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

	function handleMouseEnter(index: number) {
		hoveredIndex = index;
	}

	function handleMouseLeave() {
		hoveredIndex = -1;
	}

	function calculateScale(index: number, hoveredIndex: number): number {
		if (hoveredIndex === -1) return 1;
		
		const distance = Math.abs(index - hoveredIndex);
		if (distance === 0) return 1.4; // Main hovered item (reduced from 1.6)
		if (distance === 1) return 1.2; // Adjacent items (reduced from 1.3)
		if (distance === 2) return 1.05; // Items 2 positions away (reduced from 1.1)
		return 1; // All other items remain normal size
	}
</script>

<div
	bind:this={dockElement}
	class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out"
	class:translate-y-24={!isVisible}
	class:opacity-0={!isVisible}
	class:pointer-events-none={!isVisible}
	on:mouseenter={handleDockMouseEnter}
	on:mouseleave={handleDockMouseLeave}
	role="toolbar"
	aria-label="Background Effects Dock"
	tabindex="0"
>
	<div class="flex items-end gap-4 px-6 py-4 bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl"
		 role="group"
		 on:mouseleave={handleMouseLeave}>
		<!-- Color Grid Picker -->
		<button 
			bind:this={dockItems[0]}
			class="dock-item group"
			class:active={showColorGrid}
			title="Professional HSL Color Picker"
			on:click={() => handleDockItemClick('colors')}
			on:mouseenter={() => handleMouseEnter(0)}
			aria-label="Professional HSL Color Picker"
			style="transform: scale({calculateScale(0, hoveredIndex)})"
		>
			<span class="dock-icon text-2xl">🎨</span>
		</button>
		
		<!-- Water Effects -->
		<button 
			bind:this={dockItems[1]}
			class="dock-item group"
			class:active={showWaterEffects}
			title="Water Effects"
			on:click={() => handleDockItemClick('water')}
			on:mouseenter={() => handleMouseEnter(1)}
			aria-label="Water Effects"
			style="transform: scale({calculateScale(1, hoveredIndex)})"
		>
			<span class="dock-icon text-2xl">🌊</span>
		</button>
		
		<!-- Light Effects -->
		<button 
			bind:this={dockItems[2]}
			class="dock-item group"
			class:active={showLightEffects}
			title="Light Effects"
			on:click={() => handleDockItemClick('light')}
			on:mouseenter={() => handleMouseEnter(2)}
			aria-label="Light Effects"
			style="transform: scale({calculateScale(2, hoveredIndex)})"
		>
			<span class="dock-icon text-2xl">✨</span>
		</button>
		
		<!-- Particle Effects -->
		<button 
			bind:this={dockItems[3]}
			class="dock-item group"
			class:active={showParticleEffects}
			title="Particle Effects"
			on:click={() => handleDockItemClick('particles')}
			on:mouseenter={() => handleMouseEnter(3)}
			aria-label="Particle Effects"
			style="transform: scale({calculateScale(3, hoveredIndex)})"
		>
			<span class="dock-icon text-2xl">💫</span>
		</button>
		<!-- Timer Settings -->
		<button 
			bind:this={dockItems[4]}
			class="dock-item group"
			class:active={showTimerSettings}
			title="Timer Settings"
			on:click={() => handleDockItemClick('timer')}
			on:mouseenter={() => handleMouseEnter(4)}
			aria-label="Timer Settings"
			style="transform: scale({calculateScale(4, hoveredIndex)})"
		>
			<span class="dock-icon text-2xl">⏱️</span>
		</button>
		<!-- Master Settings -->
		<button 
			bind:this={dockItems[5]}
			class="dock-item group"
			class:active={showMasterSettings}
			title="Master Settings"
			on:click={() => handleDockItemClick('settings')}
			on:mouseenter={() => handleMouseEnter(5)}
			aria-label="Master Settings"
			style="transform: scale({calculateScale(5, hoveredIndex)})"
		>
			<span class="dock-icon text-2xl">⚙️</span>
		</button>
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
			<LightEffectsPanel />
		</div>
	{/if}

	<!-- Particle Effects Panel -->
	{#if showParticleEffects}
		<div 
			class="panel-container particle-effects-panel"
			class:visible={showParticleEffects}
		>
			<ParticleEffectsPanel />
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
	.dock-item {
		width: 4rem;
		height: 4rem;
		border-radius: 0.75rem;
		background-color: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		transform-origin: center bottom;
		cursor: pointer;
	}
	
	.dock-item:hover {
		background-color: rgba(255, 255, 255, 0.1);
		border-color: rgba(255, 255, 255, 0.2);
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
	}
	
	.dock-item:focus {
		outline: none;
		box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
	}
	
	.dock-item.active {
		background-color: rgba(59, 130, 246, 0.2);
		border-color: rgba(59, 130, 246, 0.4);
		box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.2), 0 4px 6px -2px rgba(59, 130, 246, 0.1);
	}
	
	.dock-item.active .dock-icon {
		filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.6));
	}
	
	.dock-icon {
		user-select: none;
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		pointer-events: none;
	}

	/* Panel positioning and animations */
	.panel-container {
		position: absolute;
		bottom: 90px;
		left: 50%;
		transform: translate(-50%, 20px);
		opacity: 0;
		pointer-events: none;
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		z-index: 999;
	}
	
	.panel-container.visible {
		transform: translate(-50%, 0);
		opacity: 1;
		pointer-events: auto;
	}
	
	.placeholder-panel {
		background: rgba(0, 0, 0, 0.95);
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 20px;
		padding: 40px;
		backdrop-filter: blur(25px);
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 8px 16px rgba(0, 0, 0, 0.2), inset 0 1px rgba(255, 255, 255, 0.1);
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
</style>