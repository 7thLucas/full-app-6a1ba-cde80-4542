import { forwardRef, useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import type { RapierRigidBody } from "@react-three/rapier";
import { ContactShadows } from "@react-three/drei";
import { TUNING } from "../constants/tuning";
import { CharacterMesh } from "./CharacterMesh";
import type { KeyState } from "../hooks/useKeyboard";

interface PlayerControllerProps {
  bodyColor: string;
  accentColor: string;
  keysRef: React.MutableRefObject<KeyState>;
  /** Position ref the camera reads each frame */
  playerPosRef: React.MutableRefObject<THREE.Vector3>;
  /** Whether input is currently allowed (the intro arc gates this). */
  inputEnabled: boolean;
  reducedMotion: boolean;
  /** Notify when the player has moved enough to count as "explored". */
  onFirstMove?: () => void;
}

export interface PlayerHandle {
  /** Get current world position (read-only — clone if you mutate). */
  position: THREE.Vector3;
}

/**
 * Capsule-physics player. Camera-relative WASD, Shift run, Space hop, E
 * surfaced via the keys ref (interactables observe it themselves).
 *
 * We use a kinematic-controlled dynamic body: linvel is overwritten each
 * frame for horizontal motion, but gravity still pulls Y. This keeps
 * Rapier collisions accurate without fighting the integrator.
 */
export const PlayerController = forwardRef<PlayerHandle, PlayerControllerProps>(
  function PlayerController(
    { bodyColor, accentColor, keysRef, playerPosRef, inputEnabled, reducedMotion, onFirstMove },
    ref,
  ) {
    const body = useRef<RapierRigidBody>(null);
    const meshGroup = useRef<THREE.Group>(null);
    const speedRef = useRef(0);
    const facingRef = useRef(0); // yaw the character mesh faces
    const groundedRef = useRef(false);
    const lastJumpRef = useRef(0);
    const firstMoveFired = useRef(false);

    const tmpVec = useRef(new THREE.Vector3());
    const inputDir = useRef(new THREE.Vector3());
    const camForward = useRef(new THREE.Vector3());
    const camRight = useRef(new THREE.Vector3());

    const { camera } = useThree();

    useImperativeHandle(ref, () => ({
      position: playerPosRef.current,
    }));

    useFrame((state) => {
      if (!body.current) return;
      const k = keysRef.current;

      // ── Compute camera-relative input ──────────────────────────────
      camera.getWorldDirection(camForward.current);
      camForward.current.y = 0;
      camForward.current.normalize();
      camRight.current.set(-camForward.current.z, 0, camForward.current.x);

      inputDir.current.set(0, 0, 0);
      if (inputEnabled) {
        if (k.forward) inputDir.current.add(camForward.current);
        if (k.backward) inputDir.current.sub(camForward.current);
        if (k.right) inputDir.current.add(camRight.current);
        if (k.left) inputDir.current.sub(camRight.current);
      }

      const inputMag = inputDir.current.length();
      if (inputMag > 0.001) {
        inputDir.current.normalize();
      }

      const speed =
        TUNING.player.walkSpeed * (k.run && inputEnabled ? TUNING.player.runMultiplier : 1);
      const desiredV = tmpVec.current
        .copy(inputDir.current)
        .multiplyScalar(inputMag > 0.001 ? speed : 0);

      // ── Apply horizontal velocity (preserve Y from gravity/jump) ───
      const currentV = body.current.linvel();
      body.current.setLinvel(
        { x: desiredV.x, y: currentV.y, z: desiredV.z },
        true,
      );

      // ── Track speed for animations ─────────────────────────────────
      speedRef.current = new THREE.Vector2(desiredV.x, desiredV.z).length();

      // ── Update facing (only if moving) ─────────────────────────────
      if (speedRef.current > 0.1) {
        facingRef.current = Math.atan2(desiredV.x, desiredV.z);
        if (!firstMoveFired.current) {
          firstMoveFired.current = true;
          onFirstMove?.();
        }
      }

      // ── Jump (Space) ───────────────────────────────────────────────
      const now = state.clock.getElapsedTime();
      const canJump =
        inputEnabled &&
        k.jump &&
        groundedRef.current &&
        now - lastJumpRef.current > 0.25;
      if (canJump) {
        body.current.setLinvel(
          { x: currentV.x, y: TUNING.player.jumpImpulse, z: currentV.z },
          true,
        );
        lastJumpRef.current = now;
        groundedRef.current = false;
        k.jump = false; // consume edge
      }

      // ── Track world position for camera ────────────────────────────
      const t = body.current.translation();
      playerPosRef.current.set(t.x, t.y, t.z);

      // ── Cheap grounded check: very low Y vel and near ground height ─
      // Island grass top is at y ≈ TUNING.island.grassThickness/2.
      const groundY = TUNING.island.grassThickness / 2;
      if (
        Math.abs(currentV.y) < 0.5 &&
        t.y < groundY + TUNING.player.height + 0.15
      ) {
        groundedRef.current = true;
      }
    });

    return (
      <>
        <RigidBody
          ref={body}
          colliders={false}
          position={[3, 2.5, 4]}
          enabledRotations={[false, false, false]}
          mass={1}
          linearDamping={4.0}
          angularDamping={1.0}
          ccd
        >
          <CapsuleCollider
            args={[TUNING.player.height / 2 - TUNING.player.radius, TUNING.player.radius]}
            position={[0, TUNING.player.height / 2 + TUNING.player.radius, 0]}
            friction={0.4}
          />
          {/* The visual mesh is offset so the capsule center is at y=height/2 */}
          <group ref={meshGroup}>
            <CharacterMesh
              bodyColor={bodyColor}
              accentColor={accentColor}
              speedRef={speedRef}
              facingRef={facingRef}
              reducedMotion={reducedMotion}
            />
          </group>
        </RigidBody>
      </>
    );
  },
);

/**
 * Soft contact shadow that follows the player. Rendered outside the
 * physics body so it doesn't inherit the capsule's vertical bobbing.
 *
 * NOTE: ContactShadows must live in the same Canvas tree but is split
 * out for clarity. It tracks the playerPosRef via a small wrapper.
 */
export function PlayerContactShadow({
  playerPosRef,
}: {
  playerPosRef: React.MutableRefObject<THREE.Vector3>;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    const p = playerPosRef.current;
    ref.current.position.set(p.x, TUNING.island.grassThickness / 2 + 0.03, p.z);
  });
  return (
    <group ref={ref}>
      <ContactShadows
        opacity={0.45}
        blur={2.2}
        scale={3}
        far={2}
        resolution={256}
        color="#2A2438"
        frames={1}
      />
    </group>
  );
}
