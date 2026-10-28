import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = [
  { path: "/", lang: "en" },
  { path: "/it/", lang: "it" },
];

const viewports = [
  { name: "mobile", width: 360, height: 800 },
  { name: "desktop", width: 1280, height: 800 },
];

for (const { path, lang } of pages) {
  for (const viewport of viewports) {
    test(`${path} renders accessibly on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      const response = await page.goto(path);

      expect(response?.ok()).toBe(true);
      await expect(page.locator("html")).toHaveAttribute("lang", lang);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  }
}
