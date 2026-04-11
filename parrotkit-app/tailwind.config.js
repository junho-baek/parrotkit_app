/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        canvas: '#ffffff',
        surface: '#ffffff',
        sheet: '#ffffff',
        stroke: '#e2e8f0',
        ink: '#111827',
        muted: '#64748b',
        brand: '#ff9568',
        rose: '#de81c1',
        violet: '#8c67ff',
        indigo: '#4f46e5',
        teal: '#0f766e',
      },
    },
  },
  plugins: [],
};
