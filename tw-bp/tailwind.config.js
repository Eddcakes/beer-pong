const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      primary: 'var(--color-primary)',
      'primary-light': 'var(--color-primary-light)',
      'primary-active': 'var(--color-primary-active)',
      secondary: 'var(--color-secondary)',
      negative: 'var(--color-negative)',
      positive: 'var(--color-positive)',
      'primary-background': 'var(--primary-background)',
      'sec-background': 'var(--sec-background)',
      'primary-text': 'var(--color-primary-text)',
      'secondary-text': 'var(--color-secondary-text)',
      'input-background': 'var(--color-input-background)',
      'link-text': 'var(--color-link-text)',
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      blue: colors.blue,
      white: colors.white,
      gray: colors.trueGray,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
    },
    maxHeight: (theme) => ({
      ...theme('spacing'),
      full: '100%',
      screen: '100vh',
      '75vh': '75vh',
    }),
    extend: {},
  },
  variants: {
    extend: {
      backgroundColor: ['responsive', 'hover', 'focus', 'active', 'disabled'],
      textColor: ['responsive', 'hover', 'focus', 'active', 'disabled'],
      margin: ['responsive', 'active'],
      borderWidth: ['responsive', 'active'],
      borderColor: ['disabled'],
      scale: ['responsive', 'hover', 'focus', 'active', 'disabled'],
      translate: ['responsive', 'hover', 'focus', 'active', 'disabled'],
      cursor: ['disabled'],
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
