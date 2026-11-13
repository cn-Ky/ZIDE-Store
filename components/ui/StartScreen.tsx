'use client';

import { useStore } from '@/lib/store';
import { sfx } from '@/lib/sfx';

const CONTROLS: [string, string][] = [
  ['W A S D', 'Yürü'],
  ['SHIFT', 'Koş'],
  ['SÜRÜKLE / ← →', 'Kamera'],
  ['E', 'İncele / Kasa'],
  ['TAB', 'Üst-alt raf'],
  ['R', 'Rafa bırak'],
  ['C', 'Sepet'],
];

export default function StartScreen() {
  const started = useStore((s) => s.started);
  const start = useStore((s) => s.start);
  if (started) return null;

  return (
    <div className="absolute inset-0 z-20 grid place-items-center bg-zide-night/55 p-4">
      <div className="panel max-w-xl p-6 text-center">
        <p className="font-pixel text-[10px] tracking-widest text-zide-cyan">RETRO OYUN MAĞAZASI · 1992-1999</p>
        <h1 className="mt-3 font-pixel text-3xl leading-tight text-zide-pink drop-shadow-[0_0_14px_rgba(255,43,214,0.9)] sm:text-4xl">
          ZIDE
          <br />
          STORE
        </h1>
        <p className="mt-4 text-sm text-white/80">
          Mağazada gez, raflardaki oyunların yanına git, kutuyu incele, elinle al, kasaya götür ve sepetine ekle.
        </p>

        <div className="mx-auto mt-5 grid max-w-md grid-cols-1 gap-x-6 gap-y-2 text-left text-xs sm:grid-cols-2">
          {CONTROLS.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-3 border-b border-white/10 pb-1">
              <span className="kbd">{k}</span>
              <span className="text-white/80">{v}</span>
            </div>
          ))}
        </div>

        <button
          className="btn mt-6 !px-6 !py-3 !text-sm"
          onClick={() => {
            sfx.unlock();
            sfx.pick();
            start();
          }}
        >
          MAĞAZAYA GİR
        </button>
        <p className="mt-4 text-[11px] text-white/45">Klavye gerektirir (masaüstü önerilir). Ödeme simülasyondur, gerçek ücret alınmaz.</p>
      </div>
    </div>
  );
}
