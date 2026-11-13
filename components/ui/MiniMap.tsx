'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/lib/store';
import { OBSTACLES, ROOM, COUNTER_USE } from '@/lib/layout';
import { playerState } from '@/lib/input';

const S = 5.5; // piksel / metre
const W = (ROOM.maxX - ROOM.minX) * S;
const H = (ROOM.maxZ - ROOM.minZ) * S;

export default function MiniMap() {
  const started = useStore((s) => s.started);
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!started) return;
    let raf = 0;
    const tx = (x: number) => (x - ROOM.minX) * S;
    const tz = (z: number) => (z - ROOM.minZ) * S;
    const draw = () => {
      const c = ref.current;
      const g = c?.getContext('2d');
      if (c && g) {
        g.clearRect(0, 0, W, H);
        g.fillStyle = 'rgba(8,4,20,0.82)';
        g.fillRect(0, 0, W, H);
        g.strokeStyle = '#00f0ff';
        g.lineWidth = 2;
        g.strokeRect(1, 1, W - 2, H - 2);
        g.fillStyle = 'rgba(255,43,214,0.55)';
        for (const b of OBSTACLES) g.fillRect(tx(b.minX), tz(b.minZ), (b.maxX - b.minX) * S, (b.maxZ - b.minZ) * S);
        g.fillStyle = '#ffe14d';
        g.fillRect(tx(COUNTER_USE.x) - 3, tz(COUNTER_USE.z) - 3, 6, 6);
        g.save();
        g.translate(tx(playerState.x), tz(playerState.z));
        g.rotate(-playerState.rot);
        g.fillStyle = '#ffffff';
        g.beginPath();
        g.moveTo(0, 7);
        g.lineTo(5, -5);
        g.lineTo(-5, -5);
        g.closePath();
        g.fill();
        g.restore();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [started]);

  if (!started) return null;
  return <canvas ref={ref} width={W} height={H} className="pointer-events-none absolute bottom-4 right-4 z-10 hidden w-36 sm:block md:w-44" />;
}
