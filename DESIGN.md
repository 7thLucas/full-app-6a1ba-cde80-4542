# Driftholm — Design Guidelines

## Design Philosophy
A handcrafted sunset diorama you can step inside. Every surface is stylized, every light is warm, every motion is gentle. The screen should feel like a painted miniature lit by golden hour — saturated but soft, dense but readable, magical but grounded.

## The Look (Visual Pillars)
1. **Saturated painterly palette** — purples, magentas, oranges, teals, warm greens
2. **Matte stylized materials** — high roughness (0.7-0.95), zero metalness, gentle color variation
3. **Warm key light + cool fill** — golden directional sun + cool hemisphere ambient
4. **Selective bloom** — only crystals bloom; the world is matte
5. **Gentle motion everywhere** — nothing is static, but nothing is fast

## Color Palette

### Sky & Atmosphere
- Sky top (zenith): `#5B2A86` (deep violet)
- Sky mid: `#C0408C` (magenta)
- Sky horizon: `#FF8A5C` (warm orange)
- Sun disc: `#FFD27A` (soft gold)
- Fog tint: `#E8A4C9` (dusty pink)

### Island Surfaces
- Grass primary: `#7BC86C` (saturated cozy green)
- Grass shadow: `#4F8F4A`
- Dirt path: `#B58968` (warm earth)
- Dirt underside: `#6E4A35` (deeper earth)
- Pond water: `#5BB3C9` with low alpha
- Rock: `#8A8597` (cool stone)

### Foliage
- Tree canopy base: `#4FA86A`
- Tree canopy alt: `#3D8F58`
- Tree trunk: `#6B4226`
- Flower red: `#E94C5A`
- Flower yellow: `#F4C24A`
- Flower violet: `#A769D9`

### Architecture
- Cottage wall: `#F0D9B5` (cream)
- Cottage trim: `#7A4B30`
- Roof: `#C44949` (warm red)
- Chimney: `#8A6750`
- Mailbox body: `#3D6BB0`
- Mailbox flag: `#E94C5A`

### Characters
- Player body: `#F4C9A6` (warm peach)
- Player accent: `#5B7CC7` (calm blue)
- Villager body: `#E0B68F`
- Villager accent: `#9F5BB7` (plum)

### Magical Accents
- Crystal: `#A6E8FF` (cyan glow base, used as emissive for bloom)
- Sparkles: `#FFE0A6` (warm gold)
- Fruit: `#FF6B5C` (vibrant berry)
- Fruit highlight: `#FFB55C`

## Typography (UI)
- HUD font: system-ui / Inter / -apple-system stack
- Quest text: 14-16px, semibold, white with subtle text-shadow
- Speech bubble: 13-14px, dark slate `#2A2438` on cream `#FBF4E4`
- Controls hint: 11-12px, white at 60% opacity
- Letter spacing: slightly loose (0.01-0.02em) for cozy feel

## Lighting Recipe
- **Hemisphere:** sky color `#FFB088`, ground color `#3D5C42`, intensity 0.55
- **Directional sun:** color `#FFC988`, intensity 1.8, position [10, 14, 6], castShadow, shadow.mapSize [2048, 2048], shadow.bias -0.0005
- **Ambient nudge:** none (rely on hemisphere)
- **Tone mapping:** ACESFilmic, exposure 1.05
- **Output:** sRGB encoding

## Postprocessing Stack (in order)
1. SSAO — radius 0.15, intensity 12, samples 16 (subtle, grounds objects)
2. Bloom — intensity 0.9, luminanceThreshold 0.85, mipmapBlur, applied selectively to crystals via emissive
3. Vignette — offset 0.5, darkness 0.55
4. SMAA — for clean edges without TAA overhead

## Materials Rule
- Default: `meshStandardMaterial` with `roughness: 0.85, metalness: 0.0`
- Foliage: roughness 0.95
- Water: roughness 0.2, transparent, opacity 0.7
- Crystals: emissive equals base color, emissiveIntensity 1.5-2.5 (bloom magnet)

## Camera & Motion Feel
- Opening arc: 3.0s ease-in-out, from high-orbit to follow position
- Follow lerp: position lerp 0.08, look-at lerp 0.12
- Pitch: 38 degrees down
- Distance: 8 units
- Height: 5 units
- FOV: 50 (slightly tighter than default for diorama feel)

## Idle Animation Timing
- Tree sway: amplitude 0.04 rad, frequency 0.6 Hz, phase-offset per tree
- Flower bob: amplitude 0.05 units, frequency 1.2 Hz
- Crystal float: drei Float speed 1.2, rotationIntensity 1, floatIntensity 1.5
- Player idle breath: amplitude 0.02 units, frequency 0.8 Hz
- Player walk bob: amplitude 0.08 units, frequency tied to speed
- Sparkles: drei Sparkles count 60, scale 14, size 2.5, speed 0.3

## HUD Layout
- Quest bubble: top-left, 16px padding from edges, rounded-2xl (16px radius), bg `rgba(42, 36, 56, 0.78)`, backdrop-blur 8px, white text
- Controls hint: bottom-center, semi-transparent, never overlapping quest
- Speech bubble (NPC): drei Html attached to NPC head, cream background, dark text, tail pointer down, fades in on interact
- No menus, no buttons, no settings in v1

## Spacing & Scale (World Units)
- Island radius: 12
- Island height (grass to bottom tip): 8
- Player height: 1.6
- Tree height: 3-4.5
- Cottage footprint: 3 x 3, height 2.5 + roof
- Crystals scale: 0.4-0.7
- Camera FOV: 50

## Component Composition Style
- Each scene element is a small functional component
- Geometry composed from primitives — no manual BufferGeometry hacking unless required
- Materials inline or memoized constants
- Idle motion via useFrame with phase offsets to avoid lockstep

## Apple HIG-Inspired UI Principles
- **Deference:** UI never competes with the diorama
- **Clarity:** Quest text is legible at a glance
- **Depth:** Subtle blur and shadow give HUD elements lift without weight

## Accessibility (v1 baseline)
- Sufficient HUD contrast (WCAG AA against worst-case backgrounds)
- Keyboard-only fully functional (no required mouse input for slice)
- No flashing / strobing effects
- Reduced motion: if `prefers-reduced-motion`, dampen idle amplitudes by 50%

## Performance Budget
- Target: 60fps at 1080p on integrated GPU
- Draw call budget: under 80
- Particle count: under 100
- Shadow map: single 2048 cascade
- Postprocessing: SMAA over TAA, no DOF, no motion blur

## Don'ts
- Don't use metalness > 0 on anything except (optionally) the mailbox flag
- Don't add bloom to non-crystal objects
- Don't let the camera clip into geometry
- Don't show loading spinners — the reveal IS the loading state
- Don't allow input during the opening 3-second arc (or queue it gracefully)
