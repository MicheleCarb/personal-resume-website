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
    },
    masthead: {
      now: "Amadeus IT Group · Consultant via Groupe SII · since Feb 2023",
      factsLabel: "Key results",
      facts: [/more than 200k€\/year \(over 20%\)/, /150k TPS/],
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
    },
    masthead: {
      now: "Amadeus IT Group · Consulente tramite Groupe SII · da feb 2023",
      factsLabel: "Risultati principali",
      facts: [/oltre 200k€\/anno \(oltre il 20%\)/, /150k TPS/],
    },
  },
];

for (const { path, other, links, masthead } of pages) {
  test.describe(path, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(path);
    });

    test("names the current employer and key results on a phone's first screen", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 360, height: 800 });
      const now = page.locator("[data-now]");
      await expect(now).toContainText(/RUNNING\s*\(/);
      await expect(now).toContainText(masthead.now);
      const facts = page.getByRole("list", { name: masthead.factsLabel });
      await expect(facts.getByRole("listitem")).toHaveText(masthead.facts);
      for (const part of [now, facts]) {
        const box = (await part.boundingBox())!;
        expect(box.y + box.height).toBeLessThanOrEqual(800);
      }
    });

    test("links to profiles and website, with no CV line until the PDF exists", async ({
      page,
    }) => {
      const banner = page.getByRole("banner");
      await expect(
        banner.getByRole("link", { name: links.linkedin }),
      ).toHaveAttribute("href", "https://www.linkedin.com/in/michelecarb");
      await expect(
        banner.getByRole("link", { name: links.github }),
      ).toHaveAttribute("href", "https://github.com/MicheleCarb");
      await expect(
        banner.getByRole("link", { name: links.website }),
      ).toHaveAttribute("href", "https://michelecarb.one");
      // TODO(cv): once the PDF exists, expect a download link instead.
      await expect(page.getByText(/CV/)).toHaveCount(0);
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
      await expect(page).toHaveTitle(
        "Michele Carbone · Software Engineer · Cloud & DevOps · Scrum Master",
      );
      await expect(head.locator('meta[property="og:image"]')).toHaveAttribute(
        "content",
        `${site}/og-image.png`,
      );
      await expect(head.locator('meta[name="twitter:card"]')).toHaveAttribute(
        "content",
        "summary_large_image",
      );
    });
  });
}

// TODO(cv): remove fixme once the PDF is added.
test.fixme("CV PDF is served", async ({ request }) => {
  const response = await request.get("/cv/michele-carbone-cv.pdf");
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("application/pdf");
});

const sections = [
  {
    path: "/",
    skills: "Skills",
    groups: ["Programming", "Agent orchestration", "Agentic development"],
    agentic: /Claude Code, Cursor, GitHub Copilot, Claude Skills, MCP/,
    credentials: "Certifications & Languages",
    language: /Italian\s*·\s*Native/,
  },
  {
    path: "/it/",
    skills: "Competenze",
    groups: ["Programmazione", "Orchestrazione di agenti", "Sviluppo agentico"],
    agentic: /Claude Code, Cursor, GitHub Copilot, Claude Skills, MCP/,
    credentials: "Certificazioni e lingue",
    language: /Italiano\s*·\s*Madrelingua/,
  },
];

for (const {
  path,
  skills,
  groups,
  agentic,
  credentials,
  language,
} of sections) {
  test(`${path} lists skills, certifications, and languages`, async ({
    page,
  }) => {
    await page.goto(path);

    const skillsSection = page.getByRole("region", { name: skills });
    for (const group of groups) {
      await expect(
        skillsSection.getByText(group, { exact: true }),
      ).toBeVisible();
    }
    await expect(skillsSection.getByText(agentic)).toBeVisible();

    const credentialsSection = page.getByRole("region", { name: credentials });
    await expect(
      credentialsSection.getByText("SAFe 6.0 Certified Scrum Master"),
    ).toBeVisible();
    await expect(credentialsSection.getByText(language)).toBeVisible();
  });
}

test("serves the icons, preview image, and robots.txt", async ({ request }) => {
  for (const path of [
    "/favicon.png",
    "/apple-touch-icon.png",
    "/og-image.png",
    "/robots.txt",
  ]) {
    const response = await request.get(path);
    expect(response.ok(), path).toBe(true);
  }
});

for (const path of ["/", "/it/"]) {
  test(`${path} loads without console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(path);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    expect(errors).toEqual([]);
  });
}
