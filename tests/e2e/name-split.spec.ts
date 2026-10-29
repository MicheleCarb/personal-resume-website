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

  test("moves the contact block beside the intro without touching it or the pipeline", async ({
    page,
  }) => {
    const pipelineTop = () =>
      page.evaluate(
        () =>
          document.querySelector("#pipeline-heading")!.getBoundingClientRect()
            .top + scrollY,
      );
    const before = await pipelineTop();
    for (let y = 0; y <= 220; y += 20) {
      await scrollToY(page, y);
      const overlap = await page.evaluate(() => {
        const links = document
          .querySelector(".masthead nav")!
          .getBoundingClientRect();
        const intro = document
          .querySelector("[data-hero-intro] p")!
          .getBoundingClientRect();
        return (
          links.left < intro.right &&
          links.right > intro.left &&
          links.top < intro.bottom &&
          links.bottom > intro.top
        );
      });
      expect(overlap, `links overlap the intro at ${y}px`).toBe(false);
    }
    const settled = await page.evaluate(() => {
      const links = document
        .querySelector(".masthead nav")!
        .getBoundingClientRect();
      const intro = document
        .querySelector("[data-hero-intro]")!
        .getBoundingClientRect();
      return links.top >= intro.top - 1 && links.bottom <= intro.bottom + 60;
    });
    expect(settled, "links settle beside the intro").toBe(true);
    expect(await pipelineTop()).toBe(before);
  });

  test("keeps the links clickable while they move", async ({ page }) => {
    await scrollToY(page, 100);
    const hit = await page.evaluate(() => {
      const link = document.querySelector(".identity a")!;
      const r = link.getBoundingClientRect();
      return (
        document
          .elementFromPoint(r.left + 4, r.top + r.height / 2)
          ?.closest("a") === link
      );
    });
    expect(hit).toBe(true);
  });

  test("moves each copy along one straight diagonal", async ({ page }) => {
    // Right edge and page top of each copy: its anchor point.
    const anchors = () =>
      page.evaluate(() =>
        [...document.querySelectorAll(".split-piece")].map((el) => {
          const r = el.getBoundingClientRect();
          return [r.right, r.top + scrollY];
        }),
      );
    const start = await anchors();
    const samples: number[][][] = [];
    for (let y = 0; y <= 200; y += 10) {
      await scrollToY(page, y);
      samples.push(await anchors());
    }
    start.forEach(([x0, y0], i) => {
      const [x1, y1] = samples[samples.length - 1][i];
      const [dx, dy] = [x1 - x0, y1 - y0];
      expect(dx, `copy ${i} moves right`).toBeGreaterThan(0);
      expect(dy, `copy ${i} moves down`).toBeGreaterThan(0);
      for (const sample of samples) {
        const [x, y] = [sample[i][0] - x0, sample[i][1] - y0];
        const offLine = Math.abs(x * dy - y * dx) / Math.hypot(dx, dy);
        expect(offLine, `copy ${i} off its diagonal`).toBeLessThan(1);
      }
    });
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
    await page.evaluate(() => scrollTo(0, 150));
    expect(
      await page
        .locator(".masthead nav")
        .evaluate((el) => getComputedStyle(el).transform),
    ).toBe("none");
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
