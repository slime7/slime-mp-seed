/** @type {import('tailwindcss').Config} */
export default {
  content: ['./public/index.html', './src/**/*.{html,js,ts,jsx,tsx,vue}'],
  corePlugins: {
    preflight: false,
  },
};
