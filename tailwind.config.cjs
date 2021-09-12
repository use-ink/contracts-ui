const colors = require('tailwindcss/colors');
const process = require('process');

module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#EDEFFF',
          100: '#E0E7FF',
          200: '#C7CCFF',
          300: '#A0A8FA',
          400: '#818CF7',
          500: '#5A69EB',
          600: '#4959EB',
          700: '#4338CA',
          800: '#313DA3',
          900: '#2F3782'
        },
        darkMode: {
          elevation: {
            0: '#1A1D1F',
            1: '#202529',
            2: '#242A2E',
            3: '#2F373D'
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
        green: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B'
        },
        orange: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12'
        },
        red: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D'
        },
        yellow: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F'
        }
      },
      spacing: {
        8.5: '2.125rem',
        9.5: '2.375rem',
        18: '4.625rem',
      },
      fontSize: {
        '2.5xl': '1.75rem',
      },
    },
  },
  variants: {
    extend: {
      borderWidth: ['last'],
      opacity: ['disabled'],
      cursor: ['disabled'],
      scale: ['focus-within'],
      stroke: ['hover', 'group-hover']
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
