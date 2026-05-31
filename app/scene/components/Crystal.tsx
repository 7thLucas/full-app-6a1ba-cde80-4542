import { Float } from "@react-three/drei";
import { TUNING } from "../constants/tuning";

interface CrystalProps {
  position: [number, number, number];
  scale?: number;
  color: string;
}

/**
 * Floating magical crystal — an octahedron with emissive material.
 * The emissive intensity is high enough to trigger selective bloom
 * via the Bloom luminance threshold (set in PostFX).
 *
 * Wrapped in drei <Float /> for free idle motion.
 */
export function Crystal({ position, scale = 0.5, color }: CrystalProps) {
  return (
    <Float
      speed={TUNING.motion.crystalFloatSpeed}
      rotationIntensity={TUNING.motion.crystalRotationIntensity}
      floatIntensity={TUNING.motion.crystalFloatIntensity}
      position={position}
    >
      <mesh castShadow scale={[scale, scale * 1.6, scale]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2.2}
          roughness={0.25}
          metalness={0.0}
          toneMapped={false}
        />
      </mesh>
      {/* inner softer core for richer bloom */}
      <mesh scale={[scale * 0.6, scale, scale * 0.6]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={"#ffffff"}
          emissive={"#ffffff"}
          emissiveIntensity={1.5}
          transparent
          opacity={0.5}
          roughness={0.1}
          metalness={0}
          toneMapped={false}
        />
      </mesh>
    </Float>
  );
}
