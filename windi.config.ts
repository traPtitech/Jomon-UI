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
        primary: colors.dark[500],
        secondary: colors.gray[400]
      }
    }
  }
})
