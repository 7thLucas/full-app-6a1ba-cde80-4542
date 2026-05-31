# Driftholm — Product Specification

## Product Identity
- **Name:** Driftholm
- **Type:** Cozy 3D floating-island life-sim browser vertical slice
- **Platform:** Browser (desktop-first, modern Chromium/Firefox/Safari with WebGL2)
- **Scope:** Vertical slice — NOT a full game. A 3-minute experience that sells a vibe.

## North Star: The First-Load Reveal
The single most important deliverable. When the app boots:
1. Camera arcs in on a sunset floating-island diorama
2. Sky gradient blooms in purple/magenta/orange
3. Particles drift through the air
4. Trees sway, crystals float and rotate
5. Soft contact shadows ground the player
6. Player can *just be there* for ~3 seconds before any WASD input is needed

Everything else in the experience — lighting, postprocessing, fog, idle animations, shadows — exists to earn this 3-second window. If the reveal is not magical, the slice has failed.

## Users
- **Primary:** Gamedev-curious browser visitors who want to feel a cozy world for 30-60 seconds
- **Secondary:** Portfolio / demo audience evaluating R3F craftsmanship
- **Tertiary:** Cozy game enthusiasts (Animal Crossing, Stardew, A Short Hike fans)

## Brand & Tone
- **Mood:** Cozy, contemplative, gently magical, golden-hour wistful
- **Voice:** Soft, encouraging, low-stakes ("Take a breath. Explore.")
- **Personality:** A handmade diorama you can step inside

## Anti-References (what Driftholm is NOT)
- NOT realistic / photoreal — stylized, saturated, painterly
- NOT high-stakes — no combat, no failure states, no timers
- NOT a full game — no inventory persistence, no save system, no progression trees
- NOT a tech demo — postprocessing serves the mood, never the other way around
- NOT minimalist — the island should feel inhabited and dense with small joys

## Strategic Principles
1. **The reveal wins or loses everything.** Optimize the first 3 seconds above all else.
2. **Procedural-only geometry.** No external assets in v1. Boxes, spheres, cones, cylinders, tori — composed lovingly.
3. **Vibe over feature count.** One villager, one interaction loop, one quest is enough.
4. **Tuning is a first-class citizen.** Every magic number lives in `constants/tuning.ts` so the feel can be dialed in.
5. **Stylization is a stack.** Saturated palette + high-roughness materials + warm key light + bloom-on-crystals-only + SSAO + vignette = the look. Removing any layer breaks it.

## Core Feature Set (Vertical Slice)

### World
- Circular floating-island (radius ~12 units) hovering in a sunset sky
- Grass top surface, dirt underside that tapers to a point
- Winding dirt path
- Small pond with subtle reflection/refraction (or stylized flat color)
- 5-8 stylized trees (cone canopy + cylinder trunk) with gentle sway
- Cozy cottage (composed of boxes + pyramid roof + chimney + door + windows)
- Mailbox near the cottage
- Flower clusters (small bobbing spheres on stems)
- Scattered rocks (irregular low-poly clusters)
- 3 collectible fruits sitting on/near trees
- 2-3 floating crystals that drift and rotate (the bloom targets)

### Player
- Cute placeholder character: rounded capsule body + sphere head + simple eyes
- WASD movement (camera-relative)
- Shift to run (1.6x speed)
- Space to hop (impulse via Rapier)
- E to interact (when near interactable)
- Walk-bob idle animation
- Contact shadow underneath

### Camera
- Third-person follow
- Pitch: 35-45 degrees down
- Follow distance: 7-9 units
- Height: 4-6 units above player
- Smooth damping (lerp factor in tuning)
- Opening cinematic arc on load (~3 seconds)

### NPC
- At least one villager (similar stylized construction as player, different palette)
- Stands near the cottage or mailbox
- Idle bob animation
- Talkable via E when nearby — shows speech bubble via drei Html

### Interactables
- Mailbox: opens a small HUD note when interacted with
- Fruits: collectible — disappear with a sparkle when E pressed nearby
- Villager: dialogue line

### HUD
- Small quest bubble top-left or bottom-center
- Quest progression:
  1. "Explore the island"
  2. "Talk to the villager"
  3. "Collect 3 fruits"
- Subtle controls hint (WASD / Shift / Space / E)
- Minimal, non-intrusive — never blocks the diorama

### Lighting & Post
- Hemisphere light (sky cool / ground warm)
- Warm directional sun (low angle, golden-hour color)
- Soft PCF shadows
- sRGB output, ACES or cinematic tone mapping
- Postprocessing chain: Bloom (crystals only, via layers or selective), SSAO, Vignette, SMAA
- Subtle ground fog / atmospheric haze

### Idle Animations
- Trees: gentle sway driven by useFrame + sin(time)
- Flowers: small bob
- Crystals: float + rotate (drei Float)
- Player: walk-bob during movement, breath-bob when idle
- Particles: drifting sparkles (drei Sparkles)

## Out of Scope (v1)
- Inventory UI / persistence
- Save/load
- Day/night cycle (locked to sunset)
- Weather
- Multiple islands
- External assets (gltf, textures, audio in v1 — audio can come later)
- Mobile touch controls (desktop keyboard only in v1)

## Success Criteria
- First load shows the reveal arc without input
- WASD + Shift + Space + E all functional
- At least one full quest loop completable in under 90 seconds
- 60fps on a modern laptop integrated GPU at 1080p
- All tuning constants live in one file
- Zero external 3D assets — geometry is procedural


#CORE TRUTH:
# Driftholm — Cozy 3D Floating-Island Vertical Slice

## App Name
**Driftholm** — a coined place-name (drift = floating, holm = small island, Old Norse). Original IP, scans as a real cozy indie game title, no Nintendo-adjacent baggage.

## The Problem We're Solving
Prove that QuantumByte can ship **cozy, polished, game-feel UX** — not just CRUD/dashboards — via a browser-based 3D vertical slice. Most browser 3D feels like a stiff tech demo; Driftholm has to feel like a real cozy life-sim on first load.

## Target Audience
Two audiences, both judging on *feel* in the first 3 seconds:
1. **Enthusiast gamers** — people who play and judge cozy life-sim games (Animal Crossing, Cozy Grove, A Short Hike crowd).
2. **Investors** — evaluating whether QuantumByte can ship polished game-feel UX beyond CRUD/dashboards.

## The P0 Moment (north star)
**The first-load reveal.** When the app boots: camera arcs in on the sunset floating-island diorama, sky blooming in purple/magenta/orange, particles drifting, trees gently swaying, crystals floating and rotating, soft contact shadows under the player. The player can just *be there* for ~3 seconds before WASD ever happens.

This is the moment that earns every postprocessing pass. Everything downstream (lighting, fog, idle animations, soft shadows, bloom on crystals) exists to land this 3-second window.

## Visual Direction
Dreamy tiny floating island / mini-planet diorama:
- Low-poly but premium, not cheap
- Soft rounded hills, stylized grass, tiny trees, cute houses, flowers, rocks, paths, water edge
- Sunset / twilight sky gradient: purple, magenta, orange
- Floating magical crystals / little planets / particles in the sky
- Cozy whimsical mood, toy-world-in-space
- Subtle rain/star streaks or floating particles for atmosphere
- Procedural geometry first — no external assets in v1

## Tech Stack
- Vite + React + TypeScript
- @react-three/fiber (3D scene)
- @react-three/drei (helpers, camera, Html labels, ContactShadows, Float, Sparkles)
- @react-three/rapier (physics + character collision)
- @react-three/postprocessing (Bloom, SSAO/ambient occlusion, vignette, SMAA)

## Vertical-Slice Scope (NOT a full game)

### Core gameplay
1. Small playable 3D island scene
2. Cute placeholder player character (simple rounded geometry)
3. WASD movement (camera-relative — W = toward where the camera looks)
4. Shift = run
5. Space = hop / jump if grounded
6. E = interact with nearby NPC / object
7. Third-person follow camera that feels easy, not dizzy

### Camera tuning (in `constants/tuning.ts`)
- Default angle: 35–45° downward
- Follow distance: 7–9 units
- Height: 4–6 units
- Smooth damping / lerp (no sudden snaps)
- Optional mouse drag or Q/E to rotate camera

### HUD
Small quest bubble / UI overlay with rotating prompts:
- "Explore the island"
- "Talk to the villager"
- "Collect 3 fruits"

## Rendering Requirements

### Lighting
- Hemisphere light (soft ambient sky/ground)
- One warm directional sun light with soft shadows
- Optional rim/fill light
- Shadows enabled, sRGB color output, cinematic tone mapping
- Soft contact shadows under characters and objects

### Materials
Stylized `meshStandardMaterial`:
- High roughness, low/no metalness
- Saturated but harmonious palette

### Postprocessing
- Subtle bloom only on magical crystals / stars
- Subtle ambient occlusion
- Light vignette
- Anti-aliasing (SMAA)

### Atmosphere
- Fog or atmospheric haze for depth
- Must look good immediately on first load

## World Design
Circular floating island / curved diorama with layered terrain:
- Grass main area
- Dirt path
- Small pond / water edge
- Trees, house, mailbox/signpost, flowers, rocks
- Collectible fruits
- Use instancing or reusable components for repeated objects

### Idle animations
- Trees sway gently
- Flowers bob slightly
- Crystals float and rotate
- Player walking bob animation

## Code Architecture
```
App.tsx
components/
  Scene.tsx
  PlayerController.tsx
  FollowCamera.tsx
  Island.tsx
  Environment.tsx
  NPC.tsx
  Interactables.tsx
  HUD.tsx
hooks/useKeyboard.ts
constants/tuning.ts
```

## Tuning Constants (expose in `constants/tuning.ts`)
- Movement speed, run speed
- Camera distance, camera height, damping
- Shadow strength, bloom intensity
- Color palette (sunset gradient stops)

## Acceptance Criteria
- Beautiful cozy 3D tiny island visible on first load
- WASD movement feels smooth
- Camera follows nicely — feels like a polished game, not a tech demo
- At least one NPC + one interactable object
- Soft shadows, harmonious colors, atmospheric sky, subtle postprocessing
- Performant on a normal laptop browser

## Build Posture
Make v1 **visually impressive before adding many gameplay systems**. Clean modular code, sensible defaults, comments explaining camera/lighting/render tuning, npm install + local run instructions.