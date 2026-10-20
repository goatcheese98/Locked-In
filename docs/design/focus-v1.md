# Locked-In focus candidate v1

Candidate, not user-approved. Paper reference (2026-10-19):
https://app.paper.design/file/01M5B2RF5NDQ8E4EFFQ4AA2BK5/p-1-0

The supplied exact JSX/computed-style readback (token hash `9e60d8aa`) guides the
centered workspace: 32px desktop/16px mobile inset, neutral header, segmented modes,
96px/120px mono timer, 44px actions, and duration/effects footer. Native Svelte
components replace canvas elements. Foreground and fonts use semantic bindings
as required by the transfer correction. The existing Skip action remains below
the primary controls. No session history or analytics were invented.

The original Paper PNG was not attached and is **not committed**. `cloud-*.png`
files are actual implementation screenshots, not Paper exports. No claim of exact
final Paper parity or user approval is made. Header height accommodates 44px targets
without clipping; the mobile selector wraps longer labels within equal segments.

## Canonical LUM source

Read through the GitHub connector on 2026-10-19 from `goatcheese98/lum-brain`:

- `src/styles/design-tokens.ts`, blob `e7e0c2362848c209914a5d9da2bcaa5657b663b8`.
- `src/styles/fonts.ts`, blob `d32cace0ed25de3f8e164b9b2d906ca6e782c0e9`.
- `src/dashboard-shell-css/primitives.ts`, blob `86324ebdaca47f0837b09c774e31a96f4d81b2d5`.
- `src/dashboard-shell-css/shell-chrome.ts`, blob `9678f3e1bf6d00e4f2701b355b8612b2a488574b`.

The handoff's nested `src/styles/dashboard-shell-css/` paths returned 404; the
repository tree resolved the actual paths above. `LUM-DESIGN-CONTRACT.md` was
unavailable. Canonical `design-tokens.ts` supplies dark values directly:
`--bg:#0a0a0b`, `--panel:#121214`, `--panel2:#0e0e10`, `--line:#242428`,
`--line2:#1a1a1d`, `--fg:#ececee`, `--mut:#92929b`, `--mut2:#8b8b94`,
`--acc:#d6a828`, `--on-acc:#141210`. Light values match the handoff.
Geist Variable and Geist Mono Variable are self-hosted from Fontsource npm
packages under SIL OFL 1.1 (licenses included in packages); no runtime font-provider
call. Paper segment geometry takes precedence over the newer LUM segment recipe.

## Interaction contract

- Start/pause/resume use a deadline. Focus/visibility events reconcile delayed
  callbacks. Reset restores configured current-mode duration. Mode changes reset
  and pause the selected mode, announced once. Ticks are not live announcements.
- Completion advances focus → short break → focus, with a long break at the
  configured count. Auto-cycle remains optional, Off by default. Long background
  delays complete at most one session; an automatic next session starts at
  observation time, without inventing unattended completed sessions.
- Reload starts a fresh focus session; only preferences persist. Settings validate
  whole-minute ranges and use Save/Cancel. Saving resets the current session and
  is prohibited while running. Native modals trap Tab/Shift-Tab and restore focus.
- Missing storage uses defaults; corrupt/denied storage gives a nonblocking notice
  and an in-memory timer. Saved background values are validated before use.
- Effects default Off. Appearance retains a choice across reload, but reduced
  motion suppresses canvas effects even when selected. Existing dock controls
  remain available; keyboard focus reveals the dock, with 44px mobile targets.
- Completion is text-only. No sound or permission prompts were added.

See [verification.md](verification.md) for commands and baseline gaps. Screenshots
cover 320/768/1440px at 900px height in both themes. Behavior assertions accompany
visual evidence. Older optional effect panels retain their existing visual design
and Svelte warnings. This is a typed timer/UI slice, not a full-repository migration.
