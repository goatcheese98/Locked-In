/**
 * Defines the possible triggers or types for a ripple effect.
 */
export type RippleType = 'mouseMove' | 'click' | 'ambient' | 'longPress' | 'glintExpire';

/**
 * Represents a single expanding ripple effect in the water.
 */
export interface Ripple {
  id: number;       // Unique identifier for the ripple.
  x: number;        // Center x-coordinate.
  y: number;        // Center y-coordinate.
  radius: number;   // Current radius.
  maxRadius: number; // Maximum radius it will expand to.
  opacity: number;  // Current opacity (0 to 1).
  speed: number;    // Expansion speed (pixels per frame).
  lineWidth: number; // Width of the ripple line.
  color: string;    // Color of the ripple.
  isAmbient?: boolean; // True if generated automatically, false if user-initiated.
  decayRate: number; // Amount opacity decreases each frame.
}

/**
 * Represents a shimmering spot of light on the water surface.
 */
export interface ShimmerSpot {
  id: number;       // Unique identifier.
  x: number;        // Center x-coordinate.
  y: number;        // Center y-coordinate.
  radius: number;   // Current radius.
  opacity: number;  // Current opacity.
  growthSpeed: number; // Rate at which the radius changes (can be negative).
  opacitySpeed: number; // Rate at which the opacity changes (can be negative).
  color: string;    // Color of the shimmer.
  currentMaxRadius: number; // The maximum radius this spot oscillates towards.
  vx: number;       // Horizontal velocity.
  vy: number;       // Vertical velocity.
  isWave?: boolean;  // If true, uses different parameters for a larger, wave-like shimmer.
  // Properties for maintaining position within the central spawn area during resize
  relativeXInSpawn?: number; // Horizontal position relative to the spawn area (0 to 1).
  relativeYInSpawn?: number; // Vertical position relative to the spawn area (0 to 1).
  baseVx?: number;   // Original horizontal velocity.
  baseVy?: number;   // Original vertical velocity.
}

/**
 * Represents a small, brief glint of light on the water.
 */
export interface Glint {
  id: number;       // Unique identifier.
  x: number;        // Center x-coordinate.
  y: number;        // Center y-coordinate.
  radius: number;   // Radius of the glint.
  opacity: number;  // Current opacity.
  decay: number;    // Rate at which opacity fades.
  color: string;    // Color of the glint.
}

/**
 * Represents the main pulsating sun glow effect.
 */
export interface SunGlow {
  id: number;            // Unique identifier.
  x: number;             // Center x-coordinate.
  y: number;             // Center y-coordinate.
  currentRadius: number; // Current radius, affected by pulsing.
  baseRadius: number;    // The base radius around which it pulses.
  radiusAmplitude: number; // The amount the radius changes during a pulse.
  currentOpacity: number; // Current opacity, affected by pulsing.
  baseOpacity: number;    // The base opacity around which it pulses.
  opacityAmplitude: number; // The amount the opacity changes during a pulse.
  pulseAngle: number;    // Current angle in the pulse cycle (radians).
  pulseSpeed: number;    // Speed of the pulse cycle.
  vx: number;            // Horizontal velocity (currently unused, could be for drift).
  vy: number;            // Vertical velocity (currently unused, could be for drift).
  // Properties for maintaining position during resize
  relativeX?: number; // Horizontal position relative to canvas width (0 to 1).
  relativeY?: number; // Vertical position relative to canvas height (0 to 1).
}

/**
 * Represents small glints associated with the SunGlow effect.
 */
export interface SunGlint {
  id: number;       // Unique identifier.
  x: number;        // Center x-coordinate.
  y: number;        // Center y-coordinate.
  radius: number;   // Radius of the glint.
  opacity: number;  // Current opacity.
  decay: number;    // Rate at which opacity fades.
  color: string;    // Color of the glint.
}

/**
 * Represents a rare visual event, like a plane shadow or whale shadow.
 */
export interface RareSighting {
  id: number;       // Unique identifier.
  type: 'plane' | 'whaleShadow'; // The specific type of sighting.
  x: number;        // Current x-coordinate.
  y: number;        // Current y-coordinate.
  vx: number;       // Horizontal velocity.
  vy: number;       // Vertical velocity.
  size: number;     // General size parameter (used differently by types).
  opacity: number;  // Base opacity.
  age: number;      // Current age in frames.
  maxAge: number;   // Maximum age in frames before removal.

  // --- Whale Shadow Specific Properties ---
  bodyAngle?: number;          // Current rotation angle of the whale body (radians).
  bodyAngleSpeed?: number;     // Speed of the body's side-to-side oscillation.
  bodyAngleAmplitude?: number; // Amplitude of the body's side-to-side oscillation.
  tailAngleOffset?: number;    // Current rotation angle of the tail fluke relative to the body.
  tailOscillationSpeed?: number; // Speed of the tail fluke's up-and-down oscillation.
  tailOscillationAmplitude?: number; // Amplitude of the tail fluke's up-and-down oscillation.
}

/**
 * Represents a tiny speck of light/particle moving across the water surface.
 */
export interface WaterGrain {
  id: number;       // Unique identifier.
  x: number;        // Current x-coordinate.
  y: number;        // Current y-coordinate.
  vx: number;       // Horizontal velocity.
  vy: number;       // Vertical velocity.
  size: number;     // Size of the grain particle.
  opacity: number;  // Current opacity.
  color: string;    // Color of the grain.
  // Properties for maintaining position during resize
  relativeX?: number; // Horizontal position relative to canvas width (0 to 1).
  relativeY?: number; // Vertical position relative to canvas height (0 to 1).
}

/**
 * Represents a single particle within a FoamStreak.
 */
export interface FoamParticle {
  x: number;                 // Current absolute x-coordinate on the canvas.
  y: number;                 // Current absolute y-coordinate on the canvas.
  size: number;              // Size of the foam particle.
  opacity: number;           // Current individual opacity of the particle.
  initialRelativeX: number;  // Original x-offset relative to the streak's path start point.
  initialRelativeY: number;  // Original y-offset relative to the streak's path start point.
  appearAtAge: number;       // Streak age (in frames) at which this particle starts appearing.
  maxOpacity: number;        // The maximum opacity this particle reaches (allows variation).
  particleAge: number;       // Age of the particle itself (frames), starts after appearAtAge.
  particleMaxAge: number;    // Lifespan of the individual particle (frames) after appearing.
}

/**
 * Represents a streak of foam composed of multiple particles, drifting on the water.
 */
export interface FoamStreak {
  id: number;           // Unique identifier.
  anchorX: number;      // Current X position of the streak's logical starting point (used for drift).
  anchorY: number;      // Current Y position of the streak's logical starting point (used for drift).
  particles: FoamParticle[]; // Array of particles making up the streak.
  vx: number;           // Horizontal drift velocity of the entire streak.
  vy: number;           // Vertical drift velocity of the entire streak.
  opacity: number;      // Overall opacity multiplier for the streak (used for fade-in/out).
  age: number;          // Current age of the streak in frames.
  maxAge: number;       // Maximum age in frames before the streak is removed.
  color: string;        // Base color for the particles in the streak.
} 