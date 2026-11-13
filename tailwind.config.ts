import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        zide: {
          pink: '#ff2bd6',
          cyan: '#00f0ff',
          yellow: '#ffe14d',
          night: '#0b0614',
          purple: '#1a0b33',
        },
      },
      fontFamily: {
        pixel: ['var(--font-pixel)', 'monospace'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        neonCyan: '0 0 18px rgba(0,240,255,0.45)',
        neonPink: '0 0 18px rgba(255,43,214,0.45)',
      },
    },
  },
  plugins: [],
};

export default config;
