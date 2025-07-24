/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E3A8A', // Navy blue
          light: '#3B82F6',
          dark: '#1E40AF',
        },
        secondary: {
          DEFAULT: '#6B7280', // Gray
          light: '#9CA3AF',
          dark: '#4B5563',
        },
        accent: {
          DEFAULT: '#DC2626', // Red
          light: '#EF4444',
          dark: '#B91C1C',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        heading: ['var(--font-roboto-condensed)'],
      },
    },
  },
  plugins: [],
}
