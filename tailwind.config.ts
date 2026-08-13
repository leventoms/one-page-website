import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f5',
          100: '#ffe4ec',
          400: '#fb7aa8',
          500: '#f5457f',
          600: '#d92a63',
        },
      },
    },
  },
  plugins: [],
};

export default config;
