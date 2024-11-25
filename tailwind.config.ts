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
        'light-green': "#7EB672",
        'dark-green': "#507c0c",
        'banner-green': "#24593D",
        'dark-red': "#C31C01",
        'red': "#EB2B0C",
        'dark-purple': "#293b8b",
        'purple': "#3851BC",
        'light-gray': "#E1E1E1",
        'gray': "#828282",
        'dark-blue': "#3851BC"
      },
      fontFamily: {
        serif: ["'Crimson Text'", "serif"],
        crimson: ['"Crimson Text"', 'serif'],
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ], 
};
export default config;