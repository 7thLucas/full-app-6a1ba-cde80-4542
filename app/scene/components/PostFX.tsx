import {
  EffectComposer,
  Bloom,
  Vignette,
  SMAA,
  N8AO,
} from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
import { TUNING } from "../constants/tuning";

interface PostFXProps {
  bloomIntensity: number;
}

/**
 * Postprocessing chain.
 *   N8AO  → grounds objects with subtle SSAO-style occlusion
 *   Bloom → selective via luminance threshold; only crystal emissives
 *           pop bright enough to trigger it
 *   Vignette → cinematic edge falloff
 *   SMAA   → cheap clean edge AA, better than FXAA, lighter than TAA
 *
 * Order matters: AO first (depth-based) → Bloom → Vignette → SMAA.
 */
export function PostFX({ bloomIntensity }: PostFXProps) {
  return (
    <EffectComposer multisampling={0} enableNormalPass>
      <N8AO
        intensity={TUNING.post.ssaoIntensity / 6}
        aoRadius={1.2}
        distanceFalloff={0.4}
        quality="medium"
        color="black"
      />
      <Bloom
        intensity={bloomIntensity}
        luminanceThreshold={TUNING.post.bloomLuminanceThreshold}
        luminanceSmoothing={TUNING.post.bloomLuminanceSmoothing}
        kernelSize={KernelSize.LARGE}
        mipmapBlur
      />
      <Vignette
        offset={TUNING.post.vignetteOffset}
        darkness={TUNING.post.vignetteDarkness}
        blendFunction={BlendFunction.NORMAL}
      />
      <SMAA />
    </EffectComposer>
  );
}
