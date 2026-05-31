/**
 * Driftholm — Tuning Constants
 *
 * Every magic number that affects "feel" lives here. The visual identity
 * of the slice is the *combination* of these values. Tweaking one tends
 * to break the diorama mood — adjust cautiously.
 *
 * Anything color/UI-string related comes from the configurables module
 * via useConfigurables(). This file is for *physics-of-the-feel* numbers
 * (speeds, damping, FOV, postprocessing tweaks, geometry sizes).
 */

export const TUNING = {
  // ── Player movement ─────────────────────────────────────────────────
  player: {
    walkSpeed: 4.2,         // units / second
    runMultiplier: 1.6,     // shift = walkSpeed * runMultiplier
    jumpImpulse: 6.5,       // y impulse on Space when grounded
    turnLerp: 0.18,         // facing rotation smoothing
    height: 1.6,            // capsule height
    radius: 0.4,            // capsule radius
    walkBobAmplitude: 0.08,
    walkBobFrequency: 7.5,  // tied to speed feel
    idleBreathAmplitude: 0.02,
    idleBreathFrequency: 0.8, // Hz
  },

  // ── Follow camera ───────────────────────────────────────────────────
  camera: {
    fov: 50,                // tighter than default → diorama feel
    distance: 8,            // follow distance (7-9 sweet spot)
    height: 5,              // above player (4-6 sweet spot)
    pitchDegrees: 38,       // 35-45 sweet spot
    positionLerp: 0.08,     // higher = snappier
    lookAtLerp: 0.12,
    // Opening cinematic arc
    introDurationSec: 3.0,  // user-promised reveal window
    introStartHeight: 14,
    introStartDistance: 16,
    introStartAngle: Math.PI * 0.85, // orbit start (radians)
  },

  // ── Island geometry ─────────────────────────────────────────────────
  island: {
    radius: 12,
    grassThickness: 0.6,
    underHeight: 7.4,       // dirt cone height (grass + underside ≈ 8)
    pondPosition: [4.5, 0.05, -3.2] as [number, number, number],
    pondRadius: 1.6,
  },

  // ── Postprocessing ──────────────────────────────────────────────────
  post: {
    bloomLuminanceThreshold: 0.78,
    bloomLuminanceSmoothing: 0.25,
    bloomKernelSize: 4,     // 0..5 (LARGE = 4)
    vignetteOffset: 0.5,
    vignetteDarkness: 0.55,
    ssaoIntensity: 12,
    ssaoRadius: 0.15,
  },

  // ── Atmosphere ──────────────────────────────────────────────────────
  atmosphere: {
    fogNear: 18,
    fogFar: 55,
    hemisphereIntensity: 0.55,
    hemisphereSkyColor: "#FFB088",
    hemisphereGroundColor: "#3D5C42",
    sunPosition: [10, 14, 6] as [number, number, number],
    sunColor: "#FFC988",
  },

  // ── Idle animations ─────────────────────────────────────────────────
  motion: {
    treeSwayAmplitude: 0.04,  // radians
    treeSwayFrequency: 0.6,   // Hz
    flowerBobAmplitude: 0.05,
    flowerBobFrequency: 1.2,
    crystalFloatSpeed: 1.2,
    crystalRotationIntensity: 1.0,
    crystalFloatIntensity: 1.5,
  },

  // ── Interaction ─────────────────────────────────────────────────────
  interaction: {
    talkRange: 2.6,
    pickupRange: 1.8,
    mailboxRange: 2.2,
  },

  // ── Sparkles particle field ─────────────────────────────────────────
  particles: {
    sparklesCount: 60,
    sparklesScale: 14,
    sparklesSize: 2.5,
    sparklesSpeed: 0.3,
  },

  // ── Sky gradient stops (used by procedural shader sky) ──────────────
  // These are *fallback* values; if configurables.skyPalette is set
  // it overrides these.
  skyFallback: {
    zenith: "#5B2A86",
    mid: "#C0408C",
    horizon: "#FF8A5C",
    sun: "#FFD27A",
    fog: "#E8A4C9",
  },

  // ── Ground / world color fallbacks (also configurable) ──────────────
  groundFallback: {
    grass: "#7BC86C",
    grassShadow: "#4F8F4A",
    dirtPath: "#B58968",
    dirtUnderside: "#6E4A35",
    pondWater: "#5BB3C9",
    rock: "#8A8597",
  },

  magicFallback: {
    crystal: "#A6E8FF",
    sparkles: "#FFE0A6",
    fruit: "#FF6B5C",
    fruitHighlight: "#FFB55C",
  },
} as const;

export type TuningType = typeof TUNING;
