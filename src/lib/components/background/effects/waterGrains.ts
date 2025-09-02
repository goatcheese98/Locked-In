/**
 * waterGrains.ts
 *
 * Manages the persistent "water grain" particles that drift across the background,
 * adding texture and a sense of subtle movement to the water surface.
 */
import type { WaterGrain } from '../types';
import {
	NUM_WATER_GRAINS,
	GRAIN_MIN_SPEED,
	GRAIN_MAX_SPEED,
	GRAIN_MIN_SIZE,
	GRAIN_MAX_SIZE,
	GRAIN_MIN_OPACITY,
	GRAIN_MAX_OPACITY
} from '../constants';
import { addWaterGrain, getWaterGrains } from '../animationState';

/**
 * Creates the initial set of water grain particles based on settings.
 * Each grain is given a random initial position, velocity, size, opacity, and color variation.
 * Stores relative position for proper handling during canvas resize.
 * Should typically only be called once during application setup.
 *
 * @param canvasWidth - The initial width of the canvas.
 * @param canvasHeight - The initial height of the canvas.
 * @param settings - The background settings containing grain parameters.
 */
export function initializeWaterGrains(canvasWidth: number, canvasHeight: number, settings?: any): void {
	// Prevent re-initialization if grains already exist.
	if (getWaterGrains().length > 0) {
		console.warn('Attempted to re-initialize water grains. Skipping.');
		return;
	}

	// Use settings values or fallback to constants
	const grainCount = settings?.grainDensity || NUM_WATER_GRAINS;
	const minSpeed = settings ? settings.grainSpeed * 0.5 : GRAIN_MIN_SPEED;
	const maxSpeed = settings ? settings.grainSpeed * 1.5 : GRAIN_MAX_SPEED;
	const minSize = settings ? settings.grainSize * 0.7 : GRAIN_MIN_SIZE;
	const maxSize = settings ? settings.grainSize * 1.3 : GRAIN_MAX_SIZE;
	const minOpacity = settings ? settings.grainOpacity * 0.5 : GRAIN_MIN_OPACITY;
	const maxOpacity = settings ? settings.grainOpacity * 1.5 : GRAIN_MAX_OPACITY;

	// Create the configured number of grains.
	for (let i = 0; i < grainCount; i++) {
		// Randomize speed and angle for velocity.
		const speed = minSpeed + Math.random() * (maxSpeed - minSpeed);
		const angle = Math.random() * Math.PI * 2;
		// Use lightness from settings or fallback to range
		const baseLightness = settings?.grainLightness || 85;
		const grainLightness = baseLightness + Math.random() * 10 - 5; // ±5 variation
		// Random initial position.
		const initialX = Math.random() * canvasWidth;
		const initialY = Math.random() * canvasHeight;

		// Add the grain to the animation state.
		addWaterGrain({
			x: initialX,
			y: initialY,
			vx: Math.cos(angle) * speed,
			vy: Math.sin(angle) * speed,
			size: minSize + Math.random() * (maxSize - minSize),
			opacity: minOpacity + Math.random() * (maxOpacity - minOpacity),
			color: `hsl(210, ${65 + Math.random() * 10}%, ${grainLightness}%)`,
			// Store relative coordinates for resizing.
			relativeX: canvasWidth > 0 ? initialX / canvasWidth : 0.5, // Avoid division by zero
			relativeY: canvasHeight > 0 ? initialY / canvasHeight : 0.5
		});
	}
	console.log(`Initialized ${getWaterGrains().length} water grains.`);
}

/**
 * Updates the position of all water grains based on their velocity.
 * Implements screen wrapping, so grains moving off one edge reappear on the opposite edge.
 * Draws each grain onto the canvas.
 *
 * @param ctx - The 2D canvas rendering context.
 * @param canvasWidth - The current width of the canvas.
 * @param canvasHeight - The current height of the canvas.
 * @param settings - The background settings for dynamic updates.
 */
export function updateAndDrawWaterGrains(
	ctx: CanvasRenderingContext2D,
	canvasWidth: number,
	canvasHeight: number,
	settings?: any
): void {
	const currentWaterGrains: WaterGrain[] = getWaterGrains();
	
	// Handle dynamic density changes
	if (settings?.grainDensity) {
		const targetCount = settings.grainDensity;
		const currentCount = currentWaterGrains.length;
		
		if (currentCount < targetCount) {
			// Add more grains
			const grainsToAdd = targetCount - currentCount;
			for (let i = 0; i < grainsToAdd; i++) {
				const speed = settings.grainSpeed * (0.5 + Math.random());
				const angle = Math.random() * Math.PI * 2;
				const baseLightness = settings.grainLightness || 85;
				const grainLightness = baseLightness + Math.random() * 10 - 5; // ±5 variation
				const initialX = Math.random() * canvasWidth;
				const initialY = Math.random() * canvasHeight;
				
				addWaterGrain({
					x: initialX,
					y: initialY,
					vx: Math.cos(angle) * speed,
					vy: Math.sin(angle) * speed,
					size: settings.grainSize,
					opacity: settings.grainOpacity,
					color: `hsl(210, ${65 + Math.random() * 10}%, ${grainLightness}%)`,
					relativeX: canvasWidth > 0 ? initialX / canvasWidth : 0.5,
					relativeY: canvasHeight > 0 ? initialY / canvasHeight : 0.5
				});
			}
		} else if (currentCount > targetCount) {
			// Remove excess grains
			const grainsToRemove = currentCount - targetCount;
			for (let i = 0; i < grainsToRemove && currentWaterGrains.length > 0; i++) {
				const grainToRemove = currentWaterGrains[currentWaterGrains.length - 1];
				releaseWaterGrain(grainToRemove);
			}
		}
	}
	
	if (currentWaterGrains.length === 0) return; // Exit if no grains exist.

	const originalGlobalAlpha = ctx.globalAlpha; // Save current alpha.

	// Update and draw each grain.
	for (const grain of currentWaterGrains) {
		// Apply dynamic speed multiplier from settings
		const speedMultiplier = settings ? (settings.grainSpeed / 0.15) : 1; // 0.15 is middle of range
		
		// Update position with dynamic speed.
		grain.x += grain.vx * speedMultiplier;
		grain.y += grain.vy * speedMultiplier;

		// --- Screen Wrapping Logic ---
		// If grain goes off left edge, wrap to right edge.
		if (grain.x < -grain.size) grain.x = canvasWidth + grain.size;
		// If grain goes off right edge, wrap to left edge.
		else if (grain.x > canvasWidth + grain.size) grain.x = -grain.size;
		// If grain goes off top edge, wrap to bottom edge.
		if (grain.y < -grain.size) grain.y = canvasHeight + grain.size;
		// If grain goes off bottom edge, wrap to top edge.
		else if (grain.y > canvasHeight + grain.size) grain.y = -grain.size;
		// ---------------------------

		// Draw the grain as a small circle.
		ctx.beginPath();
		// Use dynamic size from settings if available
		const renderSize = settings ? settings.grainSize : grain.size;
		ctx.arc(grain.x, grain.y, renderSize, 0, Math.PI * 2);
		
		// Use dynamic color with lightness from settings if available
		if (settings?.grainLightness) {
			const baseLightness = settings.grainLightness;
			const lightVariation = Math.abs(Math.sin(grain.x * 0.01 + grain.y * 0.01)) * 10 - 5; // Deterministic variation based on position
			const finalLightness = Math.max(20, Math.min(90, baseLightness + lightVariation));
			ctx.fillStyle = `hsl(210, ${65 + Math.random() * 10}%, ${finalLightness}%)`;
		} else {
			ctx.fillStyle = grain.color;
		}
		
		// Use dynamic opacity from settings if available
		const renderOpacity = settings ? settings.grainOpacity : grain.opacity;
		ctx.globalAlpha = Math.max(0, renderOpacity * originalGlobalAlpha);
		ctx.fill();
	}
	ctx.globalAlpha = originalGlobalAlpha; // Restore original alpha.
}

/**
 * Adjusts the position of water grains when the canvas resizes.
 * Uses the stored relative coordinates (`relativeX`, `relativeY`) to map
 * the grain's position to the new canvas dimensions, maintaining distribution.
 * Provides a fallback to random positioning if relative coordinates are missing.
 *
 * @param canvasWidth - The new width of the canvas.
 * @param canvasHeight - The new height of the canvas.
 */
export function handleResizeWaterGrains(canvasWidth: number, canvasHeight: number): void {
	const currentWaterGrains: WaterGrain[] = getWaterGrains();
	if (currentWaterGrains.length === 0) return; // Exit if no grains to resize.

	for (const grain of currentWaterGrains) {
		// Check if relative coordinates are stored.
		if (grain.relativeX !== undefined && grain.relativeY !== undefined) {
			// Calculate new absolute position based on relative coords and new dimensions.
			grain.x = grain.relativeX * canvasWidth;
			grain.y = grain.relativeY * canvasHeight;
		} else {
			// Fallback: If relative coordinates are missing (e.g., from older state),
			// assign a random position and calculate relative coords for future resizes.
			console.warn(
				'WaterGrain missing relative coordinates during resize. Re-randomizing position.'
			);
			grain.x = Math.random() * canvasWidth;
			grain.y = Math.random() * canvasHeight;
			grain.relativeX = canvasWidth > 0 ? grain.x / canvasWidth : 0.5;
			grain.relativeY = canvasHeight > 0 ? grain.y / canvasHeight : 0.5;
		}
	}
}
