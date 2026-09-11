import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";

const stages = [
  ["fragment", (artifact) => artifact.kind === "fragment" || artifact.kind === "koan"],
  ["question", (artifact) => artifact.kind === "dialogue"],
  ["contradiction", (artifact) => artifact.kind === "critique"],
  ["form", (artifact) => artifact.kind === "formalization"],
  ["return", (artifact) => artifact.kind !== "seed"]
];

function indexFor(pathId, stage, count) {
  const material = "seed-0|" + pathId + "|" + stage;
  return createHash("sha256").update(material).digest().readUInt32BE(0) % count;
}

function selectPath(pathId, corpus) {
  const selected = [];
  const selectedIds = new Set();
  for (const [stage, eligible] of stages) {
    const allEligible = corpus.filter(eligible);
    const unseenEligible = allEligible.filter((artifact) => !selectedIds.has(artifact.id));
    const pool = unseenEligible;
    const artifact = pool[indexFor(pathId, stage, pool.length)];
    selected.push(artifact.id);
    selectedIds.add(artifact.id);
  }
  return selected;
}

test("a versioned path is deterministic and does not repeat an eligible artifact", () => {
  const corpus = [
    { id: "fragment-a", kind: "fragment" },
    { id: "dialogue-a", kind: "dialogue" },
    { id: "critique-a", kind: "critique" },
    { id: "formalization-a", kind: "formalization" },
    { id: "return-a", kind: "story" }
  ];
  const first = selectPath("e4f0jbp9", corpus);
  assert.deepEqual(first, selectPath("e4f0jbp9", corpus));
  assert.equal(new Set(first).size, stages.length);
});
