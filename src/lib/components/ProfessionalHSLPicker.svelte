<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { 
		backgroundSettings, 
		setGradientColor1, 
		setGradientColor2,
		getGradientColor1HSL,
		getGradientColor2HSL
	} from '$lib/stores/backgroundSettingsStore';

	let hueCanvasRef: HTMLCanvasElement;
	let satCanvasRef: HTMLCanvasElement;
	let lightCanvasRef: HTMLCanvasElement;
	let animationFrameId: number;
	let hueCtx: CanvasRenderingContext2D | null = null;
	let satCtx: CanvasRenderingContext2D | null = null;
	let lightCtx: CanvasRenderingContext2D | null = null;

	// Control states
	let selectedComponent: 'hue' | 'saturation' | 'lightness' = 'hue';
	let isLocked = false;
	let isSynced = false;
	let isDragging = false;
	let activeGradient: 1 | 2 | null = null;
	let activeSlider: 'hue' | 'saturation' | 'lightness' | null = null;
	let dragOffset = { x: 0 };

	// Canvas dimensions
	const SLIDER_WIDTH = 320;
	const SLIDER_HEIGHT = 40;
	const SLIDER_MARGIN = 16;

	// Animation state
	let animationTime = 0;

	// Gradient indicator positions for each slider
	let hueIndicator1 = { x: 0, targetX: 0, scale: 1, opacity: 0.9 };
	let hueIndicator2 = { x: 0, targetX: 0, scale: 1, opacity: 0.9 };
	let satIndicator1 = { x: 0, targetX: 0, scale: 1, opacity: 0.9 };
	let satIndicator2 = { x: 0, targetX: 0, scale: 1, opacity: 0.9 };
	let lightIndicator1 = { x: 0, targetX: 0, scale: 1, opacity: 0.9 };
	let lightIndicator2 = { x: 0, targetX: 0, scale: 1, opacity: 0.9 };
	
	// Store subscription for reactive updates
	let unsubscribe: () => void;

	$: color1HSL = getGradientColor1HSL() || { h: 210, s: 70, l: 50 };
	$: color2HSL = getGradientColor2HSL() || { h: 200, s: 68, l: 50 };

	// Convert HSL values to slider positions
	function updateIndicatorPositions() {
		// Hue slider positions (0-360° mapped to slider width)
		hueIndicator1.targetX = SLIDER_MARGIN + (color1HSL.h / 360) * (SLIDER_WIDTH - 2 * SLIDER_MARGIN);
		hueIndicator2.targetX = SLIDER_MARGIN + (color2HSL.h / 360) * (SLIDER_WIDTH - 2 * SLIDER_MARGIN);
		hueIndicator1.x = hueIndicator1.targetX;
		hueIndicator2.x = hueIndicator2.targetX;
		
		// Saturation slider positions (0-100% mapped to slider width)
		satIndicator1.targetX = SLIDER_MARGIN + (color1HSL.s / 100) * (SLIDER_WIDTH - 2 * SLIDER_MARGIN);
		satIndicator2.targetX = SLIDER_MARGIN + (color2HSL.s / 100) * (SLIDER_WIDTH - 2 * SLIDER_MARGIN);
		satIndicator1.x = satIndicator1.targetX;
		satIndicator2.x = satIndicator2.targetX;
		
		// Lightness slider positions (0-100% range mapped to slider width)
		lightIndicator1.targetX = SLIDER_MARGIN + (color1HSL.l / 100) * (SLIDER_WIDTH - 2 * SLIDER_MARGIN);
		lightIndicator2.targetX = SLIDER_MARGIN + (color2HSL.l / 100) * (SLIDER_WIDTH - 2 * SLIDER_MARGIN);
		lightIndicator1.x = lightIndicator1.targetX;
		lightIndicator2.x = lightIndicator2.targetX;
	}

	// Convert slider position to HSL value
	function sliderPositionToValue(x: number, sliderType: 'hue' | 'saturation' | 'lightness'): number {
		const normalizedX = Math.max(0, Math.min(1, (x - SLIDER_MARGIN) / (SLIDER_WIDTH - 2 * SLIDER_MARGIN)));
		
		switch (sliderType) {
			case 'hue':
				return normalizedX * 360;
			case 'saturation':
				return normalizedX * 100;
			case 'lightness':
				// Full lightness range 0-100%
				return normalizedX * 100;
		}
	}

	// Smooth animation loop
	function animate() {
		if (!hueCtx || !satCtx || !lightCtx) {
			animationFrameId = requestAnimationFrame(animate);
			return;
		}

		animationTime += 0.016; // ~60fps

		// Skip smoothing during drag - positions are already set in handleGlobalMouseMove
		if (!isDragging) {
			const smoothFactor = 0.15;
			
			// Update all indicator positions with smoothing
			hueIndicator1.x += (hueIndicator1.targetX - hueIndicator1.x) * smoothFactor;
			hueIndicator2.x += (hueIndicator2.targetX - hueIndicator2.x) * smoothFactor;
			satIndicator1.x += (satIndicator1.targetX - satIndicator1.x) * smoothFactor;
			satIndicator2.x += (satIndicator2.targetX - satIndicator2.x) * smoothFactor;
			lightIndicator1.x += (lightIndicator1.targetX - lightIndicator1.x) * smoothFactor;
			lightIndicator2.x += (lightIndicator2.targetX - lightIndicator2.x) * smoothFactor;
		}

		// Animate scales and opacity based on interaction
		const indicators = [hueIndicator1, hueIndicator2, satIndicator1, satIndicator2, lightIndicator1, lightIndicator2];
		indicators.forEach((indicator, index) => {
			const gradientNum = (index % 2) + 1;
			if (activeGradient === gradientNum && (
				(activeSlider === 'hue' && index < 2) ||
				(activeSlider === 'saturation' && index >= 2 && index < 4) ||
				(activeSlider === 'lightness' && index >= 4)
			)) {
				indicator.scale = 1 + 0.2 * Math.sin(animationTime * 8);
				indicator.opacity = 0.95;
			} else {
				indicator.scale += (1 - indicator.scale) * 0.1;
				indicator.opacity += (0.9 - indicator.opacity) * 0.1;
			}
		});

		drawSliders();
		animationFrameId = requestAnimationFrame(animate);
	}

	// Main drawing function for all sliders
	function drawSliders() {
		drawHueSlider();
		drawSaturationSlider();
		drawLightnessSlider();
	}

	// Draw hue slider (full spectrum 0-360°)
	function drawHueSlider() {
		if (!hueCtx) return;

		hueCtx.clearRect(0, 0, SLIDER_WIDTH, SLIDER_HEIGHT);

		// Draw hue gradient
		const gradient = hueCtx.createLinearGradient(SLIDER_MARGIN, 0, SLIDER_WIDTH - SLIDER_MARGIN, 0);
		for (let i = 0; i <= 12; i++) {
			const hue = (i / 12) * 360;
			gradient.addColorStop(i / 12, `hsl(${hue}, 70%, 50%)`);
		}

		hueCtx.fillStyle = gradient;
		drawRoundedRect(hueCtx, SLIDER_MARGIN, 8, SLIDER_WIDTH - 2 * SLIDER_MARGIN, SLIDER_HEIGHT - 16, 8);
		hueCtx.fill();

		// Draw border
		hueCtx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
		hueCtx.lineWidth = 1;
		drawRoundedRect(hueCtx, SLIDER_MARGIN, 8, SLIDER_WIDTH - 2 * SLIDER_MARGIN, SLIDER_HEIGHT - 16, 8);
		hueCtx.stroke();

		// Draw indicators
		drawSliderIndicator(hueCtx, hueIndicator1, '#3B82F6', '1');
		drawSliderIndicator(hueCtx, hueIndicator2, '#EC4899', '2');
	}

	// Draw saturation slider (dynamically based on current hue values)
	function drawSaturationSlider() {
		if (!satCtx) return;

		satCtx.clearRect(0, 0, SLIDER_WIDTH, SLIDER_HEIGHT);

		// Use average hue for the saturation gradient
		const avgHue = (color1HSL.h + color2HSL.h) / 2;
		const gradient = satCtx.createLinearGradient(SLIDER_MARGIN, 0, SLIDER_WIDTH - SLIDER_MARGIN, 0);
		gradient.addColorStop(0, `hsl(${avgHue}, 0%, 50%)`);
		gradient.addColorStop(1, `hsl(${avgHue}, 100%, 50%)`);

		satCtx.fillStyle = gradient;
		drawRoundedRect(satCtx, SLIDER_MARGIN, 8, SLIDER_WIDTH - 2 * SLIDER_MARGIN, SLIDER_HEIGHT - 16, 8);
		satCtx.fill();

		// Draw border
		satCtx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
		satCtx.lineWidth = 1;
		drawRoundedRect(satCtx, SLIDER_MARGIN, 8, SLIDER_WIDTH - 2 * SLIDER_MARGIN, SLIDER_HEIGHT - 16, 8);
		satCtx.stroke();

		// Draw indicators
		drawSliderIndicator(satCtx, satIndicator1, '#3B82F6', '1');
		drawSliderIndicator(satCtx, satIndicator2, '#EC4899', '2');
	}

	// Draw lightness slider (dynamically based on current hue and saturation values)
	function drawLightnessSlider() {
		if (!lightCtx) return;

		lightCtx.clearRect(0, 0, SLIDER_WIDTH, SLIDER_HEIGHT);

		// Use average hue and saturation for the lightness gradient (0-100% range)
		const avgHue = (color1HSL.h + color2HSL.h) / 2;
		const avgSat = (color1HSL.s + color2HSL.s) / 2;
		const gradient = lightCtx.createLinearGradient(SLIDER_MARGIN, 0, SLIDER_WIDTH - SLIDER_MARGIN, 0);
		gradient.addColorStop(0, `hsl(${avgHue}, ${avgSat}%, 0%)`);
		gradient.addColorStop(0.25, `hsl(${avgHue}, ${avgSat}%, 25%)`);
		gradient.addColorStop(0.5, `hsl(${avgHue}, ${avgSat}%, 50%)`);
		gradient.addColorStop(0.75, `hsl(${avgHue}, ${avgSat}%, 75%)`);
		gradient.addColorStop(1, `hsl(${avgHue}, ${avgSat}%, 100%)`);

		lightCtx.fillStyle = gradient;
		drawRoundedRect(lightCtx, SLIDER_MARGIN, 8, SLIDER_WIDTH - 2 * SLIDER_MARGIN, SLIDER_HEIGHT - 16, 8);
		lightCtx.fill();

		// Draw border
		lightCtx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
		lightCtx.lineWidth = 1;
		drawRoundedRect(lightCtx, SLIDER_MARGIN, 8, SLIDER_WIDTH - 2 * SLIDER_MARGIN, SLIDER_HEIGHT - 16, 8);
		lightCtx.stroke();

		// Draw indicators
		drawSliderIndicator(lightCtx, lightIndicator1, '#3B82F6', '1');
		drawSliderIndicator(lightCtx, lightIndicator2, '#EC4899', '2');
	}

	// Draw slider indicator
	function drawSliderIndicator(ctx: CanvasRenderingContext2D, indicator: any, color: string, label: string) {
		const x = indicator.x;
		const y = SLIDER_HEIGHT / 2;
		const scale = indicator.scale;
		const opacity = indicator.opacity;

		ctx.save();
		ctx.globalAlpha = opacity;

		// Draw glow effect
		const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, 20 * scale);
		glowGradient.addColorStop(0, color + '40');
		glowGradient.addColorStop(1, color + '00');
		ctx.fillStyle = glowGradient;
		ctx.fillRect(x - 20 * scale, y - 20 * scale, 40 * scale, 40 * scale);

		// Draw main indicator circle
		ctx.beginPath();
		ctx.arc(x, y, 10 * scale, 0, Math.PI * 2);
		ctx.fillStyle = color;
		ctx.fill();
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
		ctx.lineWidth = 2;
		ctx.stroke();

		// Draw inner highlight
		ctx.beginPath();
		ctx.arc(x, y, 6 * scale, 0, Math.PI * 2);
		ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
		ctx.fill();

		// Draw label
		ctx.fillStyle = 'white';
		ctx.font = `bold ${8 * scale}px system-ui`;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(label, x, y);

		ctx.restore();
	}

	// Utility function for rounded rectangles
	function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
		ctx.beginPath();
		ctx.moveTo(x + radius, y);
		ctx.lineTo(x + width - radius, y);
		ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
		ctx.lineTo(x + width, y + height - radius);
		ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
		ctx.lineTo(x + radius, y + height);
		ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
		ctx.lineTo(x, y + radius);
		ctx.quadraticCurveTo(x, y, x + radius, y);
		ctx.closePath();
	}

	// Simplified mouse event handlers
	function handleSliderMouseDown(event: MouseEvent, sliderType: 'hue' | 'saturation' | 'lightness') {
		let canvasRef: HTMLCanvasElement;
		let indicator1: any, indicator2: any;

		// Get references based on slider type
		switch (sliderType) {
			case 'hue':
				canvasRef = hueCanvasRef;
				indicator1 = hueIndicator1;
				indicator2 = hueIndicator2;
				break;
			case 'saturation':
				canvasRef = satCanvasRef;
				indicator1 = satIndicator1;
				indicator2 = satIndicator2;
				break;
			case 'lightness':
				canvasRef = lightCanvasRef;
				indicator1 = lightIndicator1;
				indicator2 = lightIndicator2;
				break;
			default:
				return;
		}

		if (!canvasRef) return;

		const rect = canvasRef.getBoundingClientRect();
		const x = event.clientX - rect.left;

		// Check if clicking on indicators
		const dist1 = Math.abs(x - indicator1.x);
		const dist2 = Math.abs(x - indicator2.x);

		if (dist1 < 20) {
			isDragging = true;
			activeGradient = 1;
			activeSlider = sliderType;
			event.preventDefault();
		} else if (dist2 < 20) {
			isDragging = true;
			activeGradient = 2;
			activeSlider = sliderType;
			event.preventDefault();
		} else {
			// Click to set gradient 1 position
			const newValue = sliderPositionToValue(x, sliderType);
			updateColorValue(sliderType, newValue, 1);
		}
	}

	function handleGlobalMouseMove(event: MouseEvent) {
		if (!isDragging || !activeSlider || !activeGradient) return;

		let canvasRef: HTMLCanvasElement;
		let indicator1: any, indicator2: any;

		switch (activeSlider) {
			case 'hue':
				canvasRef = hueCanvasRef;
				indicator1 = hueIndicator1;
				indicator2 = hueIndicator2;
				break;
			case 'saturation':
				canvasRef = satCanvasRef;
				indicator1 = satIndicator1;
				indicator2 = satIndicator2;
				break;
			case 'lightness':
				canvasRef = lightCanvasRef;
				indicator1 = lightIndicator1;
				indicator2 = lightIndicator2;
				break;
			default:
				return;
		}

		if (!canvasRef) return;

		const rect = canvasRef.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const constrainedX = Math.max(SLIDER_MARGIN, Math.min(SLIDER_WIDTH - SLIDER_MARGIN, x));
		
		// Update the indicator position immediately
		if (activeGradient === 1) {
			indicator1.targetX = constrainedX;
			indicator1.x = constrainedX; // Immediate update for dragging
		} else {
			indicator2.targetX = constrainedX;
			indicator2.x = constrainedX; // Immediate update for dragging
		}
		
		const newValue = sliderPositionToValue(constrainedX, activeSlider);
		updateColorValue(activeSlider, newValue, activeGradient);
	}

	function handleGlobalMouseUp() {
		isDragging = false;
		activeGradient = null;
		activeSlider = null;
	}

	// Helper function to update color values
	function updateColorValue(component: 'hue' | 'saturation' | 'lightness', value: number, gradientNumber: 1 | 2) {
		const currentColor = gradientNumber === 1 ? color1HSL : color2HSL;
		
		if (!currentColor) return;
		
		let newH = currentColor.h;
		let newS = currentColor.s;
		let newL = currentColor.l;
		
		switch (component) {
			case 'hue':
				newH = value;
				break;
			case 'saturation':
				newS = value;
				break;
			case 'lightness':
				newL = value;
				break;
		}

		if (gradientNumber === 1) {
			setGradientColor1(newH, newS, newL);
			// Update local reactive variable to trigger updates
			color1HSL = { h: newH, s: newS, l: newL };
		} else {
			setGradientColor2(newH, newS, newL);
			// Update local reactive variable to trigger updates
			color2HSL = { h: newH, s: newS, l: newL };
		}
	}

	// Control functions
	function toggleSync() {
		isSynced = !isSynced;
	}

	function toggleLock() {
		isLocked = !isLocked;
	}

	function resetColors() {
		setGradientColor1(210, 70, 50);
		setGradientColor2(200, 68, 50);
	}

	onMount(() => {
		if (!hueCanvasRef || !satCanvasRef || !lightCanvasRef) return;

		hueCtx = hueCanvasRef.getContext('2d');
		satCtx = satCanvasRef.getContext('2d');
		lightCtx = lightCanvasRef.getContext('2d');
		
		if (!hueCtx || !satCtx || !lightCtx) return;

		// Set canvas sizes
		hueCanvasRef.width = SLIDER_WIDTH;
		hueCanvasRef.height = SLIDER_HEIGHT;
		satCanvasRef.width = SLIDER_WIDTH;
		satCanvasRef.height = SLIDER_HEIGHT;
		lightCanvasRef.width = SLIDER_WIDTH;
		lightCanvasRef.height = SLIDER_HEIGHT;

		// Initial setup
		updateIndicatorPositions();
		
		// Start animation loop
		animate();

		// Add global event listeners for dragging
		document.addEventListener('mousemove', handleGlobalMouseMove);
		document.addEventListener('mouseup', handleGlobalMouseUp);
		
		// Subscribe to background settings for real-time updates
		unsubscribe = backgroundSettings.subscribe((settings) => {
			// Directly update positions when store changes
			if (settings.gradientColor1 || settings.gradientColor2) {
				updateIndicatorPositions();
			}
		});

		return () => {
			if (animationFrameId) {
				cancelAnimationFrame(animationFrameId);
			}
			
			document.removeEventListener('mousemove', handleGlobalMouseMove);
			document.removeEventListener('mouseup', handleGlobalMouseUp);
			
			if (unsubscribe) {
				unsubscribe();
			}
		};
	});

	// React to color changes and redraw sliders
	$: if (color1HSL && color2HSL && typeof color1HSL.h === 'number' && typeof color2HSL.h === 'number') {
		updateIndicatorPositions();
		// Force redraw of all sliders when colors change
		if (hueCtx && satCtx && lightCtx) {
			drawSliders();
		}
	}

	onDestroy(() => {
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId);
		}
	});
</script>

<div class="professional-hsl-picker">
	<!-- Header Controls -->
	<div class="picker-header">
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

	<!-- Hue Slider -->
	<div class="slider-section">
		<div class="slider-label">Hue (0° - 360°)</div>
		<div class="slider-container">
			<canvas
				bind:this={hueCanvasRef}
				class="color-slider"
				on:mousedown={(e) => handleSliderMouseDown(e, 'hue')}
			></canvas>
		</div>
	</div>

	<!-- Saturation Slider -->
	<div class="slider-section">
		<div class="slider-label">Saturation (0% - 100%)</div>
		<div class="slider-container">
			<canvas
				bind:this={satCanvasRef}
				class="color-slider"
				on:mousedown={(e) => handleSliderMouseDown(e, 'saturation')}
			></canvas>
		</div>
	</div>

	<!-- Lightness Slider -->
	<div class="slider-section">
		<div class="slider-label">Lightness (0% - 100%)</div>
		<div class="slider-container">
			<canvas
				bind:this={lightCanvasRef}
				class="color-slider"
				on:mousedown={(e) => handleSliderMouseDown(e, 'lightness')}
			></canvas>
		</div>
	</div>

	<!-- Color Preview -->
	<div class="color-preview">
		<div class="preview-item">
			<div 
				class="preview-swatch"
				style="background-color: hsl({color1HSL.h}, {color1HSL.s}%, {color1HSL.l}%)"
			></div>
			<span class="preview-label">
				Gradient 1: {Math.round(color1HSL.h)}°, {Math.round(color1HSL.s)}%, {Math.round(color1HSL.l)}%
			</span>
		</div>
		<div class="preview-item">
			<div 
				class="preview-swatch"
				style="background-color: hsl({color2HSL.h}, {color2HSL.s}%, {color2HSL.l}%)"
			></div>
			<span class="preview-label">
				Gradient 2: {Math.round(color2HSL.h)}°, {Math.round(color2HSL.s)}%, {Math.round(color2HSL.l)}%
			</span>
		</div>
	</div>

	<!-- Instructions -->
	<div class="instructions">
		<p>Click: Set Gradient 1 • Drag indicators to move</p>
	</div>
</div>

<style>
	.professional-hsl-picker {
		background: rgba(0, 0, 0, 0.95);
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 20px;
		padding: 20px;
		backdrop-filter: blur(25px);
		box-shadow: 
			0 20px 40px rgba(0, 0, 0, 0.4),
			0 8px 16px rgba(0, 0, 0, 0.2),
			inset 0 1px rgba(255, 255, 255, 0.1);
		min-width: 360px;
		max-width: 400px;
	}

	.picker-header {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 20px;
	}

	.control-buttons {
		display: flex;
		gap: 6px;
	}

	.control-btn {
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.15);
		color: rgba(255, 255, 255, 0.8);
		padding: 8px 10px;
		border-radius: 8px;
		cursor: pointer;
		font-size: 14px;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 32px;
		height: 32px;
		position: relative;
		overflow: hidden;
	}

	.control-btn::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent);
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.control-btn:hover {
		background: rgba(255, 255, 255, 0.15);
		border-color: rgba(255, 255, 255, 0.3);
		color: white;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	}

	.control-btn:hover::before {
		opacity: 1;
	}

	.control-btn.active {
		background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(59, 130, 246, 0.2));
		border-color: rgba(59, 130, 246, 0.6);
		color: #60a5fa;
		box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
	}

	.reset-btn:hover {
		background: linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0.2));
		border-color: rgba(239, 68, 68, 0.6);
		color: #f87171;
		box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
	}

	.slider-section {
		margin-bottom: 16px;
	}

	.slider-label {
		color: rgba(255, 255, 255, 0.8);
		font-size: 12px;
		font-weight: 600;
		margin-bottom: 8px;
		text-align: center;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.slider-container {
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 
			0 4px 12px rgba(0, 0, 0, 0.3),
			inset 0 1px rgba(255, 255, 255, 0.1);
	}

	.color-slider {
		display: block;
		width: 100%;
		height: 40px;
		cursor: crosshair;
		transition: transform 0.2s ease;
	}

	.color-slider:hover {
		transform: scale(1.02);
	}

	.color-preview {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-bottom: 16px;
		margin-top: 20px;
		padding: 16px;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.preview-item {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.preview-swatch {
		width: 28px;
		height: 28px;
		border-radius: 6px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		flex-shrink: 0;
		box-shadow: 
			0 4px 8px rgba(0, 0, 0, 0.3),
			inset 0 1px rgba(255, 255, 255, 0.2);
	}

	.preview-label {
		color: rgba(255, 255, 255, 0.9);
		font-size: 13px;
		font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
		font-weight: 500;
	}

	.instructions {
		text-align: center;
		color: rgba(255, 255, 255, 0.6);
		font-size: 12px;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		padding-top: 12px;
		font-weight: 500;
	}

	/* Mobile adjustments */
	@media (max-width: 480px) {
		.professional-hsl-picker {
			min-width: 320px;
			padding: 16px;
		}
		
		.control-btn {
			min-width: 28px;
			height: 28px;
		}

		.color-slider {
			height: 36px;
		}
	}
</style>