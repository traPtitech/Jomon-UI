import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        'surface-primary': '#f9fafb',
        'surface-secondary': '#d1d5db',
        'surface-tertiary': '#e5e7eb',
        'hover-primary': '#e5e7eb',
        'hover-secondary': '#f3f4f6',
        'text-primary': '#323232',
        'text-secondary': '#9ca3af',

        'error-primary': '#ef4444',
        'error-secondary': '#fca5a5',
        'accent-primary': '#10b981',
        'accent-secondary': '#6ee7b7',

        'status-submitted': '#fbbf24',
        'status-fix-required': '#f87171',
        'status-accepted': '#34d399',
        'status-completed': '#9ca3af',
        'status-rejected': '#9ca3af'
      }
    }
  },
  plugins: [typography]
}
