import { useMemo } from "react";
import { RigidBody, CylinderCollider } from "@react-three/rapier";
import * as THREE from "three";
import { TUNING } from "../constants/tuning";
import { Tree } from "./Tree";
import { Flower } from "./Flower";
import { Rock } from "./Rock";
import { Cottage } from "./Cottage";
import { Pond } from "./Pond";

interface IslandProps {
  ground: {
    grass: string;
    grassShadow: string;
    dirtPath: string;
    dirtUnderside: string;
    pondWater: string;
    rock: string;
  };
  reducedMotion: boolean;
}

/**
 * The whole physical island — fixed RigidBody for the ground so the
 * player capsule lands on it. Decorative trees/flowers/rocks/cottage
 * sit on top.
 *
 * Path is rendered as a slightly-raised dirt strip (thin curved boxes)
 * to give the eye somewhere to wander. Pond is in the negative-Z
 * quadrant. Cottage is in the +X quadrant.
 */
export function Island({ ground, reducedMotion }: IslandProps) {
  const trees = useMemo<
    Array<{ pos: [number, number, number]; scale: number; variant: 0 | 1; phase: number }>
  >(
    () => [
      { pos: [-6, 0, -4], scale: 1.15, variant: 0, phase: 0.0 },
      { pos: [-3.5, 0, -7.5], scale: 0.95, variant: 1, phase: 0.18 },
      { pos: [-8.5, 0, 1.5], scale: 1.0, variant: 0, phase: 0.35 },
      { pos: [-4.5, 0, 5.8], scale: 1.1, variant: 1, phase: 0.5 },
      { pos: [2.5, 0, 7.5], scale: 0.95, variant: 0, phase: 0.65 },
      { pos: [7.0, 0, 3.8], scale: 1.05, variant: 1, phase: 0.8 },
      { pos: [8.8, 0, -2.0], scale: 0.9, variant: 0, phase: 0.95 },
    ],
    [],
  );

  const flowers = useMemo<
    Array<{ pos: [number, number, number]; color: string; phase: number }>
  >(
    () => [
      { pos: [-2.2, 0, -2.4], color: "#E94C5A", phase: 0.0 },
      { pos: [-1.6, 0, -3.0], color: "#F4C24A", phase: 0.2 },
      { pos: [-0.8, 0, 2.2], color: "#A769D9", phase: 0.4 },
      { pos: [1.4, 0, 3.6], color: "#E94C5A", phase: 0.6 },
      { pos: [3.2, 0, 1.0], color: "#F4C24A", phase: 0.8 },
      { pos: [-5.5, 0, 3.5], color: "#A769D9", phase: 1.0 },
      { pos: [5.0, 0, -1.5], color: "#E94C5A", phase: 0.3 },
      { pos: [-3.0, 0, 1.5], color: "#F4C24A", phase: 0.7 },
      { pos: [6.8, 0, 1.8], color: "#A769D9", phase: 0.9 },
      { pos: [-7.0, 0, -1.2], color: "#E94C5A", phase: 0.15 },
    ],
    [],
  );

  const rocks = useMemo<
    Array<{ pos: [number, number, number]; scale: number; rot: number; seed: number }>
  >(
    () => [
      { pos: [-7.5, 0, -2.5], scale: 1.1, rot: 0.2, seed: 7 },
      { pos: [6.5, 0, 5.2], scale: 0.9, rot: 1.1, seed: 13 },
      { pos: [-2.0, 0, 6.5], scale: 1.2, rot: 2.4, seed: 21 },
      { pos: [4.0, 0, -5.5], scale: 0.85, rot: 0.8, seed: 33 },
      { pos: [0.0, 0, -5.0], scale: 0.7, rot: 1.5, seed: 41 },
    ],
    [],
  );

  // Curved dirt path — series of slightly-rotated stretched boxes
  const pathSegments = useMemo<
    Array<{ pos: [number, number, number]; rot: number; len: number }>
  >(
    () => [
      { pos: [3.5, 0.31, 3.0], rot: -0.3, len: 2.2 },
      { pos: [2.0, 0.31, 1.3], rot: -0.1, len: 2.0 },
      { pos: [0.8, 0.31, -0.5], rot: 0.2, len: 2.0 },
      { pos: [-0.6, 0.31, -2.0], rot: 0.5, len: 2.0 },
      { pos: [-2.4, 0.31, -2.8], rot: 1.0, len: 2.0 },
    ],
    [],
  );

  return (
    <group>
      {/* ── Ground (physical) ───────────────────────────────────────────── */}
      <RigidBody type="fixed" colliders={false} friction={1.0} restitution={0}>
        <CylinderCollider
          args={[TUNING.island.grassThickness / 2, TUNING.island.radius]}
          position={[0, 0, 0]}
        />
        {/* Grass top — a flat-ish cylinder */}
        <mesh
          receiveShadow
          castShadow
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
        >
          <cylinderGeometry
            args={[
              TUNING.island.radius,
              TUNING.island.radius * 0.96,
              TUNING.island.grassThickness,
              48,
            ]}
          />
          <meshStandardMaterial color={ground.grass} roughness={0.95} metalness={0} />
        </mesh>
      </RigidBody>

      {/* Underside — tapered dirt cone hanging below the grass */}
      <mesh position={[0, -TUNING.island.underHeight / 2 - 0.3, 0]}>
        <coneGeometry
          args={[TUNING.island.radius * 0.96, TUNING.island.underHeight, 48]}
        />
        <meshStandardMaterial color={ground.dirtUnderside} roughness={0.95} metalness={0} />
      </mesh>

      {/* Mid dirt band — a darker ring at the grass/dirt interface */}
      <mesh position={[0, -TUNING.island.grassThickness / 2 - 0.05, 0]}>
        <cylinderGeometry
          args={[
            TUNING.island.radius * 0.965,
            TUNING.island.radius * 0.92,
            0.18,
            48,
          ]}
        />
        <meshStandardMaterial color={ground.dirtPath} roughness={0.95} metalness={0} />
      </mesh>

      {/* Subtle grass-shadow ring inside the island top, for depth */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, TUNING.island.grassThickness / 2 + 0.005, 0]}
      >
        <ringGeometry args={[TUNING.island.radius * 0.7, TUNING.island.radius * 0.95, 48]} />
        <meshStandardMaterial
          color={ground.grassShadow}
          transparent
          opacity={0.35}
          roughness={1}
          metalness={0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Winding dirt path — sits just above grass */}
      {pathSegments.map((seg, i) => (
        <mesh
          key={i}
          position={seg.pos}
          rotation={[0, seg.rot, 0]}
          receiveShadow
        >
          <boxGeometry args={[seg.len, 0.04, 0.85]} />
          <meshStandardMaterial color={ground.dirtPath} roughness={0.95} metalness={0} />
        </mesh>
      ))}

      {/* ── Decor ─────────────────────────────────────────────────────── */}
      {trees.map((t, i) => (
        <Tree
          key={`tree-${i}`}
          position={[t.pos[0], TUNING.island.grassThickness / 2, t.pos[2]]}
          scale={t.scale}
          variant={t.variant}
          phase={t.phase}
          reducedMotion={reducedMotion}
        />
      ))}

      {flowers.map((f, i) => (
        <Flower
          key={`flower-${i}`}
          position={[f.pos[0], TUNING.island.grassThickness / 2, f.pos[2]]}
          color={f.color}
          phase={f.phase}
          reducedMotion={reducedMotion}
        />
      ))}

      {rocks.map((r, i) => (
        <Rock
          key={`rock-${i}`}
          position={[r.pos[0], TUNING.island.grassThickness / 2, r.pos[2]]}
          scale={r.scale}
          rotationY={r.rot}
          seed={r.seed}
          color={ground.rock}
        />
      ))}

      {/* Cottage near the southwest */}
      <Cottage
        position={[-5.5, TUNING.island.grassThickness / 2, -1]}
        rotationY={Math.PI * 0.85}
      />

      {/* Pond */}
      <Pond
        position={[
          TUNING.island.pondPosition[0],
          TUNING.island.grassThickness / 2 + 0.02,
          TUNING.island.pondPosition[2],
        ]}
        radius={TUNING.island.pondRadius}
        color={ground.pondWater}
      />
    </group>
  );
}
