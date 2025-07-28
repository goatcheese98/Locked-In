/**
 * glints.ts
 *
 * Manages the creation, animation, and drawing of regular Glint effects.
 * Glints are small, short-lived flashes of light on the water surface.
 * When a glint expires, it triggers the creation of a specific ripple type.
 */
import type { Glint } from '../types';
import { MAX_GLINTS } from '../constants';
import { addGlint, getGlints, releaseGlint } from '../animationState';

/**
 * Creates a new Glint particle at a random position on the canvas,
 * if the maximum number of glints has not been reached.
 * Adds the glint to the central `animationState`.
 *
 * @param canvasWidth - The current width of the canvas.
 * @param canvasHeight - The current height of the canvas.
 */
export function createGlint(canvasWidth: number, canvasHeight: number): void {
	// Prevent creating too many glints.
	if (getGlints().length >= MAX_GLINTS) return;

	// Add the glint using the pooled adder function from animationState.
	addGlint({
		x: Math.random() * canvasWidth, // Random X position.
		y: Math.random() * canvasHeight, // Random Y position.
		radius: Math.random() * 0.25 + 0.2, // Small radius variation.
		opacity: Math.random() * 0.4 + 0.2, // Initial opacity variation.
		decay: Math.random() * 0.005 + 0.005, // Fade speed variation.
		color: 'rgba(255, 255, 230, 0.85)' // Consistent pale yellow color.
	});
}

/**
 * Updates the state (opacity) of all active Glints and draws them.
 * Iterates backwards to allow safe removal.
 * If a Glint's opacity drops to zero or below, it is released back to the object pool
 * and its position is recorded to trigger a ripple effect in the main component.
 *
 * @param ctx - The 2D canvas rendering context.
 * @returns An array of { x: number, y: number } coordinates where expired glints were located,
 *          used to trigger 'glintExpire' ripples.
 */
export function updateAndDrawGlints(ctx: CanvasRenderingContext2D): { x: number; y: number }[] {
	const currentGlints: Glint[] = getGlints();
	// Early exit if there are no glints to process.
	if (currentGlints.length === 0) return [];

	const ripplesToCreate: { x: number; y: number }[] = [];
	const originalAlpha = ctx.globalAlpha; // Save current alpha.

	// Iterate backwards through the glints array.
	for (let i = currentGlints.length - 1; i >= 0; i--) {
		const g = currentGlints[i];

		// Update the glint's opacity.
		g.opacity -= g.decay;

		// Check if the glint has faded completely.
		if (g.opacity <= 0) {
			// Record position for ripple creation before releasing.
			ripplesToCreate.push({ x: g.x, y: g.y });
			// Release the glint back to the inactive pool.
			releaseGlint(g);
		} else {
			// If the glint is still visible, draw it.
			ctx.beginPath();
			ctx.arc(g.x, g.y, g.radius, 0, Math.PI * 2);
			ctx.fillStyle = g.color;
			ctx.globalAlpha = Math.max(0, g.opacity); // Clamp alpha just in case.
			ctx.fill();
		}
	}

	ctx.globalAlpha = originalAlpha; // Restore original alpha.
	return ripplesToCreate; // Return positions of expired glints.
}
