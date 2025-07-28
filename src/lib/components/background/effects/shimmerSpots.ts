/**
 * shimmerSpots.ts
 *
 * Manages the creation, animation, drawing, and resizing logic for shimmer spots.
 * Shimmer spots are dynamic circles of light that move, change size, and change opacity,
 * contributing to the watery appearance. They include standard spots and larger "wave" spots.
 * Positions are warped using a time-based offset for a flowing effect.
 */
import {
	MAX_SHIMMER_SPOTS,
	SHIMMER_SPAWN_AREA_WIDTH_RATIO,
	SHIMMER_SPAWN_AREA_HEIGHT_RATIO,
	WAVE_SHIMMER_MIN_SPEED_FACTOR,
	WAVE_SHIMMER_MAX_SPEED_FACTOR,
	WAVE_SHIMMER_MIN_OPACITY,
	WAVE_SHIMMER_MAX_OPACITY,
	WAVE_SHIMMER_COLOR_LIGHTNESS_MIN,
	WAVE_SHIMMER_COLOR_LIGHTNESS_MAX,
	SHIMMER_RESIZE_MIN_SPEED_MULTIPLIER,
	SHIMMER_RESIZE_MAX_SPEED_MULTIPLIER
} from '../constants';
import { addShimmerSpot, getShimmerSpots, releaseOldestShimmerSpot } from '../animationState';
import type { ShimmerSpot } from '../types'; // Import ShimmerSpot type
import { getWarpOffset } from '../utils';

/**
 * Creates a new shimmer spot and adds it to the animation state.
 * Spots are created within a defined central spawn area on the canvas.
 * Parameters vary based on whether it's a standard or wave-type spot.
 *
 * @param canvasWidth - Current width of the canvas.
 * @param canvasHeight - Current height of the canvas.
 * @param isWaveType - If true, creates a larger, slower, more opaque spot with different color properties.
 */
export function createShimmerSpot(
	canvasWidth: number,
	canvasHeight: number,
	isWaveType: boolean
): void {
	if (getShimmerSpots().length >= MAX_SHIMMER_SPOTS) {
		// If limit is reached, remove the oldest spot before adding a new one.
		releaseOldestShimmerSpot();
		// Note: We proceed even if releaseOldestShimmerSpot() returned null (meaning the list was somehow empty despite the check),
		// as addShimmerSpot will still function correctly.
	}

	// Define variables for spot properties.
	let spotSize: number;
	let initialVx: number;
	let initialVy: number;
	let opacity: number;
	let growthSpeed: number;
	let opacitySpeedValue: number;
	let color: string;
	let speedFactor = 1;

	// Calculate the central spawn area boundaries based on canvas size and ratios from constants.
	const spawnMinX = (canvasWidth * (1 - SHIMMER_SPAWN_AREA_WIDTH_RATIO)) / 2;
	const spawnWidth = canvasWidth * SHIMMER_SPAWN_AREA_WIDTH_RATIO;
	const spawnMinY = (canvasHeight * (1 - SHIMMER_SPAWN_AREA_HEIGHT_RATIO)) / 2;
	const spawnHeight = canvasHeight * SHIMMER_SPAWN_AREA_HEIGHT_RATIO;

	// Determine random initial position within the spawn area.
	const xPos = spawnMinX + Math.random() * spawnWidth;
	const yPos = spawnMinY + Math.random() * spawnHeight;

	// Set properties based on whether it's a wave type or standard spot.
	if (isWaveType) {
		// Wave spots are larger, slower, and have different opacity/color ranges.
		spotSize = (Math.min(canvasWidth, canvasHeight) / 2) * (0.8 + Math.random() * 0.4); // Larger base size
		speedFactor =
			WAVE_SHIMMER_MIN_SPEED_FACTOR +
			Math.random() * (WAVE_SHIMMER_MAX_SPEED_FACTOR - WAVE_SHIMMER_MIN_SPEED_FACTOR);
		initialVx = (Math.random() - 0.5) * 0.2 * speedFactor;
		initialVy = (Math.random() - 0.5) * 0.2 * speedFactor;
		opacity =
			WAVE_SHIMMER_MIN_OPACITY +
			Math.random() * (WAVE_SHIMMER_MAX_OPACITY - WAVE_SHIMMER_MIN_OPACITY);
		growthSpeed = (Math.random() * 0.015 + 0.005) * (Math.random() < 0.5 ? 1 : -1) * speedFactor;
		opacitySpeedValue =
			(Math.random() * 0.00015 + 0.00005) * (Math.random() < 0.5 ? 1 : -1) * speedFactor;
		// Wave color has higher lightness.
		color = `hsl(210, ${68 + Math.random() * 10}%, ${WAVE_SHIMMER_COLOR_LIGHTNESS_MIN + Math.random() * (WAVE_SHIMMER_COLOR_LIGHTNESS_MAX - WAVE_SHIMMER_COLOR_LIGHTNESS_MIN)}%)`;
	} else {
		// Standard spots are smaller and have different properties.
		spotSize = Math.random() * 80 + 40;
		initialVx = (Math.random() - 0.5) * 0.12;
		initialVy = (Math.random() - 0.5) * 0.12;
		opacity = Math.random() * 0.03 + 0.01;
		growthSpeed = (Math.random() * 0.02 + 0.01) * (Math.random() < 0.5 ? 1 : -1);
		opacitySpeedValue = (Math.random() * 0.0002 + 0.0001) * (Math.random() < 0.5 ? 1 : -1);
		color = `hsl(${200 + Math.random() * 20}, ${65 + Math.random() * 20}%, ${35 + Math.random() * 30}%)`;
	}

	// Add the newly configured spot to the central animation state.
	// Store relative position within the spawn area and base velocity for resizing.
	addShimmerSpot({
		x: xPos,
		y: yPos,
		radius: Math.random() * spotSize * 0.3 + spotSize * 0.2, // Initial radius variation
		currentMaxRadius: spotSize, // Target maximum radius for oscillation
		opacity: opacity,
		growthSpeed: growthSpeed,
		opacitySpeed: opacitySpeedValue,
		color: color,
		vx: initialVx,
		vy: initialVy,
		isWave: isWaveType,
		relativeXInSpawn: spawnWidth > 0 ? (xPos - spawnMinX) / spawnWidth : 0.5, // Avoid division by zero
		relativeYInSpawn: spawnHeight > 0 ? (yPos - spawnMinY) / spawnHeight : 0.5,
		baseVx: initialVx, // Store initial velocity for resize adjustments
		baseVy: initialVy
	});
}

/**
 * Updates the state (position, radius, opacity) of all active shimmer spots and draws them.
 * Applies boundary checks and reverses direction for speed/opacity changes when limits are hit.
 * Uses a warping offset for drawing positions to create a flowing effect.
 * Also includes logic to potentially spawn new spots (consider moving this to the main component).
 *
 * @param ctx - The 2D canvas rendering context.
 * @param canvasWidth - Current width of the canvas.
 * @param canvasHeight - Current height of the canvas.
 * @param globalTime - A time value used to drive the warping effect animation.
 */
export function updateAndDrawShimmerSpots(
	ctx: CanvasRenderingContext2D,
	canvasWidth: number,
	canvasHeight: number,
	globalTime: number
): void {
	const currentShimmerSpots: ShimmerSpot[] = getShimmerSpots();
	if (currentShimmerSpots.length === 0) return; // Exit if no spots to draw.

	const originalCompositeOp = ctx.globalCompositeOperation;
	ctx.globalCompositeOperation = 'screen'; // Use 'screen' blend mode for additive light effect.

	// Iterate backwards for potential future removal, though spots currently don't expire.
	for (let i = currentShimmerSpots.length - 1; i >= 0; i--) {
		const spot = currentShimmerSpots[i];

		// Update basic physics.
		spot.x += spot.vx;
		spot.y += spot.vy;
		spot.radius += spot.growthSpeed;
		spot.opacity += spot.opacitySpeed;

		// --- Oscillation Logic ---
		// Reverse opacity change direction when hitting limits.
		// TODO: Make opacity limits constants?
		if (spot.opacity > 0.06 || spot.opacity < 0.005) {
			spot.opacitySpeed *= -1;
			spot.opacity = Math.max(0.005, Math.min(0.06, spot.opacity)); // Clamp to prevent exceeding bounds.
		}
		// Reverse growth direction when hitting radius limits.
		// TODO: Make radius limits (min factor, max) constants?
		if (spot.radius > spot.currentMaxRadius || spot.radius < spot.currentMaxRadius * 0.2) {
			spot.growthSpeed *= -1;
			spot.radius = Math.max(10, Math.min(spot.currentMaxRadius, spot.radius)); // Clamp with a minimum size.
		}
		// ------------------------

		// --- Boundary Collision ---
		// Reverse horizontal velocity and clamp position if hitting left/right edges.
		if (spot.x - spot.radius < 0 || spot.x + spot.radius > canvasWidth) {
			spot.vx *= -1;
			spot.x = Math.max(spot.radius, Math.min(canvasWidth - spot.radius, spot.x)); // Clamp position.
		}
		// Reverse vertical velocity and clamp position if hitting top/bottom edges.
		if (spot.y - spot.radius < 0 || spot.y + spot.radius > canvasHeight) {
			spot.vy *= -1;
			spot.y = Math.max(spot.radius, Math.min(canvasHeight - spot.radius, spot.y)); // Clamp position.
		}
		// -----------------------

		// --- Drawing ---
		// Calculate time-based warp offset for the current position.
		const warp = getWarpOffset(spot.x, spot.y, globalTime);
		const warpedX = spot.x + warp.dx;
		const warpedY = spot.y + warp.dy;

		// Create a radial gradient for the spot's appearance.
		const gradient = ctx.createRadialGradient(warpedX, warpedY, 0, warpedX, warpedY, spot.radius);
		// Extract base color (without alpha) to build the gradient stops.
		const baseColor = spot.color.substring(0, spot.color.lastIndexOf(')'));
		gradient.addColorStop(0, `${baseColor}, ${spot.opacity})`); // Center is full opacity.
		gradient.addColorStop(0.7, `${baseColor}, ${spot.opacity * 0.5})`); // Fade partway out.
		gradient.addColorStop(1, `${baseColor}, 0)`); // Edge is fully transparent.

		// Draw the spot using the gradient.
		ctx.fillStyle = gradient;
		ctx.beginPath();
		ctx.arc(warpedX, warpedY, spot.radius, 0, Math.PI * 2);
		ctx.fill();
		// ----------------
	}
	ctx.globalCompositeOperation = originalCompositeOp; // Restore original blend mode.
}

/**
 * Adjusts the position, size, and speed of shimmer spots when the canvas resizes.
 * Uses stored relative positions within the spawn area to maintain distribution.
 * Adjusts speed based on distance from the center of the new spawn area.
 * Rescales wave-type spots based on the new canvas dimensions.
 *
 * @param canvasWidth - The new width of the canvas.
 * @param canvasHeight - The new height of the canvas.
 */
export function handleResizeShimmerSpots(canvasWidth: number, canvasHeight: number): void {
	const currentShimmerSpots: ShimmerSpot[] = getShimmerSpots();
	if (currentShimmerSpots.length === 0) return; // Exit if no spots to resize.

	// Recalculate spawn area based on new dimensions.
	const newSpawnMinX = (canvasWidth * (1 - SHIMMER_SPAWN_AREA_WIDTH_RATIO)) / 2;
	const newSpawnWidth = canvasWidth * SHIMMER_SPAWN_AREA_WIDTH_RATIO;
	const newSpawnMinY = (canvasHeight * (1 - SHIMMER_SPAWN_AREA_HEIGHT_RATIO)) / 2;
	const newSpawnHeight = canvasHeight * SHIMMER_SPAWN_AREA_HEIGHT_RATIO;

	// Calculate center and max distance within the new spawn area for speed scaling.
	const newSpawnCenterX = newSpawnMinX + newSpawnWidth / 2;
	const newSpawnCenterY = newSpawnMinY + newSpawnHeight / 2;
	// Add small epsilon to avoid division by zero if spawn area is tiny.
	const maxDistInSpawn =
		Math.sqrt(Math.pow(newSpawnWidth / 2, 2) + Math.pow(newSpawnHeight / 2, 2)) + 0.001;

	for (const spot of currentShimmerSpots) {
		// Recalculate absolute position based on stored relative position within the spawn area.
		// Fallback to random relative position if stored value is missing (should not happen).
		const relX = spot.relativeXInSpawn !== undefined ? spot.relativeXInSpawn : Math.random();
		const relY = spot.relativeYInSpawn !== undefined ? spot.relativeYInSpawn : Math.random();
		spot.x = newSpawnMinX + relX * newSpawnWidth;
		spot.y = newSpawnMinY + relY * newSpawnHeight;

		// Adjust speed: Spots further from the center move slightly faster.
		if (spot.baseVx !== undefined && spot.baseVy !== undefined) {
			const distFromSpawnCenter = Math.sqrt(
				Math.pow(spot.x - newSpawnCenterX, 2) + Math.pow(spot.y - newSpawnCenterY, 2)
			);
			// Normalize distance from center (0 to 1).
			const normalizedDistance = Math.min(1, distFromSpawnCenter / maxDistInSpawn);
			// Linearly interpolate speed multiplier based on distance.
			const currentSpeedMultiplier =
				SHIMMER_RESIZE_MIN_SPEED_MULTIPLIER +
				normalizedDistance *
					(SHIMMER_RESIZE_MAX_SPEED_MULTIPLIER - SHIMMER_RESIZE_MIN_SPEED_MULTIPLIER);
			spot.vx = spot.baseVx * currentSpeedMultiplier;
			spot.vy = spot.baseVy * currentSpeedMultiplier;
		}

		// Re-calculate size for wave-type spots based on new canvas dimensions.
		if (spot.isWave) {
			const newSpotSize = (Math.min(canvasWidth, canvasHeight) / 2) * (0.8 + Math.random() * 0.4);
			spot.currentMaxRadius = newSpotSize;
			// Also reset current radius to a value within the new size range.
			spot.radius = Math.random() * newSpotSize * 0.3 + newSpotSize * 0.2;
		}
	}
}
