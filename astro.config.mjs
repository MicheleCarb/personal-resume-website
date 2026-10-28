// @ts-check
import { defineConfig } from "astro/config";

// Served from the custom domain root, so no `base` is needed (ADR 0002).
export default defineConfig({
  site: "https://michelecarb.one",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "it"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
