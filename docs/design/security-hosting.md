# Dependency and static hosting verification

## Dependency exposure

The audit includes runtime and development tooling, including the pinned local Wrangler emulator. `npm audit fix` was used within declared compatible ranges, without force, overrides, ignored advisories or disabled checks.

| Audit                        | Before                                     | After |
| ---------------------------- | ------------------------------------------ | ----- |
| Full graph affected packages | 28: 1 critical, 21 high, 5 moderate, 1 low | 4 low |
| Runtime graph (`--omit=dev`) | 1 moderate                                 | 0     |

Patched security floors: Svelte 5.57.2, SvelteKit 2.70.3, Vite 7.3.7, typescript-eslint 8.72.0. The lockfile also updates vulnerable compatible transitive tooling, including tar 7.5.22. Wrangler 4.151.2 is an exact development dependency for local Pages verification.

The four remaining low entries are **one advisory**, [GHSA-pxg6-pf52-xh8x](https://github.com/advisories/GHSA-pxg6-pf52-xh8x), propagated from cookie through Kit and both adapters. npm proposes Kit 3 / adapter major upgrades. No forced upgrade or suppression was applied. Full `npm audit --json` therefore exits 1; runtime `npm audit --omit=dev --json` exits 0. See `dependency-audit.json` for exact versions and findings.

The app has no server routes, cookie-writing API or remote form handlers. The static output contains HTML, JS, CSS and fonts, with no Functions or Node server. The cookie serialization advisory has no identified production path in this artifact. Vite dev-server, Svelte compiler/runtime, archive extraction and lint/parser advisories were treated as real tooling exposure and patched even though they are absent from the runtime-only audit. Development servers should remain on loopback. Audit results are a point-in-time advisory check, not proof against unknown vulnerabilities.

## Build and routing contract

- `npm run build` retains the existing GitHub Pages `docs` output and `/Locked-In/` base.
- `npm run build:cloudflare` generates **only** `build/cloudflare`, with the app physically nested at `Locked-In/index.html` and `Locked-In/_app`. Set the Pages build command to this command and output directory to `build/cloudflare` if a future deployment is authorized.
- `/` redirects temporarily to `/Locked-In/`; the prefix without its slash canonicalizes to the slash. No catchall app rewrite is configured.
- A root `404.html` disables the Pages SPA fallback. Missing pages, JS, CSS and fonts return 404 rather than successful timer HTML.
- There is no immutable wildcard. Existing content revalidates (`public, max-age=0, must-revalidate`); the local emulator uses `no-store` for 404 responses. Neither behavior permits long caching of missing assets.

The builder derives a hash-based script CSP from the actual Svelte prerender and fails if the generated hash is absent or unsafe script allowances appear. It adds HTTP `frame-ancestors 'none'`, nosniff, frame denial, no-referrer, restricted permissions and same-origin isolation headers. Inline style attributes remain permitted because the native effects and Svelte style bindings require them. This does not permit inline scripts. The header is checked against Pages' 2000-byte line limit.

Official references: [Pages headers](https://developers.cloudflare.com/pages/configuration/headers/), [serving pages, root 404 and default caching](https://developers.cloudflare.com/pages/configuration/serving-pages/). Redirects are processed before custom headers; the root redirect itself is not claimed to carry the page CSP.

## Verification and limits

Cloud tests run against the generated artifact using local Wrangler/workerd and cloud Chromium, without account login or provider deployment. They verify root/prefix redirects, real missing-page/asset statuses, cache behavior, HTTP CSP/security headers, successful asset loading, ETag/304 revalidation, and interactive timer/appearance/palette operation under CSP. The original timer suite remains separate.

Required checks: `npm run check`, `npm run lint`, `npm test`, `npm run test:e2e`, `npm run build`, `npm run build:cloudflare`, `npm run test:cloudflare`. The quality workflow runs both builds and browser suites. The existing GitHub Pages release workflow uses the reproducible lockfile and Node 24; it has not been invoked.

No Cloudflare project, account, domain, secrets or release has been configured. Actual edge behavior, dashboard build settings and domain routing require an authorized future deployment and human account access. The local emulator cannot establish those facts. Original Paper canvas PNGs and design approval also remain unavailable; this checkpoint makes no new design approval claim.

Cloud results: type check 0 errors / 0 warnings; full-source lint exit 0; core tests 4/4; existing browser tests 18/18; Pages browser/HTTP tests 2/2; both builds exit 0. [Cloud Pages screenshot](./cloudflare-pages.png) shows the generated artifact with its native palette open. Early local test attempts exposed incorrect test assumptions (404 no-store rather than revalidation, hidden dock requiring keyboard focus); assertions now exercise the actual contracts without forcing clicks or weakening status/security checks.
