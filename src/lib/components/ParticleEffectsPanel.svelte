<script lang="ts">
	import { backgroundSettings } from '$lib/stores/backgroundSettingsStore';
	
	$: settings = $backgroundSettings;
	
	function updateParticleSetting(key: string, value: any) {
		backgroundSettings.update(s => ({
			...s,
			[key]: value
		}));
	}
	
	// Reset to defaults
	function resetDefaults() {
		updateParticleSetting('waterGrainsEnabled', true);
		updateParticleSetting('grainDensity', 600);
		updateParticleSetting('grainSpeed', 0.15);
		updateParticleSetting('grainSize', 0.875);
		updateParticleSetting('grainOpacity', 0.4);
		updateParticleSetting('foamEnabled', true);
		updateParticleSetting('foamFrequency', 0.02);
		updateParticleSetting('foamLifetime', 750);
		updateParticleSetting('foamComplexity', 50);
		updateParticleSetting('foamBranchiness', 0.25);
		updateParticleSetting('foamAnimationSpeed', 1.0);
		updateParticleSetting('foamOpacity', 0.7);
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
					checked={settings.waterGrainsEnabled}
					on:change={(e) => updateParticleSetting('waterGrainsEnabled', e.currentTarget.checked)}
					class="toggle-input"
				/>
				<span class="toggle-label">Enable</span>
			</label>
		</div>
		
		{#if settings.waterGrainsEnabled}
			<div class="controls-grid">
				<div class="control-item">
					<label for="grain-density" class="control-label">Density</label>
					<div class="slider-container">
						<input
							id="grain-density"
							type="range"
							value={settings.grainDensity}
							on:input={(e) => updateParticleSetting('grainDensity', parseInt(e.currentTarget.value))}
							min="100"
							max="1200"
							step="50"
							class="slider"
						/>
						<span class="value-display">{settings.grainDensity}</span>
					</div>
				</div>
				
				<div class="control-item">
					<label for="grain-speed" class="control-label">Speed</label>
					<div class="slider-container">
						<input
							id="grain-speed"
							type="range"
							value={settings.grainSpeed}
							on:input={(e) => updateParticleSetting('grainSpeed', parseFloat(e.currentTarget.value))}
							min="0.05"
							max="0.25"
							step="0.01"
							class="slider"
						/>
						<span class="value-display">{settings.grainSpeed.toFixed(2)}</span>
					</div>
				</div>
				
				<div class="control-item">
					<label for="grain-size" class="control-label">Size</label>
					<div class="slider-container">
						<input
							id="grain-size"
							type="range"
							value={settings.grainSize}
							on:input={(e) => updateParticleSetting('grainSize', parseFloat(e.currentTarget.value))}
							min="0.5"
							max="1.25"
							step="0.05"
							class="slider"
						/>
						<span class="value-display">{settings.grainSize.toFixed(2)}</span>
					</div>
				</div>
				
				<div class="control-item">
					<label for="grain-opacity" class="control-label">Opacity</label>
					<div class="slider-container">
						<input
							id="grain-opacity"
							type="range"
							value={settings.grainOpacity}
							on:input={(e) => updateParticleSetting('grainOpacity', parseFloat(e.currentTarget.value))}
							min="0.1"
							max="0.8"
							step="0.05"
							class="slider"
						/>
						<span class="value-display">{Math.round(settings.grainOpacity * 100)}%</span>
					</div>
				</div>
				
				<div class="control-item">
					<label for="grain-lightness" class="control-label">Lightness</label>
					<div class="slider-container">
						<input
							id="grain-lightness"
							type="range"
							value={settings.grainLightness}
							on:input={(e) => updateParticleSetting('grainLightness', parseInt(e.currentTarget.value))}
							min="20"
							max="90"
							step="5"
							class="slider"
						/>
						<span class="value-display">{settings.grainLightness}%</span>
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
					checked={settings.foamEnabled}
					on:change={(e) => updateParticleSetting('foamEnabled', e.currentTarget.checked)}
					class="toggle-input"
				/>
				<span class="toggle-label">Enable</span>
			</label>
		</div>
		
		{#if settings.foamEnabled}
			<div class="controls-grid">
				<div class="control-item">
					<label for="foam-frequency" class="control-label">Frequency</label>
					<div class="slider-container">
						<input
							id="foam-frequency"
							type="range"
							value={settings.foamFrequency}
							on:input={(e) => updateParticleSetting('foamFrequency', parseFloat(e.currentTarget.value))}
							min="0.005"
							max="0.15"
							step="0.005"
							class="slider"
						/>
						<span class="value-display">{(settings.foamFrequency * 100).toFixed(1)}%</span>
					</div>
				</div>
				
				<div class="control-item">
					<label for="foam-lifetime" class="control-label">Lifetime</label>
					<div class="slider-container">
						<input
							id="foam-lifetime"
							type="range"
							value={settings.foamLifetime}
							on:input={(e) => updateParticleSetting('foamLifetime', parseInt(e.currentTarget.value))}
							min="300"
							max="1200"
							step="50"
							class="slider"
						/>
						<span class="value-display">{(settings.foamLifetime / 60).toFixed(1)}s</span>
					</div>
				</div>
				
				<div class="control-item">
					<label for="foam-complexity" class="control-label">Complexity</label>
					<div class="slider-container">
						<input
							id="foam-complexity"
							type="range"
							value={settings.foamComplexity}
							on:input={(e) => updateParticleSetting('foamComplexity', parseInt(e.currentTarget.value))}
							min="25"
							max="100"
							step="5"
							class="slider"
						/>
						<span class="value-display">{settings.foamComplexity}</span>
					</div>
				</div>
				
				<div class="control-item">
					<label for="foam-branchiness" class="control-label">Branchiness</label>
					<div class="slider-container">
						<input
							id="foam-branchiness"
							type="range"
							value={settings.foamBranchiness}
							on:input={(e) => updateParticleSetting('foamBranchiness', parseFloat(e.currentTarget.value))}
							min="0"
							max="0.5"
							step="0.05"
							class="slider"
						/>
						<span class="value-display">{Math.round(settings.foamBranchiness * 100)}%</span>
					</div>
				</div>
				
				<div class="control-item">
					<label for="foam-animation-speed" class="control-label">Animation Speed</label>
					<div class="slider-container">
						<input
							id="foam-animation-speed"
							type="range"
							value={settings.foamAnimationSpeed || 1.0}
							on:input={(e) => updateParticleSetting('foamAnimationSpeed', parseFloat(e.currentTarget.value))}
							min="0.2"
							max="3.0"
							step="0.1"
							class="slider"
						/>
						<span class="value-display">{(settings.foamAnimationSpeed || 1.0).toFixed(1)}x</span>
					</div>
				</div>
				
				<div class="control-item">
					<label for="foam-opacity" class="control-label">Opacity</label>
					<div class="slider-container">
						<input
							id="foam-opacity"
							type="range"
							value={settings.foamOpacity}
							on:input={(e) => updateParticleSetting('foamOpacity', parseFloat(e.currentTarget.value))}
							min="0.3"
							max="1.0"
							step="0.05"
							class="slider"
						/>
						<span class="value-display">{Math.round(settings.foamOpacity * 100)}%</span>
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
		background: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 12px;
		padding: 20px;
		width: 320px;
		color: white;
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