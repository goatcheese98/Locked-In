<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { Ripple, ShimmerSpot, Glint, SunGlow, SunGlint, RareSighting, WaterGrain, FoamParticle, FoamStreak } from './background/types';
  import {
    RIPPLE_CONFIG, AMBIENT_RIPPLE_INTERVAL, MAX_SHIMMER_SPOTS, MAX_GLINTS, GLINT_CHANCE,
    MOUSE_MOVE_THROTTLE, LONG_PRESS_DURATION, LONG_PRESS_MOVE_THRESHOLD, SUN_GLOW_PULSE_SPEED_MIN,
    SUN_GLOW_PULSE_SPEED_MAX, MAX_SUN_GLINTS, TARGET_GLINTS_TO_SPAWN_AT_BASE_OPACITY,
    TARGET_GLINTS_TO_SPAWN_AT_PEAK_OPACITY, SUN_GLINT_COLOR, MAX_RARE_SIGHTINGS,
    RARE_SIGHTING_CHECK_INTERVAL, NUM_WAVE_SHIMMER_SPOTS, WAVE_SHIMMER_MIN_OPACITY,
    WAVE_SHIMMER_MAX_OPACITY, WAVE_SHIMMER_MIN_SPEED_FACTOR, WAVE_SHIMMER_MAX_SPEED_FACTOR,
    WAVE_SHIMMER_COLOR_LIGHTNESS_MIN, WAVE_SHIMMER_COLOR_LIGHTNESS_MAX, SHIMMER_SPAWN_AREA_WIDTH_RATIO,
    SHIMMER_SPAWN_AREA_HEIGHT_RATIO, SHIMMER_RESIZE_MIN_SPEED_MULTIPLIER, SHIMMER_RESIZE_MAX_SPEED_MULTIPLIER,
    NUM_WATER_GRAINS, GRAIN_MIN_SPEED, GRAIN_MAX_SPEED, GRAIN_MIN_SIZE, GRAIN_MAX_SIZE, GRAIN_MIN_OPACITY,
    GRAIN_MAX_OPACITY, GRADIENT_DIRECTION_CHANGE_INTERVAL, GRADIENT_TRANSITION_DURATION, GRADIENT_DIRECTIONS,
    MAX_FOAM_STREAKS, FOAM_STREAK_CHANCE_PER_FRAME, FOAM_STREAK_COLOR_PRIMARY, FOAM_STREAK_COLOR_SECONDARY,
    FOAM_PARTICLE_MIN_SIZE, FOAM_PARTICLE_MAX_SIZE, FOAM_STREAK_NUM_PARTICLES_MIN, FOAM_STREAK_NUM_PARTICLES_MAX,
    FOAM_STREAK_MAX_WIDTH, FOAM_STREAK_SEGMENT_LENGTH_MIN, FOAM_STREAK_SEGMENT_LENGTH_MAX, FOAM_STREAK_LIFESPAN_MIN,
    FOAM_STREAK_LIFESPAN_MAX, FOAM_STREAK_FADE_DURATION_RATIO, FOAM_STREAK_DRIFT_X_MIN, FOAM_STREAK_DRIFT_X_MAX,
    FOAM_STREAK_DRIFT_Y_MIN, FOAM_STREAK_DRIFT_Y_MAX, FOAM_STREAK_WOBBLE_FACTOR, FOAM_PARTICLE_APPEAR_DELAY_PER_PARTICLE,
    FOAM_STREAK_JAGGEDNESS, FOAM_STREAK_MAIN_PATH_SEGMENTS_MIN, FOAM_STREAK_MAIN_PATH_SEGMENTS_MAX, FOAM_BRANCH_CHANCE,
    FOAM_SUB_BRANCH_MAX_SEGMENTS, FOAM_SUB_BRANCH_ANGLE_OFFSET, FOAM_PARTICLES_PER_SEGMENT_POINT, FOAM_PARTICLE_LIFESPAN_MIN,
    FOAM_PARTICLE_LIFESPAN_MAX, FOAM_PARTICLE_FADE_RATIO, RARE_SIGHTING_CONFIGS
  } from './background/constants';
  import { easeInOutQuad, getWarpOffset } from './background/utils';
  import {
    addShimmerSpot, addSunGlow, addSunGlint, addWaterGrain, addFoamStreak,
    getShimmerSpots, getSunGlows, getSunGlints, getRareSightings, getWaterGrains, getFoamStreaks
  } from './background/animationState';
  import { createRipple, updateAndDrawRipples } from './background/effects/ripples';
  import {
    createShimmerSpot,
    updateAndDrawShimmerSpots,
    handleResizeShimmerSpots
  } from './background/effects/shimmerSpots';
  import {
    createSunGlow as createSunGlowEffect,
    updateAndDrawSunGlows,
    updateAndDrawSunGlints,
    handleResizeSunGlows
  } from './background/effects/sunGlow';
  import {
    createGlint as createGlintEffect,
    updateAndDrawGlints as updateAndDrawGlintsEffect
  } from './background/effects/glints';
  import {
    createRareSighting as createRareSightingEffect,
    updateAndDrawRareSightings as updateAndDrawRareSightingsEffect
  } from './background/effects/rareSightings';
  import {
    initializeWaterGrains as initializeWaterGrainsEffect,
    updateAndDrawWaterGrains as updateAndDrawWaterGrainsEffect,
    handleResizeWaterGrains
  } from './background/effects/waterGrains';
  import {
    createFoamStreak as createFoamStreakEffect,
    updateAndDrawFoamStreaks as updateAndDrawFoamStreaksEffect
  } from './background/effects/foamStreaks';

  export let gradientColor1: string = 'hsl(210, 70%, 25%)'; // Default Color 1
  export let gradientColor2: string = 'hsl(200, 68%, 27%)'; // Default Color 2

  let canvasRef: HTMLCanvasElement;
  // To help TypeScript and linters, we'll use local non-null vars inside functions after checks

  let animationFrameId: number;
  let globalTime = 0; // For global animations like warping

  // Dynamic Gradient State
  let currentGradientAngleIndex = 0; // Start with Top-Left to Bottom-Right
  let targetGradientAngleIndex = 0;
  let gradientTransitionProgress = 1; // Start fully at the initial angle
  let lastGradientDirectionChangeTime = 0;
  let interpolatedGradientCoords = { ...GRADIENT_DIRECTIONS[0] }; // Initial coordinates
  let gradientTransitionStartTime = 0;

  onMount(() => {
    const canvas = canvasRef; 
    if (!canvas) { console.error("Canvas not available onMount"); return; }
    // console.log(`[onMount Start] Canvas: ${canvas.width}x${canvas.height}`); // Log at start of onMount - remove, resizeCanvas will log
    const ctx = canvas.getContext('2d');
    if (!ctx) { console.error("Context not available onMount"); return; }

    resizeCanvas(); // Ensure canvas dimensions are set first
    console.log(`[onMount after initial resize] Canvas: ${canvas.width}x${canvas.height}`);

    let lastMouseMoveTime = 0;
    let mouseDownTime = 0; 
    let mouseDownPos: { x: number, y: number } | null = null;
    let ambientRippleIntervalId: number | undefined; 
    let isDraggingBeyondThreshold = false; // New flag

    let timeSinceLastSightingAttempt = 0;

    // --- HELPER & DRAWING FUNCTIONS (NOW INSIDE ONMOUNT, USING LOCAL CTX & CANVAS) ---
    function createShimmerSpotInternal(isWaveType: boolean) {
        if (!ctx || !canvas) return;

        let spotSize: number;
        let initialVx: number;
        let initialVy: number;
        let opacity: number;
        let growthSpeed: number;
        let opacitySpeedValue: number;
        let color: string;
        let speedFactor = 1;

        const spawnMinX = canvas.width * (1 - SHIMMER_SPAWN_AREA_WIDTH_RATIO) / 2;
        const spawnWidth = canvas.width * SHIMMER_SPAWN_AREA_WIDTH_RATIO;
        const spawnMinY = canvas.height * (1 - SHIMMER_SPAWN_AREA_HEIGHT_RATIO) / 2;
        const spawnHeight = canvas.height * SHIMMER_SPAWN_AREA_HEIGHT_RATIO;

        const xPos = spawnMinX + Math.random() * spawnWidth;
        const yPos = spawnMinY + Math.random() * spawnHeight;

        if (isWaveType) {
            spotSize = (Math.min(canvas.width, canvas.height) / 2) * (0.8 + Math.random() * 0.4);
            speedFactor = WAVE_SHIMMER_MIN_SPEED_FACTOR + Math.random() * (WAVE_SHIMMER_MAX_SPEED_FACTOR - WAVE_SHIMMER_MIN_SPEED_FACTOR);
            initialVx = (Math.random() - 0.5) * 0.2 * speedFactor;
            initialVy = (Math.random() - 0.5) * 0.2 * speedFactor;
            opacity = WAVE_SHIMMER_MIN_OPACITY + Math.random() * (WAVE_SHIMMER_MAX_OPACITY - WAVE_SHIMMER_MIN_OPACITY);
            growthSpeed = (Math.random() * 0.015 + 0.005) * (Math.random() < 0.5 ? 1 : -1) * speedFactor;
            opacitySpeedValue = (Math.random() * 0.00015 + 0.00005) * (Math.random() < 0.5 ? 1 : -1) * speedFactor;
            color = `hsl(210, ${68 + Math.random()*10}%, ${WAVE_SHIMMER_COLOR_LIGHTNESS_MIN + Math.random()*(WAVE_SHIMMER_COLOR_LIGHTNESS_MAX - WAVE_SHIMMER_COLOR_LIGHTNESS_MIN)}%)`;
        } else {
            spotSize = Math.random() * 80 + 40;
            initialVx = (Math.random() - 0.5) * 0.12;
            initialVy = (Math.random() - 0.5) * 0.12;
            opacity = Math.random() * 0.03 + 0.01;
            growthSpeed = (Math.random() * 0.02 + 0.01) * (Math.random() < 0.5 ? 1 : -1);
            opacitySpeedValue = (Math.random() * 0.0002 + 0.0001) * (Math.random() < 0.5 ? 1 : -1);
            color = `hsl(${200 + Math.random() * 20}, ${65 + Math.random()*20}%, ${35 + Math.random()*30}%)`;
        }

        addShimmerSpot({
            x: xPos,
            y: yPos,
            radius: Math.random() * spotSize * 0.3 + spotSize * 0.2,
            currentMaxRadius: spotSize,
            opacity: opacity,
            growthSpeed: growthSpeed,
            opacitySpeed: opacitySpeedValue,
            color: color,
            vx: initialVx,
            vy: initialVy,
            isWave: isWaveType,
            relativeXInSpawn: (xPos - spawnMinX) / spawnWidth,
            relativeYInSpawn: (yPos - spawnMinY) / spawnHeight,
            baseVx: initialVx,
            baseVy: initialVy
        });
    }

    // --- Background Warping Parameters ---
    const warpStrength = 15; // Increased for more pronounced warping
    const warpScale = 0.04; // How coarse the warping is (keeping this for now)

    function updateDynamicGradient() {
      const now = Date.now();
      if (lastGradientDirectionChangeTime === 0) { // Initialize first time
        lastGradientDirectionChangeTime = now;
        gradientTransitionStartTime = now; 
        // Start transition to the next angle in sequence
        targetGradientAngleIndex = (currentGradientAngleIndex + 1) % GRADIENT_DIRECTIONS.length;
        gradientTransitionProgress = 0;
      }

      // Check if it's time to pick a new target direction and current transition is complete
      if (now - lastGradientDirectionChangeTime >= GRADIENT_DIRECTION_CHANGE_INTERVAL && gradientTransitionProgress >= 1) {
        currentGradientAngleIndex = targetGradientAngleIndex; // Current transition target is now the stable one
        // Set next target in clockwise sequence
        targetGradientAngleIndex = (currentGradientAngleIndex + 1) % GRADIENT_DIRECTIONS.length;
        gradientTransitionProgress = 0; // Reset progress for the new transition
        lastGradientDirectionChangeTime = now; // Record time of this direction change decision
        gradientTransitionStartTime = now; // Start the new transition timing
      }

      if (gradientTransitionProgress < 1) {
        const elapsedTransitionTime = now - gradientTransitionStartTime;
        gradientTransitionProgress = Math.min(1, elapsedTransitionTime / GRADIENT_TRANSITION_DURATION);
        
        const easedProgress = easeInOutQuad(gradientTransitionProgress);

        const currentCoords = GRADIENT_DIRECTIONS[currentGradientAngleIndex];
        const targetCoords = GRADIENT_DIRECTIONS[targetGradientAngleIndex];

        interpolatedGradientCoords.x1 = currentCoords.x1 + (targetCoords.x1 - currentCoords.x1) * easedProgress;
        interpolatedGradientCoords.y1 = currentCoords.y1 + (targetCoords.y1 - currentCoords.y1) * easedProgress;
        interpolatedGradientCoords.x2 = currentCoords.x2 + (targetCoords.x2 - currentCoords.x2) * easedProgress;
        interpolatedGradientCoords.y2 = currentCoords.y2 + (targetCoords.y2 - currentCoords.y2) * easedProgress;
      } else {
        // Ensure it snaps to target if transition is done
        interpolatedGradientCoords = { ...GRADIENT_DIRECTIONS[targetGradientAngleIndex] };
        currentGradientAngleIndex = targetGradientAngleIndex; // Update current index once stable
      }
    }

    // --- Event Handlers (now local to onMount) ---
    const handleMouseMove = (event: MouseEvent) => {
      if (mouseDownPos) { 
        if (!isDraggingBeyondThreshold) {
            const dx = event.pageX - mouseDownPos.x;
            const dy = event.pageY - mouseDownPos.y;
            if (Math.sqrt(dx*dx + dy*dy) > LONG_PRESS_MOVE_THRESHOLD) {
                isDraggingBeyondThreshold = true;
            }
        }

        const n = Date.now(); 
        if (n - lastMouseMoveTime > MOUSE_MOVE_THROTTLE) {
          createRipple(event.pageX, event.pageY, 'mouseMove'); 
          lastMouseMoveTime = n;
        }
      } else {
      }
    };

    const handleMouseDown = (event: MouseEvent) => {
      mouseDownTime = Date.now();
      mouseDownPos = { x: event.pageX, y: event.pageY };
      isDraggingBeyondThreshold = false;
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (!mouseDownPos || mouseDownTime === 0) { 
        return;
      }

      const pressDuration = Date.now() - mouseDownTime;
      if (!isDraggingBeyondThreshold) { 
        if (pressDuration >= LONG_PRESS_DURATION) {
          createRipple(event.pageX, event.pageY, 'longPress');
        } else {
          createRipple(event.pageX, event.pageY, 'mouseMove');
        }
      }
      
      mouseDownPos = null;
      mouseDownTime = 0;
      isDraggingBeyondThreshold = false;
    };
    
    const tryCreateAmbientRipple = () => { 
        if (!canvas) return; 
        createRipple(Math.random() * canvas.width, Math.random() * canvas.height, 'ambient'); 
    };

    // --- Setup & Animation Loop ---
    function resizeCanvas() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      console.log(`[resizeCanvas] Canvas: ${canvas.width}x${canvas.height}`);
      
      // Call the dedicated resize handler for shimmer spots
      handleResizeShimmerSpots(canvas.width, canvas.height);
      
      // Call the dedicated resize handler for sun glows
      handleResizeSunGlows(canvas.width, canvas.height);

      // Call the dedicated resize handler for water grains
      handleResizeWaterGrains(canvas.width, canvas.height);
    }
    window.addEventListener('resize', resizeCanvas);
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    if (typeof window !== 'undefined') { 
        ambientRippleIntervalId = window.setInterval(tryCreateAmbientRipple, AMBIENT_RIPPLE_INTERVAL);
    }

    // Initialize effects
    // Use the imported createShimmerSpot and pass canvas dimensions
    if (canvas) { // Ensure canvas is available
        for(let k=0; k < MAX_SHIMMER_SPOTS - NUM_WAVE_SHIMMER_SPOTS; k++) createShimmerSpot(canvas.width, canvas.height, false);
        for(let k=0; k < NUM_WAVE_SHIMMER_SPOTS; k++) createShimmerSpot(canvas.width, canvas.height, true);
        // Use the imported createSunGlowEffect
        createSunGlowEffect(canvas.width, canvas.height);
        // Use the imported initializeWaterGrainsEffect
        initializeWaterGrainsEffect(canvas.width, canvas.height);
    }
    
    console.log(`[onMount End] Canvas: ${canvas.width}x${canvas.height}, ShimmerSpots: ${getShimmerSpots().length}, Grains: ${getWaterGrains().length}, SunGlows: ${getSunGlows().length}`);

    function animate() {
      if (!ctx || !canvas) { animationFrameId = requestAnimationFrame(animate); return; } 
      globalTime += 0.002; 
      updateDynamicGradient(); 
      
      // Draw background gradient
      const gradX1 = interpolatedGradientCoords.x1 * canvas.width;
      const gradY1 = interpolatedGradientCoords.y1 * canvas.height;
      const gradX2 = interpolatedGradientCoords.x2 * canvas.width;
      const gradY2 = interpolatedGradientCoords.y2 * canvas.height;
      const gradient = ctx.createLinearGradient(gradX1, gradY1, gradX2, gradY2);
      gradient.addColorStop(0, gradientColor1);
      gradient.addColorStop(1, gradientColor2);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // ---

      updateAndDrawRipples(ctx);
      updateAndDrawShimmerSpots(ctx, canvas.width, canvas.height, globalTime); // Call new function
      // Call imported water grain update function
      updateAndDrawWaterGrainsEffect(ctx, canvas.width, canvas.height);
      updateAndDrawSunGlows(ctx);   
      updateAndDrawSunGlints(ctx);  
      
      const FRAME_TIME_MS = 16.67; 
      timeSinceLastSightingAttempt += FRAME_TIME_MS;
      if (timeSinceLastSightingAttempt >= RARE_SIGHTING_CHECK_INTERVAL) {
          for (const typeKey in RARE_SIGHTING_CONFIGS) {
            const sightingType = typeKey as keyof typeof RARE_SIGHTING_CONFIGS;
            const config = RARE_SIGHTING_CONFIGS[sightingType];
            if (typeof config.chancePerInterval === 'number' && Math.random() < config.chancePerInterval) {
                if (getRareSightings().length < MAX_RARE_SIGHTINGS) { 
                    // Use imported function
                    createRareSightingEffect(canvas.width, canvas.height, sightingType);
                }
            }
        }
        timeSinceLastSightingAttempt = 0; 
      }
      // Use imported function
      updateAndDrawRareSightingsEffect(ctx, canvas.width, canvas.height);

      if (Math.random() < GLINT_CHANCE) createGlintEffect(canvas.width, canvas.height);
      const ripplesFromGlints = updateAndDrawGlintsEffect(ctx);
      ripplesFromGlints.forEach(pos => createRipple(pos.x, pos.y, 'glintExpire'));

      // Foam streak creation
      if (Math.random() < FOAM_STREAK_CHANCE_PER_FRAME && getFoamStreaks().length < MAX_FOAM_STREAKS) {
        // Use imported function
        createFoamStreakEffect(canvas.width, canvas.height);
      }
      // Update/Draw Foam Streaks
      updateAndDrawFoamStreaksEffect(ctx, canvas.width, canvas.height);

      animationFrameId = requestAnimationFrame(animate);
    }
    
    animate(); // Start animation after setup

    return () => { 
        window.removeEventListener('resize', resizeCanvas);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
        if (ambientRippleIntervalId) clearInterval(ambientRippleIntervalId);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  });

</script>

<canvas bind:this={canvasRef} class="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"></canvas>

<style>
  body {
    user-select: none; /* Attempt to prevent text selection globally for better long-press experience */
    -webkit-user-select: none;
    -ms-user-select: none;
  }
  canvas {
    /* background-color: rgba(20,20,20,0.05); */ /* Optional tint for dev */
  }
</style> 