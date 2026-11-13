// Sahne ve kontrol bileşenleri arasında paylaşılan, React dışı (mutable) durum.
export const keys: Record<string, boolean> = {};
export const cam = { yaw: 0, pitch: 0.38 };
export const playerState = { x: 0, z: 9, rot: Math.PI };
