import { useEffect, useState } from "react";
import { useConfigurables } from "~/modules/configurables";

/**
 * Driftholm — index route.
 *
 * The R3F Canvas is client-only (it pokes WebGL on mount). We render a
 * configurable sunset gradient on the server + first paint, then swap
 * in the full <App /> after hydration. This is exactly the spec: the
 * reveal IS the loading state.
 */
export default function IndexPage() {
  const [SceneApp, setSceneApp] = useState<React.ComponentType | null>(null);
  const { config } = useConfigurables();

  useEffect(() => {
    let cancelled = false;
    // Dynamic import so three / R3F / rapier only ship to the client
    import("~/scene/App").then((mod) => {
      if (cancelled) return;
      setSceneApp(() => mod.App);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // SSR + pre-hydration fallback: a sunset gradient panel (no spinner).
  const skyZenith = config?.skyPalette?.zenith ?? "#5B2A86";
  const skyMid = config?.skyPalette?.mid ?? "#C0408C";
  const skyHorizon = config?.skyPalette?.horizon ?? "#FF8A5C";

  if (!SceneApp) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          margin: 0,
          background: `linear-gradient(180deg, ${skyZenith} 0%, ${skyMid} 55%, ${skyHorizon} 100%)`,
          overflow: "hidden",
        }}
      />
    );
  }

  return <SceneApp />;
}
