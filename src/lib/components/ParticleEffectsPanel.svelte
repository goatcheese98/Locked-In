<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	
	const dispatch = createEventDispatcher();
	
	// Water Grains Settings
	let waterGrainsEnabled = true;
	let grainDensity = 600; // Number of particles
	let grainSpeed = 0.15; // Average speed
	let grainSize = 0.875; // Average size
	let grainOpacity = 0.4; // Average opacity
	
	// Foam Streaks Settings
	let foamEnabled = true;
	let foamFrequency = 0.02; // Chance per frame
	let foamLifetime = 120; // Average lifetime in frames
	let foamComplexity = 50; // Average path segments
	let foamBranchiness = 0.25; // Branch probability
	let foamOpacity = 0.7;
	
	// Apply settings
	function applySettings() {
		dispatch('update', {
			waterGrains: {
				enabled: waterGrainsEnabled,
				density: grainDensity,
				speed: grainSpeed,
				size: grainSize,
				opacity: grainOpacity
			},
			foam: {
				enabled: foamEnabled,
				frequency: foamFrequency,
				lifetime: foamLifetime,
				complexity: foamComplexity,
				branchiness: foamBranchiness,
				opacity: foamOpacity
			}
		});
	}
	
	// Reset to defaults
	function resetDefaults() {
		waterGrainsEnabled = true;
		grainDensity = 600;
		grainSpeed = 0.15;
		grainSize = 0.875;
		grainOpacity = 0.4;
		
		foamEnabled = true;
		foamFrequency = 0.02;
		foamLifetime = 120;
		foamComplexity = 50;
		foamBranchiness = 0.25;
		foamOpacity = 0.7;
		
		applySettings();
	}
</script>

<div class="effects-panel">
	<h3 class="panel-title">Particle Effects</h3>
	
	<!-- Water Grains Section -->
	<div class="effect-section">
		<div class="section-header">
			<h4 class="section-title">Water Grains</h4>
			<label class="toggle-wrapper">
				<input
					type="checkbox"
					bind:checked={waterGrainsEnabled}
					on:change={applySettings}
					class="toggle-input"
				/>
				<span class="toggle-label">Enable</span>
			</label>
		</div>
		
		{#if waterGrainsEnabled}
			<div class="controls-grid">
				<div class="control-item">
					<label for="grain-density" class="control-label">Density</label>
					<div class="slider-container">
						<input
							id="grain-density"
							type="range"
							bind:value={grainDensity}
							on:input={applySettings}
							min="100"
							max="1200"
							step="50"
							class="slider"
						/>
						<span class="value-display">{grainDensity}</span>
					</div>
				</div>
				
				<div class="control-item">
					<label for="grain-speed" class="control-label">Speed</label>
					<div class="slider-container">
						<input
							id="grain-speed"
							type="range"
							bind:value={grainSpeed}
							on:input={applySettings}
							min="0.05"
							max="0.25"
							step="0.01"
							class="slider"
						/>
						<span class="value-display">{grainSpeed.toFixed(2)}</span>
					</div>
				</div>
				
				<div class="control-item">
					<label for="grain-size" class="control-label">Size</label>
					<div class="slider-container">
						<input
							id="grain-size"
							type="range"
							bind:value={grainSize}
							on:input={applySettings}
							min="0.5"
							max="1.25"
							step="0.05"
							class="slider"
						/>
						<span class="value-display">{grainSize.toFixed(2)}</span>
					</div>
				</div>
				
				<div class="control-item">
					<label for="grain-opacity" class="control-label">Opacity</label>
					<div class="slider-container">
						<input
							id="grain-opacity"
							type="range"
							bind:value={grainOpacity}
							on:input={applySettings}
							min="0.1"
							max="0.8"
							step="0.05"
							class="slider"
						/>
						<span class="value-display">{Math.round(grainOpacity * 100)}%</span>
					</div>
				</div>
			</div>
		{/if}
	</div>
	
	<!-- Foam Streaks Section -->
	<div class="effect-section">
		<div class="section-header">
			<h4 class="section-title">Foam Streaks</h4>
			<label class="toggle-wrapper">
				<input
					type="checkbox"
					bind:checked={foamEnabled}
					on:change={applySettings}
					class="toggle-input"
				/>
				<span class="toggle-label">Enable</span>
			</label>
		</div>
		
		{#if foamEnabled}
			<div class="controls-grid">
				<div class="control-item">
					<label for="foam-frequency" class="control-label">Frequency</label>
					<div class="slider-container">
						<input
							id="foam-frequency"
							type="range"
							bind:value={foamFrequency}
							on:input={applySettings}
							min="0.005"
							max="0.05"
							step="0.005"
							class="slider"
						/>
						<span class="value-display">{(foamFrequency * 100).toFixed(1)}%</span>
					</div>
				</div>
				
				<div class="control-item">
					<label for="foam-lifetime" class="control-label">Lifetime</label>
					<div class="slider-container">
						<input
							id="foam-lifetime"
							type="range"
							bind:value={foamLifetime}
							on:input={applySettings}
							min="60"
							max="200"
							step="10"
							class="slider"
						/>
						<span class="value-display">{(foamLifetime / 60).toFixed(1)}s</span>
					</div>
				</div>
				
				<div class="control-item">
					<label for="foam-complexity" class="control-label">Complexity</label>
					<div class="slider-container">
						<input
							id="foam-complexity"
							type="range"
							bind:value={foamComplexity}
							on:input={applySettings}
							min="25"
							max="100"
							step="5"
							class="slider"
						/>
						<span class="value-display">{foamComplexity}</span>
					</div>
				</div>
				
				<div class="control-item">
					<label for="foam-branchiness" class="control-label">Branchiness</label>
					<div class="slider-container">
						<input
							id="foam-branchiness"
							type="range"
							bind:value={foamBranchiness}
							on:input={applySettings}
							min="0"
							max="0.5"
							step="0.05"
							class="slider"
						/>
						<span class="value-display">{Math.round(foamBranchiness * 100)}%</span>
					</div>
				</div>
				
				<div class="control-item">
					<label for="foam-opacity" class="control-label">Opacity</label>
					<div class="slider-container">
						<input
							id="foam-opacity"
							type="range"
							bind:value={foamOpacity}
							on:input={applySettings}
							min="0.3"
							max="1.0"
							step="0.05"
							class="slider"
						/>
						<span class="value-display">{Math.round(foamOpacity * 100)}%</span>
					</div>
				</div>
			</div>
		{/if}
	</div>
	
	<button
		type="button"
		on:click={resetDefaults}
		class="reset-button"
	>
		Reset to Defaults
	</button>
</div>

<style>
	.effects-panel {
		background: rgba(0, 0, 0, 0.95);
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 20px;
		padding: 24px;
		backdrop-filter: blur(25px);
		box-shadow: 
			0 20px 40px rgba(0, 0, 0, 0.4),
			0 8px 16px rgba(0, 0, 0, 0.2),
			inset 0 1px rgba(255, 255, 255, 0.1);
		min-width: 380px;
		max-width: 420px;
	}

	.panel-title {
		text-align: center;
		font-size: 18px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.9);
		margin-bottom: 24px;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.effect-section {
		margin-bottom: 24px;
		padding: 20px;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.effect-section:last-of-type {
		margin-bottom: 24px;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16px;
	}

	.section-title {
		font-size: 16px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.9);
		margin: 0;
	}

	.toggle-wrapper {
		display: flex;
		align-items: center;
		gap: 8px;
		cursor: pointer;
	}

	.toggle-input {
		width: 44px;
		height: 24px;
		appearance: none;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 12px;
		position: relative;
		cursor: pointer;
		transition: background 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.toggle-input::before {
		content: '';
		position: absolute;
		top: 2px;
		left: 2px;
		width: 20px;
		height: 20px;
		background: white;
		border-radius: 10px;
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	.toggle-input:checked {
		background: rgba(147, 51, 234, 0.6);
	}

	.toggle-input:checked::before {
		transform: translateX(20px);
	}

	.toggle-label {
		font-size: 13px;
		color: rgba(255, 255, 255, 0.7);
		user-select: none;
	}

	.controls-grid {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.control-item {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.control-label {
		font-size: 13px;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.7);
	}

	.slider-container {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.slider {
		flex: 1;
		height: 6px;
		appearance: none;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 3px;
		outline: none;
		cursor: pointer;
	}

	.slider::-webkit-slider-thumb {
		appearance: none;
		width: 16px;
		height: 16px;
		background: rgba(147, 51, 234, 0.8);
		border-radius: 50%;
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		border: 2px solid rgba(255, 255, 255, 0.9);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	.slider::-webkit-slider-thumb:hover {
		background: rgba(147, 51, 234, 1);
		transform: scale(1.1);
		box-shadow: 0 0 0 4px rgba(147, 51, 234, 0.2);
	}

	.slider::-moz-range-thumb {
		width: 16px;
		height: 16px;
		background: rgba(147, 51, 234, 0.8);
		border-radius: 50%;
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		border: 2px solid rgba(255, 255, 255, 0.9);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	.value-display {
		min-width: 60px;
		text-align: right;
		font-size: 13px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.9);
		font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
	}

	.reset-button {
		width: 100%;
		padding: 12px 16px;
		background: linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0.2));
		border: 1px solid rgba(239, 68, 68, 0.6);
		border-radius: 12px;
		color: #f87171;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.reset-button:hover {
		background: linear-gradient(135deg, rgba(239, 68, 68, 0.4), rgba(239, 68, 68, 0.3));
		border-color: rgba(239, 68, 68, 0.8);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
	}

	/* Mobile adjustments */
	@media (max-width: 480px) {
		.effects-panel {
			min-width: 340px;
			padding: 20px;
		}
		
		.effect-section {
			padding: 16px;
		}
	}
</style>