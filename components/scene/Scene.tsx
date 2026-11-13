'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import Room from './Room';
import Shelves from './Shelves';
import Counter from './Counter';
import Decor from './Decor';
import Player from './Player';

export default function Scene() {
  return (
    <div className="fixed inset-0">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ fov: 55, near: 0.1, far: 80, position: [0, 3, 14] }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#0b0614']} />
        <ambientLight intensity={1.1} color="#9a8bd8" />
        <hemisphereLight args={['#b8a8ff', '#1a0b33', 0.7]} />
        <pointLight position={[-6, 3.5, -6]} color="#ff2bd6" intensity={45} distance={18} decay={2} />
        <pointLight position={[6, 3.5, -6]} color="#00f0ff" intensity={45} distance={18} decay={2} />
        <pointLight position={[-6, 3.5, 6]} color="#00f0ff" intensity={35} distance={18} decay={2} />
        <pointLight position={[6, 3.5, 6]} color="#ff2bd6" intensity={35} distance={18} decay={2} />
        <pointLight position={[0, 3.6, 0]} color="#ffffff" intensity={30} distance={18} decay={2} />
        <spotLight position={[0, 4, -3]} angle={0.5} penumbra={0.6} intensity={60} color="#ffe14d" target-position={[0, 0, -3]} />

        <Suspense fallback={null}>
          <Room />
          <Shelves />
          <Counter />
          <Decor />
          <Player />
        </Suspense>

        <EffectComposer multisampling={0}>
          <Bloom intensity={0.75} luminanceThreshold={0.75} luminanceSmoothing={0.2} mipmapBlur />
          <Vignette eskil={false} offset={0.2} darkness={0.75} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
