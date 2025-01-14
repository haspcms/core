module.exports = {
  extends: ["next", "turbo", "prettier"],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "react/jsx-key": "off",

    // base rules
    "prettier/prettier": "warn",
    "no-console": ["warn", { allow: ["error"] }],
    "no-undef": "warn",
    "no-unused-vars": ["warn", { args: "none" }],
    eqeqeq: ["warn", "always"],
    "no-unexpected-multiline": "warn",
    "no-cond-assign": ["warn", "always"],
    "no-redeclare": "warn",
    "no-self-compare": "warn",
  },
  parserOptions: {
    babelOptions: {
      presets: [require.resolve("next/babel")],
    },
  },
};
