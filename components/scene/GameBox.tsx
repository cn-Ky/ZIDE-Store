'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import type { Game } from '@/lib/games';
import { coverTexture } from '@/lib/covers';
import { BOX } from '@/lib/layout';

type Props = { game: Game; outline?: boolean };

/** Kapağı olan kutu: ön ve arka yüzde kapak, kenarlarda oyunun rengi. */
export default function GameBox({ game, outline = false }: Props) {
  const tex = useMemo(() => coverTexture(game), [game]);
  const side = useMemo(() => new THREE.Color(game.colors[0]).multiplyScalar(0.55), [game]);

  return (
    <group>
      <mesh>
        <boxGeometry args={[BOX.w, BOX.h, BOX.d]} />
        <meshStandardMaterial attach="material-0" color={side} roughness={0.6} />
        <meshStandardMaterial attach="material-1" color={side} roughness={0.6} />
        <meshStandardMaterial attach="material-2" color={side} roughness={0.6} />
        <meshStandardMaterial attach="material-3" color={side} roughness={0.6} />
        <meshStandardMaterial attach="material-4" map={tex} roughness={0.5} />
        <meshStandardMaterial attach="material-5" map={tex} roughness={0.5} />
      </mesh>
      {outline && (
        <mesh scale={[1.12, 1.07, 1.8]}>
          <boxGeometry args={[BOX.w, BOX.h, BOX.d]} />
          <meshBasicMaterial color="#ffe14d" side={THREE.BackSide} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}
