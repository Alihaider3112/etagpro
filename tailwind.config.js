const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  mode: 'jit',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
        serif: ['Inter', ...fontFamily.serif]
      }
    },
    screens: {
      xs: '530px',

      sm: '640px',

      md: '768px',

      lg: '1024px',

      xl: '1280px',

      '2xl': '1536px'
    }
  },
  variants: {
    extend: {
      backgroundColor: ['hover'],
      boxShadow: ['hover'],
      transform: ['hover'],
      scale: ['hover']
    }
  },
  important: true, // important in prod is must be
  // eslint-disable-next-line global-require
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
  corePlugins: {
    preflight: false // <== disable this!
  }
}
