'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { ROOM } from '@/lib/layout';
import { GAMES } from '@/lib/games';
import { coverTexture } from '@/lib/covers';
import { floorTexture, signTexture } from '@/lib/signs';

const W = ROOM.maxX - ROOM.minX; // 26
const D = ROOM.maxZ - ROOM.minZ; // 24
const H = ROOM.height;

function Neon({ pos, size, color }: { pos: [number, number, number]; size: [number, number, number]; color: string }) {
  return (
    <mesh position={pos}>
      <boxGeometry args={size} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}

export default function Room() {
  const floor = useMemo(() => floorTexture(), []);
  const big = useMemo(() => signTexture('ZIDE STORE', '#ff2bd6', 1024, 256, 150), []);
  const sub = useMemo(() => signTexture('RETRO GAME SHOP  1992-1999', '#00f0ff', 1024, 128, 64), []);
  const exit = useMemo(() => signTexture('CIKIS', '#ffe14d', 512, 128, 80), []);
  const play = useMemo(() => signTexture('OYUN ODASI', '#00f0ff', 768, 160, 90), []);
  const posters = useMemo(() => [GAMES[11], GAMES[2], GAMES[0]].map((g) => coverTexture(g)), []);
  const posters2 = useMemo(() => [GAMES[6], GAMES[23], GAMES[3]].map((g) => coverTexture(g)), []);

  return (
    <group>
      {/* zemin ve tavan */}
      <mesh rotation-x={-Math.PI / 2}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial map={floor} roughness={0.35} metalness={0.15} />
      </mesh>
      <mesh rotation-x={Math.PI / 2} position={[0, H, 0]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color="#0d0720" roughness={1} />
      </mesh>

      {/* duvarlar */}
      <mesh position={[0, H / 2, ROOM.minZ]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color="#1a0b33" roughness={0.9} />
      </mesh>
      <mesh position={[0, H / 2, ROOM.maxZ]} rotation-y={Math.PI}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color="#1a0b33" roughness={0.9} />
      </mesh>
      <mesh position={[ROOM.maxX, H / 2, 0]} rotation-y={-Math.PI / 2}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color="#1a0b33" roughness={0.9} />
      </mesh>
      <mesh position={[ROOM.minX, H / 2, 0]} rotation-y={Math.PI / 2}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color="#1a0b33" roughness={0.9} />
      </mesh>

      {/* neon şeritler */}
      {[
        { y: 0.08, c: '#00f0ff' },
        { y: H - 0.08, c: '#ff2bd6' },
      ].map(({ y, c }) => (
        <group key={y}>
          <Neon pos={[0, y, ROOM.minZ + 0.04]} size={[W, 0.06, 0.06]} color={c} />
          <Neon pos={[0, y, ROOM.maxZ - 0.04]} size={[W, 0.06, 0.06]} color={c} />
          <Neon pos={[ROOM.minX + 0.04, y, 0]} size={[0.06, 0.06, D]} color={c} />
          <Neon pos={[ROOM.maxX - 0.04, y, 0]} size={[0.06, 0.06, D]} color={c} />
        </group>
      ))}

      {/* tavan ışık panelleri */}
      {[-8, 0, 8].map((z) =>
        [-6.5, 6.5].map((x) => (
          <Neon key={`${x}${z}`} pos={[x, H - 0.03, z]} size={[3.6, 0.04, 0.35]} color={(x + z) % 3 === 0 ? '#ff2bd6' : '#00f0ff'} />
        ))
      )}

      {/* kuzey duvarı ana tabela */}
      <mesh position={[0, 2.7, ROOM.minZ + 0.06]}>
        <planeGeometry args={[6.4, 1.6]} />
        <meshBasicMaterial map={big} transparent toneMapped={false} />
      </mesh>
      <mesh position={[0, 1.7, ROOM.minZ + 0.06]}>
        <planeGeometry args={[6, 0.75]} />
        <meshBasicMaterial map={sub} transparent toneMapped={false} />
      </mesh>

      {/* güney duvarı: çıkış + posterler */}
      <mesh position={[0, 3.3, ROOM.maxZ - 0.06]} rotation-y={Math.PI}>
        <planeGeometry args={[2.4, 0.6]} />
        <meshBasicMaterial map={exit} transparent toneMapped={false} />
      </mesh>
      {[-4.5, 0, 4.5].map((x, i) => (
        <mesh key={x} position={[x, 2.3, ROOM.maxZ - 0.05]} rotation-y={Math.PI}>
          <planeGeometry args={[1.4, 1.85]} />
          <meshBasicMaterial map={posters2[i]} toneMapped={false} />
        </mesh>
      ))}

      {/* doğu duvarı posterleri (makinelerin üstü) */}
      {[-6.5, -4.8, -3.1].map((z, i) => (
        <mesh key={z} position={[ROOM.maxX - 0.05, 3.0, z]} rotation-y={-Math.PI / 2}>
          <planeGeometry args={[1.3, 1.7]} />
          <meshBasicMaterial map={posters[i]} toneMapped={false} />
        </mesh>
      ))}

      {/* batı duvarı: oyun odası tabelası */}
      <mesh position={[ROOM.minX + 0.06, 3.1, 7]} rotation-y={Math.PI / 2}>
        <planeGeometry args={[3.2, 0.7]} />
        <meshBasicMaterial map={play} transparent toneMapped={false} />
      </mesh>
    </group>
  );
}
