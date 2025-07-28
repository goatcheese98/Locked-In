/**
 * utils.ts
 *
 * Contains general utility functions used by the background animation system.
 */

/**
 * Quadratic easing function that starts slow, accelerates, then decelerates.
 * @param t - The input time or progress, typically between 0 and 1.
 * @returns The eased value, also typically between 0 and 1.
 */
export function easeInOutQuad(t: number): number {
	// Clamp input to [0, 1] to ensure correct behavior
	const clampedT = Math.max(0, Math.min(1, t));
	return clampedT < 0.5 ? 2 * clampedT * clampedT : 1 - Math.pow(-2 * clampedT + 2, 2) / 2;
}

// --- Background Warping Parameters ---

/** Controls the maximum displacement distance for the warping effect. */
const warpStrength = 15; // Increased for more pronounced warping
/** Controls the scale or frequency of the warping noise pattern. Smaller values = larger patterns. */
const warpScale = 0.04; // How coarse the warping is (keeping this for now)

/**
 * Calculates a displacement offset (dx, dy) for a given point (x, y) at a specific time,
 * creating a time-varying warping effect based on overlapping sine/cosine waves.
 * Used primarily for the ShimmerSpot effect to create a flowing water look.
 *
 * @param x - The horizontal coordinate of the point to warp.
 * @param y - The vertical coordinate of the point to warp.
 * @param time - A global time value that drives the animation.
 * @returns An object { dx: number, dy: number } representing the displacement offset.
 */
export function getWarpOffset(x: number, y: number, time: number): { dx: number; dy: number } {
	// Combine multiple angle calculations using time and position to create complex patterns
	const angle1 = (x * warpScale + y * warpScale * 0.3 + time * 0.8) * Math.PI * 2; // Increased time factor for more animation
	const angle2 = (x * warpScale * 0.7 - y * warpScale + time * 0.5) * Math.PI * 2; // Increased time factor for more animation

	// Combine sine and cosine results from different angles to get x and y offsets
	// The factors (0.6, 0.4) weight the influence of each angle differently for dx and dy
	const dx = Math.sin(angle1) * warpStrength * 0.6 + Math.sin(angle2) * warpStrength * 0.4;
	const dy = Math.cos(angle1) * warpStrength * 0.4 + Math.cos(angle2) * warpStrength * 0.6;
	return { dx, dy };
}
