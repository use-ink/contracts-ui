const colors = require('tailwindcss/colors');
const process = require('process');

module.exports = {
  purge: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        darkMode: {
          elevation: {
            2: '#242A2E'
          }
        },
        elevation: {
          0: '#1a1d20',
          1: '#202529',
          2: '#242A2E',
          3: '#2F373D',
        },
        'gray-stroke': '#31383D',
        gray: {
          50: '#F5F6FA',
          100: '#F0F1F7',
          200: '#E6E7F0',
          300: '#D3D4DB',
          400: '#9597A6',
          500: '#737480',
          600: '#4D4F5C',
          700: '#3C3D47',
          800: '#2B2C33',
          850: '#1D2124',
          900: '#1A1D1F',
        },
      },
      spacing: {
        8.5: '2.125rem',
        9.5: '2.375rem',
        18: '4.625rem',
      },
    },
  },
  variants: {
    extend: {
      borderWidth: ['last'],
      scale: ['focus-within'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
