import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { TUNING } from "../constants/tuning";

interface TreeProps {
  position: [number, number, number];
  scale?: number;
  /** Phase offset (0..1) so trees don't sway in lockstep */
  phase?: number;
  /** Variant 0 or 1 picks a slightly different canopy color */
  variant?: 0 | 1;
  trunkColor?: string;
  canopyBase?: string;
  canopyAlt?: string;
  reducedMotion?: boolean;
}

/**
 * Stylized cozy tree: cone canopy + cylinder trunk. The whole tree group
 * sways from its base; the canopy bobs slightly out of phase for warmth.
 */
export function Tree({
  position,
  scale = 1,
  phase = 0,
  variant = 0,
  trunkColor = "#6B4226",
  canopyBase = "#4FA86A",
  canopyAlt = "#3D8F58",
  reducedMotion = false,
}: TreeProps) {
  const group = useRef<THREE.Group>(null);
  const canopy = useRef<THREE.Mesh>(null);

  const swayAmp = TUNING.motion.treeSwayAmplitude * (reducedMotion ? 0.5 : 1);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const w = TUNING.motion.treeSwayFrequency * Math.PI * 2;
    const phasePi = phase * Math.PI * 2;
    if (group.current) {
      group.current.rotation.z = Math.sin(t * w + phasePi) * swayAmp;
      group.current.rotation.x = Math.cos(t * w * 0.7 + phasePi) * swayAmp * 0.6;
    }
    if (canopy.current) {
      canopy.current.position.y =
        2.4 * scale + Math.sin(t * w * 1.3 + phasePi) * 0.04;
    }
  });

  const canopyColor = variant === 0 ? canopyBase : canopyAlt;

  return (
    <group position={position} scale={[scale, scale, scale]} ref={group}>
      {/* Trunk */}
      <mesh castShadow receiveShadow position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.18, 0.24, 1.8, 10]} />
        <meshStandardMaterial color={trunkColor} roughness={0.95} metalness={0} />
      </mesh>
      {/* Canopy — stacked cones for cozy painterly read */}
      <mesh ref={canopy} castShadow receiveShadow position={[0, 2.4, 0]}>
        <coneGeometry args={[1.1, 1.6, 12]} />
        <meshStandardMaterial color={canopyColor} roughness={0.95} metalness={0} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 3.1, 0]}>
        <coneGeometry args={[0.85, 1.3, 12]} />
        <meshStandardMaterial color={canopyColor} roughness={0.95} metalness={0} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 3.7, 0]}>
        <coneGeometry args={[0.6, 1.0, 12]} />
        <meshStandardMaterial color={canopyBase} roughness={0.95} metalness={0} />
      </mesh>
    </group>
  );
}
