/**
 * rareSightings.ts
 * 
 * Manages the infrequent appearance, movement, and drawing of "rare sightings" 
 * like plane or whale shadows moving across the background.
 */
import type { RareSighting } from '../types';
import { MAX_RARE_SIGHTINGS, RARE_SIGHTING_CONFIGS } from '../constants';
import { addRareSighting, getRareSightings, releaseRareSighting } from '../animationState';

// --- Internal Drawing Functions ---

/**
 * Draws a simple rectangular representation of a plane shadow.
 * Assumes canvas state (fillStyle, globalAlpha) is set before calling.
 * 
 * @param ctx - The 2D canvas rendering context.
 * @param s - The RareSighting object representing the plane.
 */
function drawPlaneSighting(ctx: CanvasRenderingContext2D, s: RareSighting): void {
  // Simple shape: one rectangle for fuselage, one for wings/tail.
  ctx.fillRect(s.x - s.size / 2, s.y - s.size / 8, s.size, s.size / 4); // Fuselage
  ctx.fillRect(s.x - s.size / 6, s.y - s.size / 3, s.size / 3, s.size * 0.8); // Wings/Tail
}

/**
 * Draws an elliptical representation of a whale shadow, including body and tail.
 * Updates the whale's animation properties (body angle, tail offset) before drawing.
 * Assumes canvas state (fillStyle, globalAlpha) is set before calling.
 * Uses save/restore to handle transformations (translation, rotation).
 * 
 * @param ctx - The 2D canvas rendering context.
 * @param s - The RareSighting object representing the whale shadow.
 */
function drawWhaleShadowSighting(ctx: CanvasRenderingContext2D, s: RareSighting): void {
  const pulseFactor = 0.05; // Subtle size pulse for the body.
  
  // Update whale-specific animation properties based on age and configured speeds/amplitudes.
  // These must be updated *before* drawing relies on them.
  if (s.bodyAngleSpeed && s.bodyAngleAmplitude) {
      s.bodyAngle = Math.sin(s.age * s.bodyAngleSpeed) * s.bodyAngleAmplitude;
  }
  if (s.tailOscillationSpeed && s.tailOscillationAmplitude) {
      s.tailAngleOffset = Math.sin(s.age * s.tailOscillationSpeed) * s.tailOscillationAmplitude;
  }

  // Calculate dynamic body and tail dimensions.
  const bodyBaseLength = s.size;
  const bodyLength = bodyBaseLength * (1 + Math.sin(s.age * 0.02) * pulseFactor); // Apply pulsing
  const bodyWidth = bodyLength / 3.5; // Maintain aspect ratio.

  const tailWidth = bodyWidth * 0.9;
  const tailLength = bodyLength * 0.3;

  // --- Draw Whale --- 
  ctx.save(); // Save current transform state.
  ctx.translate(s.x, s.y); // Move origin to whale's position.
  ctx.rotate(s.bodyAngle || 0); // Apply body rotation.

  // Draw main body ellipse.
  ctx.beginPath();
  ctx.ellipse(0, 0, bodyLength / 2, bodyWidth / 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Prepare to draw tail relative to the body.
  const tailAttachX = -bodyLength / 2 * 0.85; // Attachment point towards the back of the body ellipse.
  const tailAttachY = 0;

  ctx.save(); // Save body transform state.
  ctx.translate(tailAttachX, tailAttachY); // Move origin to tail attachment point.
  ctx.rotate(s.tailAngleOffset || 0); // Apply tail oscillation rotation.

  // Draw tail ellipse.
  ctx.beginPath();
  ctx.ellipse(0, 0, tailLength / 2, tailWidth / 2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore(); // Restore from tail transform state.
  ctx.restore(); // Restore from body transform state.
  // ------------------
}

// --- Creation Function ---

/**
 * Creates a new rare sighting of a specific type (e.g., 'plane', 'whaleShadow').
 * Determines initial position, velocity, and other properties based on the type's configuration
 * from `RARE_SIGHTING_CONFIGS`.
 * Adds the new sighting to the central `animationState`.
 * 
 * @param canvasWidth - The current width of the canvas.
 * @param canvasHeight - The current height of the canvas.
 * @param typeToCreate - The key corresponding to the desired sighting type in `RARE_SIGHTING_CONFIGS`.
 */
export function createRareSighting(canvasWidth: number, canvasHeight: number, typeToCreate: keyof typeof RARE_SIGHTING_CONFIGS): void {
    // Only proceed if the number of active sightings is below the limit.
    if (getRareSightings().length >= MAX_RARE_SIGHTINGS) {
        return;
    }

    const type = typeToCreate;
    const config = RARE_SIGHTING_CONFIGS[type];
    // Ensure config exists for the requested type.
    if (!config) {
        console.warn(`Configuration not found for rare sighting type: ${type}`);
        return; 
    }

    // Initialize position and velocity variables.
    let x, y, vx, vy;
    // Randomize speed within the configured range.
    const speed = config.minSpeed + Math.random() * (config.maxSpeed - config.minSpeed);

    // Set initial position and velocity based on sighting type.
    // Sightings typically start just off-screen.
    switch (type) {
      case 'plane':
        // Start either left or right, high up on the screen.
        x = Math.random() < 0.5 ? -config.maxSize : canvasWidth + config.maxSize;
        y = Math.random() * canvasHeight * 0.3; // Top 30% of screen height.
        vx = (x < 0 ? 1 : -1) * speed; // Move across the screen.
        vy = (Math.random() - 0.5) * speed * 0.3; // Slight vertical drift.
        break;
      case 'whaleShadow':
        // Start either left or right, lower down on the screen.
        x = Math.random() < 0.5 ? -config.maxSize * 1.5 : canvasWidth + config.maxSize * 1.5;
        y = canvasHeight * (0.5 + Math.random() * 0.4); // Lower 50% of screen height.
        vx = (x < 0 ? 1 : -1) * speed;
        vy = (Math.random() - 0.5) * speed * 0.1; // Very slight vertical drift.
        break;
      default:
        // Log a warning if an unhandled type is encountered.
        console.warn(`Unhandled rare sighting type for creation: ${type}`);
        return;
    }

    // Prepare the properties object for the new sighting.
    const sightingProps = {
      type,
      x, y, vx, vy,
      size: config.minSize + Math.random() * (config.maxSize - config.minSize),
      opacity: config.baseOpacity,
      age: 0, // Start age at 0.
      maxAge: config.minDuration + Math.random() * (config.maxDuration - config.minDuration),
      // Conditionally add whale-specific animation properties only for 'whaleShadow' type.
      ...(type === 'whaleShadow' ? {
        bodyAngle: 0,
        bodyAngleSpeed: (Math.random() * 0.003 + 0.002) * (Math.random() < 0.5 ? 1 : -1),
        bodyAngleAmplitude: Math.PI / 36, // Approx 5 degrees.
        tailAngleOffset: 0,
        tailOscillationSpeed: (Math.random() * 0.04 + 0.03),
        tailOscillationAmplitude: Math.PI / 10, // Approx 18 degrees.
      } : {})
    };

    // Add the sighting to the animation state using the pooled adder function.
    // Type assertion might be needed if TypeScript struggles with the conditional properties.
    addRareSighting(sightingProps as Omit<RareSighting, 'id'>);
    
}

// --- Update and Draw Orchestration ---

/**
 * Updates the state (position, age, opacity) of all active rare sightings 
 * and orchestrates their drawing by calling type-specific drawing functions.
 * Removes sightings that are expired (exceeded maxAge) or have moved off-screen.
 * 
 * @param ctx - The 2D canvas rendering context.
 * @param canvasWidth - Current width of the canvas.
 * @param canvasHeight - Current height of the canvas.
 */
export function updateAndDrawRareSightings(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number): void {
    const currentRareSightings: RareSighting[] = getRareSightings();
    if (currentRareSightings.length === 0) return;

    const originalGlobalAlpha = ctx.globalAlpha; // Save canvas state.

    // Iterate backwards for safe removal using releaseRareSighting.
    for (let i = currentRareSightings.length - 1; i >= 0; i--) {
        const s = currentRareSightings[i];
        
        // --- Update Common State --- 
        s.age++;
        s.x += s.vx;
        s.y += s.vy;
        // -------------------------
        
        // --- Check for Removal --- 
        // Define generous off-screen padding based on size.
        const padding = s.size * 2; 
        const isExpired = s.age > s.maxAge;
        const isOffScreen = s.x < -padding || s.x > canvasWidth + padding || s.y < -padding || s.y > canvasHeight + padding;

        if (isExpired || isOffScreen) {
            releaseRareSighting(s); // Release back to the pool.
            continue; // Skip further processing and drawing for this sighting.
        }
        // -------------------------

        // --- Update Opacity --- 
        // Apply fade-out effect during the last 20% of the sighting's lifespan.
        let currentOpacity = s.opacity;
        const fadeStartTimeRatio = 0.8; // Start fading at 80% of maxAge.
        if (s.age / s.maxAge > fadeStartTimeRatio) {
          const fadeProgress = (s.age / s.maxAge - fadeStartTimeRatio) / (1 - fadeStartTimeRatio);
          currentOpacity = s.opacity * (1 - fadeProgress);
        }
        currentOpacity = Math.max(0, currentOpacity); // Ensure opacity doesn't go below 0.
        // ----------------------

        // --- Prepare and Call Drawing Function --- 
        // Set common drawing styles (shared by all sighting types).
        ctx.globalAlpha = currentOpacity;
        ctx.fillStyle = `rgba(10, 10, 20, ${currentOpacity * 0.7})`; // Base dark shadow color.

        // Call the specific drawing function based on the sighting's type.
        switch (s.type) {
          case 'plane':
            drawPlaneSighting(ctx, s);
            break;
          case 'whaleShadow':
            // Whale animation updates (angles) happen inside drawWhaleShadowSighting.
            drawWhaleShadowSighting(ctx, s);
            break;
          // Add cases for new sighting types here.
          default:
            // Log a warning if a drawing function hasn't been implemented for a type.
            console.warn(`No drawing function implemented for rare sighting type: ${s.type}`);
        }
        // -------------------------------------
    }
    ctx.globalAlpha = originalGlobalAlpha; // Restore canvas state.
} 