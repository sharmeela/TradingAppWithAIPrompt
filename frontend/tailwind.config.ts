import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#07111F',
        accent: '#22d3ee',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(34,211,238,0.2), 0 12px 30px rgba(8,145,178,0.25)',
      },
    },
  },
  plugins: [],
} satisfies Config;
