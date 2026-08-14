import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Near-black "gallery wall" surfaces — the neutral canvas that lets
        // colorful photos/accents do the talking, per the reference system.
        plum: {
          DEFAULT: '#151517', // card surface
          deep: '#0a0a0c', // page background
          soft: '#1d1d20', // slightly lighter surface
          line: '#2a2a2e', // 1px borders/strokes
        },
        // Single accent family, used sparingly and mostly via the gradient
        // utility classes below — this is the "warm orange" stop.
        marigold: {
          DEFAULT: '#ff7a45',
          light: '#ff9d6b',
          deep: '#e85a2a',
        },
        // The "pink/purple" stop of the accent gradient, and a secondary
        // solid accent for variety where a second color is genuinely needed.
        rose: {
          DEFAULT: '#c026d3',
          light: '#e879c9',
        },
        ivory: {
          DEFAULT: '#ffffff', // primary text
          muted: '#a3a3ad', // secondary text
        },
        // brand.* is used across existing components (buttons, PIN gate);
        // remapped to the accent family so the whole app restyles without
        // touching those files.
        brand: {
          50: '#fff3ec',
          100: '#ffe1d1',
          400: '#ff9d6b',
          500: '#ff7a45',
          600: '#e85a2a',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
