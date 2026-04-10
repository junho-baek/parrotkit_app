/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        canvas: '#f6f3ea',
        surface: '#fffdf8',
        sheet: '#fff9ee',
        stroke: '#e8e0d2',
        ink: '#111827',
        muted: '#57534e',
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
