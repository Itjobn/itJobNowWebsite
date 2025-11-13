/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1193D4',
      },
      fontFamily: {
        switzer: ['"Switzer"', 'sans-serif'],
      },
      screens: {
        extraSmall: "375px",
        small: "425px",
        tablet: "841px",
        smallDesktop: "1200px",
        desktop: "1430px",
        largeDesktop: "1600px",
        extraLargeDesktop: "1920px",
        ultraLargeDesktop: "2100px",
      },
      height: {
        "screen-minus-5vh": "calc(100vh - 5vh)",
        "screen-minus-9vh": "calc(100vh - 9vh)",
        "screen-minus-12vh": "calc(100vh - 12vh)",
        "screen-minus-18vh": "calc(100vh - 18vh)",
        "screen-minus-10vh": "calc(100vh - 20vh)",
        "screen-minus-30vh": "calc(100vh - 30vh)",
        "screen-minus-40vh": "calc(100vh - 40vh)",
        "screen-minus-50vh": "calc(100vh - 50vh)",
        "screen-minus-53vh": "calc(100vh - 53vh)",
        "screen-minus-60vh": "calc(100vh - 60vh)",
      },
      maxHeight: {
        "screen-minus-5vh": "calc(100vh - 5vh)",
        "screen-minus-9vh": "calc(100vh - 9vh)",
        "screen-minus-40vh": "calc(100vh - 40vh)",
      },
    },
  },
  plugins: [],
};
