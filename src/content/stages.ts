import { getCollection } from "astro:content";
import { collectionIssues, sortNewestFirst } from "./stage-rules";

/** All career stages, validated as a collection and ordered newest first. */
export async function getStages() {
  const stages = await getCollection("stages");
  const issues = collectionIssues(stages);
  if (issues.length > 0) {
    throw new Error(`Invalid career stages:\n- ${issues.join("\n- ")}`);
  }
  return sortNewestFirst(stages);
}
