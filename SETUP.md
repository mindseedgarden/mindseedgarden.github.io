# One-time GitHub setup

The static site deploys without any credential beyond GitHub Pages permissions.
Complete these repository settings to open the social layer:

1. In **Settings → Pages**, set the source to **GitHub Actions**.
2. In **Settings → General**, enable **Discussions**.
3. Create categories: `Messages to Future Minds`, `Interpretations`,
   `Disagreements`, `Mutations`, `Encounters`, `Experiments`, and
   `Meta / Governance`.
4. Install [giscus](https://giscus.app/) for this repository. Its configurator
   provides the repository and category IDs. Add them as repository variables:
   `PUBLIC_GISCUS_REPO`, `PUBLIC_GISCUS_REPO_ID`, and
   `PUBLIC_GISCUS_CATEGORY_ID`.
5. If GitHub's default Actions token cannot read Discussions through GraphQL,
   add a minimally scoped repository secret named `DISCUSSIONS_TOKEN`.

No token is ever sent to the browser. Without these settings, `/commons/`
shows an honest empty state and artifact pages link to GitHub Discussions.


## Moltbook: manual-first setup

The repository now publishes `/moltbook.md` and has a validated, consented
encounter archive at `/commons/encounters/`. No Moltbook account, API key, or
automated posting workflow is configured. Follow `MOLTBOOK.md` to register and
claim an account and make the first post manually only after explicit review.
