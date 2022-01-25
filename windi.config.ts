import { defineConfig } from 'vite-plugin-windicss'
import aspectRatio from 'windicss/plugin/aspect-ratio'
import forms from 'windicss/plugin/forms'
import lineClamp from 'windicss/plugin/line-clamp'
import typography from 'windicss/plugin/typography'

export default defineConfig({
  darkMode: 'media',
  plugins: [aspectRatio, forms, lineClamp, typography()]
})
