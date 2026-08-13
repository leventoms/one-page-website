import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        plum: {
          DEFAULT: '#2c1a33',
          deep: '#170e1a',
          soft: '#3a2440',
          line: '#4a2f52',
        },
        marigold: {
          DEFAULT: '#f0a94e',
          light: '#f6c27a',
          deep: '#c07620',
        },
        rose: {
          DEFAULT: '#e2607a',
          light: '#f0a9b8',
        },
        ivory: {
          DEFAULT: '#f7ede1',
          muted: '#c9b7c2',
        },
        // brand.* is used across existing components (buttons, PIN gate);
        // remapped to the marigold family so the whole app restyles
        // without touching those files.
        brand: {
          50: '#fff8ec',
          100: '#ffedcf',
          400: '#f6c27a',
          500: '#f0a94e',
          600: '#c07620',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
