import globals from "globals";

export default [
  {
    ignores: ["dist/*"],
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": [
        "warn",
        { vars: "all", args: "after-used", ignoreRestSiblings: false },
      ],
      eqeqeq: ["warn", "always"],
      "no-unexpected-multiline": "warn",
      "no-cond-assign": ["warn", "always"],
      "no-redeclare": "warn",
      "no-self-compare": "warn",
      "no-undef": "error",
    },
  },
];
