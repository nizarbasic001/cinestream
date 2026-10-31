/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cs: {
          bg: '#0a0a0f',
          surface: '#13131a',
          'surface-hover': '#1c1c26',
          border: '#2a2a35',
          text: '#f5f5f7',
          'text-muted': '#9ca3af',
          primary: '#e50914',
          'primary-dark': '#b8070f',
          accent: '#f5c518',
          success: '#22c55e',
          warning: '#f59e0b',
          error: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Cairo', 'Inter', 'sans-serif'],
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
      },
      maxWidth: {
        '8xl': '88rem',
      },
    },
  },
  plugins: [],
};
