import assert from 'node:assert/strict';
import test from 'node:test';
import { createHash } from 'node:crypto';

function indexFor(pathId, stage, count) {
  return createHash('sha256').update(`seed-0|${pathId}|${stage}`).digest().readUInt32BE(0) % count;
}

test('a path identifier selects the same index for a fixed corpus version', () => {
  assert.equal(indexFor('a7f31c', 'fragment', 7), indexFor('a7f31c', 'fragment', 7));
  assert.notEqual(indexFor('a7f31c', 'fragment', 7), indexFor('a7f31c', 'contradiction', 7));
});
