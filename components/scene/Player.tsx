'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Humanoid from './Humanoid';
import { keys, cam, playerState } from '@/lib/input';
import { resolve, ROOM, GAME_SLOTS, COUNTER_USE } from '@/lib/layout';
import { GAMES, GAME_BY_ID } from '@/lib/games';
import { useStore, isTaken } from '@/lib/store';
import { sfx } from '@/lib/sfx';

const SPEED = 4.2;
const RADIUS = 0.35;

export default function Player() {
  const group = useRef<THREE.Group>(null!);
  const speed = useRef({ v: 0 });
  const { camera, gl } = useThree();
  const heldId = useStore((s) => s.heldId);
  const camPos = useRef(new THREE.Vector3());
  const initCam = useRef(false);
  const lastNearest = useRef<string | null>(null);

  // Klavye
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const s = useStore.getState();
      const k = e.key.toLowerCase();

      if (e.key === 'Escape') {
        if (s.inspectId) s.closeInspect();
        else if (s.order) s.closeOrder();
        else if (s.cartOpen) s.closeCart();
        return;
      }
      if (!s.started) return;
      if (k === 'c' && s.cartOpen) {
        s.closeCart();
        return;
      }
      if (s.inspectId || s.cartOpen || s.order) return;

      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'tab', ' '].includes(k)) e.preventDefault();
      keys[k] = true;

      if (e.repeat) return;
      if (k === 'e') {
        const n = s.near;
        if (n?.kind === 'game') {
          s.openInspect(n.id);
          sfx.pick();
        } else if (n?.kind === 'counter') {
          if (s.heldId) {
            s.scanHeld();
            sfx.scan();
          } else {
            s.openCart();
          }
        }
      } else if (k === 'tab' || k === 'q') {
        s.cycle();
        sfx.switch();
      } else if (k === 'r') {
        if (s.heldId) {
          s.returnHeld();
          sfx.drop();
        }
      } else if (k === 'c') {
        s.openCart();
        for (const key of Object.keys(keys)) keys[key] = false;
      }
    };
    const up = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false;
    };
    const blur = () => {
      for (const key of Object.keys(keys)) keys[key] = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', blur);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', blur);
    };
  }, []);

  // Fare ile kamera döndürme
  useEffect(() => {
    const el = gl.domElement;
    let dragging = false;
    let lx = 0;
    let ly = 0;
    const pd = (e: PointerEvent) => {
      dragging = true;
      lx = e.clientX;
      ly = e.clientY;
    };
    const pm = (e: PointerEvent) => {
      if (!dragging) return;
      cam.yaw -= (e.clientX - lx) * 0.005;
      cam.pitch = THREE.MathUtils.clamp(cam.pitch + (e.clientY - ly) * 0.004, 0.08, 0.95);
      lx = e.clientX;
      ly = e.clientY;
    };
    const pu = () => {
      dragging = false;
    };
    el.addEventListener('pointerdown', pd);
    window.addEventListener('pointermove', pm);
    window.addEventListener('pointerup', pu);
    return () => {
      el.removeEventListener('pointerdown', pd);
      window.removeEventListener('pointermove', pm);
      window.removeEventListener('pointerup', pu);
    };
  }, [gl]);

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const s = useStore.getState();
    const active = s.started && !s.inspectId && !s.cartOpen && !s.order;

    let ix = 0;
    let iz = 0;
    if (active) {
      if (keys['w'] || keys['arrowup']) iz += 1;
      if (keys['s'] || keys['arrowdown']) iz -= 1;
      if (keys['d']) ix += 1;
      if (keys['a']) ix -= 1;
      if (keys['arrowleft']) cam.yaw += 1.8 * dt;
      if (keys['arrowright']) cam.yaw -= 1.8 * dt;
    } else if (!s.started) {
      cam.yaw += dt * 0.18; // başlangıç ekranında yavaş dönüş
    }

    const len = Math.hypot(ix, iz);
    let target = 0;
    if (len > 0) {
      ix /= len;
      iz /= len;
      const sin = Math.sin(cam.yaw);
      const cos = Math.cos(cam.yaw);
      const dx = ix * cos - iz * sin;
      const dz = -ix * sin - iz * cos;
      const run = keys['shift'] ? 1.6 : 1;
      const r = resolve(playerState.x + dx * SPEED * run * dt, playerState.z + dz * SPEED * run * dt, RADIUS);
      playerState.x = r.x;
      playerState.z = r.z;
      const want = Math.atan2(dx, dz);
      let d = want - playerState.rot;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      playerState.rot += d * Math.min(1, dt * 12);
      target = run;
    }
    speed.current.v = THREE.MathUtils.damp(speed.current.v, target, 10, dt);

    group.current.position.set(playerState.x, 0, playerState.z);
    group.current.rotation.y = playerState.rot;

    // Kamera
    const dist = 5.4;
    const p = cam.pitch;
    const hx = playerState.x;
    const hz = playerState.z;
    const cx = THREE.MathUtils.clamp(hx + Math.sin(cam.yaw) * Math.cos(p) * dist, ROOM.minX + 0.4, ROOM.maxX - 0.4);
    const cz = THREE.MathUtils.clamp(hz + Math.cos(cam.yaw) * Math.cos(p) * dist, ROOM.minZ + 0.4, ROOM.maxZ - 0.4);
    const cy = Math.min(1.5 + Math.sin(p) * dist, ROOM.height - 0.3);
    if (!initCam.current) {
      camPos.current.set(cx, cy, cz);
      initCam.current = true;
    } else {
      camPos.current.lerp(new THREE.Vector3(cx, cy, cz), 1 - Math.exp(-dt * 10));
    }
    camera.position.copy(camPos.current);
    camera.lookAt(hx, 1.2, hz);

    // Yakındaki etkileşim
    if (!active) return;
    const dc = Math.hypot(playerState.x - COUNTER_USE.x, playerState.z - COUNTER_USE.z);
    if (dc < 1.9) {
      s.setNear({ kind: 'counter' });
      lastNearest.current = null;
      return;
    }
    const cands: { id: string; d: number; y: number }[] = [];
    for (const g of GAMES) {
      if (isTaken(s, g.id)) continue;
      const sl = GAME_SLOTS[g.id];
      if (!sl) continue;
      const d = Math.hypot(sl.x - playerState.x, sl.z - playerState.z);
      if (d < 1.9) cands.push({ id: g.id, d, y: sl.y });
    }
    cands.sort((a, b) => a.d - b.d || a.y - b.y);
    const nearestId = cands[0]?.id ?? null;
    if (nearestId !== lastNearest.current) {
      lastNearest.current = nearestId;
      if (s.focus !== 0) s.setFocus(0);
    }
    if (cands.length) {
      const pick = cands[useStore.getState().focus % cands.length];
      s.setNear({ kind: 'game', id: pick.id, stack: cands.length });
    } else {
      s.setNear(null);
    }
  });

  return (
    <group ref={group} position={[playerState.x, 0, playerState.z]} rotation={[0, playerState.rot, 0]}>
      <Humanoid speed={speed} held={heldId ? GAME_BY_ID[heldId] : null} />
    </group>
  );
}
