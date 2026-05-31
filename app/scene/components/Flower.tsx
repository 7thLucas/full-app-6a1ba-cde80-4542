import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { TUNING } from "../constants/tuning";

interface FlowerProps {
  position: [number, number, number];
  color: string;
  phase?: number;
  reducedMotion?: boolean;
}

export function Flower({ position, color, phase = 0, reducedMotion = false }: FlowerProps) {
  const ref = useRef<THREE.Group>(null);
  const amp = TUNING.motion.flowerBobAmplitude * (reducedMotion ? 0.5 : 1);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    const w = TUNING.motion.flowerBobFrequency * Math.PI * 2;
    ref.current.position.y = position[1] + Math.sin(t * w + phase * Math.PI * 2) * amp;
    ref.current.rotation.z = Math.sin(t * w * 0.6 + phase) * 0.08;
  });

  return (
    <group ref={ref} position={position}>
      {/* Stem */}
      <mesh castShadow position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.36, 6]} />
        <meshStandardMaterial color="#4F8F4A" roughness={0.95} metalness={0} />
      </mesh>
      {/* Bloom */}
      <mesh castShadow position={[0, 0.42, 0]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0} />
      </mesh>
      {/* Tiny leaf */}
      <mesh castShadow position={[0.08, 0.22, 0]} rotation={[0, 0, -0.6]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#4F8F4A" roughness={0.95} metalness={0} />
      </mesh>
    </group>
  );
}
