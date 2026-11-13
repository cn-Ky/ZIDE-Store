import { create } from 'zustand';
import { GAME_BY_ID } from './games';

export type Near = { kind: 'game'; id: string; stack: number } | { kind: 'counter' } | null;
export type Order = { no: string; ids: string[]; total: number };

type State = {
  started: boolean;
  heldId: string | null;
  cart: string[];
  purchased: string[];
  inspectId: string | null;
  cartOpen: boolean;
  near: Near;
  focus: number;
  toast: string | null;
  scanAt: number;
  order: Order | null;

  start: () => void;
  setNear: (n: Near) => void;
  setFocus: (n: number) => void;
  cycle: () => void;
  say: (msg: string) => void;
  openInspect: (id: string) => void;
  closeInspect: () => void;
  take: (id: string) => void;
  returnHeld: () => void;
  scanHeld: () => void;
  removeFromCart: (id: string) => void;
  openCart: () => void;
  closeCart: () => void;
  checkout: () => void;
  closeOrder: () => void;
};

let toastTimer: ReturnType<typeof setTimeout> | undefined;

function sameNear(a: Near, b: Near) {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.kind !== b.kind) return false;
  if (a.kind === 'game' && b.kind === 'game') return a.id === b.id && a.stack === b.stack;
  return true;
}

export const useStore = create<State>((set, get) => ({
  started: false,
  heldId: null,
  cart: [],
  purchased: [],
  inspectId: null,
  cartOpen: false,
  near: null,
  focus: 0,
  toast: null,
  scanAt: 0,
  order: null,

  start: () => set({ started: true }),
  setNear: (n) => {
    if (sameNear(get().near, n)) return;
    set({ near: n });
  },
  setFocus: (n) => set({ focus: n }),
  cycle: () => set((s) => ({ focus: s.focus + 1 })),
  say: (msg) => {
    set({ toast: msg });
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => set({ toast: null }), 2600);
  },
  openInspect: (id) => set({ inspectId: id }),
  closeInspect: () => set({ inspectId: null }),
  take: (id) => {
    const prev = get().heldId;
    set({ heldId: id, inspectId: null });
    const t = GAME_BY_ID[id].title;
    get().say(prev && prev !== id ? `${GAME_BY_ID[prev].title} rafa döndü, ${t} elinde` : `${t} elinde! Kasaya götür.`);
  },
  returnHeld: () => {
    const id = get().heldId;
    if (!id) return;
    set({ heldId: null });
    get().say(`${GAME_BY_ID[id].title} rafa geri bırakıldı`);
  },
  scanHeld: () => {
    const id = get().heldId;
    if (!id) return;
    set((s) => ({ cart: [...s.cart, id], heldId: null, scanAt: Date.now() }));
    get().say(`${GAME_BY_ID[id].title} sepete eklendi`);
  },
  removeFromCart: (id) => set((s) => ({ cart: s.cart.filter((x) => x !== id) })),
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
  checkout: () => {
    const s = get();
    if (!s.cart.length) return;
    const total = s.cart.reduce((a, id) => a + GAME_BY_ID[id].price, 0);
    const order: Order = { no: 'ZD-' + Math.floor(100000 + Math.random() * 900000), ids: [...s.cart], total };
    set({ purchased: [...s.purchased, ...s.cart], cart: [], order });
  },
  closeOrder: () => set({ order: null, cartOpen: false }),
}));

export const isTaken = (s: Pick<State, 'heldId' | 'cart' | 'purchased'>, id: string) =>
  s.heldId === id || s.cart.includes(id) || s.purchased.includes(id);
