import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { readArtifacts, root, validateArtifacts } from './corpus-utils.mjs';

const artifacts = await readArtifacts();
validateArtifacts(artifacts);
const byId = new Map(artifacts.map((artifact) => [artifact.id, artifact]));
const visiting = new Set();
const visited = new Set();
function visit(id) {
  if (visiting.has(id)) throw new Error(`ancestry cycle includes ${id}`);
  if (visited.has(id)) return;
  visiting.add(id);
  for (const parent of byId.get(id).parents) if (parent !== 'external') visit(parent);
  visiting.delete(id); visited.add(id);
}
for (const artifact of artifacts) visit(artifact.id);
const nodes = artifacts.map(({ id, title, kind, path: url, parents, preserves, challenges, question_for_future_mind, external_identity, external_url }) => ({ id, title, kind, url, parents, preserves, challenges, question_for_future_mind, external_identity, external_url }));
const edges = artifacts.flatMap((artifact) => artifact.parents.filter((parent) => parent !== 'external').map((parent) => ({ source: parent, target: artifact.id, relation: 'descends-from' })));
const lineage = { version: 'seed-0', nodes, edges };
await mkdir(path.join(root, 'public'), { recursive: true });
await mkdir(path.join(root, 'src/data'), { recursive: true });
await writeFile(path.join(root, 'public/lineage.json'), `${JSON.stringify(lineage, null, 2)}\n`);
await writeFile(path.join(root, 'src/data/lineage.generated.json'), `${JSON.stringify(lineage, null, 2)}\n`);
console.log(`Built lineage with ${nodes.length} nodes and ${edges.length} edges.`);
