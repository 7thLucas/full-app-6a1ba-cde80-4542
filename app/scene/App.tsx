import { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

import { Scene } from "./components/Scene";
import { HUD } from "./components/HUD";
import { TUNING } from "./constants/tuning";
import { useGameState, TOTAL_FRUIT_COUNT } from "./hooks/useGameState";
import { useConfigurables } from "~/modules/configurables";

/**
 * Driftholm — top-level Canvas + HUD wrapper.
 *
 * This component:
 *   1. Pulls all owner-customizable values from useConfigurables()
 *      (palette, names, copy, tuning floats, feature flags).
 *   2. Owns the shared GameApi state.
 *   3. Mounts the R3F Canvas (the diorama) and the 2D HUD on top.
 *
 * All hard-coded values that affect "feel of motion" live in
 * constants/tuning.ts. All values that affect "feel of brand" live in
 * the configurables schema.
 */
export function App() {
  const { config, loading } = useConfigurables();
  const game = useGameState();
  const [introProgress, setIntroProgress] = useState(0);

  // ── Resolve owner-customizable values with safe fallbacks ────────────
  const appName = (config?.appName && !config.appName.startsWith("FILL_"))
    ? config.appName
    : "Driftholm";
  const tagline = config?.tagline ?? "A cozy floating island, lit by golden hour.";
  const welcomeMessage = config?.welcomeMessage ?? "Take a breath. Explore.";

  const sky = useMemo(() => {
    const s = config?.skyPalette;
    return {
      zenith: s?.zenith ?? TUNING.skyFallback.zenith,
      mid: s?.mid ?? TUNING.skyFallback.mid,
      horizon: s?.horizon ?? TUNING.skyFallback.horizon,
      sun: s?.sun ?? TUNING.skyFallback.sun,
      fog: s?.fog ?? TUNING.skyFallback.fog,
    };
  }, [config?.skyPalette]);

  const ground = useMemo(() => {
    const g = config?.groundPalette;
    return {
      grass: g?.grass ?? TUNING.groundFallback.grass,
      grassShadow: g?.grassShadow ?? TUNING.groundFallback.grassShadow,
      dirtPath: g?.dirtPath ?? TUNING.groundFallback.dirtPath,
      dirtUnderside: g?.dirtUnderside ?? TUNING.groundFallback.dirtUnderside,
      pondWater: g?.pondWater ?? TUNING.groundFallback.pondWater,
      rock: g?.rock ?? TUNING.groundFallback.rock,
    };
  }, [config?.groundPalette]);

  const magic = useMemo(() => {
    const m = config?.magicPalette;
    return {
      crystal: m?.crystal ?? TUNING.magicFallback.crystal,
      sparkles: m?.sparkles ?? TUNING.magicFallback.sparkles,
      fruit: m?.fruit ?? TUNING.magicFallback.fruit,
      fruitHighlight: m?.fruitHighlight ?? TUNING.magicFallback.fruitHighlight,
    };
  }, [config?.magicPalette]);

  const brandColor = useMemo(() => {
    const b = config?.brandColor;
    const valid = (v?: string) =>
      typeof v === "string" && v.length > 0 && !v.startsWith("FILL_");
    return {
      primary: valid(b?.primary) ? b!.primary : "#C0408C",
      secondary: valid(b?.secondary) ? b!.secondary : "#FF8A5C",
      accent: valid(b?.accent) ? b!.accent : "#A6E8FF",
    };
  }, [config?.brandColor]);

  const questSteps = useMemo<string[]>(() => {
    const q = config?.questSteps;
    if (Array.isArray(q) && q.length > 0) return q;
    return ["Explore the island", "Talk to the villager", "Collect 3 fruits"];
  }, [config?.questSteps]);

  const villagerName = config?.villagerName ?? "Elder Pip";
  const villagerDialogue =
    config?.villagerDialogue ??
    "Welcome to Driftholm, traveler. The crystals hum louder at sunset.";
  const mailboxNote =
    config?.mailboxNote ?? "A note flutters out: \"The wind has been gentle this week.\"";
  const showQuestBubble = config?.showQuestBubble ?? true;
  const showControlsHint = config?.showControlsHint ?? true;
  const bloomIntensity = typeof config?.bloomIntensity === "number" ? config.bloomIntensity : 0.9;
  const sunIntensity = typeof config?.sunIntensity === "number" ? config.sunIntensity : 1.8;

  // Map quest step enum to index in the (configurable) step list
  const currentStepIndex = useMemo(() => {
    switch (game.state.step) {
      case "explore": return 0;
      case "talk": return Math.min(1, questSteps.length - 1);
      case "collect": return Math.min(2, questSteps.length - 1);
      case "done": return questSteps.length;
      default: return 0;
    }
  }, [game.state.step, questSteps.length]);

  if (loading) {
    // Reveal IS the loading state — no spinner. We render a quick
    // brand-tinted gradient until config arrives, so there's no flash
    // of white. Should be <100ms in practice.
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: `linear-gradient(180deg, ${sky.zenith} 0%, ${sky.mid} 55%, ${sky.horizon} 100%)`,
        }}
      />
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: `linear-gradient(180deg, ${sky.zenith} 0%, ${sky.mid} 55%, ${sky.horizon} 100%)`,
        overflow: "hidden",
      }}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
          // outputColorSpace defaults to SRGBColorSpace in modern three
        }}
        camera={{
          position: [
            Math.sin(TUNING.camera.introStartAngle) * TUNING.camera.introStartDistance,
            TUNING.camera.introStartHeight,
            Math.cos(TUNING.camera.introStartAngle) * TUNING.camera.introStartDistance,
          ],
          fov: TUNING.camera.fov,
          near: 0.1,
          far: 200,
        }}
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <Scene
          game={game}
          onIntroProgress={setIntroProgress}
          sky={sky}
          ground={ground}
          magic={magic}
          player={{ body: "#F4C9A6", accent: brandColor.primary }}
          villager={{
            name: villagerName,
            dialogue: villagerDialogue,
            body: "#E0B68F",
            accent: "#9F5BB7",
          }}
          mailboxNote={mailboxNote}
          sunIntensity={sunIntensity}
          bloomIntensity={bloomIntensity}
        />
      </Canvas>

      <HUD
        appName={appName}
        tagline={tagline}
        welcomeMessage={welcomeMessage}
        questSteps={questSteps}
        currentStepIndex={currentStepIndex}
        fruitsCollected={game.state.fruitsCollected}
        totalFruits={TOTAL_FRUIT_COUNT}
        introDone={introProgress >= 1}
        showQuestBubble={showQuestBubble}
        showControlsHint={showControlsHint}
        brandColor={brandColor}
      />
    </div>
  );
}
