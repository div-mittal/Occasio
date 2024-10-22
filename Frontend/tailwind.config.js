/** @type {import('tailwindcss').Config} */
export default {
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "blk" : "#141414",
        "wht" : "#D3D3D3",
        "ylw" : "#E0AF31",
      },
      fontFamily: {
        roboto: ['Afacad', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

