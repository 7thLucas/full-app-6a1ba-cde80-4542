import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Cozy cottage composed entirely from primitives:
 *   - box walls (cream)
 *   - pyramid roof (warm red, rotated cone with 4 segments)
 *   - chimney with a tiny smoke puff
 *   - door + windows
 */
interface CottageProps {
  position: [number, number, number];
  rotationY?: number;
}

export function Cottage({ position, rotationY = 0 }: CottageProps) {
  const smoke = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!smoke.current) return;
    const t = state.clock.getElapsedTime();
    smoke.current.position.y = 4.4 + Math.sin(t * 0.8) * 0.12;
    smoke.current.scale.setScalar(0.4 + Math.sin(t * 0.6) * 0.06);
    (smoke.current.material as THREE.MeshStandardMaterial).opacity =
      0.35 + Math.sin(t * 0.8) * 0.1;
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Walls */}
      <mesh castShadow receiveShadow position={[0, 1.0, 0]}>
        <boxGeometry args={[3, 2, 3]} />
        <meshStandardMaterial color="#F0D9B5" roughness={0.85} metalness={0} />
      </mesh>
      {/* Wooden trim — thin band */}
      <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
        <boxGeometry args={[3.1, 0.2, 3.1]} />
        <meshStandardMaterial color="#7A4B30" roughness={0.9} metalness={0} />
      </mesh>
      {/* Roof — 4-sided pyramid via cone(4 segments) */}
      <mesh castShadow receiveShadow position={[0, 2.7, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[2.3, 1.4, 4]} />
        <meshStandardMaterial color="#C44949" roughness={0.85} metalness={0} />
      </mesh>
      {/* Chimney */}
      <mesh castShadow receiveShadow position={[0.9, 3.1, 0.4]}>
        <boxGeometry args={[0.35, 0.9, 0.35]} />
        <meshStandardMaterial color="#8A6750" roughness={0.95} metalness={0} />
      </mesh>
      {/* Smoke puff */}
      <mesh ref={smoke} position={[0.9, 4.4, 0.4]}>
        <sphereGeometry args={[0.35, 12, 12]} />
        <meshStandardMaterial
          color="#FBF4E4"
          transparent
          opacity={0.45}
          roughness={1}
          metalness={0}
        />
      </mesh>
      {/* Door */}
      <mesh castShadow position={[0, 0.7, 1.51]}>
        <boxGeometry args={[0.7, 1.3, 0.05]} />
        <meshStandardMaterial color="#7A4B30" roughness={0.85} metalness={0} />
      </mesh>
      {/* Door knob */}
      <mesh position={[0.22, 0.7, 1.55]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#E1B65B" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Front-left window */}
      <mesh castShadow position={[-0.9, 1.25, 1.51]}>
        <boxGeometry args={[0.6, 0.6, 0.05]} />
        <meshStandardMaterial
          color="#A6E8FF"
          roughness={0.3}
          metalness={0}
          emissive="#7BD7FF"
          emissiveIntensity={0.15}
        />
      </mesh>
      {/* Front-right window */}
      <mesh castShadow position={[0.9, 1.25, 1.51]}>
        <boxGeometry args={[0.6, 0.6, 0.05]} />
        <meshStandardMaterial
          color="#A6E8FF"
          roughness={0.3}
          metalness={0}
          emissive="#7BD7FF"
          emissiveIntensity={0.15}
        />
      </mesh>
    </group>
  );
}
