/**
 * constants.ts
 *
 * This file centralizes configuration values and tuning parameters for the
 * interactive background animation effects.
 */
import type { RareSighting } from './types';

// --- Ripple Effect Constants ---

/**
 * Configuration settings for different types of ripple effects.
 * Controls appearance (size, speed, color, opacity) and behavior.
 */
export const RIPPLE_CONFIG = {
	mouseMove: {
		maxRadius: 50, // Max radius for ripples created by mouse movement.
		speed: 0.35, // Expansion speed.
		lineWidth: 1.0, // Line thickness.
		initialOpacity: 0.35, // Starting opacity.
		color: 'rgb(100, 180, 255)', // Ripple color.
		decayRate: 0.005 // Opacity decrease per frame.
	},
	click: {
		// Config for ripples created by a mouse click.
		maxRadius: 85,
		speed: 0.9,
		lineWidth: 2.2,
		initialOpacity: 0.95,
		color: 'rgb(190, 230, 255)',
		decayRate: 0.008
	},
	ambient: {
		// Config for background, automatically generated ripples.
		maxRadius: 30,
		speed: 0.2,
		lineWidth: 1,
		initialOpacity: 0.15,
		color: 'rgb(150, 200, 255)',
		decayRate: 0.008
	},
	longPress: {
		// Config for ripples created by a long mouse press.
		maxRadius: 150,
		speed: 0.3,
		lineWidth: 3.5,
		initialOpacity: 0.85,
		color: 'rgb(70, 140, 220)',
		decayRate: 0.006
	},
	glintExpire: {
		// Config for ripples created when a regular Glint expires.
		maxRadius: 40,
		speed: 0.9,
		lineWidth: 1.0,
		initialOpacity: 0.6,
		color: 'rgba(255, 255, 230, 0.7)',
		decayRate: 0.02 // Faster decay (was 0.97, likely a typo, making it decay faster)
	}
};

/** Interval (in milliseconds) for creating ambient ripples. */
export const AMBIENT_RIPPLE_INTERVAL = 2000;

// --- Shimmer Spot Constants ---

/** Maximum number of shimmer spots allowed on screen. */
export const MAX_SHIMMER_SPOTS = 128;

// --- Glint Constants ---

/** Maximum number of regular glints allowed on screen. */
export const MAX_GLINTS = 16;
/** Probability (0 to 1) of creating a new glint in each animation frame. */
export const GLINT_CHANCE = 0.05;

// --- User Interaction Constants ---

/** Minimum time (in milliseconds) between processing mouse move events for ripple creation. */
export const MOUSE_MOVE_THROTTLE = 30;
/** Minimum duration (in milliseconds) for a mouse press to be considered a long press. */
export const LONG_PRESS_DURATION = 400;
/** Minimum distance (in pixels) the mouse must move during a press to invalidate a long press. */
export const LONG_PRESS_MOVE_THRESHOLD = 10;

// --- Sun Glow Constants ---

/** Minimum speed for the sun glow's pulsating animation cycle. */
export const SUN_GLOW_PULSE_SPEED_MIN = 0.0011;
/** Maximum speed for the sun glow's pulsating animation cycle. */
export const SUN_GLOW_PULSE_SPEED_MAX = 0.003;

// --- Sun Glint Constants (Associated with Sun Glow) ---

/** Maximum number of sun glints (particles originating from the Sun Glow) allowed on screen. */
export const MAX_SUN_GLINTS = 3000;
/** Target number of sun glints to spawn per frame when the Sun Glow is at its base (dimmest) opacity. */
export const TARGET_GLINTS_TO_SPAWN_AT_BASE_OPACITY = 2;
/** Target number of sun glints to spawn per frame when the Sun Glow is at its peak (brightest) opacity. */
export const TARGET_GLINTS_TO_SPAWN_AT_PEAK_OPACITY = 15;
/** Color of the sun glints. */
export const SUN_GLINT_COLOR = 'rgba(255, 255, 234, 0.95)';

// --- Rare Sighting Constants ---

/** Maximum number of rare sightings (e.g., plane, whale) allowed on screen simultaneously. */
export const MAX_RARE_SIGHTINGS = 4;
/** Interval (in milliseconds) at which to check if a new rare sighting should be created. */
export const RARE_SIGHTING_CHECK_INTERVAL = 1000;

// --- Wave Shimmer Spot Constants ---

/** Number of larger, slower shimmer spots used to create a wave-like effect. */
export const NUM_WAVE_SHIMMER_SPOTS = 3;
/** Minimum opacity for wave-type shimmer spots. */
export const WAVE_SHIMMER_MIN_OPACITY = 0.15;
/** Maximum opacity for wave-type shimmer spots. */
export const WAVE_SHIMMER_MAX_OPACITY = 0.3;
/** Minimum speed factor multiplier for wave-type shimmer spots. */
export const WAVE_SHIMMER_MIN_SPEED_FACTOR = 0.2;
/** Maximum speed factor multiplier for wave-type shimmer spots. */
export const WAVE_SHIMMER_MAX_SPEED_FACTOR = 0.5;
/** Minimum HSL lightness value for the color of wave-type shimmer spots. */
export const WAVE_SHIMMER_COLOR_LIGHTNESS_MIN = 45;
/** Maximum HSL lightness value for the color of wave-type shimmer spots. */
export const WAVE_SHIMMER_COLOR_LIGHTNESS_MAX = 60;

// --- Shimmer Spawn Area Constants ---

/** Ratio of canvas width used as the central area for spawning shimmer spots. */
export const SHIMMER_SPAWN_AREA_WIDTH_RATIO = 0.6;
/** Ratio of canvas height used as the central area for spawning shimmer spots. */
export const SHIMMER_SPAWN_AREA_HEIGHT_RATIO = 0.6;
/** Minimum speed multiplier applied to shimmer spots based on distance from center during resize. */
export const SHIMMER_RESIZE_MIN_SPEED_MULTIPLIER = 1.0;
/** Maximum speed multiplier applied to shimmer spots based on distance from center during resize. */
export const SHIMMER_RESIZE_MAX_SPEED_MULTIPLIER = 2.25;

// --- Water Grain Constants ---

/** Total number of water grain particles simulated. */
export const NUM_WATER_GRAINS = 600;
/** Minimum speed for water grains. */
export const GRAIN_MIN_SPEED = 0.05;
/** Maximum speed for water grains. */
export const GRAIN_MAX_SPEED = 0.25;
/** Minimum size for water grains. */
export const GRAIN_MIN_SIZE = 0.5;
/** Maximum size for water grains. */
export const GRAIN_MAX_SIZE = 1.25;
/** Minimum opacity for water grains. */
export const GRAIN_MIN_OPACITY = 0.25;
/** Maximum opacity for water grains. */
export const GRAIN_MAX_OPACITY = 0.55;

// --- Dynamic Gradient Background Constants ---

// Note: Base colors are now component props (gradientColor1, gradientColor2)

/** Interval (in milliseconds) between changes in the background gradient's direction. */
export const GRADIENT_DIRECTION_CHANGE_INTERVAL = 60000;
/** Duration (in milliseconds) of the smooth transition between gradient directions. */
export const GRADIENT_TRANSITION_DURATION = 5000;

/**
 * Defines the start (x1, y1) and end (x2, y2) points for the linear background gradient.
 * Coordinates are relative to canvas dimensions (0 to 1).
 * Order defines the sequence of transitions (clockwise rotation).
 */
export const GRADIENT_DIRECTIONS = [
	{ x1: 0, y1: 0, x2: 1, y2: 1 }, // 1. Top-Left to Bottom-Right
	{ x1: 0.5, y1: 0, x2: 0.5, y2: 1 }, // 2. Top to Bottom
	{ x1: 1, y1: 0, x2: 0, y2: 1 }, // 3. Top-Right to Bottom-Left
	{ x1: 1, y1: 0.5, x2: 0, y2: 0.5 }, // 4. Right to Left
	{ x1: 1, y1: 1, x2: 0, y2: 0 }, // 5. Bottom-Right to Top-Left
	{ x1: 0.5, y1: 1, x2: 0.5, y2: 0 }, // 6. Bottom to Top
	{ x1: 0, y1: 1, x2: 1, y2: 0 }, // 7. Bottom-Left to Top-Right
	{ x1: 0, y1: 0.5, x2: 1, y2: 0.5 } // 8. Left to Right
];

// --- Foam Streaks Effect Constants ---

/** Maximum number of foam streaks allowed on screen. */
export const MAX_FOAM_STREAKS = 25000; // Reverted to previous higher value per user request
/** Probability (0 to 1) of creating a new foam streak in each animation frame. */
export const FOAM_STREAK_CHANCE_PER_FRAME = 0.55; // Reverted to previous higher value per user request
/** Primary color for foam streak particles. */
export const FOAM_STREAK_COLOR_PRIMARY = 'rgba(235, 245, 255, 0.7)';
/** Secondary color variation for foam streak particles. */
export const FOAM_STREAK_COLOR_SECONDARY = 'rgba(210, 230, 245, 0.5)';

/** Minimum size for individual foam particles. */
export const FOAM_PARTICLE_MIN_SIZE = 0.5;
/** Maximum size for individual foam particles. */
export const FOAM_PARTICLE_MAX_SIZE = 1.5;
/** Minimum number of particles generated for a single foam streak. */
export const FOAM_STREAK_NUM_PARTICLES_MIN = 50;
/** Maximum number of particles generated for a single foam streak. */
export const FOAM_STREAK_NUM_PARTICLES_MAX = 120;

/** Approximate maximum width/spread of particles along the foam streak path. */
export const FOAM_STREAK_MAX_WIDTH = 15;
/** Minimum length of a segment in the foam streak's underlying path. */
export const FOAM_STREAK_SEGMENT_LENGTH_MIN = 5;
/** Maximum length of a segment in the foam streak's underlying path. */
export const FOAM_STREAK_SEGMENT_LENGTH_MAX = 12;

/** Minimum lifespan (in frames) of a foam streak before fading out. */
export const FOAM_STREAK_LIFESPAN_MIN = 500;
/** Maximum lifespan (in frames) of a foam streak before fading out. */
export const FOAM_STREAK_LIFESPAN_MAX = 1000;
/** Proportion of a streak's lifespan dedicated to fade-in and fade-out (e.g., 0.2 means 20% fade-in, 20% fade-out). */
export const FOAM_STREAK_FADE_DURATION_RATIO = 0.2;

/** Minimum horizontal drift speed for foam streaks. */
export const FOAM_STREAK_DRIFT_X_MIN = 0.02;
/** Maximum horizontal drift speed for foam streaks. */
export const FOAM_STREAK_DRIFT_X_MAX = 0.12;
/** Minimum vertical drift speed for foam streaks. */
export const FOAM_STREAK_DRIFT_Y_MIN = 0.005;
/** Maximum vertical drift speed for foam streaks. */
export const FOAM_STREAK_DRIFT_Y_MAX = 0.05;
/** Factor controlling the individual random movement (wobble) of foam particles away from the main path. */
export const FOAM_STREAK_WOBBLE_FACTOR = 0.02;
/** Delay (in frames per particle) controlling how quickly particles appear along the streak path. */
export const FOAM_PARTICLE_APPEAR_DELAY_PER_PARTICLE = 0.3;

// --- Foam Streak Path Generation Constants ---

/** Maximum angle deviation (in radians) allowed between segments, creating a jagged path. */
export const FOAM_STREAK_JAGGEDNESS = Math.PI / 4;
/** Minimum number of segments in the main path of a foam streak. */
export const FOAM_STREAK_MAIN_PATH_SEGMENTS_MIN = 25;
/** Maximum number of segments in the main path of a foam streak. */
export const FOAM_STREAK_MAIN_PATH_SEGMENTS_MAX = 100;
/** Probability (0 to 1) that a segment on the main path will fork into a sub-branch. */
export const FOAM_BRANCH_CHANCE = 0.25;
/** Maximum number of segments allowed in a sub-branch fork. */
export const FOAM_SUB_BRANCH_MAX_SEGMENTS = 10;
/** Approximate angle offset (in radians) for sub-branches relative to the main path direction. */
export const FOAM_SUB_BRANCH_ANGLE_OFFSET = Math.PI / 3;
/** Number of individual foam particles generated around each point in the streak's path (main and branches). */
export const FOAM_PARTICLES_PER_SEGMENT_POINT = 2;

// --- Foam Particle Lifespan/Fade Constants ---

/** Minimum lifespan (in frames) for an individual foam particle after it appears. */
export const FOAM_PARTICLE_LIFESPAN_MIN = 30;
/** Maximum lifespan (in frames) for an individual foam particle after it appears. */
export const FOAM_PARTICLE_LIFESPAN_MAX = 70;
/** Proportion of a particle's lifespan dedicated to fade-in and fade-out. */
export const FOAM_PARTICLE_FADE_RATIO = 0.25;

// --- Rare Sighting Configuration ---

/**
 * Defines the specific parameters for each type of rare sighting.
 * Used by the `createRareSighting` function.
 */
interface RareSightingConfig {
	minSpeed: number; // Minimum travel speed.
	maxSpeed: number; // Maximum travel speed.
	minSize: number; // Minimum size.
	maxSize: number; // Maximum size.
	baseOpacity: number; // Base opacity.
	minDuration: number; // Minimum duration on screen (frames).
	maxDuration: number; // Maximum duration on screen (frames).
	chancePerInterval: number; // Probability (0-1) of appearing during each check interval.
}

/**
 * A configuration object mapping each rare sighting type to its specific parameters.
 * Ensures all defined rare sighting types have corresponding configuration.
 */
export const RARE_SIGHTING_CONFIGS: Record<RareSighting['type'], RareSightingConfig> = {
	plane: {
		minSpeed: 0.25,
		maxSpeed: 0.5,
		minSize: 25,
		maxSize: 45,
		baseOpacity: 0.4,
		minDuration: 10000,
		maxDuration: 20000, // Note: Durations seem very long (in frames), maybe intended in ms?
		chancePerInterval: 0.01
	},
	whaleShadow: {
		minSpeed: 0.18,
		maxSpeed: 0.32,
		minSize: 40,
		maxSize: 70,
		baseOpacity: 0.5,
		minDuration: 1200,
		maxDuration: 2500, // Duration in frames
		chancePerInterval: 0.09
	}
};
