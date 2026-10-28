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
      "Polytechnic of Turin",
      "Stellantis",
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

  test("groups overlapping stages as parallel", async ({ page }) => {
    const parallel = pipeline(page).locator(".parallel");
    await expect(parallel).toContainText("Parallel stages");
    await expect(parallel.getByRole("heading", { level: 3 })).toHaveText([
      "Polytechnic of Turin",
      "Stellantis",
    ]);
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
    await expect(section.getByRole("heading", { level: 3 }).nth(2)).toHaveText(
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
