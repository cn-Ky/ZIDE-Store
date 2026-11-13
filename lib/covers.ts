import * as THREE from 'three';
import type { Game, IconName } from './games';

// 8x8 piksel ikonlar
const ICONS: Record<IconName, string[]> = {
  star: ['...##...', '...##...', '########', '.######.', '..####..', '..####..', '.##..##.', '##....##'],
  ghost: ['..####..', '.######.', '########', '#..##..#', '########', '########', '########', '##.##.##'],
  sword: ['......##', '.....###', '....###.', '...###..', '#.###...', '.###....', '.##.....', '#.#.....'],
  heart: ['.##..##.', '########', '########', '########', '.######.', '..####..', '...##...', '........'],
  bolt: ['....###.', '...###..', '..###...', '.######.', '...###..', '..###...', '.##.....', '##......'],
  ship: ['...##...', '..####..', '..####..', '.######.', '.######.', '##.##.##', '#..##..#', '...##...'],
  car: ['........', '..####..', '.######.', '########', '#.####.#', '########', '.##..##.', '........'],
  skull: ['.######.', '########', '#.#..#.#', '########', '.######.', '..#..#..', '..####..', '........'],
  crown: ['#..##..#', '#.####.#', '########', '########', '.######.', '........', '........', '........'],
};

const cache = new Map<string, THREE.CanvasTexture>();
const canvasCache = new Map<string, HTMLCanvasElement>();
const urlCache = new Map<string, string>();

function drawCover(game: Game): HTMLCanvasElement {
  const cached = canvasCache.get(game.id);
  if (cached) return cached;

  const W = 256;
  const H = 340;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d')!;

  const grad = g.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, game.colors[0]);
  grad.addColorStop(1, game.colors[1]);
  g.fillStyle = grad;
  g.fillRect(0, 0, W, H);

  // retro ızgara
  g.strokeStyle = 'rgba(255,255,255,0.09)';
  g.lineWidth = 1;
  for (let y = 170; y < H; y += 18) {
    g.beginPath();
    g.moveTo(0, y);
    g.lineTo(W, y);
    g.stroke();
  }
  for (let x = -W; x < W * 2; x += 28) {
    g.beginPath();
    g.moveTo(W / 2, 170);
    g.lineTo(x, H);
    g.stroke();
  }

  // üst bant
  g.fillStyle = 'rgba(0,0,0,0.55)';
  g.fillRect(0, 0, W, 30);
  g.textBaseline = 'middle';
  g.font = 'bold 14px monospace';
  g.textAlign = 'left';
  g.fillStyle = game.accent;
  g.fillText(game.platform.toUpperCase(), 10, 16);
  g.textAlign = 'right';
  g.fillStyle = '#ffffff';
  g.fillText(String(game.year), W - 10, 16);

  // piksel ikon
  const bits = ICONS[game.icon];
  const cell = 14;
  const ox = (W - 8 * cell) / 2;
  const oy = 48;
  bits.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (ch !== '#') return;
      g.fillStyle = 'rgba(0,0,0,0.4)';
      g.fillRect(ox + x * cell + 4, oy + y * cell + 4, cell, cell);
    })
  );
  bits.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (ch !== '#') return;
      g.fillStyle = game.accent;
      g.fillRect(ox + x * cell, oy + y * cell, cell, cell);
      g.fillStyle = 'rgba(255,255,255,0.35)';
      g.fillRect(ox + x * cell, oy + y * cell, cell, 3);
    })
  );

  // başlık (satır kaydırmalı)
  g.textAlign = 'center';
  g.font = 'bold 26px monospace';
  const words = game.title.toUpperCase().split(' ');
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (g.measureText(test).width > W - 24 && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  lines.push(line);
  const startY = 200 - ((lines.length - 1) * 30) / 2 + 10;
  lines.forEach((l, i) => {
    g.fillStyle = 'rgba(0,0,0,0.6)';
    g.fillText(l, W / 2 + 2, startY + i * 30 + 2);
    g.fillStyle = '#ffffff';
    g.fillText(l, W / 2, startY + i * 30);
  });

  // alt şerit
  g.fillStyle = 'rgba(0,0,0,0.62)';
  g.fillRect(0, H - 34, W, 34);
  g.font = 'bold 13px monospace';
  g.textAlign = 'left';
  g.fillStyle = game.accent;
  g.fillText(game.genre.toUpperCase(), 10, H - 17);
  g.textAlign = 'right';
  g.fillStyle = '#ffe14d';
  g.fillText('★ ' + game.rating.toFixed(1), W - 10, H - 17);

  canvasCache.set(game.id, c);
  return c;
}

export function coverTexture(game: Game): THREE.CanvasTexture {
  const hit = cache.get(game.id);
  if (hit) return hit;
  const tex = new THREE.CanvasTexture(drawCover(game));
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  cache.set(game.id, tex);
  return tex;
}

/** 2B arayüzde (HUD, sepet) kapak görseli olarak kullanmak için. */
export function coverUrl(game: Game): string {
  const hit = urlCache.get(game.id);
  if (hit) return hit;
  const u = drawCover(game).toDataURL('image/png');
  urlCache.set(game.id, u);
  return u;
}
