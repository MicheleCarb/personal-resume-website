import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const pipeline = (page: Page) =>
  page.getByRole("region", { name: "Career pipeline" });

test.describe("career pipeline (English)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("lists stages newest first", async ({ page }) => {
    await expect(pipeline(page).getByRole("heading", { level: 3 })).toHaveText([
      "Pipeline continues",
      "Amadeus IT Group",
      "Stellantis",
      "Polytechnic of Turin",
      "Polytechnic of Turin",
    ]);
  });

  test("labels every stage status in text", async ({ page }) => {
    const statuses = pipeline(page).locator(".stage-status");
    await expect(statuses).toHaveCount(5);
    await expect(statuses.nth(0)).toHaveText(/PENDING\s*\(Next\)/);
    await expect(statuses.nth(1)).toHaveText(/RUNNING\s*\(Current role\)/);
    for (const i of [2, 3, 4]) {
      await expect(statuses.nth(i)).toHaveText(/SUCCESS\s*\(Completed\)/);
    }
  });

  test("marks only the running stage as the current step", async ({ page }) => {
    const current = pipeline(page).locator('[aria-current="step"]');
    await expect(current).toHaveCount(1);
    await expect(current.getByRole("heading", { level: 3 })).toHaveText(
      "Amadeus IT Group",
    );
  });

  test("shows the current role first with an open end", async ({ page }) => {
    const current = pipeline(page).locator('[aria-current="step"]');
    await expect(current.getByRole("heading", { level: 4 }).first()).toHaveText(
      "Software Engineer · DevOps · Team Contributor",
    );
    await expect(current.getByText(/Dec 2024 – Present/)).toBeVisible();
  });

  test("shows Stellantis as the stage after the MSc, not in parallel", async ({
    page,
  }) => {
    await expect(pipeline(page).locator(".parallel")).toHaveCount(0);
    await expect(
      pipeline(page).getByRole("heading", { level: 4 }).nth(3),
    ).toHaveText("Master Thesis Researcher, then Engineering Specialist");
    await expect(
      pipeline(page).getByRole("heading", { level: 4 }).nth(4),
    ).toHaveText("MSc in Computer Engineering, Cybersecurity");
  });

  test("opens step details from the keyboard", async ({ page }) => {
    const details = pipeline(page).locator("details").first();
    const highlight = details.getByText(/AI knowledge assistants/);
    await expect(highlight).toBeHidden();

    await details.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(details).toHaveAttribute("open", "");
    await expect(highlight).toBeVisible();
  });

  test("has no accessibility violations with every detail expanded", async ({
    page,
  }) => {
    await page
      .locator("details")
      .evaluateAll((all) => all.forEach((d) => d.setAttribute("open", "")));
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});

test.describe("career pipeline (Italian)", () => {
  test("uses Italian names, dates, and labels", async ({ page }) => {
    await page.goto("/it/");
    const section = page.getByRole("region", { name: "Pipeline di carriera" });
    await expect(section.getByRole("heading", { level: 3 }).nth(3)).toHaveText(
      "Politecnico di Torino",
    );
    await expect(section.getByText(/dic 2024 – Oggi/)).toBeVisible();
    await expect(section.locator(".stage-status").nth(1)).toHaveText(
      /RUNNING\s*\(Ruolo attuale\)/,
    );
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("renders the pipeline and its expandable details", async ({ page }) => {
    await page.goto("/");
    await expect(pipeline(page).getByRole("heading", { level: 3 })).toHaveCount(
      5,
    );
    const summary = pipeline(page).locator("summary").first();
    await summary.click();
    await expect(
      pipeline(page).getByText(/AI knowledge assistants/),
    ).toBeVisible();
  });
});

test.describe("running marker motion", () => {
  const spinner = (page: Page) =>
    page
      .locator('[data-status="running"] .marker')
      .evaluate((el) => getComputedStyle(el, "::after").animationName);

  test("spins while the role is running", async ({ page }) => {
    await page.goto("/");
    expect(await spinner(page)).toBe("spin");
  });

  test("stays still under reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    expect(await spinner(page)).toBe("none");
    await expect(page.locator('[aria-current="step"]')).toContainText(
      "RUNNING",
    );
  });
});
