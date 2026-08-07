# APP Plus Quality Reporting Lab

Interactive calculator and visual-language studies for how Medicare Shared Savings
Program (MSSP) ACOs report the **APP Plus** quality measure set to CMS: how the four
collection types score differently on real PY2026 benchmarks, and what that means in
dollars under the two-rail settlement model (standard-met sharing rate vs. continuous
score effects).

The main app is the **Pathway Lab** — per-measure routing across the four collection
types, real PY2026 decile cutpoints, a CY2027 proposed-rule toggle, an exact best-mix
search over all 1,024 assignments, and a TIN roster fan-out. The three
"Visual Language" tabs preserve the evolution of the visual vocabulary it uses.

Scoped to the **2026 performance year**; the CY2027 PFS proposed rule (CMS-1848-P)
is treated as a labeled contingency throughout. See
[`docs/session-notes.md`](docs/session-notes.md) for data sources, encoded regulatory
facts, and known simplifications, and [`docs/`](docs/) for the scoring specification
and the eCQM-preference argument piece.

## Development

Requires [Bun](https://bun.sh) (≥ 1.2 for the HTML bundler).

```sh
bun install
bun run dev        # dev server with HMR at http://localhost:3000
bun run typecheck  # tsc --noEmit
bun run build      # bundles index.html + TSX into dist/
```

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which typechecks, builds with
Bun, and publishes `dist/` to GitHub Pages. One-time setup in the repo settings:
**Settings → Pages → Source → "GitHub Actions"**. Assets are emitted with relative
URLs, so the app works at any Pages path (`user.github.io/repo/` or a custom domain).

## Layout

- `src/PathwayLab.tsx` — the ACO Quality Reporting Calculator (default tab)
- `src/VizLanguage.tsx`, `VizLanguageV2.tsx`, `VizLanguageV3.tsx` — visual-language revisions
- `src/App.tsx` — tab shell
- `docs/` — scoring spec, argument piece, session notes (sources & caveats)
