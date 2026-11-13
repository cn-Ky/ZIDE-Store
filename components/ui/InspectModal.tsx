'use client';

import { Canvas } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import GameBox from '../scene/GameBox';
import { useStore } from '@/lib/store';
import { GAME_BY_ID, fmt } from '@/lib/games';
import { sfx } from '@/lib/sfx';

export default function InspectModal() {
  const id = useStore((s) => s.inspectId);
  const heldId = useStore((s) => s.heldId);
  const take = useStore((s) => s.take);
  const close = useStore((s) => s.closeInspect);
  if (!id) return null;
  const g = GAME_BY_ID[id];
  const stars = Math.round(g.rating);

  return (
    <div className="absolute inset-0 z-20 grid place-items-center bg-zide-night/70 p-3" onClick={close}>
      <div className="panel grid w-full max-w-3xl grid-cols-1 overflow-hidden sm:grid-cols-2" onClick={(e) => e.stopPropagation()}>
        <div className="h-64 bg-gradient-to-b from-zide-purple to-zide-night sm:h-96">
          <Canvas camera={{ position: [0, 0, 3.4], fov: 40 }} dpr={[1, 2]}>
            <ambientLight intensity={1.3} />
            <directionalLight position={[3, 3, 4]} intensity={2.4} />
            <pointLight position={[-3, -1, 2]} color="#ff2bd6" intensity={14} />
            <pointLight position={[3, 1, -2]} color="#00f0ff" intensity={14} />
            <Float speed={2} rotationIntensity={0.15} floatIntensity={0.6}>
              <group scale={2.1}>
                <GameBox game={g} />
              </group>
            </Float>
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2.2} />
          </Canvas>
        </div>

        <div className="flex flex-col p-5">
          <div className="font-pixel text-[9px] text-zide-cyan">
            {g.platform} · {g.year}
          </div>
          <h2 className="mt-2 font-pixel text-lg leading-snug text-zide-pink">{g.title}</h2>
          <div className="mt-2 text-sm text-zide-yellow">
            {'★'.repeat(stars)}
            <span className="text-white/25">{'★'.repeat(5 - stars)}</span>
            <span className="ml-2 text-white/60">{g.rating.toFixed(1)}</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-white/80">{g.blurb}</p>
          <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="border border-white/15 p-2">
              <dt className="text-white/50">Tür</dt>
              <dd className="mt-0.5">{g.genre}</dd>
            </div>
            <div className="border border-white/15 p-2">
              <dt className="text-white/50">Oyuncu</dt>
              <dd className="mt-0.5">{g.players}</dd>
            </div>
          </dl>

          <div className="mt-auto pt-5">
            <div className="font-pixel text-xl text-zide-yellow">{fmt(g.price)}</div>
            {heldId && <p className="mt-1 text-[11px] text-white/55">Elindeki oyun rafa geri bırakılacak.</p>}
            <div className="mt-3 flex gap-2">
              <button
                className="btn flex-1"
                onClick={() => {
                  sfx.pick();
                  take(g.id);
                }}
              >
                ELİME AL
              </button>
              <button className="btn btn-cyan" onClick={close}>
                KAPAT
              </button>
            </div>
            <p className="mt-2 text-[10px] text-white/40">Kutuyu sürükleyerek döndürebilirsin · ESC ile kapat</p>
          </div>
        </div>
      </div>
    </div>
  );
}
