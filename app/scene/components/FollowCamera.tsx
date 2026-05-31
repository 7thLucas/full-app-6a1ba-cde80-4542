import { useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { TUNING } from "../constants/tuning";

interface FollowCameraProps {
  targetRef: React.MutableRefObject<THREE.Vector3>;
  /** Seconds elapsed since mount (driven by parent for sync with input gate). */
  introProgress: number; // 0..1, 1 = intro done
}

/**
 * Third-person follow camera.
 *
 *   Intro arc (introProgress < 1):
 *     orbits from a high cinematic position down to the follow position.
 *
 *   Follow (introProgress >= 1):
 *     dampened position + lookAt lerp toward player.
 *
 * The arc parameters live in TUNING.camera.intro*.
 */
export function FollowCamera({ targetRef, introProgress }: FollowCameraProps) {
  const { camera } = useThree();
  const tmpTarget = useRef(new THREE.Vector3());
  const lookAtTarget = useRef(new THREE.Vector3());
  const lookAtCurrent = useRef(new THREE.Vector3());
  const desiredPos = useRef(new THREE.Vector3());

  // initialize FOV once
  const fovInitialized = useRef(false);
  if (!fovInitialized.current) {
    if ((camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
      (camera as THREE.PerspectiveCamera).fov = TUNING.camera.fov;
      (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
    }
    fovInitialized.current = true;
  }

  useFrame(() => {
    const p = targetRef.current;
    // Eye target is a bit above the capsule center so we look at the head
    tmpTarget.current.set(p.x, p.y + 1.1, p.z);
    lookAtTarget.current.copy(tmpTarget.current);

    // ── Compute follow position behind/above target ──────────────────
    const pitchRad = (TUNING.camera.pitchDegrees * Math.PI) / 180;
    const followDist = TUNING.camera.distance;
    const followHeight = TUNING.camera.height;

    // Follow direction = behind the camera's current yaw, projected onto XZ.
    // For a stationary scene this means the camera stays in roughly the
    // same orbital position. We compute an azimuth from camera's current XZ
    // relative to player so the camera stays where the player put it.
    const dx = camera.position.x - p.x;
    const dz = camera.position.z - p.z;
    const azimuth = Math.atan2(dx, dz);

    const followX = p.x + Math.sin(azimuth) * followDist * Math.cos(pitchRad);
    const followZ = p.z + Math.cos(azimuth) * followDist * Math.cos(pitchRad);
    const followY = p.y + followHeight;

    const followPos = desiredPos.current.set(followX, followY, followZ);

    if (introProgress < 1.0) {
      // ── Intro arc ────────────────────────────────────────────────
      // Ease-in-out from a high orbit to the follow pos
      const t = easeInOutCubic(introProgress);
      const startAngle = TUNING.camera.introStartAngle;
      const startDist = TUNING.camera.introStartDistance;
      const startH = TUNING.camera.introStartHeight;

      const orbitAngle = startAngle + (azimuth - startAngle) * t;
      const dist = startDist + (followDist - startDist) * t;
      const h = startH + (followY - startH) * t;
      const x = p.x + Math.sin(orbitAngle) * dist * Math.cos(pitchRad);
      const z = p.z + Math.cos(orbitAngle) * dist * Math.cos(pitchRad);

      camera.position.set(x, h, z);
      // During intro, look directly at player (no smoothing — we want crisp arc)
      lookAtCurrent.current.copy(lookAtTarget.current);
      camera.lookAt(lookAtCurrent.current);
      return;
    }

    // ── Steady-state follow ─────────────────────────────────────────
    camera.position.lerp(followPos, TUNING.camera.positionLerp);
    lookAtCurrent.current.lerp(lookAtTarget.current, TUNING.camera.lookAtLerp);
    camera.lookAt(lookAtCurrent.current);
  });

  return null;
}

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
