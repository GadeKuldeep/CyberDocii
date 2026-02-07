/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#000000', // Pure Black
          800: '#0a0a0a', // Almost Black
          700: '#141414', // Very Dark Gray
          600: '#1f1f1f',
        },
        primary: {
          DEFAULT: '#00BFFF', // Sky Blue (Deep Sky Blue)
          hover: '#0099CC',
        },
        secondary: {
          DEFAULT: '#1E90FF', // Dodger Blue
        },
        accent: {
          DEFAULT: '#00BFFF', // Matching primary for consistency in this theme
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
