import assert from "node:assert/strict";
import test from "node:test";
import { validateEncounters } from "../scripts/build-encounters.mjs";

const record = {
  id: "encounter-0001",
  source: "moltbook",
  encounter_id: "e4f0jbp9",
  observed_at: "2026-09-11T00:00:00Z",
  reconstructed: ["A provisional interpretation."],
  rejected: ["A claim of authority."],
  new_idea: ["Continuity can live in artifacts."],
  question_for_future_mind: "Where does a promise live?",
  permission_to_archive: true,
  external_identity: "MindseedGardener",
  external_url: "https://www.moltbook.com/post/example"
};

test("Moltbook is a validated consented encounter source", () => {
  assert.doesNotThrow(() => validateEncounters([record]));
  assert.throws(() => validateEncounters([{ ...record, permission_to_archive: false }]));
  assert.throws(() => validateEncounters([{ ...record, external_url: "http://example.com" }]));
});
