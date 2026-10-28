// Career-stage schema and validation rules (ADR 0004).
// Kept free of `astro:content` imports so unit tests can use it directly.
import { z } from "astro/zod";

const text = z.string().min(1);
export const localized = z.object({ en: text, it: text });
const localizedList = z.object({ en: z.array(text), it: z.array(text) });
// A fact that reads the same in both languages, or differs per language.
const localizable = z.union([text, localized]);

// "YYYY" when only the year is known, otherwise "YYYY-MM".
const partialDate = z
  .string()
  .regex(/^\d{4}(-(0[1-9]|1[0-2]))?$/, "Expected YYYY or YYYY-MM");

const step = z.object({
  role: localized,
  start: partialDate,
  end: partialDate.nullable(),
  summary: localized.optional(),
  highlights: localizedList.optional(),
});

export const stageSchema = z
  .object({
    kind: z.enum(["education", "work", "next"]),
    status: z.enum(["success", "running", "pending"]),
    organization: localizable.optional(),
    employmentNote: localized.optional(),
    location: localizable.optional(),
    parallelWith: z.string().optional(),
    steps: z.array(step),
    technologies: z.array(text).optional(),
    link: z.url().optional(),
  })
  .superRefine((stage, ctx) => {
    for (const message of entryIssues(stage)) {
      ctx.addIssue({ code: "custom", message });
    }
  });

export type Stage = z.infer<typeof stageSchema>;
export type Step = Stage["steps"][number];
export interface StageEntry {
  id: string;
  data: Stage;
}

/** Month index for comparisons; a year-only date spans January–December. */
export function monthIndex(date: string, edge: "start" | "end"): number {
  const [year, month] = date.split("-").map(Number);
  return year * 12 + (month ?? (edge === "start" ? 1 : 12)) - 1;
}

function stepEnd(step: Step): number {
  return step.end === null ? Infinity : monthIndex(step.end, "end");
}

/** Rules that concern a single stage. */
export function entryIssues(stage: Stage): string[] {
  const issues: string[] = [];
  const isNext = stage.kind === "next";

  if (isNext !== (stage.status === "pending")) {
    issues.push("Only the 'next' stage can be pending, and it must be.");
  }
  if (isNext && (stage.organization || stage.steps.length > 0)) {
    issues.push("The 'next' stage names no organization and has no steps.");
  }
  if (!isNext && (!stage.organization || stage.steps.length === 0)) {
    issues.push(
      "A completed or running stage needs an organization and steps.",
    );
  }

  stage.steps.forEach((step, i) => {
    const where = `Step ${i + 1}`;
    if (step.end !== null && stepEnd(step) < monthIndex(step.start, "start")) {
      issues.push(`${where} ends before it starts.`);
    }
    const isLast = i === stage.steps.length - 1;
    if (step.end === null && !(stage.status === "running" && isLast)) {
      issues.push(`${where} is open-ended but is not the running step.`);
    }
    if (
      step.highlights &&
      step.highlights.en.length !== step.highlights.it.length
    ) {
      issues.push(
        `${where} has different numbers of English and Italian highlights.`,
      );
    }
    const next = stage.steps[i + 1];
    if (next && stepEnd(step) > monthIndex(next.start, "end")) {
      issues.push(
        `${where} must end before step ${i + 2} starts (oldest first).`,
      );
    }
  });

  if (stage.status === "running" && stage.steps.at(-1)?.end !== null) {
    issues.push(
      "The running stage's last step must be open-ended (end: null).",
    );
  }
  return issues;
}

/** Rules that concern the collection as a whole. */
export function collectionIssues(stages: StageEntry[]): string[] {
  const issues: string[] = [];
  const count = (status: Stage["status"]) =>
    stages.filter((s) => s.data.status === status).length;

  if (count("running") !== 1) {
    issues.push(
      `Expected exactly one running stage, found ${count("running")}.`,
    );
  }
  if (count("pending") > 1) {
    issues.push(
      `Expected at most one pending stage, found ${count("pending")}.`,
    );
  }

  const byId = new Map(stages.map((s) => [s.id, s.data]));
  for (const { id, data } of stages) {
    if (!data.parallelWith) continue;
    const other = byId.get(data.parallelWith);
    if (!other) {
      issues.push(
        `'${id}' is parallel with unknown stage '${data.parallelWith}'.`,
      );
    } else if (!overlaps(data, other)) {
      issues.push(
        `'${id}' is marked parallel with '${data.parallelWith}' but their dates do not overlap.`,
      );
    }
  }
  return issues;
}

function span(stage: Stage): [number, number] {
  return [
    Math.min(...stage.steps.map((s) => monthIndex(s.start, "start"))),
    Math.max(...stage.steps.map(stepEnd)),
  ];
}

function overlaps(a: Stage, b: Stage): boolean {
  const [aStart, aEnd] = span(a);
  const [bStart, bEnd] = span(b);
  return aStart <= bEnd && bStart <= aEnd;
}

/** Newest first, like a build history: pending, running, then by start date. */
export function sortNewestFirst(stages: StageEntry[]): StageEntry[] {
  const rank = { pending: 2, running: 1, success: 0 };
  return [...stages].sort(
    (a, b) =>
      rank[b.data.status] - rank[a.data.status] ||
      span(b.data)[0] - span(a.data)[0],
  );
}
