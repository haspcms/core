import jsdoc from "eslint-plugin-jsdoc";
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
    plugins: {
      jsdoc,
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
      "jsdoc/require-jsdoc": [
        "warn",
        {
          publicOnly: true,
          require: {
            FunctionDeclaration: false,
            ArrowFunctionExpression: false,
            FunctionExpression: false,
          },
        },
      ],
    },
  },
];
