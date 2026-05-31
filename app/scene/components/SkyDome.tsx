import { useMemo } from "react";
import * as THREE from "three";

/**
 * Procedural sunset sky — a large back-side sphere with a custom
 * vertex/fragment shader that mixes three color stops (horizon → mid → zenith)
 * plus a soft sun disc. No textures, no external assets.
 *
 * The shader is intentionally simple: a vertical gradient driven by the
 * world-space Y direction of the view ray, plus a smooth radial sun.
 */
interface SkyDomeProps {
  zenith: string;
  mid: string;
  horizon: string;
  sun: string;
}

const vertexShader = /* glsl */ `
  varying vec3 vWorldDir;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldDir = normalize(worldPos.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec3 vWorldDir;
  uniform vec3 uZenith;
  uniform vec3 uMid;
  uniform vec3 uHorizon;
  uniform vec3 uSun;
  uniform vec3 uSunDir;

  void main() {
    // Map vertical direction → [0,1] from horizon to zenith
    float t = clamp(vWorldDir.y * 0.5 + 0.5, 0.0, 1.0);

    // Three-stop gradient: horizon (t=0) → mid (t~0.55) → zenith (t=1)
    vec3 lower = mix(uHorizon, uMid, smoothstep(0.0, 0.55, t));
    vec3 sky = mix(lower, uZenith, smoothstep(0.55, 1.0, t));

    // Sun disc — soft, large
    float sunDot = dot(normalize(vWorldDir), normalize(uSunDir));
    float sunDisc = smoothstep(0.985, 0.9985, sunDot);
    float sunHalo = smoothstep(0.85, 1.0, sunDot) * 0.45;
    vec3 sun = uSun * (sunDisc + sunHalo);

    gl_FragColor = vec4(sky + sun, 1.0);
  }
`;

export function SkyDome({ zenith, mid, horizon, sun }: SkyDomeProps) {
  const uniforms = useMemo(
    () => ({
      uZenith: { value: new THREE.Color(zenith) },
      uMid: { value: new THREE.Color(mid) },
      uHorizon: { value: new THREE.Color(horizon) },
      uSun: { value: new THREE.Color(sun) },
      uSunDir: { value: new THREE.Vector3(0.55, 0.35, 0.4).normalize() },
    }),
    // re-init only on color change
    [zenith, mid, horizon, sun],
  );

  return (
    <mesh scale={[1, 1, 1]} frustumCulled={false}>
      <sphereGeometry args={[120, 32, 16]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.BackSide}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
