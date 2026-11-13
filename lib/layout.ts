import { GAMES } from './games';

export const ROOM = { minX: -13, maxX: 13, minZ: -12, maxZ: 12, height: 4.2 };

export const COLS = 4;
export const TIERS = 2;
export const SLOTS_PER_SHELF = COLS * TIERS;
export const TIER_Y = [0.2, 1.5]; // raf üst yüzeyleri
export const SHELF_W = 4.4;
export const SHELF_D = 0.8;
export const SHELF_H = 2.9;
export const BOX = { w: 0.7, h: 0.95, d: 0.12 };

export type ShelfDef = { pos: [number, number]; rot: number; label: string };

export const SHELVES: ShelfDef[] = [
  { pos: [-5.5, -11.35], rot: 0, label: 'YENİ GELENLER' },
  { pos: [5.5, -11.35], rot: 0, label: 'EFSANELER' },
  { pos: [-12.35, -2], rot: Math.PI / 2, label: 'KLASİKLER' },
];

export const COUNTER = { x: 7.5, z: 5, w: 4, d: 1.4 };
export const COUNTER_USE = { x: 7.5, z: 6.4 };
export const CASHIER_POS = { x: 7.5, z: 3.9 };

export const CABINETS: { x: number; z: number }[] = [
  { x: 12.35, z: -6.5 },
  { x: 12.35, z: -4.8 },
  { x: 12.35, z: -3.1 },
];
export const PODIUM = { x: 0, z: -3, r: 1.0 };

export type Box = { minX: number; maxX: number; minZ: number; maxZ: number };

export function slotLocal(col: number, tier: number) {
  return { x: (col - (COLS - 1) / 2) * 1.1, y: TIER_Y[tier] + BOX.h / 2, z: 0.1 };
}

export function localToWorld(shelf: ShelfDef, lx: number, lz: number) {
  const s = Math.sin(shelf.rot);
  const c = Math.cos(shelf.rot);
  return { x: shelf.pos[0] + lx * c + lz * s, z: shelf.pos[1] - lx * s + lz * c };
}

export const GAME_SLOTS: Record<string, { x: number; y: number; z: number }> = {};
GAMES.forEach((g, i) => {
  const unit = Math.floor(i / SLOTS_PER_SHELF);
  const r = i % SLOTS_PER_SHELF;
  const tier = Math.floor(r / COLS);
  const col = r % COLS;
  const shelf = SHELVES[unit];
  if (!shelf) return;
  const l = slotLocal(col, tier);
  const w = localToWorld(shelf, l.x, l.z);
  GAME_SLOTS[g.id] = { x: w.x, y: l.y, z: w.z };
});

export const OBSTACLES: Box[] = [];
SHELVES.forEach((s) => {
  const c = Math.abs(Math.cos(s.rot));
  const sn = Math.abs(Math.sin(s.rot));
  const hx = (SHELF_W / 2) * c + (SHELF_D / 2) * sn;
  const hz = (SHELF_W / 2) * sn + (SHELF_D / 2) * c;
  OBSTACLES.push({ minX: s.pos[0] - hx, maxX: s.pos[0] + hx, minZ: s.pos[1] - hz, maxZ: s.pos[1] + hz });
});
OBSTACLES.push({
  minX: COUNTER.x - COUNTER.w / 2,
  maxX: COUNTER.x + COUNTER.w / 2,
  minZ: COUNTER.z - COUNTER.d / 2,
  maxZ: COUNTER.z + COUNTER.d / 2,
});
OBSTACLES.push({ minX: 7.1, maxX: 7.9, minZ: 3.5, maxZ: 4.3 }); // kasiyer
CABINETS.forEach((c) => OBSTACLES.push({ minX: c.x - 0.45, maxX: c.x + 0.45, minZ: c.z - 0.5, maxZ: c.z + 0.5 }));
OBSTACLES.push({ minX: -12.35, maxX: -11.45, minZ: 6.35, maxZ: 7.65 }); // TV sehpası
OBSTACLES.push({ minX: -9.05, maxX: -7.9, minZ: 5.85, maxZ: 8.15 }); // koltuk
OBSTACLES.push({ minX: PODIUM.x - PODIUM.r, maxX: PODIUM.x + PODIUM.r, minZ: PODIUM.z - PODIUM.r, maxZ: PODIUM.z + PODIUM.r });

/** Daire (oyuncu) - kutu çarpışması, duvarlar dahil. */
export function resolve(x: number, z: number, r: number) {
  x = Math.min(Math.max(x, ROOM.minX + r + 0.2), ROOM.maxX - r - 0.2);
  z = Math.min(Math.max(z, ROOM.minZ + r + 0.2), ROOM.maxZ - r - 0.2);
  for (const b of OBSTACLES) {
    const cx = Math.min(Math.max(x, b.minX), b.maxX);
    const cz = Math.min(Math.max(z, b.minZ), b.maxZ);
    const dx = x - cx;
    const dz = z - cz;
    const d2 = dx * dx + dz * dz;
    if (d2 >= r * r) continue;
    if (d2 > 1e-6) {
      const d = Math.sqrt(d2);
      x += (dx / d) * (r - d);
      z += (dz / d) * (r - d);
    } else {
      // merkez kutunun içinde: en yakın kenara it
      const left = x - b.minX;
      const right = b.maxX - x;
      const top = z - b.minZ;
      const bottom = b.maxZ - z;
      const m = Math.min(left, right, top, bottom);
      if (m === left) x = b.minX - r;
      else if (m === right) x = b.maxX + r;
      else if (m === top) z = b.minZ - r;
      else z = b.maxZ + r;
    }
  }
  return { x, z };
}
