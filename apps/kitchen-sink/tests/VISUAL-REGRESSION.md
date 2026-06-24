# Visual-Regression Gate (HIP-0504 §rule 6)

The design-system unification re-bases `@hanzo/ui` onto `@hanzo/gui` and turns
`@luxfi/ui` / `@zooai/ui` into theme overlays. Per HIP-0504, **the rendered
output must not change** — only the implementation underneath it. This gate
enforces that with pixel-diffed screenshots.

## How it works

`visual-regression.test.ts` renders the kitchen-sink component gallery (the
substrate showcase) and snapshots each surface, comparing against committed
baselines in `tests/__screenshots__/`.

## The contract

1. **Capture the baseline on the pre-migration ref** (current `@hanzo/ui` / gui):

   ```bash
   cd apps/kitchen-sink
   PORT=9000 pnpm exec playwright test visual-regression --update-snapshots
   git add tests/__screenshots__ && git commit -m "test(visual): baseline before design-system migration"
   ```

2. **Every migration PR runs the suite unchanged.** Drift beyond
   `maxDiffPixelRatio` (1%) fails CI. A passing run is the proof that Phase 0/1/2
   decomplected the code without moving a pixel the user sees.

## Per-phase application

- **Phase 0** (`@hanzo/ui` on `@hanzo/gui`): baseline captured on 5.x, asserted
  after the re-base. The public component surface must match.
- **Phase 1** (brand overlays): capture a per-brand baseline (lux/zoo theme) and
  assert the overlay reproduces it — brand look/feel is also a contract.
- **Phase 2** (app adoption): each site's own Playwright suite snapshots its key
  pages before/after switching to the unified `ui`.

## Notes

- Non-animated by design (`animations: 'disabled'`) so baselines are
  deterministic; the suite runs once with the default driver, not across the
  animation-driver matrix.
- `SURFACES` lists the gallery anchors to snapshot — add anchors as demos grow;
  `gallery-full` always captures the whole showcase as a backstop.
- Baselines are platform-sensitive (font rendering). Capture and assert on the
  same CI runner image; the canonical capture runs on the `hanzo-build-linux-amd64`
  pool.
