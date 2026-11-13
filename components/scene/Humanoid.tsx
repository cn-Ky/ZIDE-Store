'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Game } from '@/lib/games';
import { playerState } from '@/lib/input';
import GameBox from './GameBox';

type Props = {
  speed: { current: { v: number } };
  held?: Game | null;
  shirt?: string;
  pants?: string;
  skin?: string;
  hair?: string;
  shoes?: string;
  cap?: string | null;
  track?: { x: number; z: number; rot: number } | null;
  scale?: number;
};

/** Blok (voxel) tarzı yürüyen karakter. +Z yönüne bakar. */
export default function Humanoid({
  speed,
  held = null,
  shirt = '#ff2bd6',
  pants = '#1d1b4b',
  skin = '#f1c27d',
  hair = '#2b1b0f',
  shoes = '#00f0ff',
  cap = '#ffe14d',
  track = null,
  scale = 1,
}: Props) {
  const body = useRef<THREE.Group>(null!);
  const legL = useRef<THREE.Group>(null!);
  const legR = useRef<THREE.Group>(null!);
  const armL = useRef<THREE.Group>(null!);
  const armR = useRef<THREE.Group>(null!);
  const head = useRef<THREE.Group>(null!);
  const heldRef = useRef<THREE.Group>(null!);
  const phase = useRef(0);

  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const v = speed.current.v;
    const amp = Math.min(v, 1) * 0.85;
    phase.current += dt * 9 * v;
    const sw = Math.sin(phase.current) * amp;
    const t = state.clock.elapsedTime;

    legL.current.rotation.x = sw;
    legR.current.rotation.x = -sw;

    const raised = held !== null;
    const tl = raised ? -1.2 + Math.sin(t * 2) * 0.03 : -sw * 0.8;
    const tr = raised ? -1.2 + Math.sin(t * 2 + 1) * 0.03 : sw * 0.8;
    armL.current.rotation.x = THREE.MathUtils.damp(armL.current.rotation.x, tl, 12, dt);
    armR.current.rotation.x = THREE.MathUtils.damp(armR.current.rotation.x, tr, 12, dt);

    body.current.position.y = Math.abs(Math.sin(phase.current)) * 0.06 * Math.min(v, 1) + Math.sin(t * 2) * 0.008;

    if (track) {
      const target = Math.atan2(playerState.x - track.x, playerState.z - track.z) - track.rot;
      const d = Math.atan2(Math.sin(target), Math.cos(target));
      head.current.rotation.y = THREE.MathUtils.damp(head.current.rotation.y, THREE.MathUtils.clamp(d, -1, 1), 6, dt);
    }
    if (heldRef.current) heldRef.current.position.y = 1.4 + Math.sin(t * 3) * 0.015;
  });

  return (
    <group scale={scale}>
      <mesh rotation-x={-Math.PI / 2} position-y={0.02}>
        <circleGeometry args={[0.45, 20]} />
        <meshBasicMaterial color="#000" transparent opacity={0.4} depthWrite={false} />
      </mesh>

      <group ref={body}>
        {/* bacaklar */}
        <group ref={legL} position={[-0.14, 0.62, 0]}>
          <mesh position={[0, -0.3, 0]}>
            <boxGeometry args={[0.2, 0.62, 0.22]} />
            <meshStandardMaterial color={pants} roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.58, 0.04]}>
            <boxGeometry args={[0.22, 0.12, 0.34]} />
            <meshStandardMaterial color={shoes} roughness={0.5} emissive={shoes} emissiveIntensity={0.25} />
          </mesh>
        </group>
        <group ref={legR} position={[0.14, 0.62, 0]}>
          <mesh position={[0, -0.3, 0]}>
            <boxGeometry args={[0.2, 0.62, 0.22]} />
            <meshStandardMaterial color={pants} roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.58, 0.04]}>
            <boxGeometry args={[0.22, 0.12, 0.34]} />
            <meshStandardMaterial color={shoes} roughness={0.5} emissive={shoes} emissiveIntensity={0.25} />
          </mesh>
        </group>

        {/* gövde */}
        <mesh position={[0, 0.96, 0]}>
          <boxGeometry args={[0.56, 0.68, 0.3]} />
          <meshStandardMaterial color={shirt} roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.04, 0]}>
          <boxGeometry args={[0.575, 0.1, 0.315]} />
          <meshStandardMaterial color="#ffffff" roughness={0.6} />
        </mesh>

        {/* kollar */}
        <group ref={armL} position={[-0.37, 1.25, 0]}>
          <mesh position={[0, -0.27, 0]}>
            <boxGeometry args={[0.16, 0.56, 0.18]} />
            <meshStandardMaterial color={shirt} roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.6, 0]}>
            <boxGeometry args={[0.15, 0.14, 0.15]} />
            <meshStandardMaterial color={skin} roughness={0.8} />
          </mesh>
        </group>
        <group ref={armR} position={[0.37, 1.25, 0]}>
          <mesh position={[0, -0.27, 0]}>
            <boxGeometry args={[0.16, 0.56, 0.18]} />
            <meshStandardMaterial color={shirt} roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.6, 0]}>
            <boxGeometry args={[0.15, 0.14, 0.15]} />
            <meshStandardMaterial color={skin} roughness={0.8} />
          </mesh>
        </group>

        {/* baş */}
        <group ref={head} position={[0, 1.53, 0]}>
          <mesh>
            <boxGeometry args={[0.42, 0.42, 0.42]} />
            <meshStandardMaterial color={skin} roughness={0.8} />
          </mesh>
          <mesh position={[-0.1, 0.03, 0.215]}>
            <boxGeometry args={[0.06, 0.08, 0.02]} />
            <meshBasicMaterial color="#120a1f" />
          </mesh>
          <mesh position={[0.1, 0.03, 0.215]}>
            <boxGeometry args={[0.06, 0.08, 0.02]} />
            <meshBasicMaterial color="#120a1f" />
          </mesh>
          <mesh position={[0, -0.1, 0.215]}>
            <boxGeometry args={[0.12, 0.03, 0.02]} />
            <meshBasicMaterial color="#8a2640" />
          </mesh>
          {/* saç */}
          <mesh position={[0, 0.17, -0.01]}>
            <boxGeometry args={[0.44, 0.12, 0.44]} />
            <meshStandardMaterial color={hair} roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.0, -0.17]}>
            <boxGeometry args={[0.44, 0.34, 0.1]} />
            <meshStandardMaterial color={hair} roughness={0.9} />
          </mesh>
          {cap && (
            <group>
              <mesh position={[0, 0.25, 0]}>
                <boxGeometry args={[0.46, 0.1, 0.46]} />
                <meshStandardMaterial color={cap} roughness={0.6} />
              </mesh>
              <mesh position={[0, 0.21, 0.3]}>
                <boxGeometry args={[0.4, 0.04, 0.2]} />
                <meshStandardMaterial color={cap} roughness={0.6} />
              </mesh>
            </group>
          )}
        </group>
      </group>

      {/* elindeki oyun */}
      {held && (
        <group ref={heldRef} position={[0, 1.4, 0.5]} rotation={[-0.15, 0, 0]} scale={0.6}>
          <GameBox game={held} />
        </group>
      )}
    </group>
  );
}
