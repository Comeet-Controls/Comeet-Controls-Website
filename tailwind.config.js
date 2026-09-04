/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        head: ["var(--font-head)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      colors: {
        bg:      "#020c18",
        bg2:     "#061525",
        surface: "#0d2035",
        accent:  "#00b4ff",
        accent2: "#0066ff",
        gold:    "#f5a623",
        ctext:   "#e0eaf5",
        muted:   "#7fa3c4",
      },
    },
  },
  plugins: [],
};