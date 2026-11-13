'use client';

import { useStore } from '@/lib/store';
import { GAME_BY_ID, fmt } from '@/lib/games';
import { coverUrl } from '@/lib/covers';
import { sfx } from '@/lib/sfx';

export default function Hud() {
  const started = useStore((s) => s.started);
  const near = useStore((s) => s.near);
  const heldId = useStore((s) => s.heldId);
  const cart = useStore((s) => s.cart);
  const toast = useStore((s) => s.toast);
  const modal = useStore((s) => !!(s.inspectId || s.cartOpen || s.order));
  const openCart = useStore((s) => s.openCart);

  if (!started) return null;

  const total = cart.reduce((a, id) => a + GAME_BY_ID[id].price, 0);
  const held = heldId ? GAME_BY_ID[heldId] : null;

  let prompt: { key: string; text: string; sub?: string } | null = null;
  if (!modal && near?.kind === 'game') {
    const g = GAME_BY_ID[near.id];
    prompt = {
      key: 'E',
      text: `${g.title} — incele`,
      sub: `${fmt(g.price)} · ${g.genre}${near.stack > 1 ? ' · TAB: diğer raf/oyun' : ''}`,
    };
  } else if (!modal && near?.kind === 'counter') {
    prompt = held
      ? { key: 'E', text: `${held.title} — kasadan geçir`, sub: 'Sepete eklenir' }
      : { key: 'E', text: cart.length ? 'Sepeti aç ve ödemeye geç' : 'Kasa', sub: cart.length ? `${cart.length} ürün · ${fmt(total)}` : 'Önce bir oyun al, sonra kasaya getir' };
  }

  return (
    <>
      {/* logo */}
      <div className="pointer-events-none absolute left-4 top-4 z-10 font-pixel text-xs text-zide-pink drop-shadow-[0_0_8px_rgba(255,43,214,0.9)]">
        ZIDE<span className="text-zide-cyan"> STORE</span>
      </div>

      {/* sepet butonu */}
      <button
        className="btn btn-cyan absolute right-4 top-4 z-10"
        onClick={() => {
          sfx.switch();
          openCart();
        }}
      >
        SEPET ({cart.length}){cart.length ? ` · ${fmt(total)}` : ''}
      </button>

      {/* kısayol ipucu */}
      <div className="pointer-events-none absolute left-1/2 top-4 z-10 hidden -translate-x-1/2 gap-3 text-[10px] text-white/70 lg:flex">
        <span><span className="kbd">WASD</span> yürü</span>
        <span><span className="kbd">E</span> etkileşim</span>
        <span><span className="kbd">R</span> bırak</span>
        <span><span className="kbd">C</span> sepet</span>
        <span>sürükle: kamera</span>
      </div>

      {/* bildirim */}
      {toast && (
        <div className="pointer-events-none absolute left-1/2 top-14 z-10 -translate-x-1/2 border-2 border-zide-yellow bg-zide-night/90 px-4 py-2 font-pixel text-[10px] text-zide-yellow">
          {toast}
        </div>
      )}

      {/* etkileşim istemi */}
      {prompt && (
        <div className="pointer-events-none absolute bottom-10 left-1/2 z-10 -translate-x-1/2">
          <div className="panel floaty flex items-center gap-3 px-4 py-3">
            <span className="kbd">{prompt.key}</span>
            <div>
              <div className="font-pixel text-[11px] text-white">{prompt.text}</div>
              {prompt.sub && <div className="mt-1 text-[11px] text-zide-cyan">{prompt.sub}</div>}
            </div>
          </div>
        </div>
      )}

      {/* eldeki oyun */}
      {held && (
        <div className="panel absolute bottom-4 left-4 z-10 flex items-center gap-3 p-2 pr-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={coverUrl(held)} alt={held.title} className="h-20 w-auto border border-white/30" />
          <div>
            <div className="font-pixel text-[9px] text-zide-yellow">ELİNDE</div>
            <div className="mt-1 text-sm font-semibold">{held.title}</div>
            <div className="mt-1 text-xs text-white/60">
              <span className="kbd">R</span> rafa bırak · kasaya götür
            </div>
          </div>
        </div>
      )}
    </>
  );
}
