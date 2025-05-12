/**
 * animationState.ts
 * 
 * This module centralizes the state management for all animated objects in the 
 * interactive background. It handles the creation, storage, retrieval, and pooling
 * of objects like ripples, glints, shimmer spots, etc., to optimize performance
 * by reducing garbage collection.
 */
import type { Ripple, ShimmerSpot, Glint, SunGlow, SunGlint, RareSighting, WaterGrain, FoamStreak, FoamParticle } from './types';

// --- ID Counters ---
// These counters ensure unique IDs for each new or reused animation object.
let rippleIdCounter = 0;
let shimmerSpotIdCounter = 0;
let glintIdCounter = 0;
let sunGlowIdCounter = 0;
let sunGlintIdCounter = 0;
let rareSightingIdCounter = 0;
let waterGrainIdCounter = 0;
let foamStreakIdCounter = 0;

// --- Active State Arrays ---
// These arrays hold all currently visible and active animation objects.
const activeRipples: Ripple[] = [];
const activeShimmerSpots: ShimmerSpot[] = [];
const activeGlints: Glint[] = [];
const activeSunGlows: SunGlow[] = [];
const activeSunGlints: SunGlint[] = [];
const activeRareSightings: RareSighting[] = [];
const activeWaterGrains: WaterGrain[] = [];
const activeFoamStreaks: FoamStreak[] = [];

// --- Inactive Object Pools ---
// These arrays store objects that have expired or been removed from the active state.
// They are reused to create new objects, reducing memory allocation and GC overhead.
const inactiveRipples: Ripple[] = [];
const inactiveGlints: Glint[] = [];
const inactiveSunGlints: SunGlint[] = [];
const inactiveRareSightings: RareSighting[] = [];
const inactiveFoamStreaks: FoamStreak[] = [];
const inactiveShimmerSpots: ShimmerSpot[] = []; // Add inactive pool for shimmer spots
const inactiveFoamParticles: FoamParticle[] = []; // Add inactive pool for foam particles
// TODO: Consider adding pools for ShimmerSpots and WaterGrains if they become expensive to create or have defined lifecycles.

// --- Getters ---
// Provide read-only access to the active object arrays. Modification should occur via add/release functions.

/** Returns the array of active Ripple objects. */
export const getRipples = (): Ripple[] => activeRipples;
/** Returns the array of active ShimmerSpot objects. */
export const getShimmerSpots = (): ShimmerSpot[] => activeShimmerSpots;
/** Returns the array of active Glint objects. */
export const getGlints = (): Glint[] => activeGlints;
/** Returns the array of active SunGlow objects. */
export const getSunGlows = (): SunGlow[] => activeSunGlows;
/** Returns the array of active SunGlint objects. */
export const getSunGlints = (): SunGlint[] => activeSunGlints;
/** Returns the array of active RareSighting objects. */
export const getRareSightings = (): RareSighting[] => activeRareSightings;
/** Returns the array of active WaterGrain objects. */
export const getWaterGrains = (): WaterGrain[] => activeWaterGrains;
/** Returns the array of active FoamStreak objects. */
export const getFoamStreaks = (): FoamStreak[] => activeFoamStreaks;

// --- Adders / Activators ---
// Functions to add new animation objects. They attempt to reuse objects from inactive pools first.

/**
 * Adds a new ripple to the animation or reuses one from the inactive pool.
 * @param props - Properties for the ripple, excluding the 'id'.
 */
export function addRipple(props: Omit<Ripple, 'id'>): void {
    let ripple: Ripple | undefined = inactiveRipples.pop(); // Try to get from pool

    if (ripple) {
        // Reset properties of the reused ripple
        ripple.x = props.x;
        ripple.y = props.y;
        ripple.radius = props.radius;
        ripple.maxRadius = props.maxRadius;
        ripple.opacity = props.opacity;
        ripple.speed = props.speed;
        ripple.lineWidth = props.lineWidth;
        ripple.color = props.color;
        ripple.isAmbient = props.isAmbient;
        ripple.decayRate = props.decayRate;
        ripple.id = rippleIdCounter++; // Assign new ID
    } else {
        // Pool was empty, create a new ripple object
        ripple = {
            ...props,
            id: rippleIdCounter++
        };
    }
    activeRipples.push(ripple);
}

/**
 * Adds a new shimmer spot to the animation.
 * Currently, ShimmerSpots are not pooled as they don't have a fixed lifecycle (they transform but don't expire).
 * @param props - Properties for the shimmer spot, excluding the 'id'.
 */
export function addShimmerSpot(props: Omit<ShimmerSpot, 'id'>): void {
    let spot: ShimmerSpot | undefined = inactiveShimmerSpots.pop();

    if (spot) {
        // Reset all properties of the reused spot
        spot.x = props.x;
        spot.y = props.y;
        spot.radius = props.radius;
        spot.currentMaxRadius = props.currentMaxRadius;
        spot.opacity = props.opacity;
        spot.growthSpeed = props.growthSpeed;
        spot.opacitySpeed = props.opacitySpeed;
        spot.color = props.color;
        spot.vx = props.vx;
        spot.vy = props.vy;
        spot.isWave = props.isWave;
        // Reset resize-related properties
        spot.relativeXInSpawn = props.relativeXInSpawn;
        spot.relativeYInSpawn = props.relativeYInSpawn;
        spot.baseVx = props.baseVx;
        spot.baseVy = props.baseVy;
        spot.id = shimmerSpotIdCounter++; // Assign new ID
    } else {
        // Pool was empty, create a new spot object
        spot = {
            ...props,
            id: shimmerSpotIdCounter++
        };
    }
    activeShimmerSpots.push(spot);
}

/**
 * Adds a new glint to the animation or reuses one from the inactive pool.
 * @param props - Properties for the glint, excluding the 'id'.
 */
export function addGlint(props: Omit<Glint, 'id'>): void {
    let glint: Glint | undefined = inactiveGlints.pop();

    if (glint) {
        glint.x = props.x;
        glint.y = props.y;
        glint.radius = props.radius;
        glint.opacity = props.opacity;
        glint.decay = props.decay;
        glint.color = props.color;
        glint.id = glintIdCounter++;
    } else {
        glint = {
            ...props,
            id: glintIdCounter++
        };
    }
    activeGlints.push(glint);
}

/**
 * Adds a new sun glow effect to the animation.
 * SunGlows are typically few (usually one) and persistent, so pooling is not currently implemented.
 * @param props - Properties for the sun glow, excluding the 'id'.
 */
export const addSunGlow = (props: Omit<SunGlow, 'id'>): void => {
    activeSunGlows.push({ ...props, id: sunGlowIdCounter++ });
    // TODO: Consider pooling if multiple SunGlows with lifecycles are introduced.
};

/**
 * Adds a new sun glint (particle from SunGlow) or reuses one from the inactive pool.
 * @param props - Properties for the sun glint, excluding the 'id'.
 */
export function addSunGlint(props: Omit<SunGlint, 'id'>): void {
    let sunGlint: SunGlint | undefined = inactiveSunGlints.pop();

    if (sunGlint) {
        sunGlint.x = props.x;
        sunGlint.y = props.y;
        sunGlint.radius = props.radius;
        sunGlint.opacity = props.opacity;
        sunGlint.decay = props.decay;
        sunGlint.color = props.color;
        sunGlint.id = sunGlintIdCounter++;
    } else {
        sunGlint = {
            ...props,
            id: sunGlintIdCounter++
        };
    }
    activeSunGlints.push(sunGlint);
}

/**
 * Adds a new rare sighting to the animation or reuses one from the inactive pool.
 * Handles resetting common and type-specific properties.
 * @param props - Properties for the rare sighting, excluding the 'id'.
 */
export function addRareSighting(props: Omit<RareSighting, 'id'>): void {
    let sighting: RareSighting | undefined = inactiveRareSightings.pop();

    if (sighting) {
        // Reset common properties
        sighting.type = props.type;
        sighting.x = props.x;
        sighting.y = props.y;
        sighting.vx = props.vx;
        sighting.vy = props.vy;
        sighting.size = props.size;
        sighting.opacity = props.opacity;
        sighting.age = 0; // Crucial: Reset age for reused objects
        sighting.maxAge = props.maxAge;
        
        // Reset type-specific properties for 'whaleShadow' if applicable,
        // and clear them if the reused object was a different type or props are not provided.
        if (props.type === 'whaleShadow') {
            sighting.bodyAngle = props.bodyAngle ?? 0;
            sighting.bodyAngleSpeed = props.bodyAngleSpeed;
            sighting.bodyAngleAmplitude = props.bodyAngleAmplitude;
            sighting.tailAngleOffset = props.tailAngleOffset ?? 0;
            sighting.tailOscillationSpeed = props.tailOscillationSpeed;
            sighting.tailOscillationAmplitude = props.tailOscillationAmplitude;
        } else {
            // Ensure properties specific to other types are cleared if reusing
            delete sighting.bodyAngle;
            delete sighting.bodyAngleSpeed;
            delete sighting.bodyAngleAmplitude;
            delete sighting.tailAngleOffset;
            delete sighting.tailOscillationSpeed;
            delete sighting.tailOscillationAmplitude;
        }
        sighting.id = rareSightingIdCounter++;
    } else {
        sighting = {
            ...props,
            age: 0, // Ensure age starts at 0 for new objects too
            id: rareSightingIdCounter++
        };
    }
    activeRareSightings.push(sighting);
}

/**
 * Adds a new water grain particle to the animation.
 * WaterGrains are persistent and numerous; pooling is not currently implemented but could be a future optimization.
 * @param props - Properties for the water grain, excluding the 'id'.
 */
export const addWaterGrain = (props: Omit<WaterGrain, 'id'>): void => {
    activeWaterGrains.push({ ...props, id: waterGrainIdCounter++ });
    // TODO: Implement pooling for WaterGrains if their creation/destruction becomes frequent or costly.
};

/**
 * Adds a new foam streak to the animation or reuses one from the inactive pool.
 * Handles resetting properties, including deep copying/resetting particles.
 * @param props - Properties for the foam streak, excluding the 'id'.
 */
export function addFoamStreak(props: Omit<FoamStreak, 'id'>): void {
    let streak: FoamStreak | undefined = inactiveFoamStreaks.pop();

    if (streak) {
        // Reset properties for reused streak
        streak.anchorX = props.anchorX;
        streak.anchorY = props.anchorY;
        // Deep copy/reset particles is crucial to avoid reusing old particle states.
        // A dedicated particle pool could further optimize this.
        streak.particles = []; 
        streak.vx = props.vx;
        streak.vy = props.vy;
        streak.opacity = 0; // Streaks typically fade in
        streak.age = 0;     // Reset age
        streak.maxAge = props.maxAge;
        streak.color = props.color;
        streak.id = foamStreakIdCounter++;
    } else {
        streak = {
            ...props,
            particles: [], 
            opacity: 0, // Start invisible, to be faded in
            age: 0,
            id: foamStreakIdCounter++
        };
    }
    activeFoamStreaks.push(streak);
}

/**
 * Adds a new foam particle or reuses one from the inactive pool.
 * IMPORTANT: This function MODIFIES the passed-in `streak` object by adding the particle to its `particles` array.
 * 
 * @param streak - The FoamStreak object to add the particle to.
 * @param props - Properties for the foam particle.
 */
export function addFoamParticle(streak: FoamStreak, props: FoamParticle): void {
    let particle: FoamParticle | undefined = inactiveFoamParticles.pop();

    if (particle) {
        // Reset properties of the reused particle
        particle.x = props.x;
        particle.y = props.y;
        particle.size = props.size;
        particle.opacity = 0; // Start invisible
        particle.initialRelativeX = props.initialRelativeX;
        particle.initialRelativeY = props.initialRelativeY;
        particle.appearAtAge = props.appearAtAge;
        particle.maxOpacity = props.maxOpacity;
        particle.particleAge = 0; // Reset age
        particle.particleMaxAge = props.particleMaxAge;
    } else {
        // Pool was empty, create a new particle object
        // Use the passed-in props directly, ensuring age/opacity are reset
        particle = {
            ...props,
            opacity: 0,
            particleAge: 0
        };
    }
    // Add the particle to the specific streak it belongs to
    streak.particles.push(particle);
}

// --- Releasers / Deactivators ---
// Functions to move objects from the active arrays to their respective inactive pools.

/**
 * Releases an active ripple, moving it to the inactive pool for reuse.
 * @param rippleToRelease - The ripple object to release.
 */
export function releaseRipple(rippleToRelease: Ripple): void {
    const index = activeRipples.findIndex(r => r.id === rippleToRelease.id);
    if (index !== -1) {
        const releasedRipple = activeRipples.splice(index, 1)[0];
        if (releasedRipple) {
            // Optional: Reset any specific properties here before pooling if necessary
            // e.g., releasedRipple.someVolatileProperty = null;
            inactiveRipples.push(releasedRipple);
        }
    } else {
        console.warn(`Attempted to release ripple with ID ${rippleToRelease.id} not found in active list.`);
    }
}

/**
 * Releases an active shimmer spot, moving it to the inactive pool for reuse.
 * @param spotToRelease - The shimmer spot object to release.
 */
export function releaseShimmerSpot(spotToRelease: ShimmerSpot): void {
    const index = activeShimmerSpots.findIndex(s => s.id === spotToRelease.id);
    if (index !== -1) {
        const releasedSpot = activeShimmerSpots.splice(index, 1)[0];
        if (releasedSpot) {
            // Optional: Reset any specific properties before pooling if needed
            inactiveShimmerSpots.push(releasedSpot);
        }
    } else {
        console.warn(`Attempted to release shimmerSpot with ID ${spotToRelease.id} not found in active list.`);
    }
}

/**
 * Releases the oldest active shimmer spot (the one at the beginning of the array)
 * and moves it to the inactive pool. Used to enforce MAX_SHIMMER_SPOTS limit.
 * @returns The released shimmer spot object, or null if the active list was empty.
 */
export function releaseOldestShimmerSpot(): ShimmerSpot | null {
    if (activeShimmerSpots.length > 0) {
        const oldestSpot = activeShimmerSpots.shift(); // Remove from the beginning
        if (oldestSpot) {
            inactiveShimmerSpots.push(oldestSpot); // Add to the inactive pool
            return oldestSpot;
        }
    }
    return null; // Return null if no spots were active
}

/**
 * Releases an active glint, moving it to the inactive pool for reuse.
 * @param glintToRelease - The glint object to release.
 */
export function releaseGlint(glintToRelease: Glint): void {
    const index = activeGlints.findIndex(g => g.id === glintToRelease.id);
    if (index !== -1) {
        const releasedGlint = activeGlints.splice(index, 1)[0];
        if (releasedGlint) {
            inactiveGlints.push(releasedGlint);
        }
    } else {
        console.warn(`Attempted to release glint with ID ${glintToRelease.id} not found in active list.`);
    }
}

/**
 * Releases an active sun glint, moving it to the inactive pool for reuse.
 * @param sunGlintToRelease - The sun glint object to release.
 */
export function releaseSunGlint(sunGlintToRelease: SunGlint): void {
    const index = activeSunGlints.findIndex(sg => sg.id === sunGlintToRelease.id);
    if (index !== -1) {
        const releasedSunGlint = activeSunGlints.splice(index, 1)[0];
        if (releasedSunGlint) {
            inactiveSunGlints.push(releasedSunGlint);
        }
    } else {
        console.warn(`Attempted to release sunGlint with ID ${sunGlintToRelease.id} not found in active list.`);
    }
}

/**
 * Releases an active rare sighting, moving it to the inactive pool for reuse.
 * @param sightingToRelease - The rare sighting object to release.
 */
export function releaseRareSighting(sightingToRelease: RareSighting): void {
    const index = activeRareSightings.findIndex(s => s.id === sightingToRelease.id);
    if (index !== -1) {
        const releasedSighting = activeRareSightings.splice(index, 1)[0];
        if (releasedSighting) {
            inactiveRareSightings.push(releasedSighting);
        }
    } else {
        console.warn(`Attempted to release rareSighting with ID ${sightingToRelease.id} not found in active list.`);
    }
}

/**
 * Releases an active foam particle, moving it to the inactive pool for reuse.
 * Note: This does NOT remove the particle from its parent streak's array. That must be handled separately.
 * 
 * @param particleToRelease - The foam particle object to release.
 */
export function releaseFoamParticle(particleToRelease: FoamParticle): void {
    // Optional: Add checks or limits for the inactive pool size if needed.
    // Reset any necessary properties before pooling, though addFoamParticle handles most resets.
    inactiveFoamParticles.push(particleToRelease);
}

/**
 * Releases an active foam streak, moving it to the inactive pool for reuse.
 * Also releases all its associated active particles back to the particle pool.
 * @param streakToRelease - The foam streak object to release.
 */
export function releaseFoamStreak(streakToRelease: FoamStreak): void {
    const index = activeFoamStreaks.findIndex(fs => fs.id === streakToRelease.id);
    if (index !== -1) {
        const releasedStreak = activeFoamStreaks.splice(index, 1)[0];
        if (releasedStreak) {
            // Release all associated particles back to their pool
            for (const particle of releasedStreak.particles) {
                releaseFoamParticle(particle);
            }
            // Clear the particles array on the streak object before pooling it
            releasedStreak.particles = []; 
            inactiveFoamStreaks.push(releasedStreak);
        }
    } else {
        console.warn(`Attempted to release foamStreak with ID ${streakToRelease.id} not found in active list.`);
    }
}

// Note: Direct array modification functions (like updateRipples, removeRippleById)
// were considered but are currently avoided to enforce state changes through the
// defined add/release patterns, which helps manage object pooling.
// Effect modules should operate on the arrays returned by getters and use release functions
// for removals, typically by iterating backwards through the arrays. 