/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        fg: 'var(--color-fg)',
        red: 'var(--color-red)',
        crimson: 'var(--color-crimson)',
        blood: 'var(--color-blood)',
        ember: 'var(--color-ember)',
        spark: 'var(--color-spark)',
        bone: 'var(--color-bone)',
        cyan: 'var(--color-cyan)',
        magenta: 'var(--color-magenta)',
        lime: 'var(--color-lime)',
        purple: 'var(--color-purple)',
        orange: 'var(--color-orange)',
        yellow: 'var(--color-yellow)',
        grid: 'var(--color-grid)',
      },
      fontFamily: {
        display: ['"Sweet Sucker Punch"', 'sans-serif'],
        body: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        graffiti: ['"Sweet Sucker Punch"', 'cursive'],
      },
      backgroundImage: {
        'gradient-blood': 'linear-gradient(135deg, var(--color-red) 0%, var(--color-crimson) 50%, var(--color-blood) 100%)',
        'gradient-ember': 'linear-gradient(135deg, var(--color-ember) 0%, var(--color-red) 50%, var(--color-blood) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'flicker': 'flicker 3s linear infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '41.99%': { opacity: '1' },
          '42%': { opacity: '0' },
          '43%': { opacity: '0' },
          '43.01%': { opacity: '1' },
          '47.99%': { opacity: '1' },
          '48%': { opacity: '0' },
          '49%': { opacity: '0' },
          '49.01%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
