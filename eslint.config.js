import js from "@eslint/js";
import astro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      "dist/",
      ".astro/",
      "node_modules/",
      "playwright-report/",
      "test-results/",
      ".claude/",
      ".impeccable/",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    // Node scripts; `document` is used inside Playwright's page.evaluate.
    files: ["scripts/**/*.mjs"],
    languageOptions: {
      globals: { URL: "readonly", console: "readonly", document: "readonly" },
    },
  },
];
