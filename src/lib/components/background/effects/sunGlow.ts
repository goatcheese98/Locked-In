/**
 * sunGlow.ts
 *
 * Manages the Sun Glow effect, a large, pulsating light source, and the numerous
 * small Sun Glint particles it emits.
 */
import type { SunGlow, SunGlint } from '../types'; // Import types
import {
	SUN_GLOW_PULSE_SPEED_MIN,
	SUN_GLOW_PULSE_SPEED_MAX,
	MAX_SUN_GLINTS,
	TARGET_GLINTS_TO_SPAWN_AT_BASE_OPACITY,
	TARGET_GLINTS_TO_SPAWN_AT_PEAK_OPACITY,
	SUN_GLINT_COLOR
} from '../constants';
import {
	addSunGlow,
	getSunGlows,
	addSunGlint,
	getSunGlints,
	releaseSunGlint
} from '../animationState';

// --- Internal Helper: Positioning ---

/**
 * A predefined 3x3 grid biasing towards the center and slightly off-center cells.
 * Used by `getRandomOffCenterPosition` to choose where the Sun Glow spawns.
 * The repetition of [1,1] makes the absolute center cell more likely.
 */
const allowedSunGlowCellIndices = [
	[0, 0],
	[0, 1],
	[0, 2], // Top row
	[1, 0],
	[1, 1],
	[1, 1],
	[1, 1],
	[1, 1],
	[1, 1],
	[1, 1],
	[1, 2], // Middle row (center weighted)
	[2, 0],
	[2, 1],
	[2, 2] // Bottom row
];

/**
 * Calculates a random position within the canvas, biased towards the center
 * and slightly off-center areas, based on the `allowedSunGlowCellIndices` grid.
 *
 * @param canvasWidth - The current width of the canvas.
 * @param canvasHeight - The current height of the canvas.
 * @returns An object { x: number, y: number } representing the calculated position.
 */
function getRandomOffCenterPosition(
	canvasWidth: number,
	canvasHeight: number
): { x: number; y: number } {
	// Randomly select a cell [row, col] from the biased grid.
	const chosenCellData =
		allowedSunGlowCellIndices[Math.floor(Math.random() * allowedSunGlowCellIndices.length)];
	const cellRow = chosenCellData[0];
	const cellCol = chosenCellData[1];

	// Calculate the dimensions of each cell in the 3x3 grid.
	const cellWidth = canvasWidth / 3;
	const cellHeight = canvasHeight / 3;

	// Calculate a random position *within* the chosen cell.
	const x = cellCol * cellWidth + Math.random() * cellWidth;
	const y = cellRow * cellHeight + Math.random() * cellHeight;
	return { x, y };
}

// --- Sun Glint Creation (Internal) ---

/**
 * Creates a single Sun Glint particle emanating from the Sun Glow.
 * Called repeatedly by `updateAndDrawSunGlows` based on the glow's current opacity.
 * Adds the glint to the `animationState`.
 *
 * @param glowCenterX - The x-coordinate of the parent Sun Glow's center.
 * @param glowCenterY - The y-coordinate of the parent Sun Glow's center.
 * @param glowCurrentRadius - The current radius of the parent Sun Glow.
 */
function createSunGlint(glowCenterX: number, glowCenterY: number, glowCurrentRadius: number): void {
	// Limit the total number of sun glints.
	if (getSunGlints().length >= MAX_SUN_GLINTS) return;

	// Determine a random position within the glow's radius.
	const angle = Math.random() * Math.PI * 2;
	const distance = Math.random() * glowCurrentRadius * 0.5; // Spawn within inner half

	// Add the new sun glint using the pooled adder function.
	addSunGlint({
		x: glowCenterX + Math.cos(angle) * distance,
		y: glowCenterY + Math.sin(angle) * distance,
		radius: Math.random() * 0.6 + 0.4, // Small radius variation
		opacity: Math.random() * 0.3 + 0.7, // Start fairly bright
		decay: Math.random() * 0.008 + 0.002, // Opacity decay rate variation
		color: SUN_GLINT_COLOR
	});
}

// --- Exported Functions ---

/**
 * Creates the main Sun Glow effect, calculating its initial position and properties.
 * Adds the glow object to the `animationState`.
 * Typically called once during initialization.
 *
 * @param canvasWidth - The initial width of the canvas.
 * @param canvasHeight - The initial height of the canvas.
 */
export function createSunGlow(canvasWidth: number, canvasHeight: number): void {
	// Determine size based on the shorter canvas dimension.
	const shorterCanvasSide = Math.min(canvasWidth, canvasHeight);
	// Get a starting position biased towards the center.
	const { x: initialX, y: initialY } = getRandomOffCenterPosition(canvasWidth, canvasHeight);

	// Add the SunGlow object to the animation state.
	addSunGlow({
		x: initialX,
		y: initialY,
		baseRadius: shorterCanvasSide * 0.45, // Base size
		radiusAmplitude: shorterCanvasSide * 0.12, // Pulsing size range
		currentRadius: shorterCanvasSide * 0.45, // Initial size
		baseOpacity: 0.35, // Base opacity
		opacityAmplitude: 0.3, // Pulsing opacity range
		currentOpacity: 0.35, // Initial opacity
		pulseAngle: Math.random() * Math.PI * 2, // Start pulse at random point in cycle
		pulseSpeed:
			SUN_GLOW_PULSE_SPEED_MIN +
			Math.random() * (SUN_GLOW_PULSE_SPEED_MAX - SUN_GLOW_PULSE_SPEED_MIN),
		vx: 0, // No initial velocity
		vy: 0,
		// Store relative position for accurate repositioning on resize.
		relativeX: initialX / canvasWidth,
		relativeY: initialY / canvasHeight
	});
}

/**
 * Updates the state (position, opacity, radius) of all active Sun Glints and draws them.
 * Applies a slight random drift to positions.
 * Releases glints that have faded out back to the object pool.
 *
 * @param ctx - The 2D canvas rendering context.
 */
export function updateAndDrawSunGlints(ctx: CanvasRenderingContext2D): void {
	const currentSunGlints: SunGlint[] = getSunGlints();
	if (currentSunGlints.length === 0) return;

	const originalGlobalAlpha = ctx.globalAlpha;

	// Iterate backwards for safe removal using releaseSunGlint.
	for (let i = currentSunGlints.length - 1; i >= 0; i--) {
		const sg = currentSunGlints[i];

		// Apply a very subtle random drift.
		sg.x += (Math.random() - 0.5) * 0.5;
		sg.y += (Math.random() - 0.5) * 0.5;

		// Update opacity and radius.
		sg.opacity -= sg.decay;
		sg.radius += 0.005; // Slight expansion over time.

		// Check if the glint has faded out.
		if (sg.opacity <= 0) {
			releaseSunGlint(sg); // Release back to the pool.
		} else {
			// Draw the active glint.
			ctx.beginPath();
			ctx.arc(sg.x, sg.y, sg.radius, 0, Math.PI * 2);
			ctx.fillStyle = sg.color;
			ctx.globalAlpha = Math.max(0, sg.opacity); // Ensure alpha doesn't go negative.
			ctx.fill();
		}
	}
	ctx.globalAlpha = originalGlobalAlpha;
}

/**
 * Updates the pulsating state (radius, opacity) of the main Sun Glow(s).
 * Calculates and triggers the creation of new Sun Glints based on the glow's current opacity.
 * Draws the Sun Glow(s) using a radial gradient.
 *
 * @param ctx - The 2D canvas rendering context.
 */
export function updateAndDrawSunGlows(ctx: CanvasRenderingContext2D): void {
	const currentSunGlows: SunGlow[] = getSunGlows();
	if (currentSunGlows.length === 0) return;

	const originalCompositeOp = ctx.globalCompositeOperation;
	ctx.globalCompositeOperation = 'lighter'; // Use 'lighter' for additive sun effect.
	const originalGlobalAlpha = ctx.globalAlpha;

	// Although typically one glow, loop supports multiple if needed in the future.
	for (let i = 0; i < currentSunGlows.length; i++) {
		const glow = currentSunGlows[i];

		// --- Update Pulsing State ---
		glow.pulseAngle += glow.pulseSpeed;
		// Calculate current radius and opacity based on sine wave of pulse angle.
		glow.currentRadius = glow.baseRadius + Math.sin(glow.pulseAngle) * glow.radiusAmplitude;
		// Opacity pulse uses a slightly offset sine wave for variation.
		glow.currentOpacity =
			glow.baseOpacity +
			(Math.sin(glow.pulseAngle * 0.7 + Math.PI / 3) * 0.5 + 0.5) * glow.opacityAmplitude;
		// Clamp opacity to valid range [0, 1].
		glow.currentOpacity = Math.max(0, Math.min(1, glow.currentOpacity));
		// --------------------------

		// --- Sun Glint Spawning ---
		// Calculate how many glints to spawn this frame based on the glow's current brightness.
		const maxPossibleGlowOpacity = glow.baseOpacity + glow.opacityAmplitude;
		// Normalize current opacity relative to its max possible value.
		const normalizedGlowOpacity =
			maxPossibleGlowOpacity > 0 ? Math.max(0, glow.currentOpacity / maxPossibleGlowOpacity) : 0;
		// Normalize the base opacity relative to the max possible value.
		const normalizedBaseOpacity =
			maxPossibleGlowOpacity > 0 ? glow.baseOpacity / maxPossibleGlowOpacity : 0;

		let numGlintsToSpawnThisFrame = 0;
		if (normalizedGlowOpacity > 0) {
			// Interpolate between target spawn rates based on whether opacity is below or above base.
			if (normalizedGlowOpacity <= normalizedBaseOpacity) {
				// Interpolate from 0 up to the base target rate.
				const t = normalizedBaseOpacity > 0 ? normalizedGlowOpacity / normalizedBaseOpacity : 0;
				numGlintsToSpawnThisFrame = Math.round(t * TARGET_GLINTS_TO_SPAWN_AT_BASE_OPACITY);
			} else {
				// Interpolate from the base target rate up to the peak target rate.
				const rangeBeyondBase = 1 - normalizedBaseOpacity;
				const t =
					rangeBeyondBase > 0
						? (normalizedGlowOpacity - normalizedBaseOpacity) / rangeBeyondBase
						: 1;
				numGlintsToSpawnThisFrame = Math.round(
					TARGET_GLINTS_TO_SPAWN_AT_BASE_OPACITY +
						t * (TARGET_GLINTS_TO_SPAWN_AT_PEAK_OPACITY - TARGET_GLINTS_TO_SPAWN_AT_BASE_OPACITY)
				);
			}
		}
		numGlintsToSpawnThisFrame = Math.max(0, numGlintsToSpawnThisFrame);

		// Create the calculated number of sun glints for this frame.
		for (let k = 0; k < numGlintsToSpawnThisFrame; k++) {
			createSunGlint(glow.x, glow.y, glow.currentRadius);
			// Stop if max glint limit is reached, even if more were calculated.
			if (getSunGlints().length >= MAX_SUN_GLINTS) {
				break;
			}
		}
		// --------------------------

		// --- Draw Sun Glow ---
		// Create a radial gradient for the glow effect.
		const gradient = ctx.createRadialGradient(
			glow.x,
			glow.y,
			0,
			glow.x,
			glow.y,
			glow.currentRadius
		);
		// Define color stops with opacity baked in, fading out towards the edge.
		gradient.addColorStop(0, `rgba(255, 250, 220, ${glow.currentOpacity})`); // Center color
		gradient.addColorStop(0.25, `rgba(255, 235, 180, ${glow.currentOpacity * 0.8})`);
		gradient.addColorStop(0.6, `rgba(255, 220, 150, ${glow.currentOpacity * 0.4})`);
		gradient.addColorStop(1, `rgba(255, 210, 130, 0)`); // Transparent edge

		// Draw the glow.
		ctx.fillStyle = gradient;
		ctx.globalAlpha = 1; // Use the opacity baked into the gradient stops.
		ctx.beginPath();
		ctx.arc(glow.x, glow.y, glow.currentRadius, 0, Math.PI * 2);
		ctx.fill();
		// ---------------------
	}
	// Restore original canvas state.
	ctx.globalCompositeOperation = originalCompositeOp;
	ctx.globalAlpha = originalGlobalAlpha;
}

/**
 * Handles the canvas resize event for the Sun Glow effect.
 * Recalculates the glow's position based on its stored relative coordinates
 * and updates its size parameters based on the new canvas dimensions.
 *
 * @param canvasWidth - The new width of the canvas.
 * @param canvasHeight - The new height of the canvas.
 */
export function handleResizeSunGlows(canvasWidth: number, canvasHeight: number): void {
	const currentSunGlows: SunGlow[] = getSunGlows();
	if (currentSunGlows.length === 0) return;

	const shorterCanvasSide = Math.min(canvasWidth, canvasHeight);

	for (const glow of currentSunGlows) {
		// Reposition based on stored relative coordinates.
		if (glow.relativeX !== undefined && glow.relativeY !== undefined) {
			glow.x = glow.relativeX * canvasWidth;
			glow.y = glow.relativeY * canvasHeight;
		} else {
			// Fallback: If relative coordinates are missing, calculate a new random position.
			// This shouldn't happen with the current createSunGlow implementation.
			console.warn('SunGlow missing relative coordinates during resize. Recalculating position.');
			const { x, y } = getRandomOffCenterPosition(canvasWidth, canvasHeight);
			glow.x = x;
			glow.y = y;
			glow.relativeX = x / canvasWidth;
			glow.relativeY = y / canvasHeight;
		}

		// Update size parameters based on the new shorter canvas side.
		glow.baseRadius = shorterCanvasSide * 0.45;
		glow.radiusAmplitude = shorterCanvasSide * 0.12;
		// The currentRadius will naturally adjust over time based on the new base/amplitude and pulseAngle.
	}
}
