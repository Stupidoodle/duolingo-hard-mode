import globals from "globals";


/** @type {import('eslint').Linter.Config[]} */
export default [
  // Generated output; linting it only produced noise.
  {ignores: ["coverage/", "dist/"]},
  {languageOptions: { globals: globals.browser }},
];