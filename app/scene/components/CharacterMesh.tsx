import { forwardRef, useRef, useImperativeHandle } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { TUNING } from "../constants/tuning";

interface CharacterMeshProps {
  bodyColor: string;
  accentColor: string;
  /** Speed in units/sec — drives walk-bob amplitude. 0 = idle breath only. */
  speedRef?: React.MutableRefObject<number>;
  reducedMotion?: boolean;
  facingRef?: React.MutableRefObject<number>;
  scale?: number;
}

export interface CharacterHandle {
  group: THREE.Group | null;
}

/**
 * Cute placeholder character — capsule body, sphere head, simple eyes.
 * Plays a walk-bob animation when speedRef is positive and a breath
 * animation when idle. Faces facingRef yaw (radians).
 */
export const CharacterMesh = forwardRef<CharacterHandle, CharacterMeshProps>(
  function CharacterMesh(
    { bodyColor, accentColor, speedRef, facingRef, reducedMotion = false, scale = 1 },
    ref,
  ) {
    const group = useRef<THREE.Group>(null);
    const inner = useRef<THREE.Group>(null);

    useImperativeHandle(ref, () => ({
      group: group.current,
    }));

    useFrame((state) => {
      if (!inner.current) return;
      const t = state.clock.getElapsedTime();
      const speed = speedRef?.current ?? 0;
      const moving = speed > 0.05;

      // Bob: walk amplitude scales with speed; idle breath is constant
      const walkAmp =
        TUNING.player.walkBobAmplitude * Math.min(1, speed / 4) *
        (reducedMotion ? 0.5 : 1);
      const breathAmp = TUNING.player.idleBreathAmplitude * (reducedMotion ? 0.5 : 1);

      if (moving) {
        const w = TUNING.player.walkBobFrequency;
        inner.current.position.y = Math.abs(Math.sin(t * w)) * walkAmp;
        inner.current.rotation.z = Math.sin(t * w) * 0.06;
      } else {
        const w = TUNING.player.idleBreathFrequency * Math.PI * 2;
        inner.current.position.y = Math.sin(t * w) * breathAmp;
        inner.current.rotation.z = 0;
      }

      // Facing yaw smoothing
      if (group.current && facingRef) {
        const cur = group.current.rotation.y;
        const target = facingRef.current;
        // wrap shortest angle
        let delta = target - cur;
        delta = Math.atan2(Math.sin(delta), Math.cos(delta));
        group.current.rotation.y = cur + delta * TUNING.player.turnLerp;
      }
    });

    return (
      <group ref={group} scale={[scale, scale, scale]}>
        <group ref={inner}>
          {/* Body — capsule */}
          <mesh castShadow position={[0, 0.55, 0]}>
            <capsuleGeometry args={[0.32, 0.45, 6, 14]} />
            <meshStandardMaterial color={bodyColor} roughness={0.85} metalness={0} />
          </mesh>
          {/* Scarf / accent */}
          <mesh castShadow position={[0, 0.92, 0]}>
            <torusGeometry args={[0.32, 0.07, 8, 16]} />
            <meshStandardMaterial color={accentColor} roughness={0.85} metalness={0} />
          </mesh>
          {/* Head */}
          <mesh castShadow position={[0, 1.22, 0]}>
            <sphereGeometry args={[0.3, 18, 18]} />
            <meshStandardMaterial color={bodyColor} roughness={0.85} metalness={0} />
          </mesh>
          {/* Eyes */}
          <mesh position={[-0.1, 1.25, 0.26]}>
            <sphereGeometry args={[0.04, 10, 10]} />
            <meshStandardMaterial color="#2A2438" roughness={0.4} metalness={0} />
          </mesh>
          <mesh position={[0.1, 1.25, 0.26]}>
            <sphereGeometry args={[0.04, 10, 10]} />
            <meshStandardMaterial color="#2A2438" roughness={0.4} metalness={0} />
          </mesh>
          {/* Cheek blush (subtle) */}
          <mesh position={[-0.16, 1.18, 0.24]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshStandardMaterial color="#F08A8A" roughness={0.9} metalness={0} />
          </mesh>
          <mesh position={[0.16, 1.18, 0.24]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshStandardMaterial color="#F08A8A" roughness={0.9} metalness={0} />
          </mesh>
          {/* Tiny hat tuft */}
          <mesh castShadow position={[0, 1.5, 0]}>
            <coneGeometry args={[0.18, 0.22, 8]} />
            <meshStandardMaterial color={accentColor} roughness={0.85} metalness={0} />
          </mesh>
        </group>
      </group>
    );
  },
);
