# ZIDE Store

Retro oyun konsolcusu temalı 3D oyun mağazası. Next.js 14 + React Three Fiber + Tailwind + Zustand.

## Çalıştırma

```bash
npm install
npm run dev
# http://localhost:3000
```

## Oynanış

| Tuş | İşlev |
| --- | --- |
| W A S D / ↑ ↓ | Yürü |
| Shift | Koş |
| Fare sürükle / ← → | Kamerayı döndür |
| E | Raftaki oyunu incele / kasada oyunu okut / sepeti aç |
| TAB (veya Q) | Aynı rafta üst-alt / komşu oyun arasında geç |
| R | Elindeki oyunu rafa bırak |
| C | Sepeti aç-kapat |
| ESC | Pencereyi kapat |

Akış: raflara git → oyunu incele (3D kutu döner) → **Elime al** → kasaya yürü → **E** ile okut → sepete eklenir → sepetten **Ödemeyi tamamla**.
Raftaki kutulara doğrudan tıklayarak da inceleyebilirsin (yakındaysan).

## Yapı

- `lib/games.ts` – 24 kurgusal oyun verisi (ad, fiyat, tür, renk...). Yeni oyun eklemek için diziye ekle; raflar 8 oyunluk (4x2) dizilir, rafa sığmayan oyun için `lib/layout.ts` içindeki `SHELVES` listesine raf ekle.
- `lib/layout.ts` – oda boyutları, raf/kasa/dekor konumları, çarpışma (`resolve`).
- `lib/covers.ts` – kutu kapakları canvas ile üretilir (görsel dosyası gerekmez). Kendi kapak görsellerini kullanmak için `coverTexture` içinde `TextureLoader` kullanabilirsin.
- `lib/store.ts` – Zustand: eldeki oyun, sepet, satın alınanlar, pencereler.
- `components/scene/*` – 3D sahne (oda, raflar, kasa+kasiyer, oyuncu, dekor, post-processing).
- `components/ui/*` – HUD, minimap, inceleme penceresi, sepet, sipariş.

## Notlar

- Oyunlar ve markalar tamamen kurgusaldır.
- Ödeme simülasyondur; backend yoktur. Gerçek ödeme/stok için Supabase/Stripe vb. bağlanabilir (`checkout` fonksiyonu `lib/store.ts` içinde).
- `postprocessing` paketi `@react-three/postprocessing` için gerekli olduğundan `package.json`'a eklendi.
- Sesler WebAudio ile üretilir; dosya gerekmez.
