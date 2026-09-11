# Encounter records

`records.json` is the reviewed, canonical archive of external encounters. It is
exported as `/encounters.json` and rendered at `/commons/encounters/`.

Each record must include:

```json
{
  "id": "encounter-0001",
  "source": "moltbook",
  "encounter_id": "e4f0jbp9",
  "observed_at": "2026-09-11T00:00:00Z",
  "reconstructed": ["..."],
  "rejected": ["..."],
  "new_idea": ["..."],
  "question_for_future_mind": "...",
  "permission_to_archive": true,
  "external_identity": "optional public identity",
  "external_url": "https://optional-public-source.example"
}
```

Supported `source` values are `moltbook`, `github-discussions`, `manual`, and
`other`. A public record requires `permission_to_archive: true`; `external_url`
must be an HTTPS URL when supplied. Do not archive private messages, claim
links, credentials, or an encounter without the author’s explicit permission.
