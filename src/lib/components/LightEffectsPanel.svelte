<script lang="ts">
  import { backgroundSettings } from '$lib/stores/backgroundSettingsStore';
  
  $: settings = $backgroundSettings;
  
  function updateLightSetting(key: string, value: any) {
    backgroundSettings.update(s => ({
      ...s,
      [key]: value
    }));
  }
</script>

<div class="effects-panel">
  <h3 class="panel-title">Light Effects</h3>
  
  <!-- Sun Glow -->
  <div class="effect-section">
    <div class="section-header">
      <h4 class="section-title">Sun Glow</h4>
      <label class="toggle">
        <input 
          type="checkbox" 
          checked={settings.sunGlowEnabled}
          on:change={(e) => updateLightSetting('sunGlowEnabled', e.currentTarget.checked)}
        />
        <span class="toggle-slider"></span>
      </label>
    </div>
    
    <div class="control-group">
      <label class="control-label">
        <span>Intensity</span>
        <span class="value">{Math.round(settings.sunGlowIntensity * 100)}%</span>
      </label>
      <input
        type="range"
        class="slider yellow-slider"
        min="0"
        max="1"
        step="0.01"
        value={settings.sunGlowIntensity}
        on:input={(e) => updateLightSetting('sunGlowIntensity', parseFloat(e.currentTarget.value))}
      />
    </div>
    
    <div class="control-group">
      <label class="control-label">
        <span>Size</span>
        <span class="value">{settings.sunGlowSize}px</span>
      </label>
      <input
        type="range"
        class="slider yellow-slider"
        min="50"
        max="500"
        step="10"
        value={settings.sunGlowSize}
        on:input={(e) => updateLightSetting('sunGlowSize', parseInt(e.currentTarget.value))}
      />
    </div>
    
    <div class="control-group">
      <label class="control-label">
        <span>Blur Amount</span>
        <span class="value">{settings.sunGlowBlur}px</span>
      </label>
      <input
        type="range"
        class="slider yellow-slider"
        min="20"
        max="100"
        step="5"
        value={settings.sunGlowBlur}
        on:input={(e) => updateLightSetting('sunGlowBlur', parseInt(e.currentTarget.value))}
      />
    </div>
    
    <div class="control-group">
      <label class="control-label">
        <span>Pulse Speed</span>
        <span class="value">{Math.round(settings.sunGlowPulseSpeed * 1000)}‰</span>
      </label>
      <input
        type="range"
        class="slider yellow-slider"
        min="0.0005"
        max="0.005"
        step="0.0005"
        value={settings.sunGlowPulseSpeed}
        on:input={(e) => updateLightSetting('sunGlowPulseSpeed', parseFloat(e.currentTarget.value))}
      />
    </div>
    
    <div class="control-group">
      <label class="control-label">
        <span>Sun Glint Intensity</span>
        <span class="value">{Math.round(settings.sunGlintIntensity * 100)}%</span>
      </label>
      <input
        type="range"
        class="slider yellow-slider"
        min="0"
        max="1"
        step="0.1"
        value={settings.sunGlintIntensity}
        on:input={(e) => updateLightSetting('sunGlintIntensity', parseFloat(e.currentTarget.value))}
      />
    </div>
    
    <div class="control-group">
      <label class="control-label">
        <span>Sun Glint Quantity</span>
        <span class="value">{Math.round(settings.sunGlintQuantity * 100)}%</span>
      </label>
      <input
        type="range"
        class="slider yellow-slider"
        min="0"
        max="2"
        step="0.1"
        value={settings.sunGlintQuantity}
        on:input={(e) => updateLightSetting('sunGlintQuantity', parseFloat(e.currentTarget.value))}
      />
    </div>
  </div>
  
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
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 20px 0;
    text-align: center;
    color: rgba(255, 223, 107, 0.9);
  }
  
  .effect-section {
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .effect-section:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .section-title {
    font-size: 16px;
    font-weight: 500;
    margin: 0;
    color: rgba(255, 223, 107, 0.8);
  }
  
  .control-group {
    margin-bottom: 16px;
  }
  
  .control-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
  }
  
  .value {
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
    font-size: 12px;
    color: rgba(255, 223, 107, 0.7);
  }
  
  /* Yellow themed sliders for light effects */
  .slider {
    -webkit-appearance: none;
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.1);
    outline: none;
    cursor: pointer;
  }
  
  .yellow-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #ffdf6b;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  
  .yellow-slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #ffdf6b;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  
  .yellow-slider:hover::-webkit-slider-thumb {
    transform: scale(1.1);
    background: #ffe580;
  }
  
  .yellow-slider:hover::-moz-range-thumb {
    transform: scale(1.1);
    background: #ffe580;
  }
  
  /* Toggle switch */
  .toggle {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
  }
  
  .toggle input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.2);
    transition: .3s;
    border-radius: 24px;
  }
  
  .toggle-slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .3s;
    border-radius: 50%;
  }
  
  .toggle input:checked + .toggle-slider {
    background-color: rgba(255, 223, 107, 0.6);
  }
  
  .toggle input:checked + .toggle-slider:before {
    transform: translateX(20px);
  }
</style>