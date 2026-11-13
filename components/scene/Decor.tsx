'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { CABINETS, PODIUM } from '@/lib/layout';
import { arcadeScreenTexture, signTexture } from '@/lib/signs';

const TINTS = ['#00f0ff', '#ff2bd6', '#ffe14d'];
const BODY = ['#3b1a8f', '#8f1a6a', '#1a6a8f'];

function Cabinet({ x, z, i }: { x: number; z: number; i: number }) {
  const screen = useMemo(() => arcadeScreenTexture(i + 3, TINTS[i % 3]), [i]);
  const marquee = useMemo(() => signTexture(['SPACE', 'RACER', 'ZIDE'][i % 3], TINTS[i % 3], 512, 128, 80), [i]);
  const mat = useRef<THREE.MeshBasicMaterial>(null!);
  useFrame((s) => {
    mat.current.color.setScalar(0.9 + Math.sin(s.clock.elapsedTime * 20 + i) * 0.06);
  });
  const body = BODY[i % 3];
  return (
    <group position={[x, 0, z]} rotation={[0, -Math.PI / 2, 0]}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.9, 1, 0.8]} />
        <meshStandardMaterial color={body} roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.07, 0.3]} rotation={[-0.35, 0, 0]}>
        <boxGeometry args={[0.9, 0.08, 0.5]} />
        <meshStandardMaterial color="#14141f" roughness={0.4} />
      </mesh>
      <mesh position={[-0.2, 1.18, 0.33]}>
        <cylinderGeometry args={[0.02, 0.02, 0.12, 8]} />
        <meshStandardMaterial color="#ccc" />
      </mesh>
      <mesh position={[-0.2, 1.26, 0.33]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color="#ff2b2b" emissive="#ff2b2b" emissiveIntensity={0.4} />
      </mesh>
      {[0.05, 0.17, 0.29].map((bx, k) => (
        <mesh key={bx} position={[bx, 1.13, 0.31 - k * 0.0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.03, 12]} />
          <meshStandardMaterial color={TINTS[k]} emissive={TINTS[k]} emissiveIntensity={0.6} />
        </mesh>
      ))}
      <mesh position={[0, 1.55, 0.05]}>
        <boxGeometry args={[0.9, 0.85, 0.6]} />
        <meshStandardMaterial color={body} roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.58, 0.355]} rotation={[-0.1, 0, 0]}>
        <planeGeometry args={[0.7, 0.62]} />
        <meshBasicMaterial ref={mat} map={screen} toneMapped={false} />
      </mesh>
      <mesh position={[0, 2.1, 0.05]}>
        <boxGeometry args={[0.9, 0.28, 0.6]} />
        <meshStandardMaterial color="#0d0720" roughness={0.6} />
      </mesh>
      <mesh position={[0, 2.1, 0.356]}>
        <planeGeometry args={[0.8, 0.2]} />
        <meshBasicMaterial map={marquee} transparent toneMapped={false} />
      </mesh>
    </group>
  );
}

function Podium() {
  const spin = useRef<THREE.Group>(null!);
  const label = useMemo(() => signTexture('ZIDE-64', '#ffe14d', 512, 128, 84), []);
  useFrame((s, dt) => {
    spin.current.rotation.y += dt * 0.6;
    spin.current.position.y = 1.55 + Math.sin(s.clock.elapsedTime * 1.6) * 0.07;
  });
  return (
    <group position={[PODIUM.x, 0, PODIUM.z]}>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[PODIUM.r, PODIUM.r + 0.1, 0.3, 32]} />
        <meshStandardMaterial color="#1a0b33" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.31, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[PODIUM.r - 0.12, PODIUM.r - 0.05, 48]} />
        <meshBasicMaterial color="#ff2bd6" toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.31, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.35, 0.42, 48]} />
        <meshBasicMaterial color="#00f0ff" toneMapped={false} side={THREE.DoubleSide} />
      </mesh>

      {/* dönen konsol */}
      <group ref={spin} position={[0, 1.55, 0]}>
        <mesh>
          <boxGeometry args={[1.0, 0.2, 0.7]} />
          <meshStandardMaterial color="#c9c3d9" roughness={0.45} />
        </mesh>
        <mesh position={[0, 0.13, -0.05]}>
          <boxGeometry args={[0.7, 0.08, 0.5]} />
          <meshStandardMaterial color="#3b1a8f" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.13, 0.3]}>
          <boxGeometry args={[0.8, 0.02, 0.06]} />
          <meshBasicMaterial color="#00f0ff" toneMapped={false} />
        </mesh>
        <mesh position={[-0.38, 0.02, 0.36]}>
          <boxGeometry args={[0.1, 0.1, 0.02]} />
          <meshBasicMaterial color="#ff2b2b" toneMapped={false} />
        </mesh>
        <mesh position={[0.38, 0.02, 0.36]}>
          <boxGeometry args={[0.1, 0.1, 0.02]} />
          <meshBasicMaterial color="#39ff14" toneMapped={false} />
        </mesh>
      </group>
      <mesh position={[0, 2.5, 0]}>
        <planeGeometry args={[1.8, 0.45]} />
        <meshBasicMaterial map={label} transparent toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function PlayCorner() {
  const tvCanvas = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 96;
    const tex = new THREE.CanvasTexture(c);
    tex.magFilter = THREE.NearestFilter;
    tex.colorSpace = THREE.SRGBColorSpace;
    return { c, tex };
  }, []);
  const state = useRef({ x: 20, y: 20, vx: 38, vy: 26, hue: 180, acc: 0 });

  useFrame((_, dt) => {
    const s = state.current;
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    if (s.x < 0 || s.x > 128 - 64) {
      s.vx *= -1;
      s.x = THREE.MathUtils.clamp(s.x, 0, 64);
      s.hue = (s.hue + 70) % 360;
    }
    if (s.y < 0 || s.y > 96 - 18) {
      s.vy *= -1;
      s.y = THREE.MathUtils.clamp(s.y, 0, 78);
      s.hue = (s.hue + 70) % 360;
    }
    s.acc += dt;
    if (s.acc < 1 / 20) return;
    s.acc = 0;
    const g = tvCanvas.c.getContext('2d')!;
    g.fillStyle = '#05040c';
    g.fillRect(0, 0, 128, 96);
    g.fillStyle = `hsl(${s.hue} 100% 60%)`;
    g.font = 'bold 18px monospace';
    g.textBaseline = 'top';
    g.fillText('ZIDE', s.x + 8, s.y);
    tvCanvas.tex.needsUpdate = true;
  });

  return (
    <group>
      {/* halı */}
      <mesh position={[-10.2, 0.012, 7]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[4.6, 3.4]} />
        <meshStandardMaterial color="#3b1a6e" roughness={1} />
      </mesh>
      <mesh position={[-10.2, 0.014, 7]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[1.35, 1.5, 4, 1, Math.PI / 4]} />
        <meshBasicMaterial color="#ffe14d" toneMapped={false} />
      </mesh>

      {/* TV sehpası + CRT */}
      <group position={[-11.9, 0, 7]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[1.3, 0.5, 0.8]} />
          <meshStandardMaterial color="#2a1250" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.9, 0]}>
          <boxGeometry args={[1.0, 0.8, 0.8]} />
          <meshStandardMaterial color="#26263a" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.92, 0.405]}>
          <planeGeometry args={[0.78, 0.6]} />
          <meshBasicMaterial map={tvCanvas.tex} toneMapped={false} />
        </mesh>
      </group>

      {/* koltuk */}
      <group position={[-8.5, 0, 7]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[2.2, 0.4, 1.0]} />
          <meshStandardMaterial color="#ff2bd6" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.7, -0.4]}>
          <boxGeometry args={[2.2, 0.8, 0.25]} />
          <meshStandardMaterial color="#d414b2" roughness={0.8} />
        </mesh>
        {[-1.1, 1.1].map((x) => (
          <mesh key={x} position={[x, 0.5, 0]}>
            <boxGeometry args={[0.25, 0.65, 1.0]} />
            <meshStandardMaterial color="#d414b2" roughness={0.8} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function Decor() {
  return (
    <group>
      {CABINETS.map((c, i) => (
        <Cabinet key={i} x={c.x} z={c.z} i={i} />
      ))}
      <Podium />
      <PlayCorner />
      <Sparkles count={90} scale={[24, 3.6, 22]} position={[0, 2, 0]} size={2.4} speed={0.25} opacity={0.6} color="#9be7ff" />
    </group>
  );
}
