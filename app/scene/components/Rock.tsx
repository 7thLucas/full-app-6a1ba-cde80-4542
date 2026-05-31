import { useMemo } from "react";
import * as THREE from "three";

interface RockProps {
  position: [number, number, number];
  scale?: number;
  rotationY?: number;
  color?: string;
  seed?: number;
}

/**
 * Stylized irregular rock — a couple of low-poly spheres of varying sizes
 * jittered together. Procedural; no shared geometry, but cheap enough.
 */
export function Rock({
  position,
  scale = 1,
  rotationY = 0,
  color = "#8A8597",
  seed = 1,
}: RockProps) {
  const lumps = useMemo(() => {
    // deterministic pseudo-random based on seed
    const rng = (i: number) => {
      const x = Math.sin(seed * 19.19 + i * 7.31) * 43758.5453;
      return x - Math.floor(x);
    };
    const out: Array<{
      pos: [number, number, number];
      size: number;
      rot: [number, number, number];
    }> = [];
    const count = 3 + Math.floor(rng(0) * 2);
    for (let i = 0; i < count; i++) {
      out.push({
        pos: [
          (rng(i + 1) - 0.5) * 0.6,
          rng(i + 2) * 0.25,
          (rng(i + 3) - 0.5) * 0.6,
        ],
        size: 0.25 + rng(i + 4) * 0.25,
        rot: [rng(i + 5) * Math.PI, rng(i + 6) * Math.PI, rng(i + 7) * Math.PI],
      });
    }
    return out;
  }, [seed]);

  return (
    <group position={position} scale={[scale, scale, scale]} rotation={[0, rotationY, 0]}>
      {lumps.map((l, i) => (
        <mesh key={i} castShadow receiveShadow position={l.pos} rotation={l.rot}>
          <dodecahedronGeometry args={[l.size, 0]} />
          <meshStandardMaterial color={color} roughness={0.95} metalness={0} flatShading />
        </mesh>
      ))}
    </group>
  );
}
