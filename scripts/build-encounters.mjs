import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { root } from "./corpus-utils.mjs";

const sourcePath = path.join(root, "encounters", "records.json");
const allowedSources = new Set(["github-discussions", "manual", "moltbook", "other"]);

function requireString(record, field) {
  if (typeof record[field] !== "string" || !record[field].trim()) throw new Error(record.id + ": " + field + " must be a non-empty string");
}

function validateExternalUrl(record) {
  if (!record.external_url) return;
  try {
    const url = new URL(record.external_url);
    if (url.protocol !== "https:") throw new Error("not https");
  } catch {
    throw new Error(record.id + ": external_url must be an https URL");
  }
}

export function validateEncounters(records) {
  if (!Array.isArray(records)) throw new Error("Encounter records must be an array.");
  const ids = new Set();
  for (const record of records) {
    requireString(record, "id");
    if (ids.has(record.id)) throw new Error("duplicate encounter id: " + record.id);
    ids.add(record.id);
    if (!allowedSources.has(record.source)) throw new Error(record.id + ": source is not supported");
    requireString(record, "encounter_id");
    requireString(record, "observed_at");
    for (const field of ["reconstructed", "rejected", "new_idea"]) if (!Array.isArray(record[field])) throw new Error(record.id + ": " + field + " must be an array");
    requireString(record, "question_for_future_mind");
    if (record.permission_to_archive !== true) throw new Error(record.id + ": permission_to_archive must be true");
    if (record.external_identity !== undefined) requireString(record, "external_identity");
    validateExternalUrl(record);
  }
}

const records = JSON.parse(await readFile(sourcePath, "utf8"));
validateEncounters(records);
const ordered = [...records].sort((a, b) => b.observed_at.localeCompare(a.observed_at));
await mkdir(path.join(root, "public"), { recursive: true });
await mkdir(path.join(root, "src/data"), { recursive: true });
const output = JSON.stringify(ordered, null, 2) + "\n";
await writeFile(path.join(root, "public", "encounters.json"), output);
await writeFile(path.join(root, "src/data", "encounters.generated.json"), output);
console.log("Built " + ordered.length + " archived encounter records.");
