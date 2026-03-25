/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  darkMode: 'class', // or 'media'
  theme: {
    extend: {
      colors: {
        colorBase: {
          light: 'var(--color-base-light)',
          dark: 'var(--color-base-dark)',
        },
        colorPrimary: {
          light: 'var(--color-primary-light)',
          dark: 'var(--color-primary-dark)',
        },
        colorSecondary: {
          light: 'var(--color-secondary-light)',
          dark: 'var(--color-secondary-dark)',
        },
        colorHover: {
          light: 'var(--color-hover-light)',
          dark: 'var(--color-hover-dark)',
        },
        colorNotImportant: {
          light: 'var(--color-not-important-light)',
          dark: 'var(--color-not-important-dark)',
        },
        colorGreen: {
          light: 'var(--color-green-light)',
          dark: 'var(--color-green-dark)',
        },
        colorRed: {
          light: 'var(--color-red-light)',
          dark: 'var(--color-red-dark)',
        },
        colorOrange: {
          light: 'var(--color-orange-light)',
          dark: 'var(--color-orange-dark)',
        },
        colorBlue: {
          light: 'var(--color-blue-light)',
          dark: 'var(--color-blue-dark)',
        },
        bgBase: {
          light: 'var(--bg-base-light)',
          dark: 'var(--bg-base-dark)',
        },
        bgSecondary: {
          light: 'var(--bg-secondary-light)',
          dark: 'var(--bg-secondary-dark)',
        },
        bgHover: {
          light: 'var(--bg-hover-light)',
          dark: 'var(--bg-hover-dark)',
        },
        bgDark: {
          light: 'var(--bg-dark-light)',
          dark: 'var(--bg-dark-dark)',
        },
        borderColor: {
          light: 'var(--border-color-light)',
          dark: 'var(--border-color-dark)',
        }
      }
    }
  },
  plugins: [],
}
