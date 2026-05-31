import { useRef, useState } from "react";
import * as THREE from "three";
import { Physics } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";

import { Environment } from "./Environment";
import { Island } from "./Island";
import { PlayerController, PlayerContactShadow } from "./PlayerController";
import { FollowCamera } from "./FollowCamera";
import { NPC } from "./NPC";
import { Interactables } from "./Interactables";
import { PostFX } from "./PostFX";
import { TUNING } from "../constants/tuning";
import { useKeyboard } from "../hooks/useKeyboard";
import { useReducedMotion } from "../hooks/useReducedMotion";
import type { GameApi } from "../hooks/useGameState";

interface SceneProps {
  game: GameApi;
  /** Reports intro progress 0..1 back to parent (for HUD welcome fade). */
  onIntroProgress: (p: number) => void;
  sky: { zenith: string; mid: string; horizon: string; sun: string; fog: string };
  ground: {
    grass: string;
    grassShadow: string;
    dirtPath: string;
    dirtUnderside: string;
    pondWater: string;
    rock: string;
  };
  magic: { crystal: string; sparkles: string; fruit: string; fruitHighlight: string };
  player: { body: string; accent: string };
  villager: { name: string; dialogue: string; body: string; accent: string };
  mailboxNote: string;
  sunIntensity: number;
  bloomIntensity: number;
}

/**
 * The entire 3D scene. Composes:
 *   - Environment (sky, fog, lights, sparkles)
 *   - Island (ground + decor + path + pond + cottage)
 *   - PlayerController + ContactShadow
 *   - NPC villager
 *   - Interactables (crystals, fruits, mailbox)
 *   - FollowCamera (with intro arc)
 *   - PostFX
 *
 * Manages the intro arc clock and reports progress out to the parent.
 * Input is disabled until intro is complete (the 3-second window the
 * spec hinges on).
 */
export function Scene({
  game,
  onIntroProgress,
  sky,
  ground,
  magic,
  player,
  villager,
  mailboxNote,
  sunIntensity,
  bloomIntensity,
}: SceneProps) {
  const keys = useKeyboard();
  const reducedMotion = useReducedMotion();
  const playerPosRef = useRef(new THREE.Vector3(3, 2.5, 4));

  // Intro arc clock + input gate
  const [introProgress, setIntroProgress] = useState(0);
  const introStartRef = useRef<number | null>(null);
  const reducedDur = reducedMotion
    ? TUNING.camera.introDurationSec * 0.5
    : TUNING.camera.introDurationSec;

  return (
    <>
      <Environment sky={sky} sparklesColor={magic.sparkles} sunIntensity={sunIntensity} />

      <Physics gravity={[0, -18, 0]}>
        <Island ground={ground} reducedMotion={reducedMotion} />

        <PlayerController
          bodyColor={player.body}
          accentColor={player.accent}
          keysRef={keys}
          playerPosRef={playerPosRef}
          inputEnabled={introProgress >= 1}
          reducedMotion={reducedMotion}
          onFirstMove={game.markExplored}
        />

        <NPC
          position={[-3.0, TUNING.island.grassThickness / 2, -2.5]}
          name={villager.name}
          dialogue={villager.dialogue}
          bodyColor={villager.body}
          accentColor={villager.accent}
          playerPosRef={playerPosRef}
          keysRef={keys}
          inputEnabled={introProgress >= 1}
          onTalk={game.talkToVillager}
          reducedMotion={reducedMotion}
        />

        <Interactables
          playerPosRef={playerPosRef}
          keysRef={keys}
          inputEnabled={introProgress >= 1}
          fruitColor={magic.fruit}
          fruitHighlight={magic.fruitHighlight}
          crystalColor={magic.crystal}
          sparklesColor={magic.sparkles}
          collectedIds={game.state.collectedFruitIds}
          onCollectFruit={game.collectFruit}
          onToggleMailbox={game.toggleMailbox}
          mailboxOpen={game.state.mailboxOpen}
          mailboxNote={mailboxNote}
        />
      </Physics>

      {/* Soft contact shadow under player (outside physics) */}
      <PlayerContactShadow playerPosRef={playerPosRef} />

      <FollowCamera targetRef={playerPosRef} introProgress={introProgress} />

      {/* Intro arc clock — drives camera intro progress */}
      <IntroClock
        durationSec={reducedDur}
        startRef={introStartRef}
        onProgress={(p) => {
          setIntroProgress(p);
          onIntroProgress(p);
        }}
      />

      <PostFX bloomIntensity={bloomIntensity} />
    </>
  );
}

interface IntroClockProps {
  durationSec: number;
  startRef: React.MutableRefObject<number | null>;
  onProgress: (p: number) => void;
}

function IntroClock({ durationSec, startRef, onProgress }: IntroClockProps) {
  const last = useRef(-1);
  useFrame((state) => {
    if (startRef.current === null) startRef.current = state.clock.getElapsedTime();
    const elapsed = state.clock.getElapsedTime() - startRef.current;
    const p = Math.min(1, elapsed / durationSec);
    if (Math.abs(p - last.current) > 0.005 || (p === 1 && last.current < 1)) {
      last.current = p;
      onProgress(p);
    }
  });
  return null;
}
