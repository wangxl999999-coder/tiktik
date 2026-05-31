/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tiktik': {
          primary: '#FE2C55',
          secondary: '#25F4EE',
          dark: '#161823',
          gray: '#1A1A1A',
          light: '#F1F1F2',
          text: '#161823',
          textSecondary: '#666666',
          border: '#E8E8E8',
          success: '#20C997',
          warning: '#FFB020',
          danger: '#FF4D4F',
        }
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      scrollbar: {
        hide: {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        }
      }
    },
  },
  plugins: [],
}
