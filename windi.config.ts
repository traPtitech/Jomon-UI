import { defineConfig } from 'vite-plugin-windicss'
import colors from 'windicss/colors'
import aspectRatio from 'windicss/plugin/aspect-ratio'
import forms from 'windicss/plugin/forms'
import lineClamp from 'windicss/plugin/line-clamp'
import typography from 'windicss/plugin/typography'

export default defineConfig({
  darkMode: 'media',
  plugins: [aspectRatio, forms, lineClamp, typography()],
  theme: {
    extend: {
      colors: {
        'surface-primary': colors.gray[50],
        'surface-secondary': colors.gray[300],
        'surface-tertiary': colors.gray[200],
        'hover-primary': colors.gray[200],
        'hover-secondary': colors.gray[100],
        'text-primary': colors.dark[200],
        'text-secondary': colors.gray[400],

        'error-primary': colors.red[500],
        'error-secondary': colors.red[300],
        'accent-primary': colors.green[500],
        'accent-secondary': colors.green[300],

        'status-submitted': colors.yellow[400],
        'status-fix-required': colors.red[400],
        'status-accepted': colors.green[400],
        'status-completed': colors.gray[400],
        'status-rejected': colors.gray[400]
      },
      width: {
        fit: 'fit-content'
      }
    }
  }
})
