'use client';

import { useStore } from '@/lib/store';
import { GAME_BY_ID, fmt } from '@/lib/games';

export default function OrderModal() {
  const order = useStore((s) => s.order);
  const close = useStore((s) => s.closeOrder);
  if (!order) return null;

  return (
    <div className="absolute inset-0 z-30 grid place-items-center bg-zide-night/80 p-4">
      <div className="panel max-w-md p-6 text-center">
        <p className="font-pixel text-[10px] text-zide-cyan">SİPARİŞ ALINDI</p>
        <h2 className="mt-3 font-pixel text-xl text-zide-yellow drop-shadow-[0_0_10px_rgba(255,225,77,0.8)]">TEŞEKKÜRLER!</h2>
        <p className="mt-3 text-sm text-white/80">Kasiyer paketini hazırladı. İyi oyunlar!</p>
        <div className="mt-4 border border-white/15 p-3 text-left text-sm">
          <div className="mb-2 text-xs text-white/50">Sipariş no: {order.no}</div>
          {order.ids.map((id, i) => (
            <div key={`${id}-${i}`} className="flex justify-between py-0.5">
              <span>{GAME_BY_ID[id].title}</span>
              <span className="text-white/70">{fmt(GAME_BY_ID[id].price)}</span>
            </div>
          ))}
          <div className="mt-2 flex justify-between border-t border-white/15 pt-2 font-semibold text-zide-yellow">
            <span>Toplam</span>
            <span>{fmt(order.total)}</span>
          </div>
        </div>
        <button className="btn mt-5" onClick={close}>
          ALIŞVERİŞE DEVAM ET
        </button>
      </div>
    </div>
  );
}
