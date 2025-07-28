<script lang="ts">
	import { onMount } from 'svelte';
	import ProfessionalHSLPicker from './ProfessionalHSLPicker.svelte';
	import TimerSettings from './TimerSettings.svelte';
	import WaterEffectsPanel from './WaterEffectsPanel.svelte';
	import ParticleEffectsPanel from './ParticleEffectsPanel.svelte';
	import LightEffectsPanel from './LightEffectsPanel.svelte';

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
		const isMouseAtBottom = distanceFromBottom <= TRIGGER_ZONE_HEIGHT;
		const isPanelOpen =
			showColorGrid ||
			showTimerSettings ||
			showWaterEffects ||
			showLightEffects ||
			showParticleEffects ||
			showMasterSettings;

		if (isMouseAtBottom || isPanelOpen) {
			showDock();
		} else {
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
		if (
			!showColorGrid &&
			!showTimerSettings &&
			!showWaterEffects &&
			!showLightEffects &&
			!showParticleEffects &&
			!showMasterSettings
		) {
			isVisible = false;
		}
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
		checkVisibility();
	}

	function togglePanel(panel: string) {
		const wasVisible = {
			colors: showColorGrid,
			timer: showTimerSettings,
			water: showWaterEffects,
			light: showLightEffects,
			particles: showParticleEffects,
			settings: showMasterSettings
		}[panel];

		closeAllPanels();

		if (!wasVisible) {
			switch (panel) {
				case 'colors':
					showColorGrid = true;
					break;
				case 'timer':
					showTimerSettings = true;
					break;
				case 'water':
					showWaterEffects = true;
					break;
				case 'light':
					showLightEffects = true;
					break;
				case 'particles':
					showParticleEffects = true;
					break;
				case 'settings':
					showMasterSettings = true;
					break;
			}
		}
		showDock();
	}

	function handleMouseEnter(index: number) {
		hoveredIndex = index;
	}

	function handleMouseLeave() {
		hoveredIndex = -1;
	}

	function calculateScale(index: number): number {
		if (hoveredIndex === -1) return 1;
		const distance = Math.abs(index - hoveredIndex);
		if (distance === 0) return 1.25;
		if (distance === 1) return 1.1;
		if (distance === 2) return 1.05;
		return 1;
	}

	const dockItems = [
		{
			id: 'colors',
			title: 'Color Palette',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.34 0 2.61-.26 3.79-.75 1.15-.47 2.22-1.13 3.21-1.95.99-.82 1.87-1.77 2.63-2.81.54-.74.99-1.53 1.37-2.39.37-.85.64-1.76.81-2.7.17-.94.25-1.92.25-2.91 0-5.52-4.48-10-10-10zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c1.66 0 3.16-.67 4.24-1.76.33-.33.62-.69.88-1.07C17.51 14.31 18 13.19 18 12c0-3.31-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/><circle cx="12" cy="12" r="2"/></svg>`
		},
		{
			id: 'water',
			title: 'Water Effects',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12zm5.29-4.71a7.983 7.983 0 0 1 9.42 0 7.983 7.983 0 0 1 0 9.42 7.983 7.983 0 0 1-9.42 0 7.983 7.983 0 0 1 0-9.42zM9 12c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3z"/></svg>`
		},
		{
			id: 'light',
			title: 'Light Effects',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4m-2.83-7.07l-2.83 2.83M16.24 16.24l-2.83 2.83M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z"/></svg>`
		},
		{
			id: 'particles',
			title: 'Particle Effects',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="5" r="1"/><circle cx="5" cy="19" r="1"/><circle cx="5" cy="5" r="1"/><circle cx="19" cy="19" r="1"/></svg>`
		},
		{
			id: 'timer',
			title: 'Timer Settings',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`
		},
		{
			id: 'settings',
			title: 'Master Settings',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19.14 12.94a8.003 8.003 0 0 0-1.4-3.88l1.7-1.7a1 1 0 0 0 0-1.42l-1.83-1.83a1 1 0 0 0-1.42 0l-1.7 1.7A8.003 8.003 0 0 0 9.06 4.86L7.34 3.14a1 1 0 0 0-1.42 0L4.09 4.97a1 1 0 0 0 0 1.42l1.7 1.7A8.003 8.003 0 0 0 4.86 12H3.14a1 1 0 0 0 0 2h1.72a8.003 8.003 0 0 0 1.4 3.88l-1.7 1.7a1 1 0 0 0 0 1.42l1.83 1.83a1 1 0 0 0 1.42 0l1.7-1.7c1.18.83 2.54 1.32 3.98 1.32s2.8-.49 3.98-1.32l1.7 1.7a1 1 0 0 0 1.42 0l1.83-1.83a1 1 0 0 0 0-1.42l-1.7-1.7a8.003 8.003 0 0 0 1.4-3.88h1.72a1 1 0 0 0 0-2h-1.72zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/></svg>`
		}
	];

	$: activePanel = showColorGrid
		? 'colors'
		: showTimerSettings
		? 'timer'
		: showWaterEffects
		? 'water'
		: showLightEffects
		? 'light'
		: showParticleEffects
		? 'particles'
		: showMasterSettings
		? 'settings'
		: null;
</script>

<div
	class="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-in-out"
	class:translate-y-20={!isVisible}
	class:opacity-0={!isVisible}
	class:pointer-events-none={!isVisible}
	on:mouseenter={handleDockMouseEnter}
	on:mouseleave={handleDockMouseLeave}
	role="toolbar"
	aria-label="Background Effects Dock"
>
	<div
		class="flex items-end justify-center gap-2"
		on:mouseleave={handleMouseLeave}
		role="group"
	>
		{#each dockItems as item, index (item.id)}
			<button
				class="dock-item"
				class:active={activePanel === item.id}
				title={item.title}
				on:click={() => togglePanel(item.id)}
				on:mouseenter={() => handleMouseEnter(index)}
				aria-label={item.title}
				style={`transform: scale(${calculateScale(index)});`}
			>
				<div class="dock-icon">{@html item.icon}</div>
			</button>
		{/each}
	</div>

	<!-- Panels -->
	<div class="panel-container" class:visible={activePanel}>
		{#if showColorGrid}
			<ProfessionalHSLPicker on:close={closeAllPanels} />
		{/if}
		{#if showTimerSettings}
			<TimerSettings on:close={closeAllPanels} />
		{/if}
		{#if showWaterEffects}
			<WaterEffectsPanel on:close={closeAllPanels} />
		{/if}
		{#if showLightEffects}
			<LightEffectsPanel on:close={closeAllPanels} />
		{/if}
		{#if showParticleEffects}
			<ParticleEffectsPanel on:close={closeAllPanels} />
		{/if}
		{#if showMasterSettings}
			<div class="placeholder-panel">
				<h3>Master Settings</h3>
				<p>Coming soon...</p>
				<button on:click={closeAllPanels}>Close</button>
			</div>
		{/if}
	</div>
</div>

<style>
	.dock-item {
		width: 48px;
		height: 48px;
		border-radius: 12px;
		background-color: rgba(30, 30, 30, 0.5);
		border: 1px solid rgba(255, 255, 255, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		transform-origin: center bottom;
		cursor: pointer;
		-webkit-backdrop-filter: blur(10px);
		backdrop-filter: blur(10px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
	}

	.dock-item:hover {
		background-color: rgba(45, 45, 45, 0.6);
		border-color: rgba(255, 255, 255, 0.2);
	}

	.dock-item:active,
	.dock-item.active {
		background-color: rgba(80, 130, 250, 0.3);
		border-color: rgba(80, 130, 250, 0.6);
		transform: scale(1.1) !important;
	}

	.dock-icon {
		width: 24px;
		height: 24px;
		color: rgba(255, 255, 255, 0.8);
		transition: all 0.2s ease;
	}

	.dock-item:hover .dock-icon {
		color: white;
	}

	.dock-item.active .dock-icon {
		color: white;
		filter: drop-shadow(0 0 5px rgba(80, 130, 250, 0.7));
	}

	.panel-container {
		position: absolute;
		bottom: calc(100% + 10px);
		left: 50%;
		transform: translate(-50%, 10px);
		opacity: 0;
		pointer-events: none;
		transition:
			transform 0.25s ease-out,
			opacity 0.25s ease-out;
		z-index: -1;
	}

	.panel-container.visible {
		transform: translate(-50%, 0);
		opacity: 1;
		pointer-events: auto;
	}

	.placeholder-panel {
		padding: 20px;
		background: rgba(20, 20, 20, 0.8);
		border-radius: 16px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(15px);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
	}
</style>