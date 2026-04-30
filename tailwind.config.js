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
        lime: 'var(--color-lime)',
        purple: 'var(--color-purple)',
        orange: 'var(--color-orange)',
        yellow: 'var(--color-yellow)',
        grid: 'var(--color-grid)',
      },
      fontFamily: {
        display: ['"Sweet Sucker Punch"', 'sans-serif'],
        body: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
        'gradient-techno': 'linear-gradient(135deg, var(--color-magenta) 0%, var(--color-purple) 50%, var(--color-cyan) 100%)',
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
