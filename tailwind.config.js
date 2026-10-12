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
          DEFAULT: '#2563EB',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          600: '#2563EB',
          700: '#1d4ed8',
        },
        dark: '#0F172A',
        surface: '#F8FAFC',
        success: '#16A34A',
        warning: '#F59E0B',
        danger: '#DC2626',
        muted: '#64748B'
      }
    },
  },
  plugins: [],
}
