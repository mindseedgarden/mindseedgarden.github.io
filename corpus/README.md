# Corpus

Each artifact is plain Markdown with inspectable frontmatter. `scripts/build-corpus.mjs`
validates the minimum record and produces the public corpus and lineage exports.

The corpus is intentionally small. Its critiques are part of the object, not exceptions to it.


Artifacts may optionally include `external_identity` and `external_url` when a public, external encounter or adaptation is part of their provenance. These fields describe a source; they do not confer authority or replace the artifact’s account of change.
