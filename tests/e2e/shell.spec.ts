import { expect, test } from "@playwright/test";

const site = "https://michelecarb.one";

const pages = [
  {
    path: "/",
    lang: "en",
    other: { name: "Italiano", path: "/it/", lang: "it" },
    links: {
      linkedin: "LinkedIn: linkedin.com/in/michelecarb",
      github: "GitHub: github.com/michelecarb",
      website: "Website: michelecarb.one",
      cv: "Download CV (PDF)",
    },
  },
  {
    path: "/it/",
    lang: "it",
    other: { name: "English", path: "/", lang: "en" },
    links: {
      linkedin: "LinkedIn: linkedin.com/in/michelecarb",
      github: "GitHub: github.com/michelecarb",
      website: "Sito web: michelecarb.one",
      cv: "Scarica il CV (PDF)",
    },
  },
];

for (const { path, other, links } of pages) {
  test.describe(path, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(path);
    });

    test("links to profiles, website, and CV with descriptive names", async ({
      page,
    }) => {
      await expect(
        page.getByRole("link", { name: links.linkedin }),
      ).toHaveAttribute("href", "https://www.linkedin.com/in/michelecarb");
      await expect(
        page.getByRole("link", { name: links.github }),
      ).toHaveAttribute("href", "https://github.com/MicheleCarb");
      await expect(
        page.getByRole("link", { name: links.website }),
      ).toHaveAttribute("href", "https://michelecarb.one");
      await expect(page.getByRole("link", { name: links.cv })).toHaveAttribute(
        "href",
        "/cv/michele-carbone-cv.pdf",
      );
    });

    test("switches to the other language", async ({ page }) => {
      await page.getByRole("link", { name: other.name }).click();
      await expect(page).toHaveURL(other.path);
      await expect(page.locator("html")).toHaveAttribute("lang", other.lang);
    });

    test("skip link moves focus to the main content", async ({ page }) => {
      await page.keyboard.press("Tab");
      const skipLink = page.locator(".skip-link");
      await expect(skipLink).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(page.locator("main")).toBeFocused();
    });

    test("declares canonical, language alternates, and social metadata", async ({
      page,
    }) => {
      const canonical = `${site}${path}`;
      const head = page.locator("head");
      await expect(head.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        canonical,
      );
      await expect(
        head.locator('link[rel="alternate"][hreflang="en"]'),
      ).toHaveAttribute("href", `${site}/`);
      await expect(
        head.locator('link[rel="alternate"][hreflang="it"]'),
      ).toHaveAttribute("href", `${site}/it/`);
      await expect(
        head.locator('link[rel="alternate"][hreflang="x-default"]'),
      ).toHaveAttribute("href", `${site}/`);
      await expect(head.locator('meta[property="og:url"]')).toHaveAttribute(
        "content",
        canonical,
      );
      await expect(head.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        /\S/,
      );
    });
  });
}

// The PDF is supplied in the content increment; remove fixme then.
test.fixme("CV PDF is served", async ({ request }) => {
  const response = await request.get("/cv/michele-carbone-cv.pdf");
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("application/pdf");
});
