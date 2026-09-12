/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#F3F7F5',
          100: '#E5EDE8',
          200: '#C8DBD0',
          300: '#A0C2B0',
          400: '#749F89',
          500: '#4D7D67',
          600: '#396350',
          700: '#2C4E3E',
          800: '#23382E', // Primary Forest Moss (Elderly style)
          900: '#1A2E25',
          950: '#112019',
        },
        moss: {
          50: '#F3F7F5',
          100: '#E5EDE8',
          200: '#C8DBD0',
          300: '#A0C2B0',
          400: '#749F89',
          500: '#4D7D67',
          600: '#396350',
          700: '#2C4E3E',
          800: '#23382E',
          900: '#1A2E25',
          950: '#112019',
        },
        cream: {
          50: '#FDFBF8',
          100: '#FAF6F0', // Warm Ivory Canvas
          200: '#F4EFE5', // Card Bisque Tint
          300: '#EAE2D3', // Subtle Border
          400: '#DCD0BD',
          500: '#C9B79E',
          600: '#A8957C',
          700: '#7D6D58',
          800: '#544839',
          900: '#332B21',
        },
        caramel: {
          50: '#FDF7F4',
          100: '#FCEEE7',
          200: '#F8DCCF',
          300: '#F0BFA6',
          400: '#E49A76',
          500: '#CF7C4E', // Warm Terracotta Caramel Accent
          600: '#BE673B',
          700: '#9E4E28',
          800: '#7E3B1B',
          900: '#5A2912',
        },
        terracotta: {
          50: '#FDF7F4',
          100: '#FCEEE7',
          200: '#F8DCCF',
          300: '#F0BFA6',
          400: '#E49A76',
          500: '#CF7C4E', // Warm Terracotta Caramel Accent
          600: '#BE673B',
          700: '#9E4E28',
          800: '#7E3B1B',
          900: '#5A2912',
        },
        navy: {
          50: '#F1F5F9',
          100: '#E2E8F0',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#142332',
          950: '#0D1924',
        },
        amber: {
          50: '#FFFDF5',
          100: '#FEF8E7',
          200: '#FDF0CF',
          300: '#FCE4A7',
          400: '#F9D174',
          500: '#D9982E', // Warm Amber
          600: '#B87A1E',
          700: '#8F5B13',
        },
        mint: {
          50: '#F2FAF6',
          100: '#E1F5EC',
          500: '#2A9D68', // Organic Green
          600: '#1E7E52',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Prompt', 'Outfit', 'Sarabun', 'sans-serif'],
        heading: ['Outfit', '"Plus Jakarta Sans"', 'Prompt', 'sans-serif'],
        display: ['Fraunces', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(36, 62, 51, 0.06)',
        'soft-lg': '0 10px 30px -4px rgba(36, 62, 51, 0.10)',
        'soft-xl': '0 20px 40px -6px rgba(36, 62, 51, 0.12)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
