import { describe, expect, test } from "vitest";
import {
  collectionIssues,
  entryIssues,
  monthIndex,
  sortNewestFirst,
  stageSchema,
  type Stage,
  type StageEntry,
} from "../../src/content/stage-rules";

const t = (en: string) => ({ en, it: `${en} (it)` });

function work(overrides: Partial<Stage> = {}): Stage {
  return {
    kind: "work",
    status: "success",
    organization: "Example Org",
    steps: [{ role: t("Engineer"), start: "2020-01", end: "2021-06" }],
    ...overrides,
  };
}

const running = (start = "2022-01"): Stage =>
  work({
    status: "running",
    steps: [{ role: t("Engineer"), start, end: null }],
  });

const next: Stage = { kind: "next", status: "pending", steps: [] };

const entry = (id: string, data: Stage): StageEntry => ({ id, data });

describe("monthIndex", () => {
  test("treats a year-only date as January at the start and December at the end", () => {
    expect(monthIndex("2019", "start")).toBe(monthIndex("2019-01", "start"));
    expect(monthIndex("2019", "end")).toBe(monthIndex("2019-12", "end"));
  });
});

describe("stage schema", () => {
  test("accepts a valid completed stage", () => {
    expect(stageSchema.safeParse(work()).success).toBe(true);
  });

  test("rejects an unknown status", () => {
    expect(stageSchema.safeParse({ ...work(), status: "failed" }).success).toBe(
      false,
    );
  });

  test("rejects malformed dates", () => {
    const stage = work({
      steps: [{ role: t("Engineer"), start: "2020-13", end: "2021" }],
    });
    expect(stageSchema.safeParse(stage).success).toBe(false);
  });

  test("rejects a missing Italian translation", () => {
    const stage = {
      ...work(),
      steps: [{ role: { en: "Engineer" }, start: "2020", end: "2021" }],
    };
    expect(stageSchema.safeParse(stage).success).toBe(false);
  });

  test("reports single-stage rule violations as schema errors", () => {
    const stage = work({
      steps: [{ role: t("Engineer"), start: "2021", end: "2020" }],
    });
    expect(stageSchema.safeParse(stage).success).toBe(false);
  });
});

describe("entryIssues", () => {
  test("accepts valid completed, running, and next stages", () => {
    expect(entryIssues(work())).toEqual([]);
    expect(entryIssues(running())).toEqual([]);
    expect(entryIssues(next)).toEqual([]);
  });

  test("only the next stage may be pending", () => {
    expect(entryIssues(work({ status: "pending" }))).not.toEqual([]);
    expect(entryIssues({ ...next, status: "success" })).not.toEqual([]);
  });

  test("the next stage names no organization and has no steps", () => {
    expect(entryIssues({ ...next, organization: "Future Corp" })).not.toEqual(
      [],
    );
    expect(entryIssues({ ...next, steps: work().steps })).not.toEqual([]);
  });

  test("completed stages need an organization and steps", () => {
    expect(entryIssues(work({ organization: undefined }))).not.toEqual([]);
    expect(entryIssues(work({ steps: [] }))).not.toEqual([]);
  });

  test("a step cannot end before it starts", () => {
    const stage = work({
      steps: [{ role: t("Engineer"), start: "2021-06", end: "2021-01" }],
    });
    expect(entryIssues(stage)).not.toEqual([]);
  });

  test("a year-only end covers its whole year", () => {
    const stage = work({
      steps: [{ role: t("Engineer"), start: "2021-06", end: "2021" }],
    });
    expect(entryIssues(stage)).toEqual([]);
  });

  test("only the running stage's last step may be open-ended", () => {
    const openCompleted = work({
      steps: [{ role: t("Engineer"), start: "2020", end: null }],
    });
    expect(entryIssues(openCompleted)).not.toEqual([]);

    const closedRunning = work({ status: "running" });
    expect(entryIssues(closedRunning)).not.toEqual([]);
  });

  test("steps are ordered oldest first and may share a boundary month", () => {
    const ordered = running();
    ordered.steps = [
      { role: t("Junior"), start: "2020-01", end: "2021-05" },
      { role: t("Senior"), start: "2021-05", end: null },
    ];
    expect(entryIssues(ordered)).toEqual([]);

    const reversed = running();
    reversed.steps = [
      { role: t("Senior"), start: "2021-05", end: "2022-01" },
      { role: t("Junior"), start: "2020-01", end: null },
    ];
    expect(entryIssues(reversed)).not.toEqual([]);
  });

  test("highlights have the same count in both languages", () => {
    const stage = work({
      steps: [
        {
          role: t("Engineer"),
          start: "2020",
          end: "2021",
          highlights: { en: ["One", "Two"], it: ["Uno"] },
        },
      ],
    });
    expect(entryIssues(stage)).not.toEqual([]);
  });
});

describe("collectionIssues", () => {
  test("accepts a valid pipeline", () => {
    const stages = [
      entry("next", next),
      entry("now", running()),
      entry("past", work()),
    ];
    expect(collectionIssues(stages)).toEqual([]);
  });

  test("requires exactly one running stage", () => {
    expect(collectionIssues([entry("past", work())])).not.toEqual([]);
    expect(
      collectionIssues([entry("a", running()), entry("b", running("2023-01"))]),
    ).not.toEqual([]);
  });

  test("allows at most one pending stage", () => {
    const stages = [
      entry("now", running()),
      entry("n1", next),
      entry("n2", next),
    ];
    expect(collectionIssues(stages)).not.toEqual([]);
  });

  test("parallel stages must exist and overlap in time", () => {
    const study = work({
      kind: "education",
      steps: [{ role: t("MSc"), start: "2019", end: "2022" }],
    });
    const job = (start: string, end: string) =>
      work({
        parallelWith: "study",
        steps: [{ role: t("Intern"), start, end }],
      });

    const base = [entry("now", running("2023-01")), entry("study", study)];
    expect(
      collectionIssues([...base, entry("job", job("2021-10", "2022-09"))]),
    ).toEqual([]);
    expect(
      collectionIssues([...base, entry("job", job("2023-01", "2023-06"))]),
    ).not.toEqual([]);
    expect(
      collectionIssues([
        entry("now", running("2023-01")),
        entry("job", job("2021-10", "2022-09")),
      ]),
    ).not.toEqual([]);
  });
});

describe("sortNewestFirst", () => {
  test("orders pending, then running, then completed stages by end date", () => {
    const older = work({
      steps: [{ role: t("A"), start: "2016", end: "2019" }],
    });
    const newer = work({
      steps: [{ role: t("B"), start: "2019", end: "2022" }],
    });
    const sorted = sortNewestFirst([
      entry("older", older),
      entry("now", running()),
      entry("newer", newer),
      entry("next", next),
    ]);
    expect(sorted.map((s) => s.id)).toEqual(["next", "now", "newer", "older"]);
  });
});
