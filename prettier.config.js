export default {
  tailwindAttributes: [
    "class",
    "className",
    "ngClass",
    ".*Class.*",
    ".*Classes.*",
  ],
  plugins: ["prettier-plugin-organize-imports", "prettier-plugin-tailwindcss"],
};
