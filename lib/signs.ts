import * as THREE from 'three';

const signCache = new Map<string, THREE.CanvasTexture>();

/** Neon yazı dokusu (saydam arka plan). */
export function signTexture(text: string, color: string, w = 1024, h = 256, size = 120): THREE.CanvasTexture {
  const key = `${text}|${color}|${w}|${h}|${size}`;
  const hit = signCache.get(key);
  if (hit) return hit;

  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d')!;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  let s = size;
  g.font = `bold ${s}px monospace`;
  while (g.measureText(text).width > w - 60 && s > 18) {
    s -= 4;
    g.font = `bold ${s}px monospace`;
  }
  g.shadowColor = color;
  g.shadowBlur = 30;
  g.fillStyle = color;
  g.fillText(text, w / 2, h / 2);
  g.fillText(text, w / 2, h / 2);
  g.shadowBlur = 0;
  g.globalAlpha = 0.92;
  g.fillStyle = '#ffffff';
  g.fillText(text, w / 2, h / 2);

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  signCache.set(key, t);
  return t;
}

/** Retro dama zemin dokusu. */
export function floorTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const g = c.getContext('2d')!;
  g.fillStyle = '#1b0d36';
  g.fillRect(0, 0, 128, 128);
  g.fillStyle = '#2c1456';
  g.fillRect(0, 0, 64, 64);
  g.fillRect(64, 64, 64, 64);
  g.strokeStyle = 'rgba(0,240,255,0.18)';
  g.lineWidth = 2;
  g.strokeRect(1, 1, 126, 126);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(13, 12);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/** Atari tarzı oyun makinesi ekranı: sabit tohumlu piksel "istilacılar". */
export function arcadeScreenTexture(seed: number, tint: string): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 112;
  const g = c.getContext('2d')!;
  g.fillStyle = '#04030a';
  g.fillRect(0, 0, 128, 112);
  let r = seed * 9301 + 49297;
  const rnd = () => {
    r = (r * 9301 + 49297) % 233280;
    return r / 233280;
  };
  g.fillStyle = tint;
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 7; col++) {
      const x = 12 + col * 15;
      const y = 10 + row * 14;
      for (let k = 0; k < 14; k++) {
        if (rnd() > 0.45) g.fillRect(x + (k % 4) * 3, y + Math.floor(k / 4) * 3, 3, 3);
      }
    }
  }
  g.fillStyle = '#fff';
  g.fillRect(60, 98, 8, 4);
  g.fillRect(62, 94, 4, 4);
  for (let i = 0; i < 18; i++) g.fillRect(rnd() * 128, rnd() * 90, 1, 1);
  const t = new THREE.CanvasTexture(c);
  t.magFilter = THREE.NearestFilter;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
