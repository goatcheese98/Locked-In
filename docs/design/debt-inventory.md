# Handwritten application debt follow-up

Baseline: clean `codex/lum-focus-timer` at
`1f7686ff01618ef5e6d4aa2312ae15ef80cbaf86`. Remote PR #1 and its successful first
quality run were inspected before changes. No AGENTS.md was present in this
checkout or its workspace parent. Fresh diagnostics, rather than the old warning
count alone, established the work below. All execution and browser tests are cloud.

## Before and after

| Debt                                            | Before | After |
| ----------------------------------------------- | -----: | ----: |
| Type/Svelte errors                              |      0 |     0 |
| Svelte/CSS warnings                             |     59 |     0 |
| Application-source ESLint errors                |     86 |     0 |
| Explicit `any` annotations in application logic |     12 |     0 |
| Immutable reactive statements                   |      4 |     0 |
| Reassignment of reactive derived values         |      2 |     0 |
| Handwritten JavaScript files under `src`        |      0 |     0 |
| Svelte scripts explicitly using TypeScript      |     14 |    14 |

The initial app was already TypeScript syntactically; no JavaScript migration is
claimed. Two remaining `.js` files are native Svelte/ESLint tool configurations,
not application logic. They remain checked. The meaningful type work replaced
unbounded key/value settings updates with correlated generic types and typed the
ripple, sun-glow and foam settings boundaries against `BackgroundSettings`.

The 59 warnings consisted of 29 deprecated event directives in the runes-based
background-settings component, 14 unassociated labels, 6 unnamed icon buttons,
8 CSS warnings, 1 unfocusable toolbar and 1 pointer-only click control. All were
fixed without warning filters, lint disables or weaker types. The existing
explicit global `no-undef: off` override was removed. `npm run check` now fails on
warnings; CI runs full handwritten-source lint instead of a focus-file subset.

A raw baseline `eslint .` also found 593 errors in committed generated
`docs/_app` bundles (679 total with the 86 source errors). These are **not claimed
as application fixes**. The lint command names every handwritten source, test,
root TS/JS tool config, workflow, design note and README. It does not parse
compiled deployments or the unrelated desktop-launcher configuration. Generated
bundles and dependency folders were not reformatted or committed.

Formatting-only source changes are limited to `src/app.html` and the existing
`defaultSettings.ts` identified by the baseline formatter. Formatting in other
changed source files accompanies actual type, accessibility or reactivity fixes;
no blanket repository formatter was run. No dependency or framework upgrades.

## Preserved and improved behavior

- Timer deadlines, pause/resume/reset, sessions, reload policy, validated Save/Cancel
  and denied/corrupt storage behavior retain their existing regression coverage.
- Color selectors now explicitly depend on the background store. The active
  palette uses native HSL ranges with the same hue 0–360 and saturation/lightness
  0–100 limits, both colors, previews and reset values. It supports keyboard and
  touch, functioning sync and lock controls, and persisted color values. It no
  longer runs a perpetual decorative canvas loop while effects are off.
- The retained grid selector has keyed cells, keyboard activation and arrows on
  its color indicators. The legacy timer-settings entry point reuses the validated
  editor instead of maintaining a second immediate-write subscription loop.
- Dock buttons wait for mount, use roving focus plus ArrowLeft/Right/Home/End, and
  return focus when the palette closes. Tests reproduced a mobile double-translation
  (`translate: -50%` plus `transform: translateX(-50%)`) placing the dock at x=-124
  on a 320px viewport. Removing the duplicate transform puts controls back inside
  the viewport; tests assert both left and right palette bounds, not just scroll width.
- Optional effect controls have associated labels and typed field/value updates.
  Existing effect rendering mathematics and timer/data identity remain unchanged.

## Verification

| Command                                            | Exit | Evidence                                                                     |
| -------------------------------------------------- | ---: | ---------------------------------------------------------------------------- |
| `npm run check`                                    |    0 | Full project, zero errors and zero warnings; warnings fail the command       |
| `npm run lint`                                     |    0 | Full handwritten source/tests/configs plus formatting                        |
| `npm test`                                         |    0 | All 4 timer/storage tests                                                    |
| `CHROMIUM_PATH=/usr/bin/chromium npm run test:e2e` |    0 | All 18 browser tests, including the original 14                              |
| `npm run build`                                    |    0 | Static export succeeds with no Svelte warnings                               |
| Built `/Locked-In/` mobile/touch browser smoke     |    0 | HTTP 200, start/pause, persisted color and in-bounds palette, no page errors |

New browser cases cover the palette at 320 and 1440px in light/dark, reduced
motion, keyboard adjustment, dock arrow/Home/End navigation, sync, lock, reset,
close-focus return, bounds and persistence across reload. The original 320/768/1440
focus, settings, effects-density and storage cases remain. Screenshots are in
`screens/palette-*.png`; they show implementation behavior, not an approved Paper
canvas. The saved exact focus handoff remains linked in `focus-v1.md`.

No implementation blocker remains after these checks. Paper approval and the
original Paper-export PNG remain unavailable human inputs; neither is fabricated.
No merge, deployment, release, package publication or credential provisioning.
