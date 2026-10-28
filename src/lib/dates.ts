// Formatting for the partial dates used by career stages ("YYYY" or "YYYY-MM").
// Month names are explicit so output does not depend on the runtime's ICU data.
import type { Lang } from "../i18n/ui";

const months: Record<Lang, string[]> = {
  en: "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),
  it: "gen feb mar apr mag giu lug ago set ott nov dic".split(" "),
};

const units: Record<Lang, { year: [string, string]; month: [string, string] }> =
  {
    en: { year: ["yr", "yrs"], month: ["mo", "mos"] },
    it: { year: ["anno", "anni"], month: ["mese", "mesi"] },
  };

function parse(date: string): { year: number; month?: number } {
  const [year, month] = date.split("-").map(Number);
  return { year, month };
}

/** "2023-02" → "Feb 2023" / "feb 2023"; "2019" stays "2019". */
export function formatPartialDate(date: string, lang: Lang): string {
  const { year, month } = parse(date);
  return month ? `${months[lang][month - 1]} ${year}` : String(year);
}

/** "2023-02" for a month-precise date at the given moment. */
export function toPartialDate(now: Date): string {
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `${now.getUTCFullYear()}-${month}`;
}

/**
 * Elapsed time between two month-precise dates, e.g. "1 yr 3 mos".
 * Returns null when either date is year-only, so no precision is invented.
 * An open end (null) is measured up to `now`.
 */
export function formatDuration(
  start: string,
  end: string | null,
  lang: Lang,
  now: Date,
): string | null {
  const from = parse(start);
  const to = parse(end ?? toPartialDate(now));
  if (!from.month || !to.month) return null;

  const total = Math.max(
    1,
    (to.year - from.year) * 12 + (to.month - from.month),
  );
  const years = Math.floor(total / 12);
  const rest = total % 12;
  const unit = units[lang];
  const part = (n: number, [one, many]: [string, string]) =>
    `${n} ${n === 1 ? one : many}`;

  return [
    years > 0 ? part(years, unit.year) : null,
    rest > 0 ? part(rest, unit.month) : null,
  ]
    .filter(Boolean)
    .join(" ");
}
