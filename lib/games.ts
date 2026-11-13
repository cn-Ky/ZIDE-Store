export type IconName = 'star' | 'ghost' | 'sword' | 'heart' | 'bolt' | 'ship' | 'car' | 'skull' | 'crown';

export type Game = {
  id: string;
  title: string;
  genre: string;
  platform: string;
  year: number;
  price: number;
  players: string;
  rating: number;
  colors: [string, string];
  accent: string;
  icon: IconName;
  blurb: string;
};

// Tüm oyunlar kurgusaldır; gerçek bir marka/karakter içermez.
export const GAMES: Game[] = [
  { id: 'neon-rider', title: 'Neon Rider 64', genre: 'Yarış', platform: 'ZIDE-64', year: 1996, price: 449, players: '1-2', rating: 4.6, colors: ['#ff2bd6', '#2a0a5e'], accent: '#00f0ff', icon: 'car', blurb: 'Geceleri ışıl ışıl yanan otoyollarda sentetik müzik eşliğinde rakiplerini geride bırak.' },
  { id: 'kozmik-avci', title: 'Kozmik Avcı', genre: 'Uzay Atıcı', platform: 'ZIDE-64', year: 1995, price: 399, players: '1', rating: 4.4, colors: ['#1d4ed8', '#050816'], accent: '#ffe14d', icon: 'ship', blurb: 'Yıldız kuşağını istila eden makine sürülerine karşı tek gemiyle savaş.' },
  { id: 'golge-sovalye', title: 'Gölge Şövalye', genre: 'Aksiyon RPG', platform: 'ZIDE Classic', year: 1994, price: 599, players: '1', rating: 4.8, colors: ['#4c1d95', '#0b0614'], accent: '#a78bfa', icon: 'sword', blurb: 'Lanetli krallığın katmanlarında ilerle, gölgeni kılıcına dönüştür.' },
  { id: 'hayalet-bahcesi', title: 'Hayalet Bahçesi', genre: 'Korku Bulmaca', platform: 'ZIDE Classic', year: 1993, price: 349, players: '1', rating: 4.2, colors: ['#065f46', '#02130e'], accent: '#a7f3d0', icon: 'ghost', blurb: 'Terk edilmiş bahçede ruhları çöz, kapıları aç, sabaha kadar hayatta kal.' },
  { id: 'pixel-kalpler', title: 'Pixel Kalpler', genre: 'Platform', platform: 'ZIDE Pocket', year: 1997, price: 249, players: '1-2', rating: 4.5, colors: ['#be123c', '#4c0519'], accent: '#fecdd3', icon: 'heart', blurb: 'İki küçük kalp, yüz seviye. Birlikte zıpla, birlikte topla.' },
  { id: 'voltaj-vadisi', title: 'Voltaj Vadisi', genre: 'Platform', platform: 'ZIDE-64', year: 1996, price: 429, players: '1-4', rating: 4.3, colors: ['#ca8a04', '#422006'], accent: '#fef08a', icon: 'bolt', blurb: 'Elektrik yüklü vadide şimşekten şimşeğe atla, jeneratörleri çalıştır.' },
  { id: 'tac-savaslari', title: 'Taç Savaşları', genre: 'Strateji', platform: 'ZIDE Classic', year: 1995, price: 499, players: '1-2', rating: 4.7, colors: ['#b45309', '#1c0a00'], accent: '#fde68a', icon: 'crown', blurb: 'Küçük krallığını büyüt, ittifaklar kur ve tacı kimseye kaptırma.' },
  { id: 'kafatasi-adasi', title: 'Kafatası Adası', genre: 'Korsan Macera', platform: 'ZIDE-64', year: 1998, price: 549, players: '1', rating: 4.5, colors: ['#0e7490', '#082f49'], accent: '#fff', icon: 'skull', blurb: 'Haritanın dışındaki adada hazine ve lanet seni bekliyor.' },
  { id: 'yildiz-tozu', title: 'Yıldız Tozu', genre: 'Uzay Keşif', platform: 'ZIDE Pocket', year: 1999, price: 299, players: '1', rating: 4.1, colors: ['#312e81', '#0f0a2e'], accent: '#fde047', icon: 'star', blurb: 'Gezegenleri keşfet, yıldız tozunu topla, galaksi haritasını tamamla.' },
  { id: 'turbo-mahalle', title: 'Turbo Mahalle', genre: 'Arcade Yarış', platform: 'ZIDE Classic', year: 1992, price: 199, players: '1-2', rating: 4.0, colors: ['#ea580c', '#431407'], accent: '#fff7ed', icon: 'car', blurb: 'Dar sokaklarda, mahalle arasında sürat rekoru kır.' },
  { id: 'robo-kedi', title: 'Robo Kedi', genre: 'Platform', platform: 'ZIDE Pocket', year: 1998, price: 279, players: '1', rating: 4.4, colors: ['#0891b2', '#083344'], accent: '#ecfeff', icon: 'bolt', blurb: 'Şehrin çatılarında gezen mekanik bir kedinin gece macerası.' },
  { id: 'kristal-kale', title: 'Kristal Kale', genre: 'RPG', platform: 'ZIDE-64', year: 1997, price: 649, players: '1', rating: 4.9, colors: ['#7c3aed', '#1e1b4b'], accent: '#f0abfc', icon: 'crown', blurb: 'Dört kristali topla, kalenin kapısını aç, krallığın kaderini değiştir.' },
  { id: 'gece-dedektifi', title: 'Gece Dedektifi', genre: 'Gizem', platform: 'ZIDE Classic', year: 1994, price: 329, players: '1', rating: 4.3, colors: ['#1e293b', '#020617'], accent: '#94a3b8', icon: 'ghost', blurb: 'Yağmurlu şehirde ipuçlarını birleştir, gerçek katili bul.' },
  { id: 'super-simitci', title: 'Süper Simitçi', genre: 'Komedi Platform', platform: 'ZIDE Pocket', year: 1996, price: 219, players: '1-2', rating: 4.2, colors: ['#d97706', '#78350f'], accent: '#fffbeb', icon: 'star', blurb: 'Tepsiyi düşürmeden sabah trafiğini aş, tüm simitleri sat!' },
  { id: 'derin-mavi', title: 'Derin Mavi', genre: 'Su Altı Macera', platform: 'ZIDE-64', year: 1998, price: 479, players: '1', rating: 4.6, colors: ['#0369a1', '#082f49'], accent: '#67e8f9', icon: 'ship', blurb: 'Okyanusun dibindeki kayıp şehre dal, sırlarını gün yüzüne çıkar.' },
  { id: 'kirmizi-firtina', title: 'Kırmızı Fırtına', genre: 'Aksiyon', platform: 'ZIDE-64', year: 1997, price: 519, players: '1-2', rating: 4.3, colors: ['#b91c1c', '#450a0a'], accent: '#fecaca', icon: 'bolt', blurb: 'Fırtınanın ortasında düşman hatlarını yar, son noktaya ulaş.' },
  { id: 'lav-kacisi', title: 'Lav Kaçışı', genre: 'Platform', platform: 'ZIDE Classic', year: 1993, price: 229, players: '1', rating: 4.0, colors: ['#dc2626', '#7f1d1d'], accent: '#fde047', icon: 'skull', blurb: 'Yükselen lavdan kaç, bloktan bloğa zıpla, çıkışa yetiş.' },
  { id: 'ejder-yumurtasi', title: 'Ejder Yumurtası', genre: 'Fantezi', platform: 'ZIDE-64', year: 1999, price: 579, players: '1', rating: 4.7, colors: ['#15803d', '#052e16'], accent: '#bbf7d0', icon: 'heart', blurb: 'Bulduğun yumurtadan çıkan ejderi büyüt, birlikte gökleri fethet.' },
  { id: 'atari-sehri', title: 'Atari Şehri', genre: 'Dövüş', platform: 'ZIDE Classic', year: 1992, price: 289, players: '1-2', rating: 4.1, colors: ['#9333ea', '#3b0764'], accent: '#f5d0fe', icon: 'sword', blurb: 'Neon sokaklarda sokak çetelerine karşı yumruk yumruğa.' },
  { id: 'zaman-bukucu', title: 'Zaman Bükücü', genre: 'Bulmaca', platform: 'ZIDE Pocket', year: 1999, price: 259, players: '1', rating: 4.5, colors: ['#0f766e', '#042f2e'], accent: '#99f6e4', icon: 'star', blurb: 'Zamanı geri sar, ileri sar, bulmacaları çözmek için kendi geçmişinle iş birliği yap.' },
  { id: 'col-haydutlari', title: 'Çöl Haydutları', genre: 'Araçlı Savaş', platform: 'ZIDE-64', year: 1996, price: 459, players: '1-4', rating: 4.4, colors: ['#c2410c', '#431407'], accent: '#fed7aa', icon: 'car', blurb: 'Kum fırtınasında zırhlı araçlarla ganimet için çarpış.' },
  { id: 'buz-sarayi', title: 'Buz Sarayı', genre: 'Macera', platform: 'ZIDE Classic', year: 1995, price: 369, players: '1', rating: 4.2, colors: ['#38bdf8', '#0c4a6e'], accent: '#f0f9ff', icon: 'crown', blurb: 'Donmuş sarayın labirent koridorlarında kaybolmuş kraliçeyi bul.' },
  { id: 'mikro-savascilar', title: 'Mikro Savaşçılar', genre: 'Dövüş', platform: 'ZIDE Pocket', year: 1998, price: 269, players: '1-2', rating: 4.0, colors: ['#4d7c0f', '#1a2e05'], accent: '#ecfccb', icon: 'sword', blurb: 'Minicik savaşçılar, devasa arenalar, büyük kombolar.' },
  { id: 'son-seviye', title: 'Son Seviye', genre: 'Korku', platform: 'ZIDE-64', year: 1999, price: 599, players: '1', rating: 4.6, colors: ['#111827', '#000'], accent: '#f87171', icon: 'skull', blurb: 'Oyunun son seviyesine ulaştın. Ama bu seviye seni bekliyordu.' },
];

export const GAME_BY_ID: Record<string, Game> = Object.fromEntries(GAMES.map((g) => [g.id, g]));

const nf = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 });
export const fmt = (n: number) => nf.format(n);
