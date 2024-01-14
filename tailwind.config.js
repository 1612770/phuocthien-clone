/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true, // to generate utilities as !important
  content: [
    // add the paths to all of your template files
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './modules/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#009549',
        'primary-light': '#04b359',
        'primary-dark': '#0d7842',
        'primary-background': '#f5f9f6',
        'primary-border': '#98afa8',
        waring: '#f5a623',
        'waring-light': '#f7c46c',
        'waring-dark': '#c47d15',
        'waring-background': '#fff8e6',
        'waring-border': '#f2d5a6',
      },
      aspectRatio: {
        '16/9': [16, 9],
        '4/3': '4 / 3',
        '21/9': '21 / 9',
      },
    },
    container: {
      center: true,
      screens: {
        sm: '600px',
        md: '728px',
        lg: '984px',
        xl: '1200px',
        '2xl': '1200px',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
