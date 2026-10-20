<script lang="ts">
	import { onMount } from 'svelte';
	import { Palette, Waves, Sun, Sparkles, Timer, Settings } from 'lucide-svelte';
	import ProfessionalHSLPicker from './ProfessionalHSLPicker.svelte';
	import TimerSettings from './TimerSettings.svelte';
	import WaterEffectsPanel from './WaterEffectsPanel.svelte';
	import ParticleEffectsPanel from './ParticleEffectsPanel.svelte';
	import LightEffectsPanel from './LightEffectsPanel.svelte';

	export let onTimerSettings: (() => void) | undefined = undefined;
	let ready = false;
	let isVisible = false;
	let panelContainer: HTMLDivElement;
	let dockElement: HTMLDivElement;
	let focusedIndex = 0;
	function dockKeys(event: KeyboardEvent) {
		if (!(event.target instanceof HTMLElement) || !event.target.closest('.dock-item')) return;
		const buttons = Array.from(dockElement.querySelectorAll<HTMLButtonElement>('.dock-item'));
		const index = buttons.indexOf(event.target.closest('button') as HTMLButtonElement);
		const next =
			event.key === 'ArrowRight'
				? (index + 1) % buttons.length
				: event.key === 'ArrowLeft'
					? (index + buttons.length - 1) % buttons.length
					: event.key === 'Home'
						? 0
						: event.key === 'End'
							? buttons.length - 1
							: -1;
		if (next < 0) return;
		event.preventDefault();
		buttons[next]?.focus();
	}
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
		ready = true;
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
		hideTimeout = window.setTimeout(hideDock, AUTO_HIDE_DELAY);
	}

	function handleDockMouseEnter() {
		showDock();
	}

	function handleDockMouseLeave() {
		scheduleHide();
	}

	function closeAllPanels() {
		const returnFocus = panelContainer?.contains(document.activeElement);
		const previousPanel = activePanel;
		showColorGrid = false;
		showTimerSettings = false;
		showWaterEffects = false;
		showLightEffects = false;
		showParticleEffects = false;
		showMasterSettings = false;
		if (returnFocus && previousPanel)
			dockElement.querySelector<HTMLButtonElement>(`[data-panel="${previousPanel}"]`)?.focus();
		checkVisibility();
	}

	function togglePanel(panel: string) {
		if (panel === 'timer' && onTimerSettings) {
			closeAllPanels();
			onTimerSettings();
			return;
		}
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
			icon: Palette
		},
		{
			id: 'water',
			title: 'Water Effects',
			icon: Waves
		},
		{
			id: 'light',
			title: 'Light Effects',
			icon: Sun
		},
		{
			id: 'particles',
			title: 'Particle Effects',
			icon: Sparkles
		},
		{
			id: 'timer',
			title: 'Timer Settings',
			icon: Timer
		},
		{
			id: 'settings',
			title: 'Master Settings',
			icon: Settings
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
	bind:this={dockElement}
	on:keydown={dockKeys}
	class="effects-dock fixed bottom-4 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ease-in-out"
	class:translate-y-20={!isVisible}
	class:opacity-0={!isVisible}
	class:pointer-events-none={!isVisible}
	on:focusin={showDock}
	on:mouseenter={handleDockMouseEnter}
	on:mouseleave={handleDockMouseLeave}
	role="toolbar"
	tabindex="-1"
	aria-label="Background Effects Dock"
>
	<div class="flex items-end justify-center gap-2" on:mouseleave={handleMouseLeave} role="group">
		{#each dockItems as item, index (item.id)}
			<button
				class="dock-item"
				disabled={!ready}
				data-panel={item.id}
				tabindex={index === focusedIndex ? 0 : -1}
				on:focus={() => (focusedIndex = index)}
				class:active={activePanel === item.id}
				title={item.title}
				on:click={() => togglePanel(item.id)}
				on:mouseenter={() => handleMouseEnter(index)}
				aria-label={item.title}
				style={`transform: scale(${calculateScale(index)});`}
			>
				<div class="dock-icon">
					<svelte:component this={item.icon} size={24} aria-hidden="true" />
				</div>
			</button>
		{/each}
	</div>

	<!-- Panels -->
	<div bind:this={panelContainer} class="panel-container" class:visible={activePanel}>
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
	.effects-dock:focus-within {
		opacity: 1 !important;
		pointer-events: auto !important;
	}
	@media (max-width: 767px) {
		.effects-dock {
			max-width: calc(100vw - 32px);
		}
		.effects-dock > div:first-child {
			gap: 4px;
		}
		.effects-dock .dock-item {
			width: 44px;
			height: 44px;
			flex-shrink: 0;
			transform: none !important;
		}
		.effects-dock .panel-container {
			max-width: calc(100vw - 32px);
			overflow: auto;
			max-height: 70svh;
		}
	}

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
		background: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 12px;
		padding: 20px;
		width: 320px;
		color: white;
	}
</style>
