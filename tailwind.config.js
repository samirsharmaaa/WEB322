module.exports = {
  content: ["./views/*.html", "./public/**/*.html"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
}