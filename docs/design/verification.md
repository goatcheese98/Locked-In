# Cloud verification

Source: clean restored `goatcheese98/Locked-In` at
`df29e7bd2aca2666b4654d7e265da3538e8c4046`, default branch `master`.
Branch: `codex/lum-focus-timer`. All execution/browser tests ran in cloud.
Onboarding helpers and source SHA matched the saved baseline. Other restored
repositories were not edited. No embedded credentials were used.

## Baseline reproduced

- `npm run check`: exit 1, 2 errors/60 warnings: missing `releaseWaterGrain` import
  and undefined `inactiveWaterGrains`. Fixed the import and removed the write to
  an unused/nonexistent pool; grains are created directly.
- A transpiled baseline store with a captured interval callback and ten-minute
  clock jump returned 1499 seconds rather than 900. Deadline tests now assert 900,
  along with pause/resume, reset and break-cycle behavior.
- Denied localStorage in baseline cloud Chromium returned Internal Error/HTTP 500.
  Browser tests now verify corrupt, wrong-type and denied storage without page
  errors, then start/pause and save usable in-memory settings.
- Repository-wide `npm run lint`: exit 1. Old source and tracked generated docs
  assets fail formatting; the chain stops before ESLint. This existing backlog
  remains. Read-only `lint:focus` covers all changed source/tests without disabling
  rules. The saved onboarding baseline separately recorded 18 source failures.

## Final commands

Node 24.19.0; system Chromium in cloud; writable npm cache.

| Command | Exit | Result |
| --- | --- | --- |
| `npm test` | 0 | 4 strict TypeScript timer/storage regression tests passed |
| `npm run check` | 0 | Zero errors; 59 existing warnings in older effect controls |
| `npm run lint:focus` | 0 | Changed source/test Prettier and ESLint passed |
| `CHROMIUM_PATH=/usr/bin/chromium npm run test:e2e` | 0 | 14 passed: timing, cycles, settings, storage, keyboard, effects-density, and six viewport/theme combinations |
| `npm run build` | 0 | Static adapter emitted `docs`, with bundled fonts |
| Cloud static `/Locked-In/` browser smoke | 0 | HTTP 200; start/pause/resume, persisted dark theme, bundled Geist, no page errors |
| `npm run lint` | 1 | Existing repository-wide formatting backlog |

Initial browser checks exposed a Tab-wrap failure, fixed with explicit modal
containment. Header controls stay disabled until mount so early clicks cannot
vanish during hydration. Node type declarations exposed a browser/Node timeout
mismatch; the dock explicitly uses `window.setTimeout`.

CI uses Node 24, one browser worker, no retries, 30-second per-test timeout and a
10-minute job. It installs Playwright Chromium and runs the proven commands above.
Remote CI results are separate from these cloud results and are not claimed here.

## Static hosting preparation and limits

The existing static adapter emits `docs` and uses `/Locked-In` production base.
Generated assets were restored to their baseline rather than committed. Build
verification artifacts live under ignored `work/`. **Build wipes `docs`, including
untracked design notes/screenshots; preserve evidence outside that output before
building.** Tracked design files can be restored from Git after a build.

For a future Cloudflare Pages preview: build command `npm run build`, output `docs`.
This export expects the `/Locked-In/` URL prefix. A root-domain target requires an
explicit base-path decision and another static-route check before deployment.
No adapter change, credential, provider call, merge, deployment, release, or package
publishing is included. Existing automatic PR previews may run. No Paper-export
PNG was supplied; see the candidate status in [focus-v1.md](focus-v1.md).
