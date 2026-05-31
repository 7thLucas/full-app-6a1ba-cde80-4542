import { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Float, Sparkles, Html } from "@react-three/drei";
import { Crystal } from "./Crystal";
import { Mailbox } from "./Mailbox";
import { TUNING } from "../constants/tuning";
import type { KeyState } from "../hooks/useKeyboard";

interface InteractablesProps {
  playerPosRef: React.MutableRefObject<THREE.Vector3>;
  keysRef: React.MutableRefObject<KeyState>;
  inputEnabled: boolean;
  fruitColor: string;
  fruitHighlight: string;
  crystalColor: string;
  sparklesColor: string;
  collectedIds: Set<string>;
  onCollectFruit: (id: string) => void;
  onToggleMailbox: (open?: boolean) => void;
  mailboxOpen: boolean;
  mailboxNote: string;
}

interface FruitDef {
  id: string;
  position: [number, number, number];
}

const FRUITS: FruitDef[] = [
  { id: "fruit-1", position: [-6.2, 1.6, -3.4] },   // near tree 1
  { id: "fruit-2", position: [-4.2, 1.6, 5.5] },    // near tree 4
  { id: "fruit-3", position: [7.0, 1.55, 3.4] },    // near tree 6
];

const MAILBOX_POS: [number, number, number] = [-3.5, 0.3, 0.5]; // in front of cottage
const CRYSTALS: Array<{ pos: [number, number, number]; scale: number }> = [
  { pos: [0, 4.5, 0], scale: 0.55 },
  { pos: [-4.0, 5.2, -5.0], scale: 0.45 },
  { pos: [5.2, 5.4, 2.8], scale: 0.65 },
];

export function Interactables({
  playerPosRef,
  keysRef,
  inputEnabled,
  fruitColor,
  fruitHighlight,
  crystalColor,
  sparklesColor,
  collectedIds,
  onCollectFruit,
  onToggleMailbox,
  mailboxOpen,
  mailboxNote,
}: InteractablesProps) {
  return (
    <>
      {/* ── Floating magical crystals (bloom targets) ──────────────────── */}
      {CRYSTALS.map((c, i) => (
        <Crystal key={`crystal-${i}`} position={c.pos} scale={c.scale} color={crystalColor} />
      ))}

      {/* ── Collectible fruits ─────────────────────────────────────────── */}
      {FRUITS.map((f) => (
        <Fruit
          key={f.id}
          id={f.id}
          position={f.position}
          color={fruitColor}
          highlight={fruitHighlight}
          sparklesColor={sparklesColor}
          collected={collectedIds.has(f.id)}
          playerPosRef={playerPosRef}
          keysRef={keysRef}
          inputEnabled={inputEnabled}
          onCollect={onCollectFruit}
        />
      ))}

      {/* ── Mailbox ─────────────────────────────────────────────────────── */}
      <MailboxInteractable
        position={MAILBOX_POS}
        playerPosRef={playerPosRef}
        keysRef={keysRef}
        inputEnabled={inputEnabled}
        open={mailboxOpen}
        onToggle={onToggleMailbox}
        note={mailboxNote}
      />
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Fruit

interface FruitProps {
  id: string;
  position: [number, number, number];
  color: string;
  highlight: string;
  sparklesColor: string;
  collected: boolean;
  playerPosRef: React.MutableRefObject<THREE.Vector3>;
  keysRef: React.MutableRefObject<KeyState>;
  inputEnabled: boolean;
  onCollect: (id: string) => void;
}

function Fruit({
  id,
  position,
  color,
  highlight,
  sparklesColor,
  collected,
  playerPosRef,
  keysRef,
  inputEnabled,
  onCollect,
}: FruitProps) {
  const [inRange, setInRange] = useState(false);
  const [poppedAt, setPoppedAt] = useState<number | null>(null);
  const fruitRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (collected && poppedAt === null) {
      setPoppedAt(state.clock.getElapsedTime());
    }
    if (collected) {
      // Pop animation: scale up briefly then fade. After 1.2s, fully hidden.
      const t = state.clock.getElapsedTime() - (poppedAt ?? state.clock.getElapsedTime());
      if (fruitRef.current) {
        const s = Math.max(0, 1 - t * 1.5);
        fruitRef.current.scale.setScalar(s * 1.1);
      }
      return;
    }

    const dx = playerPosRef.current.x - position[0];
    const dz = playerPosRef.current.z - position[2];
    const dy = playerPosRef.current.y + 1 - position[1];
    const dist = Math.sqrt(dx * dx + dz * dz + dy * dy);
    const r = dist <= TUNING.interaction.pickupRange;
    if (r !== inRange) setInRange(r);

    if (r && inputEnabled && keysRef.current.interactPressed) {
      keysRef.current.interactPressed = false;
      onCollect(id);
    }
  });

  // Hide entirely shortly after pop
  const fullyGone =
    collected && poppedAt !== null && performance.now() / 1000 - poppedAt > 1.2;
  if (fullyGone) {
    // Render a brief sparkle pulse — Sparkles fades naturally
    return (
      <Sparkles
        position={position}
        count={20}
        scale={1.2}
        size={3}
        speed={0.6}
        color={sparklesColor}
      />
    );
  }

  return (
    <group ref={fruitRef} position={position}>
      <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.8}>
        {/* Berry body */}
        <mesh castShadow>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial
            color={color}
            roughness={0.6}
            metalness={0}
            emissive={highlight}
            emissiveIntensity={0.15}
          />
        </mesh>
        {/* Highlight cap (a tiny stem-leaf composite) */}
        <mesh position={[0, 0.16, 0]}>
          <coneGeometry args={[0.07, 0.1, 6]} />
          <meshStandardMaterial color="#4F8F4A" roughness={0.95} metalness={0} />
        </mesh>
        {/* Tiny gleam sphere */}
        <mesh position={[-0.06, 0.05, 0.13]} scale={[1, 1, 1]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial
            color={"#FFFFFF"}
            emissive={"#FFFFFF"}
            emissiveIntensity={0.5}
            roughness={0.2}
          />
        </mesh>
      </Float>
      {!collected && (
        <Sparkles
          count={10}
          scale={0.6}
          size={2}
          speed={0.4}
          color={sparklesColor}
        />
      )}
      {inRange && !collected && (
        <Html position={[0, 0.55, 0]} center distanceFactor={7} zIndexRange={[40, 0]} pointerEvents="none">
          <div
            style={{
              background: "rgba(42, 36, 56, 0.85)",
              color: "#FBF4E4",
              padding: "5px 9px",
              borderRadius: 10,
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 11,
              fontWeight: 600,
              whiteSpace: "nowrap",
              boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
              backdropFilter: "blur(8px)",
            }}
          >
            Press E to pick
          </div>
        </Html>
      )}
    </group>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Mailbox

interface MailboxInteractableProps {
  position: [number, number, number];
  playerPosRef: React.MutableRefObject<THREE.Vector3>;
  keysRef: React.MutableRefObject<KeyState>;
  inputEnabled: boolean;
  open: boolean;
  onToggle: (open?: boolean) => void;
  note: string;
}

function MailboxInteractable({
  position,
  playerPosRef,
  keysRef,
  inputEnabled,
  open,
  onToggle,
  note,
}: MailboxInteractableProps) {
  const [inRange, setInRange] = useState(false);

  useFrame(() => {
    const dx = playerPosRef.current.x - position[0];
    const dz = playerPosRef.current.z - position[2];
    const dist = Math.sqrt(dx * dx + dz * dz);
    const r = dist <= TUNING.interaction.mailboxRange;
    if (r !== inRange) setInRange(r);

    if (r && inputEnabled && keysRef.current.interactPressed) {
      keysRef.current.interactPressed = false;
      onToggle();
    }
    // Auto-close when player walks away
    if (!r && open) {
      onToggle(false);
    }
  });

  return <Mailbox position={position} inRange={inRange} open={open} note={note} />;
}
