import { useEffect, useRef } from "react";

/**
 * Pressed-keys ref shared across the player controller + interactables.
 * Returns a stable ref whose `.current` is mutated by the global handlers.
 *
 * Why a ref and not state? — the player controller runs inside R3F's
 * useFrame loop. We don't want React re-renders for every keydown; we
 * want the latest input read in the next frame.
 */
export type KeyState = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  run: boolean;
  jump: boolean;
  interact: boolean;
  /** Edge-triggered interact (true for exactly one frame after press). */
  interactPressed: boolean;
};

export function createKeyState(): KeyState {
  return {
    forward: false,
    backward: false,
    left: false,
    right: false,
    run: false,
    jump: false,
    interact: false,
    interactPressed: false,
  };
}

export function useKeyboard() {
  const keys = useRef<KeyState>(createKeyState());

  useEffect(() => {
    const setKey = (e: KeyboardEvent, down: boolean) => {
      // Ignore when typing in inputs
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }

      const k = keys.current;
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          k.forward = down;
          break;
        case "KeyS":
        case "ArrowDown":
          k.backward = down;
          break;
        case "KeyA":
        case "ArrowLeft":
          k.left = down;
          break;
        case "KeyD":
        case "ArrowRight":
          k.right = down;
          break;
        case "ShiftLeft":
        case "ShiftRight":
          k.run = down;
          break;
        case "Space":
          if (down && !k.jump) {
            k.jump = true;
          } else if (!down) {
            k.jump = false;
          }
          e.preventDefault();
          break;
        case "KeyE":
          if (down && !k.interact) {
            k.interactPressed = true;
          }
          k.interact = down;
          break;
      }
    };

    const onDown = (e: KeyboardEvent) => setKey(e, true);
    const onUp = (e: KeyboardEvent) => setKey(e, false);

    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);

    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, []);

  return keys;
}
