import * as THREE from "three";
import { Sparkles } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { SkyDome } from "./SkyDome";
import { TUNING } from "../constants/tuning";

/**
 * Environment — sky, fog, hemisphere + sun lighting, drifting sparkles.
 * Everything ambient. No interactivity.
 */
interface EnvironmentProps {
  sky: { zenith: string; mid: string; horizon: string; sun: string; fog: string };
  sparklesColor: string;
  sunIntensity: number;
}

export function Environment({ sky, sparklesColor, sunIntensity }: EnvironmentProps) {
  const { scene } = useThree();

  // Fog matches horizon tint for atmospheric haze depth
  useEffect(() => {
    scene.fog = new THREE.Fog(sky.fog, TUNING.atmosphere.fogNear, TUNING.atmosphere.fogFar);
    return () => {
      scene.fog = null;
    };
  }, [scene, sky.fog]);

  const sunPos = useMemo<[number, number, number]>(
    () => TUNING.atmosphere.sunPosition as [number, number, number],
    [],
  );

  return (
    <>
      <SkyDome zenith={sky.zenith} mid={sky.mid} horizon={sky.horizon} sun={sky.sun} />

      {/* Cool sky ↔ warm ground hemisphere ambient */}
      <hemisphereLight
        color={TUNING.atmosphere.hemisphereSkyColor}
        groundColor={TUNING.atmosphere.hemisphereGroundColor}
        intensity={TUNING.atmosphere.hemisphereIntensity}
      />

      {/* Warm directional sun with soft PCF shadows */}
      <directionalLight
        position={sunPos}
        intensity={sunIntensity}
        color={TUNING.atmosphere.sunColor}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0005}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
      />

      {/* Drifting motes — diegetic atmosphere particles */}
      <Sparkles
        count={TUNING.particles.sparklesCount}
        scale={TUNING.particles.sparklesScale}
        size={TUNING.particles.sparklesSize}
        speed={TUNING.particles.sparklesSpeed}
        color={sparklesColor}
        position={[0, 4, 0]}
        noise={0.7}
      />
    </>
  );
}
