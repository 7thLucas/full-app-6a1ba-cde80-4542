import { useEffect, useState } from "react";

interface HUDProps {
  appName: string;
  tagline?: string;
  welcomeMessage?: string;
  questSteps: string[];
  currentStepIndex: number;
  fruitsCollected: number;
  totalFruits: number;
  introDone: boolean;
  showQuestBubble: boolean;
  showControlsHint: boolean;
  brandColor: { primary: string; secondary: string; accent: string };
}

/**
 * 2D HUD overlay. Rendered on top of the Canvas via absolute positioning.
 *
 *   Top-left:   Quest bubble (current step + progress)
 *   Top-right:  App brand chip (name + tagline)
 *   Center:     Welcome banner during intro arc (fades out)
 *   Bottom:     Controls hint (subtle)
 *
 * Apple HIG-inspired: deferential, blurred panels, no fighting for attention.
 */
export function HUD({
  appName,
  tagline,
  welcomeMessage,
  questSteps,
  currentStepIndex,
  fruitsCollected,
  totalFruits,
  introDone,
  showQuestBubble,
  showControlsHint,
  brandColor,
}: HUDProps) {
  const [welcomeVisible, setWelcomeVisible] = useState(true);

  // After intro is done, fade the welcome banner over ~1.5s
  useEffect(() => {
    if (!introDone) return;
    const t = setTimeout(() => setWelcomeVisible(false), 1600);
    return () => clearTimeout(t);
  }, [introDone]);

  const currentStep =
    currentStepIndex < questSteps.length ? questSteps[currentStepIndex] : "Sunset rest";
  const isCollectStep = currentStep?.toLowerCase().includes("collect");

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
        color: "#FBF4E4",
        userSelect: "none",
      }}
    >
      {/* ── Brand chip (top-right) ─────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "rgba(42, 36, 56, 0.55)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          padding: "10px 14px",
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          gap: 10,
          boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: brandColor.accent,
            boxShadow: `0 0 12px ${brandColor.accent}`,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.04em",
            }}
          >
            {appName}
          </span>
          {tagline && (
            <span
              style={{
                fontSize: 10,
                opacity: 0.75,
                fontWeight: 500,
                letterSpacing: "0.02em",
                maxWidth: 220,
              }}
            >
              {tagline}
            </span>
          )}
        </div>
      </div>

      {/* ── Quest bubble (top-left) ────────────────────────────────────── */}
      {showQuestBubble && introDone && (
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            background: "rgba(42, 36, 56, 0.78)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            padding: "12px 16px",
            borderRadius: 16,
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,255,255,0.08)",
            maxWidth: 280,
            display: "flex",
            flexDirection: "column",
            gap: 4,
            animation: "drift-fade-in 0.6s ease-out both",
          }}
        >
          <div
            style={{
              fontSize: 10,
              opacity: 0.6,
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              fontWeight: 700,
              color: brandColor.accent,
            }}
          >
            Quest
          </div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: "0.01em",
              textShadow: "0 1px 4px rgba(0,0,0,0.35)",
            }}
          >
            {currentStep}
          </div>
          {isCollectStep && (
            <div
              style={{
                fontSize: 12,
                fontWeight: 500,
                opacity: 0.85,
                marginTop: 4,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: brandColor.primary,
                }}
              />
              {fruitsCollected} / {totalFruits} fruits
            </div>
          )}
          {currentStepIndex >= questSteps.length && (
            <div
              style={{
                fontSize: 12,
                fontWeight: 500,
                opacity: 0.9,
                marginTop: 4,
              }}
            >
              You did everything you came here to do.
            </div>
          )}
        </div>
      )}

      {/* ── Welcome banner (center, intro only) ────────────────────────── */}
      {welcomeVisible && welcomeMessage && (
        <div
          style={{
            position: "absolute",
            top: "32%",
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            opacity: introDone ? 0 : 1,
            transition: "opacity 1.4s ease",
          }}
        >
          <div
            style={{
              padding: "10px 22px",
              borderRadius: 999,
              background: "rgba(42, 36, 56, 0.5)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)",
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: "0.04em",
              boxShadow: "0 12px 28px rgba(0,0,0,0.3)",
              textShadow: "0 1px 4px rgba(0,0,0,0.45)",
            }}
          >
            {welcomeMessage}
          </div>
        </div>
      )}

      {/* ── Controls hint (bottom center) ───────────────────────────────── */}
      {showControlsHint && introDone && (
        <div
          style={{
            position: "absolute",
            bottom: 18,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: 10,
            opacity: 0.78,
            animation: "drift-fade-in 0.8s ease-out 0.2s both",
          }}
        >
          {[
            { key: "WASD", label: "Move" },
            { key: "Shift", label: "Run" },
            { key: "Space", label: "Hop" },
            { key: "E", label: "Interact" },
          ].map((c) => (
            <div
              key={c.key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(42, 36, 56, 0.55)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                padding: "5px 10px",
                borderRadius: 10,
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.04em",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span
                style={{
                  background: "rgba(255,255,255,0.12)",
                  padding: "2px 6px",
                  borderRadius: 5,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                }}
              >
                {c.key}
              </span>
              <span style={{ opacity: 0.8 }}>{c.label}</span>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes drift-fade-in {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
