const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import("tailwindcss/tailwind-config").TailwindConfig } */
module.exports = {
  mode: 'jit',
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter var"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    // @ts-ignore
    require('@tailwindcss/forms'),
    // @ts-ignore
    require('@tailwindcss/typography'),
    // @ts-ignore
    require('@tailwindcss/line-clamp'),
    // @ts-ignore
    require('@tailwindcss/aspect-ratio'),
  ],
}
