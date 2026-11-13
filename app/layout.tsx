import type { Metadata } from 'next';
import { Press_Start_2P, Inter } from 'next/font/google';
import './globals.css';

const pixel = Press_Start_2P({ weight: '400', subsets: ['latin', 'latin-ext'], variable: '--font-pixel' });
const sans = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'ZIDE Store — Retro Oyun Mağazası',
  description: '3D retro oyun mağazasında gez, oyunları incele, elinle al, kasaya götür.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${pixel.variable} ${sans.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
