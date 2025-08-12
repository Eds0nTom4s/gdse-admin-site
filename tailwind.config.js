/********************
 * Tailwind Config  *
 ********************/
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app.vue',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#04aa5d',
          yellow: '#f9eb07',
          mint: '#ebfbf6'
        }
      }
    }
  },
  plugins: []
};