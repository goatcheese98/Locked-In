<script lang="ts">
	import { backgroundSettings } from '$lib/stores/backgroundSettingsStore';
	
	$: settings = $backgroundSettings;
	
	function updateWaterSetting(key: string, value: any) {
		backgroundSettings.update(s => ({
			...s,
			[key]: value
		}));
	}
	
	// Reset to defaults
	function resetDefaults() {
		updateWaterSetting('ripplesEnabled', true);
		updateWaterSetting('rippleSize', 50);
		updateWaterSetting('rippleSpeed', 0.35);
		updateWaterSetting('rippleFrequency', 3000);
		updateWaterSetting('shimmerEnabled', true);
		updateWaterSetting('shimmerIntensity', 0.5);
		updateWaterSetting('shimmerSpeed', 1.0);
		updateWaterSetting('shimmerCount', 5);
	}
</script>

<div class="effects-panel">
	<h3 class="panel-title">Water Effects</h3>
	
	<!-- Ripples Section -->
	<div class="effect-section">
		<div class="section-header">
			<h4 class="section-title">Ripples</h4>
			<label class="toggle-wrapper">
				<input
					type="checkbox"
					checked={settings.ripplesEnabled}
					on:change={(e) => updateWaterSetting('ripplesEnabled', e.currentTarget.checked)}
					class="toggle-input"
				/>
				<span class="toggle-label">Enable</span>
			</label>
		</div>
		
		{#if settings.ripplesEnabled}
			<div class="controls-grid">
				<div class="control-item">
					<label class="control-label">Size</label>
					<div class="slider-container">
						<input
							type="range"
							value={settings.rippleSize}
							on:input={(e) => updateWaterSetting('rippleSize', parseInt(e.currentTarget.value))}
							min="20"
							max="150"
							class="slider"
						/>
						<span class="value-display">{settings.rippleSize}</span>
					</div>
				</div>
				
				<div class="control-item">
					<label class="control-label">Speed</label>
					<div class="slider-container">
						<input
							type="range"
							value={settings.rippleSpeed}
							on:input={(e) => updateWaterSetting('rippleSpeed', parseFloat(e.currentTarget.value))}
							min="0.1"
							max="1.0"
							step="0.05"
							class="slider"
						/>
						<span class="value-display">{settings.rippleSpeed.toFixed(2)}</span>
					</div>
				</div>
				
				<div class="control-item">
					<label class="control-label">Ambient Frequency</label>
					<div class="slider-container">
						<input
							type="range"
							value={10000 - settings.rippleFrequency + 1000}
							on:input={(e) => updateWaterSetting('rippleFrequency', 10000 - parseInt(e.currentTarget.value) + 1000)}
							min="1000"
							max="10000"
							step="500"
							class="slider"
						/>
						<span class="value-display">{Math.round((10000 - settings.rippleFrequency + 1000) / 1000 * 10) / 10}/10</span>
					</div>
				</div>
			</div>
		{/if}
	</div>
	
	<!-- Shimmer Section -->
	<div class="effect-section">
		<div class="section-header">
			<h4 class="section-title">Wave Shimmer</h4>
			<label class="toggle-wrapper">
				<input
					type="checkbox"
					checked={settings.shimmerEnabled}
					on:change={(e) => updateWaterSetting('shimmerEnabled', e.currentTarget.checked)}
					class="toggle-input"
				/>
				<span class="toggle-label">Enable</span>
			</label>
		</div>
		
		{#if settings.shimmerEnabled}
			<div class="controls-grid">
				<div class="control-item">
					<label class="control-label">Intensity</label>
					<div class="slider-container">
						<input
							type="range"
							value={settings.shimmerIntensity}
							on:input={(e) => updateWaterSetting('shimmerIntensity', parseFloat(e.currentTarget.value))}
							min="0.1"
							max="1.0"
							step="0.05"
							class="slider"
						/>
						<span class="value-display">{Math.round(settings.shimmerIntensity * 100)}%</span>
					</div>
				</div>
				
				<div class="control-item">
					<label class="control-label">Speed</label>
					<div class="slider-container">
						<input
							type="range"
							value={settings.shimmerSpeed}
							on:input={(e) => updateWaterSetting('shimmerSpeed', parseFloat(e.currentTarget.value))}
							min="0.5"
							max="2.0"
							step="0.1"
							class="slider"
						/>
						<span class="value-display">{settings.shimmerSpeed.toFixed(1)}x</span>
					</div>
				</div>
				
				<div class="control-item">
					<label class="control-label">Count</label>
					<div class="slider-container">
						<input
							type="range"
							value={settings.shimmerCount}
							on:input={(e) => updateWaterSetting('shimmerCount', parseInt(e.currentTarget.value))}
							min="1"
							max="10"
							class="slider"
						/>
						<span class="value-display">{settings.shimmerCount}</span>
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
		background: rgba(59, 130, 246, 0.6);
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
		background: rgba(59, 130, 246, 0.8);
		border-radius: 50%;
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		border: 2px solid rgba(255, 255, 255, 0.9);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	.slider::-webkit-slider-thumb:hover {
		background: rgba(59, 130, 246, 1);
		transform: scale(1.1);
		box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
	}

	.slider::-moz-range-thumb {
		width: 16px;
		height: 16px;
		background: rgba(59, 130, 246, 0.8);
		border-radius: 50%;
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		border: 2px solid rgba(255, 255, 255, 0.9);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	.value-display {
		min-width: 50px;
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