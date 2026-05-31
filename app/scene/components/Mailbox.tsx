import { Html } from "@react-three/drei";
import { RigidBody, CuboidCollider } from "@react-three/rapier";

interface MailboxProps {
  position: [number, number, number];
  inRange: boolean;
  open: boolean;
  note: string;
  rotationY?: number;
}

export function Mailbox({ position, inRange, open, note, rotationY = 0 }: MailboxProps) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[0.25, 0.6, 0.25]} position={[0, 0.6, 0]} />
        {/* Post */}
        <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.06, 0.07, 1, 8]} />
          <meshStandardMaterial color="#7A4B30" roughness={0.9} metalness={0} />
        </mesh>
        {/* Box body */}
        <mesh castShadow receiveShadow position={[0, 1.1, 0]}>
          <boxGeometry args={[0.5, 0.35, 0.7]} />
          <meshStandardMaterial color="#3D6BB0" roughness={0.7} metalness={0} />
        </mesh>
        {/* Rounded top — half cylinder */}
        <mesh castShadow receiveShadow position={[0, 1.28, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.25, 0.25, 0.5, 12, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#3D6BB0" roughness={0.7} metalness={0} />
        </mesh>
        {/* Door (front) */}
        <mesh castShadow position={[0, 1.1, 0.36]}>
          <boxGeometry args={[0.4, 0.3, 0.02]} />
          <meshStandardMaterial color="#2C5495" roughness={0.7} metalness={0} />
        </mesh>
        {/* Flag */}
        <mesh
          castShadow
          position={[0.28, 1.25, 0]}
          rotation={[0, 0, open ? Math.PI / 6 : 0]}
        >
          <boxGeometry args={[0.02, 0.3, 0.02]} />
          <meshStandardMaterial color="#7A4B30" roughness={0.9} metalness={0} />
        </mesh>
        <mesh
          castShadow
          position={[0.4, 1.32, 0]}
          rotation={[0, 0, open ? Math.PI / 6 : 0]}
        >
          <boxGeometry args={[0.16, 0.12, 0.02]} />
          <meshStandardMaterial color="#E94C5A" roughness={0.85} metalness={0} />
        </mesh>
      </RigidBody>

      {/* Floating prompt when in range, not yet opened */}
      {inRange && !open && (
        <Html position={[0, 1.85, 0]} center distanceFactor={8} zIndexRange={[40, 0]}>
          <div
            style={{
              background: "rgba(42, 36, 56, 0.85)",
              color: "#FBF4E4",
              padding: "6px 10px",
              borderRadius: 12,
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.02em",
              whiteSpace: "nowrap",
              boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
              backdropFilter: "blur(8px)",
              pointerEvents: "none",
            }}
          >
            Press E to open
          </div>
        </Html>
      )}

      {/* Opened note */}
      {open && (
        <Html position={[0, 2.1, 0]} center distanceFactor={7} zIndexRange={[40, 0]}>
          <div
            style={{
              background: "#FBF4E4",
              color: "#2A2438",
              padding: "12px 16px",
              borderRadius: 14,
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 13,
              maxWidth: 240,
              lineHeight: 1.4,
              boxShadow: "0 12px 32px rgba(42,36,56,0.35)",
              border: "1px solid rgba(122, 75, 48, 0.25)",
              pointerEvents: "none",
            }}
          >
            {note}
          </div>
        </Html>
      )}
    </group>
  );
}
