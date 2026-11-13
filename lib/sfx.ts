// Basit WebAudio 8-bit efektleri (dosya gerekmez).
let ctx: AudioContext | null = null;

function getCtx() {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(freq: number, dur: number, type: OscillatorType = 'square', vol = 0.05, delay = 0) {
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime + delay;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(vol, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(c.destination);
  o.start(t0);
  o.stop(t0 + dur + 0.02);
}

export const sfx = {
  unlock() {
    getCtx();
  },
  pick() {
    tone(520, 0.07);
    tone(780, 0.09, 'square', 0.05, 0.06);
  },
  scan() {
    tone(1200, 0.08, 'square', 0.06);
    tone(1800, 0.14, 'square', 0.06, 0.09);
  },
  drop() {
    tone(300, 0.1, 'triangle', 0.06);
  },
  buy() {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.14, 'square', 0.05, i * 0.1));
  },
  switch() {
    tone(660, 0.05, 'square', 0.04);
  },
};
