import { useCallback, useMemo, useState } from "react";

/**
 * Vertical-slice game state. Single source of truth for:
 *  - which quest step is active
 *  - which fruits the player has collected
 *  - whether the villager has been spoken to
 *  - whether the mailbox note is showing
 *
 * Intentionally minimal — no persistence, no save/load. The slice resets
 * on every reload (that's a feature, not a bug — the reveal sells itself
 * fresh each visit).
 */

export type QuestStep = "explore" | "talk" | "collect" | "done";

export interface GameState {
  step: QuestStep;
  fruitsCollected: number;
  talkedToVillager: boolean;
  mailboxOpen: boolean;
  collectedFruitIds: Set<string>;
}

export interface GameApi {
  state: GameState;
  collectFruit: (id: string) => void;
  talkToVillager: () => void;
  toggleMailbox: (open?: boolean) => void;
  /** Called once after the intro arc finishes and the player has moved. */
  markExplored: () => void;
}

const TOTAL_FRUITS = 3;

export function useGameState(): GameApi {
  const [step, setStep] = useState<QuestStep>("explore");
  const [fruitsCollected, setFruitsCollected] = useState(0);
  const [talkedToVillager, setTalkedToVillager] = useState(false);
  const [mailboxOpen, setMailboxOpen] = useState(false);
  const [collectedFruitIds, setCollectedFruitIds] = useState<Set<string>>(
    () => new Set(),
  );

  const markExplored = useCallback(() => {
    setStep((cur) => (cur === "explore" ? "talk" : cur));
  }, []);

  const talkToVillager = useCallback(() => {
    setTalkedToVillager(true);
    setStep((cur) => (cur === "talk" || cur === "explore" ? "collect" : cur));
  }, []);

  const toggleMailbox = useCallback((open?: boolean) => {
    setMailboxOpen((cur) => (typeof open === "boolean" ? open : !cur));
  }, []);

  const collectFruit = useCallback(
    (id: string) => {
      setCollectedFruitIds((prev) => {
        if (prev.has(id)) return prev;
        const next = new Set(prev);
        next.add(id);
        const count = next.size;
        setFruitsCollected(count);
        if (count >= TOTAL_FRUITS) {
          setStep("done");
        }
        return next;
      });
    },
    [],
  );

  const state: GameState = useMemo(
    () => ({
      step,
      fruitsCollected,
      talkedToVillager,
      mailboxOpen,
      collectedFruitIds,
    }),
    [step, fruitsCollected, talkedToVillager, mailboxOpen, collectedFruitIds],
  );

  return { state, collectFruit, talkToVillager, toggleMailbox, markExplored };
}

export const TOTAL_FRUIT_COUNT = TOTAL_FRUITS;
