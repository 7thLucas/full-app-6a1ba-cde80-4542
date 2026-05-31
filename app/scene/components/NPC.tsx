import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import { CharacterMesh } from "./CharacterMesh";
import { TUNING } from "../constants/tuning";
import type { KeyState } from "../hooks/useKeyboard";

interface NPCProps {
  position: [number, number, number];
  name: string;
  dialogue: string;
  bodyColor: string;
  accentColor: string;
  playerPosRef: React.MutableRefObject<THREE.Vector3>;
  keysRef: React.MutableRefObject<KeyState>;
  /** Whether input is allowed (gated by intro). */
  inputEnabled: boolean;
  onTalk: () => void;
  reducedMotion?: boolean;
}

/**
 * Stationary villager NPC. Idle bob. When the player enters interaction
 * range, shows a "Press E to talk" prompt. When E is pressed, shows the
 * dialogue bubble and triggers onTalk().
 *
 * The bubble persists briefly after E is released so the player can read.
 */
export function NPC({
  position,
  name,
  dialogue,
  bodyColor,
  accentColor,
  playerPosRef,
  keysRef,
  inputEnabled,
  onTalk,
  reducedMotion = false,
}: NPCProps) {
  const group = useRef<THREE.Group>(null);
  const speedRef = useRef(0); // always 0 — idle breath only
  const facingRef = useRef(Math.PI); // face -Z by default
  const inRangeRef = useRef(false);
  const showBubbleRef = useRef(false);
  const hideAtRef = useRef(0);

  // We use a state-via-ref pattern + a tiny mutable trigger so the
  // Html bubble re-renders. We pipe the trigger via a ref + state.
  const [, force] = useForceUpdate();

  useFrame((state) => {
    if (!group.current) return;
    const dx = playerPosRef.current.x - position[0];
    const dz = playerPosRef.current.z - position[2];
    const dist = Math.sqrt(dx * dx + dz * dz);
    const inRange = dist <= TUNING.interaction.talkRange;

    if (inRange !== inRangeRef.current) {
      inRangeRef.current = inRange;
      force();
    }

    // Look at player when in range
    if (inRange) {
      facingRef.current = Math.atan2(dx, dz);
    }

    // Handle interact press (E)
    if (inRange && inputEnabled && keysRef.current.interactPressed) {
      keysRef.current.interactPressed = false;
      showBubbleRef.current = true;
      hideAtRef.current = state.clock.getElapsedTime() + 6.0;
      onTalk();
      force();
    }

    // Auto-hide bubble
    if (showBubbleRef.current && state.clock.getElapsedTime() > hideAtRef.current) {
      showBubbleRef.current = false;
      force();
    }
  });

  return (
    <group position={position} ref={group}>
      <RigidBody type="fixed" colliders={false} position={[0, 0, 0]}>
        <CapsuleCollider
          args={[TUNING.player.height / 2 - TUNING.player.radius, TUNING.player.radius]}
          position={[0, TUNING.player.height / 2 + TUNING.player.radius, 0]}
        />
        <CharacterMesh
          bodyColor={bodyColor}
          accentColor={accentColor}
          speedRef={speedRef}
          facingRef={facingRef}
          reducedMotion={reducedMotion}
          scale={0.95}
        />
      </RigidBody>

      {/* Always show a tiny name tag */}
      <Html
        position={[0, 2.1, 0]}
        center
        distanceFactor={9}
        zIndexRange={[35, 0]}
        pointerEvents="none"
      >
        <div
          style={{
            background: "rgba(42, 36, 56, 0.75)",
            color: "#FBF4E4",
            padding: "3px 8px",
            borderRadius: 10,
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.04em",
            whiteSpace: "nowrap",
            opacity: 0.85,
          }}
        >
          {name}
        </div>
      </Html>

      {inRangeRef.current && !showBubbleRef.current && (
        <Html position={[0, 1.85, 0]} center distanceFactor={8} zIndexRange={[40, 0]} pointerEvents="none">
          <div
            style={{
              background: "rgba(42, 36, 56, 0.85)",
              color: "#FBF4E4",
              padding: "6px 10px",
              borderRadius: 12,
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 12,
              fontWeight: 600,
              whiteSpace: "nowrap",
              boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
              backdropFilter: "blur(8px)",
            }}
          >
            Press E to talk
          </div>
        </Html>
      )}

      {showBubbleRef.current && (
        <Html position={[0, 2.3, 0]} center distanceFactor={6} zIndexRange={[40, 0]} pointerEvents="none">
          <div
            style={{
              background: "#FBF4E4",
              color: "#2A2438",
              padding: "12px 16px",
              borderRadius: 14,
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 13,
              maxWidth: 260,
              lineHeight: 1.45,
              boxShadow: "0 12px 32px rgba(42,36,56,0.35)",
              border: "1px solid rgba(122, 75, 48, 0.25)",
              position: "relative",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                marginBottom: 4,
                color: "#9F5BB7",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {name}
            </div>
            {dialogue}
          </div>
        </Html>
      )}
    </group>
  );
}

// Tiny inline-friendly force-update helper.
import { useReducer } from "react";
function useForceUpdate(): [number, () => void] {
  const [n, dispatch] = useReducer((x: number) => x + 1, 0);
  return [n, dispatch as () => void];
}
