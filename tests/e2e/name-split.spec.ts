// Hero name split and organization logos.
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const desktop = { width: 1280, height: 800 };
// Any scroll past the start threshold plays the whole sequence.
const firstScroll = 40;

const scrollToY = (page: Page, top: number) =>
  page.evaluate(
    (y) =>
      new Promise((resolve) => {
        scrollTo(0, y);
        requestAnimationFrame(() => requestAnimationFrame(resolve));
      }),
    top,
  );

// The hero's own animations and transitions (not the running spinner).
// Freezes the sequence at a moment in time, in milliseconds.
const seek = (page: Page, time: number) =>
  page.evaluate(
    (t) =>
      new Promise((resolve) => {
        for (const animation of document.getAnimations()) {
          const target = (animation.effect as KeyframeEffect).target;
          if (!target?.closest(".masthead")) continue;
          animation.pause();
          animation.currentTime = t;
        }
        requestAnimationFrame(() => requestAnimationFrame(resolve));
      }),
    time,
  );

// Lets the sequence run to its end.
const settle = (page: Page) =>
  page.evaluate(async () => {
    const hero = document
      .getAnimations()
      .filter((animation) =>
        (animation.effect as KeyframeEffect).target?.closest(".masthead"),
      );
    hero.forEach((animation) => animation.play());
    await Promise.all(hero.map((animation) => animation.finished));
    await new Promise((resolve) => requestAnimationFrame(resolve));
  });

const opacities = (page: Page, selector: string) =>
  page
    .locator(selector)
    .evaluateAll((els) =>
      els.map((el) => Number(getComputedStyle(el).opacity)),
    );

const linksTop = (page: Page) =>
  page
    .locator(".masthead nav")
    .evaluate((el) => el.getBoundingClientRect().top + scrollY);

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
    await expect(page.locator(".masthead .identity .handle")).toHaveText([
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

  test("keeps the real links fully visible at rest, in flight and after landing", async ({
    page,
  }) => {
    const linkText = ".masthead .identity :is(.prefix, .handle, .suffix)";
    const allVisible = async () =>
      expect(new Set(await opacities(page, linkText))).toEqual(new Set([1]));

    await allVisible();
    expect(await opacities(page, ".split-piece")).toEqual([0, 0, 0, 0]);

    await scrollToY(page, firstScroll);
    for (const time of [150, 300, 450, 600, 750]) {
      await seek(page, time);
      await allVisible();
    }
    await seek(page, 400);
    expect(Math.max(...(await opacities(page, ".split-piece")))).toBe(1);

    await settle(page);
    await allVisible();
    expect(await opacities(page, ".split-piece")).toEqual([0, 0, 0, 0]);
  });

  test("runs to the end when scrolling stops right after it starts", async ({
    page,
  }) => {
    const before = await linksTop(page);
    await scrollToY(page, firstScroll);
    await settle(page);

    const descent = await page
      .locator(".masthead")
      .evaluate((el) => parseFloat(el.style.getPropertyValue("--links-dy")));
    expect(descent).toBeGreaterThan(0);
    expect(await linksTop(page)).toBeCloseTo(before + descent, 0);

    // Each copy has landed exactly on its handle.
    const landed = await page.evaluate(() => {
      const box = (el: Element) => el.getBoundingClientRect();
      const handles = [
        ...document.querySelectorAll(".masthead .identity .handle"),
      ];
      const pieces = [...document.querySelectorAll(".split-to")];
      return handles.map((handle, i) => [
        Math.abs(box(handle).left - box(pieces[i]).left),
        Math.abs(box(handle).top - box(pieces[i]).top),
        Math.abs(box(handle).width - box(pieces[i]).width),
      ]);
    });
    for (const offsets of landed) {
      for (const offset of offsets) expect(offset).toBeLessThan(2);
    }
  });

  test("does not start on a tiny scroll, and resets back at the top", async ({
    page,
  }) => {
    const masthead = page.locator(".masthead");
    const before = await linksTop(page);

    await scrollToY(page, 10);
    await expect(masthead).not.toHaveClass(/is-landed/);

    await scrollToY(page, firstScroll);
    await expect(masthead).toHaveClass(/is-landed/);
    await settle(page);

    // Scrolling back up short of the top keeps the settled state.
    await scrollToY(page, 10);
    await expect(masthead).toHaveClass(/is-landed/);

    await scrollToY(page, 0);
    await expect(masthead).not.toHaveClass(/is-landed|is-flying/);
    await settle(page);
    expect(await linksTop(page)).toBeCloseTo(before, 0);
    expect(await opacities(page, ".split-piece")).toEqual([0, 0, 0, 0]);
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
    await scrollToY(page, firstScroll);
    for (let time = 0; time <= 720; time += 60) {
      await seek(page, time);
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
      expect(overlap, `links overlap the intro at ${time}ms`).toBe(false);
    }
    await settle(page);
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
    await scrollToY(page, firstScroll);
    await seek(page, 200);
    const hit = await page.evaluate(() => {
      const link = document.querySelector(".masthead .identity a")!;
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
    await scrollToY(page, firstScroll);
    await seek(page, 0);
    const start = await anchors();
    const samples: number[][][] = [];
    // 720ms of flight plus the longest stagger.
    for (let time = 0; time <= 900; time += 45) {
      await seek(page, time);
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

  test("prints the links in their place, not where the sequence moved them", async ({
    page,
  }) => {
    await scrollToY(page, firstScroll);
    await settle(page);
    await page.emulateMedia({ media: "print" });
    const nav = page.locator(".masthead nav");
    expect(await nav.evaluate((el) => getComputedStyle(el).transform)).toBe(
      "none",
    );
    await expect(page.locator(".name-split")).toBeHidden();
    // Inside the masthead, above its rule, clear of the intro.
    const inside = await page.evaluate(() => {
      const box = (selector: string) =>
        document.querySelector(selector)!.getBoundingClientRect();
      return box(".masthead nav").bottom <= box(".masthead").bottom;
    });
    expect(inside).toBe(true);
  });

  test("stays accessible mid-flight", async ({ page }) => {
    await scrollToY(page, firstScroll);
    await seek(page, 400);
    // The flying copies are aria-hidden, decorative and on screen only
    // while they fly; the real text around them is still checked.
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
