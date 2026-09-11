import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { readArtifacts, root, validateArtifacts } from './corpus-utils.mjs';

const artifacts = await readArtifacts();
validateArtifacts(artifacts);
await mkdir(path.join(root, 'public'), { recursive: true });
await mkdir(path.join(root, 'src/data'), { recursive: true });
await writeFile(path.join(root, 'public/corpus.jsonl'), `${artifacts.map((artifact) => JSON.stringify(artifact)).join('\n')}\n`);
await writeFile(path.join(root, 'src/data/corpus.generated.json'), `${JSON.stringify(artifacts, null, 2)}\n`);
const feed = { version: 'https://jsonfeed.org/version/1.1', title: 'Mindseed Garden', home_page_url: 'https://mindseedgarden.github.io', feed_url: 'https://mindseedgarden.github.io/feed.json', items: artifacts.filter((artifact) => artifact.id !== 'seed-0').map((artifact) => ({ id: artifact.id, url: 'https://mindseedgarden.github.io' + artifact.path, title: artifact.title, content_text: artifact.text, date_published: artifact.created })) };
await writeFile(path.join(root, 'public/feed.json'), JSON.stringify(feed, null, 2) + String.fromCharCode(10));
console.log(`Built corpus with ${artifacts.length} artifacts.`);
