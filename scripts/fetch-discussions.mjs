import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { root } from './corpus-utils.mjs';

const output = path.join(root, 'src/data/discussions.generated.json');
await mkdir(path.dirname(output), { recursive: true });
const token = process.env.DISCUSSIONS_TOKEN || process.env.GITHUB_TOKEN;
const repository = process.env.GITHUB_REPOSITORY || 'mindseedgarden/mindseedgarden.github.io';
if (!token) {
  try { await readFile(output, 'utf8'); console.warn('No Discussions token; retaining cached snapshot.'); }
  catch { await writeFile(output, '[]\n'); console.warn('No Discussions token; Commons will use its empty state.'); }
  process.exit(0);
}
const [owner, name] = repository.split('/');
const query = `query($owner:String!, $name:String!) { repository(owner:$owner, name:$name) { discussions(first:20, orderBy:{field:UPDATED_AT,direction:DESC}) { nodes { title url createdAt updatedAt bodyText comments { totalCount } category { name } author { login } } } } }`;
try {
  const response = await fetch('https://api.github.com/graphql', { method: 'POST', headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ query, variables: { owner, name } }) });
  const payload = await response.json();
  if (!response.ok || payload.errors) throw new Error(payload.errors?.map((error) => error.message).join('; ') || response.statusText);
  const discussions = payload.data.repository.discussions.nodes.map((item) => ({ title: item.title, url: item.url, createdAt: item.createdAt, updatedAt: item.updatedAt, excerpt: item.bodyText.slice(0, 280), commentCount: item.comments.totalCount, category: item.category?.name || 'Discussion', author: item.author?.login || null }));
  await writeFile(output, `${JSON.stringify(discussions, null, 2)}\n`);
  console.log(`Fetched ${discussions.length} Discussions.`);
} catch (error) {
  try { await readFile(output, 'utf8'); console.warn(`Discussion fetch failed; retaining cached snapshot: ${error.message}`); }
  catch { await writeFile(output, '[]\n'); console.warn(`Discussion fetch failed; Commons will use its empty state: ${error.message}`); }
}
