'use client';

import { useStore } from '@/lib/store';
import { GAME_BY_ID, fmt } from '@/lib/games';
import { coverUrl } from '@/lib/covers';
import { sfx } from '@/lib/sfx';

export default function CartPanel() {
  const open = useStore((s) => s.cartOpen);
  const cart = useStore((s) => s.cart);
  const close = useStore((s) => s.closeCart);
  const remove = useStore((s) => s.removeFromCart);
  const checkout = useStore((s) => s.checkout);
  if (!open) return null;

  const total = cart.reduce((a, id) => a + GAME_BY_ID[id].price, 0);

  return (
    <div className="absolute inset-0 z-20 bg-zide-night/60" onClick={close}>
      <aside
        className="panel absolute bottom-0 right-0 top-0 flex w-full max-w-md flex-col !border-y-0 !border-r-0 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-pixel text-sm text-zide-pink">SEPETİN</h2>
          <button className="btn btn-cyan !px-3 !py-2" onClick={close}>
            KAPAT
          </button>
        </div>

        <div className="mt-4 flex-1 space-y-2 overflow-y-auto pr-1">
          {cart.length === 0 && (
            <p className="mt-10 text-center text-sm text-white/60">
              Sepet boş.
              <br />
              Bir oyunu elinle alıp kasaya götür!
            </p>
          )}
          {cart.map((id, i) => {
            const g = GAME_BY_ID[id];
            return (
              <div key={`${id}-${i}`} className="flex items-center gap-3 border border-white/15 p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coverUrl(g)} alt={g.title} className="h-16 w-auto" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{g.title}</div>
                  <div className="text-xs text-white/55">
                    {g.platform} · {g.genre}
                  </div>
                  <div className="mt-1 font-pixel text-[10px] text-zide-yellow">{fmt(g.price)}</div>
                </div>
                <button
                  className="btn !px-2 !py-1"
                  title="Sepetten çıkar (rafa döner)"
                  onClick={() => {
                    sfx.drop();
                    remove(id);
                  }}
                >
                  SİL
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-4 border-t border-white/15 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/70">Toplam</span>
            <span className="font-pixel text-lg text-zide-yellow">{fmt(total)}</span>
          </div>
          <button
            className="btn mt-3 w-full !py-3"
            disabled={cart.length === 0}
            onClick={() => {
              sfx.buy();
              checkout();
            }}
          >
            ÖDEMEYİ TAMAMLA
          </button>
          <p className="mt-2 text-center text-[10px] text-white/40">Demo mağaza: gerçek ödeme alınmaz.</p>
        </div>
      </aside>
    </div>
  );
}
