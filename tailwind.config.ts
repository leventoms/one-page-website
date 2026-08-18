import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Near-black "gallery wall" surfaces — used by the actual delivered
        // product (Tier1-3Template, PinGate, /p/[slug]). Left untouched by
        // the marketing-site light redesign: colorful user photos are
        // meant to pop against near-black on the pages people actually
        // receive, and that's a separate, deliberate decision from how the
        // marketing site around it looks.
        plum: {
          DEFAULT: '#151517', // card surface
          deep: '#0a0a0c', // page background
          soft: '#1d1d20', // slightly lighter surface
          line: '#2a2a2e', // 1px borders/strokes
        },
        // Marketing-site surfaces (warm cream canvas — per Cutiepage's own
        // convention for this category: an off-white "gift wrap" base reads
        // cozier/more romantic than stark white for a gifting product —
        // with dark "product panel" islands floating on it, borrowed from
        // Subframe's screenshot-panel pattern). Only page.tsx, Nav,
        // Accordion, MarqueeStrip, the builder chrome, and ManualRequestForm
        // use these — never the templates themselves.
        paper: {
          DEFAULT: '#fffcf8', // page background
          soft: '#faf3ec', // card / input surface
          line: '#ece2d6', // 1px borders/strokes
        },
        ink: {
          DEFAULT: '#0a0a0c', // primary text on paper
          muted: '#6b6b70', // secondary text on paper
        },
        // Single accent family, used sparingly and mostly via the gradient
        // utility classes below — this is the "warm orange" stop. Unchanged
        // by the light redesign — same brand gradient, new canvas around it.
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
          DEFAULT: '#ffffff', // primary text — product surfaces only, see `plum` above
          muted: '#a3a3ad', // secondary text — product surfaces only
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
