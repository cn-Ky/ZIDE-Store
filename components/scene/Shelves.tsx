'use client';

import { useMemo, useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import GameBox from './GameBox';
import { GAMES } from '@/lib/games';
import { useStore } from '@/lib/store';
import { playerState } from '@/lib/input';
import { signTexture } from '@/lib/signs';
import { sfx } from '@/lib/sfx';
import { COLS, GAME_SLOTS, SHELVES, SHELF_D, SHELF_H, SHELF_W, SLOTS_PER_SHELF, TIER_Y, slotLocal, type ShelfDef } from '@/lib/layout';

const LABEL_COLORS = ['#ff2bd6', '#00f0ff', '#ffe14d'];

export default function Shelves() {
  return (
    <>
      {SHELVES.map((def, unit) => (
        <ShelfUnit key={unit} def={def} unit={unit} />
      ))}
    </>
  );
}

function ShelfUnit({ def, unit }: { def: ShelfDef; unit: number }) {
  const near = useStore((s) => s.near);
  const heldId = useStore((s) => s.heldId);
  const cart = useStore((s) => s.cart);
  const purchased = useStore((s) => s.purchased);
  const color = LABEL_COLORS[unit % LABEL_COLORS.length];
  const label = useMemo(() => signTexture(def.label, color, 1024, 200, 110), [def.label, color]);

  const games = GAMES.slice(unit * SLOTS_PER_SHELF, (unit + 1) * SLOTS_PER_SHELF);
  const boardYs = [...TIER_Y.map((y) => y - 0.04), SHELF_H - 0.04];

  const pick = (id: string, e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (e.delta > 6) return; // sürükleme (kamera) tıklama sayılmasın
    const s = useStore.getState();
    if (s.inspectId || s.cartOpen || s.order || !s.started) return;
    const sl = GAME_SLOTS[id];
    if (Math.hypot(sl.x - playerState.x, sl.z - playerState.z) < 3.2) {
      s.openInspect(id);
      sfx.pick();
    } else {
      s.say('Biraz yaklaş, rafın önüne gel');
    }
  };

  return (
    <group position={[def.pos[0], 0, def.pos[1]]} rotation={[0, def.rot, 0]}>
      {/* arka panel ve yanlar */}
      <mesh position={[0, SHELF_H / 2, -SHELF_D / 2 + 0.025]}>
        <boxGeometry args={[SHELF_W, SHELF_H, 0.05]} />
        <meshStandardMaterial color="#120826" roughness={0.9} />
      </mesh>
      {[-1, 1].map((sx) => (
        <mesh key={sx} position={[sx * (SHELF_W / 2 - 0.04), SHELF_H / 2, 0]}>
          <boxGeometry args={[0.08, SHELF_H, SHELF_D]} />
          <meshStandardMaterial color="#2a1250" roughness={0.7} />
        </mesh>
      ))}

      {/* raf tahtaları + neon şerit */}
      {boardYs.map((y, i) => (
        <group key={i}>
          <mesh position={[0, y, 0]}>
            <boxGeometry args={[SHELF_W, 0.08, SHELF_D]} />
            <meshStandardMaterial color="#3a1a6e" roughness={0.6} />
          </mesh>
          <mesh position={[0, y - 0.02, SHELF_D / 2 + 0.005]}>
            <boxGeometry args={[SHELF_W - 0.1, 0.03, 0.02]} />
            <meshBasicMaterial color={i % 2 ? '#ff2bd6' : '#00f0ff'} toneMapped={false} />
          </mesh>
        </group>
      ))}

      {/* tabela */}
      <mesh position={[0, SHELF_H + 0.42, 0.1]}>
        <planeGeometry args={[SHELF_W * 0.78, 0.8]} />
        <meshBasicMaterial map={label} transparent toneMapped={false} side={THREE.DoubleSide} />
      </mesh>

      {/* oyunlar */}
      {games.map((g, i) => {
        const tier = Math.floor(i / COLS);
        const col = i % COLS;
        const l = slotLocal(col, tier);
        const gone = heldId === g.id || cart.includes(g.id) || purchased.includes(g.id);
        if (gone) return null;
        const focused = near?.kind === 'game' && near.id === g.id;
        return (
          <ShelfGame
            key={g.id}
            id={g.id}
            pos={[l.x, l.y, l.z]}
            focused={focused}
            onPick={pick}
          />
        );
      })}
    </group>
  );
}

function ShelfGame({
  id,
  pos,
  focused,
  onPick,
}: {
  id: string;
  pos: [number, number, number];
  focused: boolean;
  onPick: (id: string, e: ThreeEvent<MouseEvent>) => void;
}) {
  const ref = useRef<THREE.Group>(null!);
  const game = GAMES.find((g) => g.id === id)!;

  useFrame((_, dt) => {
    const k = 1 - Math.exp(-dt * 12);
    const g = ref.current;
    g.position.z = THREE.MathUtils.lerp(g.position.z, pos[2] + (focused ? 0.26 : 0), k);
    g.position.y = THREE.MathUtils.lerp(g.position.y, pos[1] + (focused ? 0.05 : 0), k);
    const sc = THREE.MathUtils.lerp(g.scale.x, focused ? 1.06 : 1, k);
    g.scale.setScalar(sc);
  });

  return (
    <group
      ref={ref}
      position={pos}
      rotation={[-0.07, 0, 0]}
      onClick={(e) => onPick(id, e)}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      <GameBox game={game} outline={focused} />
    </group>
  );
}
