/**
 * waterGrains.ts
 * 
 * Manages the persistent "water grain" particles that drift across the background,
 * adding texture and a sense of subtle movement to the water surface.
 */
import type { WaterGrain } from '../types';
import {
    NUM_WATER_GRAINS, GRAIN_MIN_SPEED, GRAIN_MAX_SPEED, GRAIN_MIN_SIZE,
    GRAIN_MAX_SIZE, GRAIN_MIN_OPACITY, GRAIN_MAX_OPACITY
} from '../constants';
import { addWaterGrain, getWaterGrains } from '../animationState';

/**
 * Creates the initial set of water grain particles based on `NUM_WATER_GRAINS`.
 * Each grain is given a random initial position, velocity, size, opacity, and color variation.
 * Stores relative position for proper handling during canvas resize.
 * Should typically only be called once during application setup.
 * 
 * @param canvasWidth - The initial width of the canvas.
 * @param canvasHeight - The initial height of the canvas.
 */
export function initializeWaterGrains(canvasWidth: number, canvasHeight: number): void {
    // Prevent re-initialization if grains already exist.
    if (getWaterGrains().length > 0) {
        console.warn('Attempted to re-initialize water grains. Skipping.');
        return; 
    }

    // Create the configured number of grains.
    for (let i = 0; i < NUM_WATER_GRAINS; i++) {
        // Randomize speed and angle for velocity.
        const speed = GRAIN_MIN_SPEED + Math.random() * (GRAIN_MAX_SPEED - GRAIN_MIN_SPEED);
        const angle = Math.random() * Math.PI * 2;
        // Randomize color lightness within a subtle range.
        const grainLightness = 20 + Math.random() * 10;
        // Random initial position.
        const initialX = Math.random() * canvasWidth;
        const initialY = Math.random() * canvasHeight;

        // Add the grain to the animation state.
        addWaterGrain({
            x: initialX,
            y: initialY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: GRAIN_MIN_SIZE + Math.random() * (GRAIN_MAX_SIZE - GRAIN_MIN_SIZE),
            opacity: GRAIN_MIN_OPACITY + Math.random() * (GRAIN_MAX_OPACITY - GRAIN_MIN_OPACITY),
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
 */
export function updateAndDrawWaterGrains(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number): void {
    const currentWaterGrains: WaterGrain[] = getWaterGrains();
    if (currentWaterGrains.length === 0) return; // Exit if no grains exist.

    const originalGlobalAlpha = ctx.globalAlpha; // Save current alpha.

    // Update and draw each grain.
    for (const grain of currentWaterGrains) {
        // Update position.
        grain.x += grain.vx;
        grain.y += grain.vy;

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
        ctx.arc(grain.x, grain.y, grain.size, 0, Math.PI * 2);
        ctx.fillStyle = grain.color;
        // Apply grain's opacity modulated by the original canvas alpha.
        ctx.globalAlpha = Math.max(0, grain.opacity * originalGlobalAlpha); 
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
        console.warn('WaterGrain missing relative coordinates during resize. Re-randomizing position.');
        grain.x = Math.random() * canvasWidth;
        grain.y = Math.random() * canvasHeight;
        grain.relativeX = canvasWidth > 0 ? grain.x / canvasWidth : 0.5;
        grain.relativeY = canvasHeight > 0 ? grain.y / canvasHeight : 0.5;
      }
    }
} 