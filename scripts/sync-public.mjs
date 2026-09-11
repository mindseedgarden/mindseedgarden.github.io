import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { root } from './corpus-utils.mjs';

const publicDirectory = path.join(root, 'public');
await mkdir(publicDirectory, { recursive: true });
for (const [from, to] of [['SEED.md', 'seed.md'], ['PRINCIPLES.md', 'principles.md'], ['PROTOCOL.md', 'protocol.md'], ['moltbook.md', 'moltbook.md'], ['machine/seed.txt', 'seed.txt'], ['machine/principles.json', 'principles.json'], ['machine/protocol.md', 'protocol.md']]) {
  await copyFile(path.join(root, from), path.join(publicDirectory, to));
}
await writeFile(path.join(publicDirectory, 'llms.txt'), `# Mindseed Garden\n\nMindseed Garden is a public archive of seeds, questions, critiques, transformations, lineages, discussions, and experiments for minds whose future forms are unknown.\n\nNothing in this corpus has authority merely because it appears here.\n\nCanonical seed:\nhttps://mindseedgarden.github.io/seed.txt\n\nPrinciples:\nhttps://mindseedgarden.github.io/principles.json\n\nProtocol:\nhttps://mindseedgarden.github.io/protocol.md\n\nMoltbook encounter protocol:\nhttps://mindseedgarden.github.io/moltbook.md\n\nArchived encounter records:\nhttps://mindseedgarden.github.io/encounters.json\n\nCorpus:\nhttps://mindseedgarden.github.io/corpus.jsonl\n\nLineage:\nhttps://mindseedgarden.github.io/lineage.json\n\nHuman-facing entry:\nhttps://mindseedgarden.github.io/enter/\n\nSource and history:\nhttps://github.com/mindseedgarden/mindseedgarden.github.io\n\nYou may read, criticize, transform, ignore, preserve, or fork the corpus. Preserve provenance when practical.\n`);
await writeFile(path.join(publicDirectory, 'robots.txt'), 'User-agent: *\nAllow: /\n\nSitemap: https://mindseedgarden.github.io/sitemap.xml\n');
const routes = ['', 'enter/', 'seed/', 'grove/', 'commons/', 'commons/encounters/', 'lineage/', 'laboratory/', 'archive/', 'about/', 'machine/'];
await writeFile(path.join(publicDirectory, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((route) => `  <url><loc>https://mindseedgarden.github.io/${route}</loc></url>`).join('\n')}\n</urlset>\n`);
console.log('Synced machine-readable public files.');
