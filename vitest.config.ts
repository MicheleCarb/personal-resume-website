/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    include: ["tests/unit/**/*.test.ts"],
    // No unit tests until the content model exists (ADR 0005).
    passWithNoTests: true,
  },
});
