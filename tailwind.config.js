/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        fg: 'var(--color-fg)',
        cyan: 'var(--color-cyan)',
        magenta: 'var(--color-magenta)',
        grid: 'var(--color-grid)',
      },
      fontFamily: {
        display: ['"Sweet Sucker Punch"', 'sans-serif'],
        body: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
