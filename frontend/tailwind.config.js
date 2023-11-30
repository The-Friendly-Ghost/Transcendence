/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/flowbite-react/**/*.js",

  ],
  theme: {
    extend: {
      fontFamily: {
        satoshi: ['Satoshi', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        "col1": "#4c1d95" /* violet 900 */,
        "col2": "#6d28d9" /* violet 700 */,
        "col3": "#06b6d4" /* cyan 500 */,
        "col4": "#a5f3fc" /* cyan 200 */,
        "col5": "#e5e7eb" /* gray 200 */,
      }
    },
  },
  plugins: [
    require("flowbite/plugin")
  ],
}