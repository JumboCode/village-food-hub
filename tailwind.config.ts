import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        'dark-green': "#24593D",
        'red': "#EB2B0C",
        'light-green': "#7EB672",
        'purple': "#3851BC",
      },
      fontFamily: {
        serif: ["'Crimson Text'", "serif"],
      },
      fontFamily: {
        crimson: ['"Crimson Text"', 'serif'],
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ], 
};
export default config;