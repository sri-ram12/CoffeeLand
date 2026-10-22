/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '420px',
      },
      colors: {
        espresso: {
          950: '#150C08',
          900: '#1E120D',
          800: '#2B1B16', // Primary Espresso Brown
          700: '#3D2720',
          600: '#4F332A',
        },
        coffee: {
          900: '#3D2418',
          800: '#4D2E1F',
          700: '#5C3825', // Coffee Brown
          600: '#75472F',
          500: '#8E5739',
          400: '#A96845',
        },
        caramel: {
          600: '#9E6F34',
          500: '#B8823F',
          DEFAULT: '#C99552', // Caramel Gold
          400: '#D5A869',
          300: '#E2BD86',
          200: '#EED3A8',
          100: '#FAE8CC',
        },
        biscuit: {
          DEFAULT: '#EDE0CC',
          50: '#FBF7F0',
          100: '#F7EFE1',
          200: '#EFE2CE',
          300: '#EDE0CC',
          400: '#E2CEB3',
          500: '#D5BD9C',
        },
        cream: {
          DEFAULT: '#EDE0CC',
          50: '#FDFCF9',
          100: '#F7EFE1',
          200: '#EFE2CE',
          300: '#EDE0CC',
        },
        beige: {
          DEFAULT: '#EDE0CC',
          400: '#DFCAAE',
          500: '#D4B996',
        },
        terracotta: {
          DEFAULT: '#802B12',
          600: '#6D240F',
          700: '#5C1D0B',
          500: '#943216',
          400: '#A94324',
          50: '#FDF7F5',
        },
        parchment: {
          50: '#FDFCF9',
          100: '#FAF5EE',
          200: '#F5EBE0',
          300: '#EDE0D0',
          400: '#DFCAAE',
          DEFAULT: '#E8D8C3',
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', '"Playfair Display"', 'sans-serif'],
        serif: ['"Playfair Display"', '"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '"Outfit"', 'Inter', 'sans-serif'],
        heading: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        handwriting: ['"Caveat"', 'cursive'],
      },
      boxShadow: {
        'warm': '0 10px 30px -10px rgba(43, 27, 22, 0.25)',
        'warm-lg': '0 20px 40px -15px rgba(43, 27, 22, 0.35)',
        'gold': '0 10px 25px -5px rgba(201, 149, 82, 0.3)',
      },
      backgroundImage: {
        'grain': "radial-gradient(circle at 50% 50%, rgba(201, 149, 82, 0.05) 0%, transparent 100%)",
      }
    },
  },
  plugins: [],
}
