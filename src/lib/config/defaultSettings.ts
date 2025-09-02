/**
 * defaultSettings.ts
 * 
 * Centralized default configuration values for all interactive background effects.
 * These values are used as initial settings and fallbacks throughout the application.
 */

// --- Light Effects Defaults ---
export const DEFAULT_LIGHT_EFFECTS = {
  sunGlow: {
    enabled: true,
    intensity: 0.7,
    size: 150,
    blur: 60,
    pulseSpeed: 0.002,
    glintIntensity: 0.6,
    glintQuantity: 1.0
  },
  glints: {
    enabled: true,
    frequency: 20,
    brightness: 0.8,
    duration: 500,
    size: 4,
    maxGlints: 16,
    chance: 0.05,
    color: 'rgba(255, 255, 230, 0.7)'
  },
  sunGlints: {
    maxSunGlints: 3000,
    targetGlintsAtBase: 2,
    targetGlintsAtPeak: 15,
    color: 'rgba(255, 255, 234, 0.95)'
  }
};

// --- Water Effects Defaults ---
export const DEFAULT_WATER_EFFECTS = {
  ripples: {
    enabled: true,
    mouseMove: {
      maxRadius: 50,
      speed: 0.35,
      lineWidth: 1.0,
      initialOpacity: 0.35,
      color: 'rgb(100, 180, 255)',
      decayRate: 0.005
    },
    click: {
      maxRadius: 85,
      speed: 0.9,
      lineWidth: 2.2,
      initialOpacity: 0.95,
      color: 'rgb(190, 230, 255)',
      decayRate: 0.008
    },
    ambient: {
      maxRadius: 30,
      speed: 0.2,
      lineWidth: 1,
      initialOpacity: 0.15,
      color: 'rgb(150, 200, 255)',
      decayRate: 0.008,
      interval: 2000
    },
    longPress: {
      maxRadius: 150,
      speed: 0.3,
      lineWidth: 3.5,
      initialOpacity: 0.85,
      color: 'rgb(70, 140, 220)',
      decayRate: 0.006
    },
    glintExpire: {
      maxRadius: 40,
      speed: 0.9,
      lineWidth: 1.0,
      initialOpacity: 0.6,
      color: 'rgba(255, 255, 230, 0.7)',
      decayRate: 0.02
    }
  },
  shimmer: {
    enabled: true,
    maxSpots: 128,
    waveSpots: 3,
    minOpacity: 0.15,
    maxOpacity: 0.3,
    minSpeedFactor: 0.2,
    maxSpeedFactor: 0.5,
    colorLightnessMin: 45,
    colorLightnessMax: 60,
    spawnAreaWidthRatio: 0.6,
    spawnAreaHeightRatio: 0.6,
    resizeMinSpeedMultiplier: 1.0,
    resizeMaxSpeedMultiplier: 2.25
  }
};

// --- Particle Effects Defaults ---
export const DEFAULT_PARTICLE_EFFECTS = {
  waterGrains: {
    enabled: true,
    count: 600,
    minSpeed: 0.05,
    maxSpeed: 0.25,
    minSize: 0.5,
    maxSize: 1.25,
    minOpacity: 0.25,
    maxOpacity: 0.55,
    lightness: 85
  },
  foamStreaks: {
    enabled: true,
    maxStreaks: 50000,
    chancePerFrame: 0.55,
    colorPrimary: 'rgba(235, 245, 255, 0.7)',
    colorSecondary: 'rgba(210, 230, 245, 0.5)',
    particle: {
      minSize: 0.5,
      maxSize: 1.5,
      minLifespan: 30,
      maxLifespan: 70,
      fadeRatio: 0.25,
      appearDelayPerParticle: 0.3,
      particlesPerSegmentPoint: 2
    },
    streak: {
      numParticlesMin: 50,
      numParticlesMax: 120,
      maxWidth: 15,
      segmentLengthMin: 5,
      segmentLengthMax: 12,
      lifespanMin: 500,
      lifespanMax: 1000,
      fadeDurationRatio: 0.2,
      driftXMin: 0.02,
      driftXMax: 0.12,
      driftYMin: 0.005,
      driftYMax: 0.05,
      wobbleFactor: 0.02,
      jaggedness: Math.PI / 4,
      mainPathSegmentsMin: 25,
      mainPathSegmentsMax: 100,
      branchChance: 0.25,
      subBranchMaxSegments: 10,
      subBranchAngleOffset: Math.PI / 3
    }
  }
};

// --- Background Gradient Defaults ---
export const DEFAULT_GRADIENT_SETTINGS = {
  color1: 'hsl(210, 70%, 50%)',
  color2: 'hsl(200, 68%, 50%)',
  directionChangeInterval: 60000,
  transitionDuration: 5000,
  directions: [
    { x1: 0, y1: 0, x2: 1, y2: 1 },
    { x1: 0.5, y1: 0, x2: 0.5, y2: 1 },
    { x1: 1, y1: 0, x2: 0, y2: 1 },
    { x1: 1, y1: 0.5, x2: 0, y2: 0.5 },
    { x1: 1, y1: 1, x2: 0, y2: 0 },
    { x1: 0.5, y1: 1, x2: 0.5, y2: 0 },
    { x1: 0, y1: 1, x2: 1, y2: 0 },
    { x1: 0, y1: 0.5, x2: 1, y2: 0.5 }
  ]
};

// --- Rare Sightings Defaults ---
export const DEFAULT_RARE_SIGHTINGS = {
  maxSightings: 4,
  checkInterval: 1000,
  configs: {
    plane: {
      minSpeed: 0.25,
      maxSpeed: 0.5,
      minSize: 25,
      maxSize: 45,
      baseOpacity: 0.4,
      minDuration: 10000,
      maxDuration: 20000,
      chancePerInterval: 0.01
    },
    whaleShadow: {
      minSpeed: 0.18,
      maxSpeed: 0.32,
      minSize: 40,
      maxSize: 70,
      baseOpacity: 0.5,
      minDuration: 1200,
      maxDuration: 2500,
      chancePerInterval: 0.09
    }
  }
};

// --- Interaction Defaults ---
export const DEFAULT_INTERACTION_SETTINGS = {
  mouseMoveThrottle: 30,
  longPressDuration: 400,
  longPressMoveThreshold: 10
};