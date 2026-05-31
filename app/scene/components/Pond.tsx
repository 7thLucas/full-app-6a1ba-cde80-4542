import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface PondProps {
  position: [number, number, number];
  radius: number;
  color: string;
}

/**
 * Stylized pond — flat circular disc with very subtle vertical ripple
 * via a uniform-driven offset. Cheap; no reflection probe.
 */
export function Pond({ position, radius, color }: PondProps) {
  const mat = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    if (!mat.current) return;
    const t = state.clock.getElapsedTime();
    mat.current.opacity = 0.65 + Math.sin(t * 0.7) * 0.05;
  });

  return (
    <group position={position}>
      {/* Water surface */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[radius, 32]} />
        <meshStandardMaterial
          ref={mat}
          color={color}
          transparent
          opacity={0.7}
          roughness={0.2}
          metalness={0}
          emissive={color}
          emissiveIntensity={0.08}
        />
      </mesh>
      {/* Rim — slightly darker ring under for depth */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <ringGeometry args={[radius * 0.95, radius * 1.12, 32]} />
        <meshStandardMaterial color="#6E4A35" roughness={0.95} metalness={0} />
      </mesh>
    </group>
  );
}
