// Experimental name split and organization logos (branch exp/scrollytelling).
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const desktop = { width: 1280, height: 800 };

const scrollToY = (page: Page, top: number) =>
  page.evaluate(
    (y) =>
      new Promise((resolve) => {
        scrollTo(0, y);
        requestAnimationFrame(() => requestAnimationFrame(resolve));
      }),
    top,
  );

const opacities = (page: Page, selector: string) =>
  page
    .locator(selector)
    .evaluateAll((els) =>
      els.map((el) => Number(getComputedStyle(el).opacity)),
    );

test.describe("name split on desktop", () => {
  test.use({ viewport: desktop });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".split-piece")).toHaveCount(4);
  });

  test("uses decorative copies and leaves the real text untouched", async ({
    page,
  }) => {
    await expect(page.locator(".name-split")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Michele Carbone",
    );
    await expect(page.locator(".identity .handle")).toHaveText([
      "michelecarb",
      "michelecarb",
      "michelecarb",
    ]);
    await expect(page.locator(".split-to")).toHaveText([
      "michelecarb",
      "michelecarb",
      "michelecarb",
      "one",
    ]);
  });

  test("shows the links at rest and after the flight, clearing them in between", async ({
    page,
  }) => {
    expect(await opacities(page, ".identity .handle")).toEqual([1, 1, 1]);
    await scrollToY(page, 80);
    expect(await opacities(page, ".identity .handle")).toEqual([0, 0, 0]);
    await scrollToY(page, 200);
    expect(await opacities(page, ".identity .handle")).toEqual([1, 1, 1]);
    expect(await opacities(page, ".split-piece")).toEqual([0, 0, 0, 0]);
  });

  test("lands each copy exactly on its handle", async ({ page }) => {
    await scrollToY(page, 200);
    const landed = await page.evaluate(() => {
      const box = (el: Element) => el.getBoundingClientRect();
      const handles = [...document.querySelectorAll(".identity .handle")];
      const pieces = [...document.querySelectorAll(".split-to")];
      return handles.map((handle, i) => [
        Math.abs(box(handle).left - box(pieces[i]).left),
        Math.abs(box(handle).width - box(pieces[i]).width),
      ]);
    });
    for (const [dx, dw] of landed) {
      expect(dx).toBeLessThan(2);
      expect(dw).toBeLessThan(2);
    }
  });

  test("stays accessible mid-flight", async ({ page }) => {
    await scrollToY(page, 80);
    // The flying copies are aria-hidden, decorative and on screen only
    // while they fade; the real text around them is still checked.
    const results = await new AxeBuilder({ page })
      .exclude(".name-split")
      .analyze();
    expect(results.violations).toEqual([]);
  });
});

for (const [name, setup] of [
  ["phones", { viewport: { width: 360, height: 800 } }],
  ["reduced motion", { viewport: desktop, reducedMotion: "reduce" as const }],
] as const) {
  test(`skips the name split on ${name}`, async ({ browser }) => {
    const context = await browser.newContext(setup);
    const page = await context.newPage();
    await page.goto("/");
    await page.waitForTimeout(300);
    await expect(page.locator(".split-piece")).toHaveCount(0);
    await context.close();
  });
}

test("shows each organization's logo beside its name", async ({
  page,
  request,
}) => {
  await page.goto("/");
  for (const [name, file] of [
    ["Amadeus IT Group", "amadeus"],
    ["Stellantis", "stellantis"],
    ["Polytechnic of Turin", "polytechnic-of-turin"],
  ]) {
    const logo = page
      .getByRole("heading", { level: 3, name, exact: true })
      .locator("img");
    await expect(logo).toHaveAttribute("src", `/logos/${file}.png`);
    await expect(logo).toHaveAttribute("alt", "");
    expect((await request.get(`/logos/${file}.png`)).ok()).toBe(true);
  }
});
