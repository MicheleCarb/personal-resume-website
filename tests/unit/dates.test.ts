import { describe, expect, test } from "vitest";
import {
  formatDuration,
  formatPartialDate,
  toPartialDate,
} from "../../src/lib/dates";

const now = new Date(Date.UTC(2026, 9, 28)); // 28 October 2026

describe("formatPartialDate", () => {
  test("formats month-precise dates per language", () => {
    expect(formatPartialDate("2023-02", "en")).toBe("Feb 2023");
    expect(formatPartialDate("2024-05", "it")).toBe("mag 2024");
    expect(formatPartialDate("2022-09", "en")).toBe("Sep 2022");
  });

  test("keeps year-only dates as years", () => {
    expect(formatPartialDate("2019", "en")).toBe("2019");
    expect(formatPartialDate("2019", "it")).toBe("2019");
  });
});

describe("toPartialDate", () => {
  test("returns the current month in YYYY-MM form", () => {
    expect(toPartialDate(now)).toBe("2026-10");
  });
});

describe("formatDuration", () => {
  test("combines years and months", () => {
    expect(formatDuration("2023-02", "2024-05", "en", now)).toBe("1 yr 3 mos");
    expect(formatDuration("2023-02", "2024-05", "it", now)).toBe(
      "1 anno 3 mesi",
    );
  });

  test("uses singular and plural forms", () => {
    expect(formatDuration("2020-01", "2022-02", "en", now)).toBe("2 yrs 1 mo");
    expect(formatDuration("2020-01", "2022-02", "it", now)).toBe(
      "2 anni 1 mese",
    );
  });

  test("omits zero parts", () => {
    expect(formatDuration("2024-05", "2024-12", "en", now)).toBe("7 mos");
    expect(formatDuration("2020-03", "2022-03", "en", now)).toBe("2 yrs");
  });

  test("measures an open end up to now", () => {
    expect(formatDuration("2024-12", null, "en", now)).toBe("1 yr 10 mos");
  });

  test("counts at least one month", () => {
    expect(formatDuration("2024-05", "2024-05", "en", now)).toBe("1 mo");
  });

  test("returns null when either date is year-only", () => {
    expect(formatDuration("2019", "2022", "en", now)).toBeNull();
    expect(formatDuration("2019-09", "2022", "en", now)).toBeNull();
  });
});
