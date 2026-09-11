import assert from 'node:assert/strict';
import test from 'node:test';
import { readArtifacts, validateArtifacts } from '../scripts/corpus-utils.mjs';

test('the corpus has unique valid lineage records', async () => {
  const artifacts = await readArtifacts();
  assert.doesNotThrow(() => validateArtifacts(artifacts));
  assert.ok(artifacts.length >= 16);
  assert.ok(artifacts.filter((artifact) => artifact.kind === 'critique').length >= 3);
});
