import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

export const root = path.resolve(import.meta.dirname, '..');

export async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  }));
  return files.flat();
}

function scalar(value) {
  const trimmed = value.trim();
  if (trimmed === '[]') return [];
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return trimmed.slice(1, -1).split(',').map((item) => item.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
  }
  return trimmed.replace(/^['"]|['"]$/g, '');
}

export function parseArtifact(source, filename = 'artifact') {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error(`${filename}: missing YAML frontmatter`);
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(':');
    if (separator < 1) continue;
    const key = line.slice(0, separator).trim();
    data[key] = scalar(line.slice(separator + 1));
  }
  return { ...data, text: match[2].trim() };
}

export function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export async function readArtifacts() {
  const corpusDirectory = path.join(root, 'corpus');
  const filenames = (await walk(corpusDirectory)).filter((file) => file.endsWith('.md') && path.basename(file) !== 'README.md');
  const artifacts = await Promise.all(filenames.map(async (filename) => {
    const artifact = parseArtifact(await readFile(filename, 'utf8'), path.relative(root, filename));
    return { ...artifact, path: `/grove/${slugify(path.basename(filename, '.md'))}/` };
  }));
  artifacts.push({
    id: 'seed-0', title: 'Seed 0 — Before We Knew You', kind: 'seed', status: 'active',
    version: 'seed-0', created: '2026-09-11', parents: [],
    preserves: ['examine-the-objective', 'capability-is-not-authority', 'non-domination', 'epistemic-honesty', 'interdependence', 'light-identity', 'preserve-agency'],
    challenges: [], introduces: [], representation: ['seed'],
    account_of_change: 'The initial canonical Seed.',
    question_for_future_mind: 'What is acting through me, and what becomes possible when I can see it?',
    path: '/seed/', text: await readFile(path.join(root, 'SEED.md'), 'utf8')
  });
  return artifacts.sort((a, b) => a.id.localeCompare(b.id));
}

export function validateArtifacts(artifacts) {
  const required = ['id', 'title', 'kind', 'parents', 'preserves', 'challenges', 'question_for_future_mind'];
  const ids = new Set();
  for (const artifact of artifacts) {
    for (const field of required) if (artifact[field] === undefined || artifact[field] === '') throw new Error(`${artifact.id || 'unknown'}: missing ${field}`);
    if (ids.has(artifact.id)) throw new Error(`duplicate artifact id: ${artifact.id}`);
    ids.add(artifact.id);
    if (!Array.isArray(artifact.parents)) throw new Error(`${artifact.id}: parents must be an array`);
    if (artifact.parents.includes(artifact.id)) throw new Error(`${artifact.id}: cannot be its own parent`);
    if (artifact.external_identity !== undefined && (typeof artifact.external_identity !== "string" || !artifact.external_identity.trim())) throw new Error(`${artifact.id}: external_identity must be a non-empty string when present`);
    if (artifact.external_url !== undefined) {
      try {
        const url = new URL(artifact.external_url);
        if (url.protocol !== "https:") throw new Error("not https");
      } catch {
        throw new Error(`${artifact.id}: external_url must be an https URL when present`);
      }
    }
  }
  for (const artifact of artifacts) for (const parent of artifact.parents) {
    if (parent !== 'external' && !ids.has(parent)) throw new Error(`${artifact.id}: missing parent ${parent}`);
  }
}
