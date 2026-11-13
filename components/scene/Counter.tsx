'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Humanoid from './Humanoid';
import { useStore } from '@/lib/store';
import { COUNTER, CASHIER_POS } from '@/lib/layout';
import { signTexture } from '@/lib/signs';

export default function Counter() {
  const count = useStore((s) => s.cart.length);
  const scanAt = useStore((s) => s.scanAt);
  const speed = useRef({ v: 0 });
  const beam = useRef<THREE.Mesh>(null!);
  const light = useRef<THREE.PointLight>(null!);

  const kasa = useMemo(() => signTexture('KASA', '#ffe14d', 512, 160, 110), []);

  // Yazar kasa ekranı
  const screen = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 160;
    c.height = 100;
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.magFilter = THREE.NearestFilter;
    return { c, tex };
  }, []);

  useEffect(() => {
    const g = screen.c.getContext('2d')!;
    g.fillStyle = '#021a1c';
    g.fillRect(0, 0, 160, 100);
    g.fillStyle = '#00f0ff';
    g.font = 'bold 18px monospace';
    g.textAlign = 'center';
    g.fillText('ZIDE POS', 80, 24);
    g.font = 'bold 14px monospace';
    g.fillText('SEPET', 80, 52);
    g.fillStyle = '#ffe14d';
    g.font = 'bold 34px monospace';
    g.fillText(String(count), 80, 88);
    screen.tex.needsUpdate = true;
  }, [count, screen]);

  useFrame(() => {
    const t = (Date.now() - scanAt) / 1000;
    const on = scanAt > 0 && t < 0.5;
    beam.current.visible = on;
    light.current.intensity = on ? 6 * (1 - t * 2) : 0;
  });

  return (
    <group>
      <group position={[COUNTER.x, 0, COUNTER.z]}>
        {/* gövde */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[COUNTER.w, 1, COUNTER.d]} />
          <meshStandardMaterial color="#2a0f4d" roughness={0.6} />
        </mesh>
        <mesh position={[0, 1.05, 0]}>
          <boxGeometry args={[COUNTER.w + 0.2, 0.1, COUNTER.d + 0.2]} />
          <meshStandardMaterial color="#120826" roughness={0.3} metalness={0.3} />
        </mesh>
        {/* ön neon şeritler */}
        <mesh position={[0, 0.75, COUNTER.d / 2 + 0.01]}>
          <boxGeometry args={[COUNTER.w - 0.2, 0.05, 0.02]} />
          <meshBasicMaterial color="#ff2bd6" toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.25, COUNTER.d / 2 + 0.01]}>
          <boxGeometry args={[COUNTER.w - 0.2, 0.05, 0.02]} />
          <meshBasicMaterial color="#00f0ff" toneMapped={false} />
        </mesh>

        {/* yazar kasa */}
        <mesh position={[-1.2, 1.2, -0.2]}>
          <boxGeometry args={[0.7, 0.2, 0.5]} />
          <meshStandardMaterial color="#1f1f2e" roughness={0.5} />
        </mesh>
        <group position={[-1.2, 1.5, -0.38]} rotation={[-0.25, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.62, 0.42, 0.06]} />
            <meshStandardMaterial color="#1f1f2e" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, 0.035]}>
            <planeGeometry args={[0.54, 0.34]} />
            <meshBasicMaterial map={screen.tex} toneMapped={false} />
          </mesh>
        </group>

        {/* tarayıcı pedi */}
        <mesh position={[0.5, 1.12, 0.15]}>
          <boxGeometry args={[0.9, 0.03, 0.5]} />
          <meshBasicMaterial color="#00f0ff" toneMapped={false} />
        </mesh>
        <mesh ref={beam} position={[0.5, 1.4, 0.15]} visible={false}>
          <boxGeometry args={[0.9, 0.55, 0.5]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.35} toneMapped={false} depthWrite={false} />
        </mesh>
        <pointLight ref={light} position={[0.5, 1.5, 0.3]} color="#00f0ff" intensity={0} distance={6} decay={2} />
      </group>

      {/* asılı tabela */}
      <group position={[COUNTER.x, 2.75, COUNTER.z]}>
        <mesh>
          <planeGeometry args={[1.8, 0.6]} />
          <meshBasicMaterial map={kasa} transparent toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
        {[-0.8, 0.8].map((x) => (
          <mesh key={x} position={[x, 0.75, 0]}>
            <boxGeometry args={[0.02, 1.5, 0.02]} />
            <meshStandardMaterial color="#444" />
          </mesh>
        ))}
      </group>

      {/* kasiyer */}
      <group position={[CASHIER_POS.x, 0, CASHIER_POS.z]}>
        <Humanoid
          speed={speed}
          shirt="#00f0ff"
          pants="#2b2b3d"
          skin="#c68642"
          hair="#1b1b1b"
          shoes="#ff2bd6"
          cap={null}
          track={{ x: CASHIER_POS.x, z: CASHIER_POS.z, rot: 0 }}
        />
      </group>
    </group>
  );
}
