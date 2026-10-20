# Static recovery surface

The Cloudflare root `404.html` now reuses the timer's built stylesheets, self-hosted Geist / Geist Mono, semantic LUM colors, 32px desktop / 16px mobile insets, neutral header and footer, centered workspace and 44px primary action. It contains no scripts, module preloads, timer or hydration bootstrap. The only action is a normal keyboard-accessible link to `/Locked-In/`.

The builder takes stylesheet URLs from the actual app export and makes them root-relative under `/Locked-In/_app/`. Their font URLs resolve relative to those stylesheets. Missing pages at arbitrary depths therefore load the same local assets rather than requesting assets relative to the missing path. No third-party font provider is used. The builder fails if the app has no local stylesheet to reuse.

Existing light/dark token values are paired with CSS `light-dark()` and `color-scheme`. A page without an explicit theme follows the system preference without JavaScript. The app's explicit `data-theme` selection still forces light or dark as before. This uses modern browser color-scheme support; verification here covers cloud Chromium, not a new legacy-browser compatibility claim. Original Paper geometry/readback remains the reference; this is an implementation surface, without new Paper approval.

The real 404 status, root redirect, CSP/security headers and cache policy are preserved. The 404 response has no-store in local Pages; successful CSS/font assets use the existing revalidation policy. There is no long-lived missing-asset wildcard cache or app fallback rewrite.

## Cloud verification

`tests/hosting/not-found.spec.ts` adds six tests at 320 / 768 / 1440px, light and dark, with page JavaScript disabled. Each loads a deeply nested missing URL and checks status 404, headers, exact theme colors, loaded local font faces, no horizontal overflow, no script requests or timer, visible keyboard focus and a return link at least 44px high inside the viewport. Enter navigates to a successful `/Locked-In/` static page with the prerendered timer visible.

The tests retain failed-asset assertions before and after recovery. Chromium reports app module preloads as `csp` when JavaScript is disabled; only those local script requests after recovery are classified separately, and each is fetched through HTTP to verify status 200 and JavaScript MIME. All other request failures and HTTP asset errors still fail. The 404 itself requests no scripts and has no failed assets.

Results: `npm run check` has 0 errors / 0 warnings; `npm run lint`, `npm test` (4), `npm run test:e2e` (18), `npm run build`, `npm run build:cloudflare`, and `npm run test:cloudflare` (8, including the previous 2 Pages checks) pass in cloud. Dependency files are unchanged: full audit remains four low propagated entries for the one documented upstream cookie advisory (exit 1), runtime audit remains clean (exit 0). No force, ignores, deployment or account changes.

All six screenshots were captured in cloud Chromium at 900px height with the return link keyboard-focused, then visually inspected. Text and action fit, both Geist faces load, focus is visible and layout follows the existing shell conventions.

| Width | Light                              | Dark                              |
| ----- | ---------------------------------- | --------------------------------- |
| 320   | [Screenshot](./404-320-light.png)  | [Screenshot](./404-320-dark.png)  |
| 768   | [Screenshot](./404-768-light.png)  | [Screenshot](./404-768-dark.png)  |
| 1440  | [Screenshot](./404-1440-light.png) | [Screenshot](./404-1440-dark.png) |

Local workerd checks do not establish deployed Cloudflare edge/dashboard/domain behavior. That still requires future deployment authorization and human account access. Model ID and reasoning setting are unavailable to this session.
