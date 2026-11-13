'use client';

import dynamic from 'next/dynamic';
import Hud from './ui/Hud';
import StartScreen from './ui/StartScreen';
import CartPanel from './ui/CartPanel';
import OrderModal from './ui/OrderModal';
import MiniMap from './ui/MiniMap';

const Scene = dynamic(() => import('./scene/Scene'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 grid place-items-center bg-zide-night font-pixel text-xs text-zide-cyan">
      YÜKLENİYOR...
    </div>
  ),
});

const InspectModal = dynamic(() => import('./ui/InspectModal'), { ssr: false });

export default function StoreClient() {
  return (
    <main className="fixed inset-0 bg-zide-night">
      <Scene />
      <div className="scanlines" />
      <Hud />
      <MiniMap />
      <InspectModal />
      <CartPanel />
      <OrderModal />
      <StartScreen />
    </main>
  );
}
