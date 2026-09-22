import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0B1E3F",
          navyDark: "#07142B",
          blue: "#0052CC",
          blueLight: "#0747A6",
          accent: "#FF424E",
          sale: "#E02020",
        },
      },
    },
  },
  plugins: [],
};
export default config;
