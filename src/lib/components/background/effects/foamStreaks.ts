/**
 * foamStreaks.ts
 *
 * Manages the creation, animation, and drawing of foam streaks.
 * Foam streaks are composed of many small particles that follow a jagged, potentially
 * branching path. They drift across the screen, fade in and out, and their individual
 * particles also have their own lifecycles and fade effects.
 */
import type { FoamStreak } from '../types'; // FoamParticle type is no longer directly used here
import {
	MAX_FOAM_STREAKS,
	FOAM_STREAK_COLOR_PRIMARY,
	FOAM_STREAK_COLOR_SECONDARY,
	FOAM_PARTICLE_MIN_SIZE,
	FOAM_PARTICLE_MAX_SIZE,
	FOAM_STREAK_MAX_WIDTH,
	FOAM_STREAK_SEGMENT_LENGTH_MIN,
	FOAM_STREAK_SEGMENT_LENGTH_MAX,
	FOAM_STREAK_LIFESPAN_MIN,
	FOAM_STREAK_LIFESPAN_MAX,
	FOAM_STREAK_FADE_DURATION_RATIO,
	FOAM_STREAK_DRIFT_X_MIN,
	FOAM_STREAK_DRIFT_X_MAX,
	FOAM_STREAK_DRIFT_Y_MIN,
	FOAM_STREAK_DRIFT_Y_MAX,
	FOAM_STREAK_WOBBLE_FACTOR,
	FOAM_PARTICLE_APPEAR_DELAY_PER_PARTICLE,
	FOAM_STREAK_JAGGEDNESS,
	FOAM_STREAK_MAIN_PATH_SEGMENTS_MIN,
	FOAM_STREAK_MAIN_PATH_SEGMENTS_MAX,
	FOAM_BRANCH_CHANCE,
	FOAM_SUB_BRANCH_MAX_SEGMENTS,
	FOAM_SUB_BRANCH_ANGLE_OFFSET,
	FOAM_PARTICLES_PER_SEGMENT_POINT,
	FOAM_PARTICLE_LIFESPAN_MIN,
	FOAM_PARTICLE_LIFESPAN_MAX,
	FOAM_PARTICLE_FADE_RATIO
} from '../constants';
import {
	addFoamStreak,
	getFoamStreaks,
	releaseFoamStreak,
	addFoamParticle,
	releaseFoamParticle
} from '../animationState';

/**
 * Creates a new foam streak effect, originating from off-screen.
 * Generates a jagged, potentially branching path and populates it with FoamParticle objects.
 * Adds the completed FoamStreak object to the central `animationState` using the pooled adder.
 *
 * @param canvasWidth - The current width of the canvas.
 * @param canvasHeight - The current height of the canvas.
 */
export function createFoamStreak(canvasWidth: number, canvasHeight: number, settings?: any): void {
	if (getFoamStreaks().length >= MAX_FOAM_STREAKS) return;

	const startSide = Math.floor(Math.random() * 3); // 0: Top, 1: Left, 2: Right
	let initialAnchorX, initialAnchorY, initialVx, initialVy;
	let baseAngle;

	// Determine starting position, velocity, and base angle based on the side
	if (startSide === 0) {
		// Top
		initialAnchorX = Math.random() * canvasWidth;
		initialAnchorY = -FOAM_STREAK_MAX_WIDTH;
		initialVx = (Math.random() - 0.5) * FOAM_STREAK_DRIFT_X_MAX * 0.5;
		initialVy =
			FOAM_STREAK_DRIFT_Y_MIN + Math.random() * (FOAM_STREAK_DRIFT_Y_MAX - FOAM_STREAK_DRIFT_Y_MIN);
		baseAngle = Math.PI / 2 + (Math.random() - 0.5) * (Math.PI / 6);
	} else if (startSide === 1) {
		// Left
		initialAnchorX = -FOAM_STREAK_MAX_WIDTH;
		initialAnchorY = Math.random() * canvasHeight;
		initialVx =
			FOAM_STREAK_DRIFT_X_MIN + Math.random() * (FOAM_STREAK_DRIFT_X_MAX - FOAM_STREAK_DRIFT_X_MIN);
		initialVy = (Math.random() - 0.5) * FOAM_STREAK_DRIFT_Y_MAX * 0.4;
		baseAngle = (Math.random() - 0.5) * (Math.PI / 4);
	} else {
		// Right
		initialAnchorX = canvasWidth + FOAM_STREAK_MAX_WIDTH;
		initialAnchorY = Math.random() * canvasHeight;
		initialVx = -(
			FOAM_STREAK_DRIFT_X_MIN +
			Math.random() * (FOAM_STREAK_DRIFT_X_MAX - FOAM_STREAK_DRIFT_X_MIN)
		);
		initialVy = (Math.random() - 0.5) * FOAM_STREAK_DRIFT_Y_MAX * 0.4;
		baseAngle = Math.PI + (Math.random() - 0.5) * (Math.PI / 4);
	}

	// Apply animation speed multiplier to velocities
	const speedMultiplier = settings?.foamAnimationSpeed || 1.0;
	initialVx *= speedMultiplier;
	initialVy *= speedMultiplier;

	let particleAppearCounter = 0;

	/**
	 * Recursively generates path segments and adds pooled particles along them.
	 * Can create main paths and sub-branches.
	 *
	 * @param targetStreak - The FoamStreak object to add particles to.
	 * @param startX - The starting X coordinate for this path section (relative to the streak anchor).
	 * @param startY - The starting Y coordinate for this path section.
	 * @param pathAngle - The initial angle for this path section.
	 * @param numSegments - The number of segments to generate for this path section.
	 * @param isSubBranch - True if this path is a sub-branch, false if it's the main path.
	 */
	const generatePathParticles = (
		targetStreak: FoamStreak,
		startX: number,
		startY: number,
		pathAngle: number,
		numSegments: number,
		isSubBranch: boolean
	) => {
		let currentX = startX;
		let currentY = startY;
		let currentAngle = pathAngle;

		for (let i = 0; i < numSegments; i++) {
			const segmentLength =
				FOAM_STREAK_SEGMENT_LENGTH_MIN +
				Math.random() * (FOAM_STREAK_SEGMENT_LENGTH_MAX - FOAM_STREAK_SEGMENT_LENGTH_MIN);

			// Apply jaggedness/angle constraints
			currentAngle += (Math.random() - 0.5) * 2 * FOAM_STREAK_JAGGEDNESS;
			if (isSubBranch) {
				const angleDiff = ((currentAngle - pathAngle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
				if (Math.abs(angleDiff) > FOAM_STREAK_JAGGEDNESS * 1.5) {
					currentAngle = pathAngle + Math.sign(angleDiff) * FOAM_STREAK_JAGGEDNESS * 1.5;
				}
			} else {
				// Main path angle constraints based on start side
				if (startSide === 0)
					currentAngle = Math.max(Math.PI / 4, Math.min((3 * Math.PI) / 4, currentAngle));
				else if (startSide === 1)
					currentAngle = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, currentAngle));
				else currentAngle = Math.max((2 * Math.PI) / 3, Math.min((4 * Math.PI) / 3, currentAngle));
			}

			const nextX = currentX + Math.cos(currentAngle) * segmentLength;
			const nextY = currentY + Math.sin(currentAngle) * segmentLength;

			// Spawn particles around the current point
			for (let k = 0; k < FOAM_PARTICLES_PER_SEGMENT_POINT; k++) {
				const particleSize =
					FOAM_PARTICLE_MIN_SIZE +
					Math.random() * (FOAM_PARTICLE_MAX_SIZE - FOAM_PARTICLE_MIN_SIZE);
				const perpAngle = currentAngle + Math.PI / 2;
				const offsetDist = (Math.random() - 0.5) * FOAM_STREAK_MAX_WIDTH * 0.8;

				const pX = currentX + Math.cos(perpAngle) * offsetDist;
				const pY = currentY + Math.sin(perpAngle) * offsetDist;

				addFoamParticle(targetStreak, {
					x: pX,
					y: pY,
					initialRelativeX: pX, // Store initial pos relative to anchor for wobble constraint
					initialRelativeY: pY,
					size: particleSize,
					opacity: 0, // Start invisible
					appearAtAge: particleAppearCounter++ * FOAM_PARTICLE_APPEAR_DELAY_PER_PARTICLE,
					maxOpacity: 0.5 + Math.random() * 0.4,
					particleAge: 0,
					particleMaxAge:
						FOAM_PARTICLE_LIFESPAN_MIN +
						Math.random() * (FOAM_PARTICLE_LIFESPAN_MAX - FOAM_PARTICLE_LIFESPAN_MIN)
				});
			}

			currentX = nextX;
			currentY = nextY;

			// Chance to create a sub-branch using dynamic branchiness
			const branchChance = settings?.foamBranchiness || FOAM_BRANCH_CHANCE;
			if (
				!isSubBranch &&
				Math.random() < branchChance &&
				i < numSegments - FOAM_SUB_BRANCH_MAX_SEGMENTS / 2 &&
				i > 2
			) {
				// Avoid branching too early or late
				const branchAngleOffset =
					(Math.random() < 0.5 ? -1 : 1) *
					FOAM_SUB_BRANCH_ANGLE_OFFSET *
					(0.7 + Math.random() * 0.6);
				const subBranchNumSegments = Math.floor(
					FOAM_SUB_BRANCH_MAX_SEGMENTS * (0.5 + Math.random() * 0.5)
				);
				generatePathParticles(
					targetStreak,
					currentX,
					currentY,
					currentAngle + branchAngleOffset,
					subBranchNumSegments,
					true
				);
			}

			// Stop generating if path goes too far off relative center (could use canvas dims later)
			// if (Math.abs(currentX) > canvasWidth * 0.7 || Math.abs(currentY) > canvasHeight * 0.7) break;
		}
	};

	// Generate the main path using dynamic complexity setting
	const complexityMultiplier = settings?.foamComplexity ? settings.foamComplexity / 50 : 1; // 50 is default complexity
	const minSegments = Math.round(FOAM_STREAK_MAIN_PATH_SEGMENTS_MIN * complexityMultiplier);
	const maxSegments = Math.round(FOAM_STREAK_MAIN_PATH_SEGMENTS_MAX * complexityMultiplier);
	const mainPathSegments = minSegments + Math.floor(Math.random() * (maxSegments - minSegments + 1));
	// Note: generatePathParticles is now called after the streak is added below

	// Create the streak object itself (particles array is initially empty)
	// Adjust lifetime inversely to animation speed - slower streaks live longer
	const baseMaxAge = settings?.foamLifetime || (
		FOAM_STREAK_LIFESPAN_MIN +
		Math.random() * (FOAM_STREAK_LIFESPAN_MAX - FOAM_STREAK_LIFESPAN_MIN)
	);
	const adjustedMaxAge = Math.round(baseMaxAge / speedMultiplier);
	
	const newStreakProps = {
		anchorX: initialAnchorX,
		anchorY: initialAnchorY,
		particles: [], // Start empty, generated particles were added via addFoamParticle
		vx: initialVx,
		vy: initialVy,
		opacity: 0, // Start invisible
		age: 0,
		maxAge: adjustedMaxAge,
		color: Math.random() < 0.6 ? FOAM_STREAK_COLOR_PRIMARY : FOAM_STREAK_COLOR_SECONDARY
	};

	// Add the streak (this will reuse from pool if possible and reset particles array)
	addFoamStreak(newStreakProps);

	// Find the newly added streak (or reused one) in the active list to generate particles *into* it
	// This is slightly inefficient, might be better if addFoamStreak returned the object
	const addedStreak = getFoamStreaks().find(
		(s) => s.anchorX === initialAnchorX && s.anchorY === initialAnchorY && s.age === 0
	);

	if (addedStreak) {
		generatePathParticles(addedStreak, 0, 0, baseAngle, mainPathSegments, false);
		// Don't create streaks with too few particles (could happen if generation stopped early)
		if (addedStreak.particles.length < 5) {
			// Need to release the streak *and* its newly added particles if we abort here
			releaseFoamStreak(addedStreak);
			return;
		}
	} else {
		console.warn('Could not find newly added streak to generate particles into.');
	}
}

/**
 * Updates the state of all active foam streaks and their constituent particles.
 * Handles streak drift, overall fade-in/out, particle appearance timing, individual
 * particle fade-in/out, particle wobble, and drawing.
 * Releases streaks that have fully expired (faded out).
 *
 * @param ctx - The 2D canvas rendering context.
 * @param canvasWidth - Current width of the canvas.
 * @param canvasHeight - Current height of the canvas.
 */
export function updateAndDrawFoamStreaks(
	ctx: CanvasRenderingContext2D,
	canvasWidth: number,
	canvasHeight: number,
	settings?: any
): void {
	const currentFoamStreaks: FoamStreak[] = getFoamStreaks();
	if (currentFoamStreaks.length === 0) return;

	const originalGlobalAlpha = ctx.globalAlpha;
	const originalCompositeOp = ctx.globalCompositeOperation;
	ctx.globalCompositeOperation = 'lighter'; // Use 'lighter' for bright foam effect.

	// Iterate backwards for safe removal using releaseFoamStreak.
	for (let i = currentFoamStreaks.length - 1; i >= 0; i--) {
		const streak = currentFoamStreaks[i];

		// --- Update Streak State ---
		streak.age++;
		streak.anchorX += streak.vx;
		streak.anchorY += streak.vy;

		// Calculate overall streak opacity for fade-in/out based on age and fade ratio.
		const fadeDuration = streak.maxAge * FOAM_STREAK_FADE_DURATION_RATIO;
		if (streak.age < fadeDuration) {
			streak.opacity = streak.age / fadeDuration;
		} else if (streak.age > streak.maxAge - fadeDuration) {
			streak.opacity = 1 - (streak.age - (streak.maxAge - fadeDuration)) / fadeDuration;
		} else {
			streak.opacity = 1;
		}
		streak.opacity = Math.max(0, Math.min(1, streak.opacity));

		// Release streak if it has fully faded out.
		if (streak.opacity <= 0 && streak.age > fadeDuration) {
			releaseFoamStreak(streak);
			continue;
		}
		// -------------------------

		// --- Off-screen Check (Optimization) ---
		let isCompletelyOffScreen = true;
		const checkBoundsX = FOAM_STREAK_MAX_WIDTH * 5;
		const checkBoundsY = FOAM_STREAK_MAX_WIDTH * 5;
		// Basic anchor check
		if (
			streak.anchorX > -checkBoundsX &&
			streak.anchorX < canvasWidth + checkBoundsX &&
			streak.anchorY > -checkBoundsY &&
			streak.anchorY < canvasHeight + checkBoundsY
		) {
			isCompletelyOffScreen = false;
		} else {
			// Detailed particle check
			isCompletelyOffScreen = true;
			for (const p of streak.particles) {
				const absoluteX = streak.anchorX + p.x;
				const absoluteY = streak.anchorY + p.y;
				// CORRECTED CHECK: Ensure particle is within canvas bounds (using canvasHeight)
				if (
					absoluteX > -p.size &&
					absoluteX < canvasWidth + p.size &&
					absoluteY > -p.size &&
					absoluteY < canvasHeight + p.size
				) {
					isCompletelyOffScreen = false;
					break;
				}
			}
		}

		// Remove if aged and fully off.
		if (isCompletelyOffScreen && streak.age > fadeDuration * 2) {
			releaseFoamStreak(streak);
			continue;
		}
		// ---------------------------------------

		ctx.fillStyle = streak.color;

		// --- Update and Draw Individual Particles ---
		// Iterate backwards to safely remove particles while iterating
		for (let pIdx = streak.particles.length - 1; pIdx >= 0; pIdx--) {
			const particle = streak.particles[pIdx];

			if (streak.age < particle.appearAtAge) {
				continue;
			}
			particle.particleAge++;

			// Check if particle lifetime is over first
			if (particle.particleAge > particle.particleMaxAge) {
				particle.opacity = 0; // Ensure it's marked as invisible
				// Release the particle back to the pool
				releaseFoamParticle(particle);
				// Remove it from this streak's particle array
				streak.particles.splice(pIdx, 1);
				continue; // Skip drawing and further updates
			} else {
				// Calculate fade in/out based on age
				const particleFadeTime = particle.particleMaxAge * FOAM_PARTICLE_FADE_RATIO;
				if (particle.particleAge < particleFadeTime) {
					particle.opacity = (particle.particleAge / particleFadeTime) * particle.maxOpacity;
				} else if (particle.particleAge > particle.particleMaxAge - particleFadeTime) {
					particle.opacity =
						(1 -
							(particle.particleAge - (particle.particleMaxAge - particleFadeTime)) /
								particleFadeTime) *
						particle.maxOpacity;
				} else {
					particle.opacity = particle.maxOpacity;
				}
				particle.opacity = Math.max(0, Math.min(particle.maxOpacity, particle.opacity));
			}

			if (particle.opacity <= 0.001) {
				// While opacity calculation might result in 0 before maxAge is reached,
				// we only release/remove once maxAge is definitively passed (handled above).
				// We just skip drawing invisible particles here.
				continue;
			}

			// Apply and constrain wobble
			particle.x += (Math.random() - 0.5) * FOAM_STREAK_WOBBLE_FACTOR;
			particle.y += (Math.random() - 0.5) * FOAM_STREAK_WOBBLE_FACTOR;
			const dx = particle.x - particle.initialRelativeX;
			const dy = particle.y - particle.initialRelativeY;
			const distSq = dx * dx + dy * dy;
			const maxWobbleDist = FOAM_STREAK_MAX_WIDTH * 0.5;
			if (distSq > maxWobbleDist * maxWobbleDist) {
				const dist = Math.sqrt(distSq);
				particle.x = particle.initialRelativeX + (dx / dist) * maxWobbleDist;
				particle.y = particle.initialRelativeY + (dy / dist) * maxWobbleDist;
			}

			// Draw particle
			const finalX = streak.anchorX + particle.x;
			const finalY = streak.anchorY + particle.y;
			const opacityMultiplier = settings?.foamOpacity ?? 1;
			const combinedOpacity = streak.opacity * particle.opacity * opacityMultiplier;
			if (combinedOpacity <= 0.001) continue;
			ctx.globalAlpha = combinedOpacity * originalGlobalAlpha;
			ctx.beginPath();
			ctx.arc(finalX, finalY, particle.size, 0, Math.PI * 2);
			ctx.fill();
		}
		// ------------------------------------------
	}
	// Restore canvas state.
	ctx.globalCompositeOperation = originalCompositeOp;
	ctx.globalAlpha = originalGlobalAlpha;
}
