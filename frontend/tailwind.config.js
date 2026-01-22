/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Softer blacks/grays
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#1a1a1a',
        },
      },
      borderRadius: {
        'DEFAULT': '0.5rem',  // 8px instead of 4px
        'sm': '0.375rem',     // 6px instead of 2px
        'md': '0.625rem',     // 10px instead of 6px
        'lg': '1rem',         // 16px instead of 8px
        'xl': '1.25rem',      // 20px instead of 12px
        '2xl': '1.5rem',      // 24px instead of 16px
        '3xl': '2rem',        // 32px instead of 24px
      },
    },
  },
  plugins: [],
}
