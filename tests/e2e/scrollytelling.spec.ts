// Experimental pinned scrollytelling (branch exp/scrollytelling): three
// persistent cards in a sticky stage, driven by continuous scroll progress.
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const desktop = { width: 1280, height: 800 };

const isPinned = (page: Page) =>
  page
    .locator("[data-scrolly]")
    .evaluate((el) => el.classList.contains("is-scrolly"));

// Scrolls and waits two frames, so the script's rAF render has run.
const scrollToY = (page: Page, top: number) =>
  page.evaluate(
    (y) =>
      new Promise((resolve) => {
        scrollTo(0, y);
        requestAnimationFrame(() => requestAnimationFrame(resolve));
      }),
    top,
  );

// Each card's window (top, height), weight and opacity, plus page facts.
const snapshot = (page: Page) =>
  page.evaluate(() => {
    const cards = [...document.querySelectorAll(".pipeline > li")]
      .slice(1)
      .map((li) => {
        const body = li.querySelector(".stage-body")!.getBoundingClientRect();
        return {
          name: li.querySelector("h3")!.textContent,
          top: body.top,
          bottom: body.bottom,
          height: body.height,
          w: Number(getComputedStyle(li).getPropertyValue("--w")),
          opacity: Number(getComputedStyle(li).opacity),
        };
      });
    const track = document
      .querySelector("[data-scrolly-track]")!
      .getBoundingClientRect();
    return {
      cards,
      pinned: track.top <= 16 && track.bottom >= innerHeight / 2,
      skills: document.querySelector("#skills-heading")!.getBoundingClientRect()
        .top,
      max: document.documentElement.scrollHeight - innerHeight,
    };
  });

// Scroll position where the named card first reaches full weight.
const findFullyActive = async (page: Page, name: string) => {
  const { max } = await snapshot(page);
  for (let y = 0; y <= max; y += 20) {
    await scrollToY(page, y);
    const card = (await snapshot(page)).cards.find((c) => c.name === name)!;
    if (card.w > 0.999) return y;
  }
  throw new Error(`${name} never became fully active`);
};

test.describe("pinned scrollytelling on desktop", () => {
  test.use({ viewport: desktop });

  test("moves cards continuously, never jumping", async ({ page }) => {
    await page.goto("/");
    expect(await isPinned(page)).toBe(true);
    const { max } = await snapshot(page);
    let previous = await snapshot(page);
    for (let y = 20; y <= max; y += 20) {
      await scrollToY(page, y);
      const now = await snapshot(page);
      if (now.pinned && previous.pinned) {
        now.cards.forEach((card, i) => {
          const before = previous.cards[i];
          expect(
            Math.abs(card.top - before.top),
            `${card.name} position at ${y}px`,
          ).toBeLessThan(40);
          expect(
            Math.abs(card.height - before.height),
            `${card.name} height at ${y}px`,
          ).toBeLessThan(60);
          expect(
            Math.abs(card.w - before.w),
            `${card.name} weight at ${y}px`,
          ).toBeLessThan(0.25);
        });
      }
      previous = now;
    }
  });

  test("keeps all three cards in view and Skills right below while pinned", async ({
    page,
  }) => {
    await page.goto("/");
    const { max } = await snapshot(page);
    for (let y = 0; y <= max; y += 80) {
      await scrollToY(page, y);
      const now = await snapshot(page);
      if (!now.pinned) continue;
      const last = now.cards[now.cards.length - 1];
      for (const card of now.cards) {
        expect(card.top, `${card.name} at ${y}px`).toBeLessThan(desktop.height);
      }
      expect(
        now.skills - last.bottom,
        `gap above Skills at ${y}px`,
      ).toBeLessThan(100);
    }
  });

  for (const name of ["Stellantis", "Polytechnic of Turin"]) {
    test(`shows all of ${name}'s content when it is active`, async ({
      page,
    }) => {
      await page.goto("/");
      await scrollToY(page, (await findFullyActive(page, name)) + 20);
      const card = page.locator(".pipeline > li").filter({
        has: page.getByRole("heading", { level: 3, name, exact: true }),
      });
      for (const d of await card.locator("details").all()) {
        await expect(d).toHaveAttribute("open", "");
      }
      const content = await card.locator(".stage-content").boundingBox();
      const window = await card.locator(".stage-body").boundingBox();
      expect(content!.y + content!.height).toBeLessThanOrEqual(
        window!.y + window!.height,
      );
    });
  }

  test("recedes previous cards but keeps their header readable", async ({
    page,
  }) => {
    await page.goto("/");
    await scrollToY(page, await findFullyActive(page, "Polytechnic of Turin"));
    const { cards } = await snapshot(page);
    for (const card of cards.slice(0, 2)) {
      expect(card.opacity, card.name).toBeGreaterThanOrEqual(0.78);
      expect(card.opacity, card.name).toBeLessThan(1);
    }
    await expect(
      page.getByRole("heading", { name: "Amadeus IT Group" }),
    ).toBeInViewport();
    await expect(page.getByText("Dec 2024 – Present").first()).toBeInViewport();
  });

  test("keeps semantics and content for assistive technology", async ({
    page,
  }) => {
    await page.goto("/");
    await scrollToY(page, await findFullyActive(page, "Stellantis"));
    await expect(page.locator('[aria-current="step"] h3')).toHaveText(
      "Amadeus IT Group",
    );
    await expect(
      page.getByText(/Designed and operationalized AI knowledge assistants/),
    ).toHaveCount(1);
    await expect(page.locator(".stage-status")).toHaveCount(4);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test("scrolls a card into view when it receives keyboard focus", async ({
    page,
  }) => {
    await page.goto("/");
    await page.locator('[data-status="success"] summary').last().focus();
    await expect
      .poll(async () => {
        const { cards } = await snapshot(page);
        return cards.find((c) => c.name === "Polytechnic of Turin")!.w;
      })
      .toBeGreaterThan(0.99);
  });
});

for (const [name, setup] of [
  ["phones", { viewport: { width: 360, height: 800 } }],
  ["reduced motion", { viewport: desktop, reducedMotion: "reduce" as const }],
] as const) {
  test(`keeps the static page on ${name}`, async ({ browser }) => {
    const context = await browser.newContext(setup);
    const page = await context.newPage();
    await page.goto("/");
    expect(await isPinned(page)).toBe(false);
    const li = page.locator(".pipeline > li").nth(1);
    expect(await li.evaluate((el) => getComputedStyle(el).position)).toBe(
      "relative",
    );
    await context.close();
  });
}
