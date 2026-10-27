import globals from "globals";


/** @type {import('eslint').Linter.Config[]} */
export default [
  // Generated output; linting it only produced noise.
  {ignores: ["coverage/", "dist/", "build/"]},
  {languageOptions: { globals: globals.browser }},
  // Build tooling runs under bun, not in the extension.
  {files: ["scripts/**/*.js", "scripts/**/*.mjs"], languageOptions: { globals: globals.node }},
];