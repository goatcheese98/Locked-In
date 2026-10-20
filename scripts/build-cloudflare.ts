import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { build } from 'vite';

process.env.LOCKED_IN_HOSTING = 'cloudflare';
await build();
const output = resolve('build/cloudflare');
const html = await readFile(resolve(output, 'Locked-In/index.html'), 'utf8');
const policy = html.match(/<meta http-equiv="content-security-policy" content="([^"]+)"/i)?.[1];
if (
	!policy ||
	!policy.includes("'sha256-") ||
	/script-src[^;]*'unsafe-(inline|eval)'/.test(policy)
) {
	throw new Error(
		'Static bootstrap must have a generated CSP hash, without unsafe script allowances.'
	);
}
const csp = `${policy}; frame-ancestors 'none'`;
if (Buffer.byteLength(`  Content-Security-Policy: ${csp}`) > 2000) {
	throw new Error('CSP exceeds the Cloudflare Pages header line limit.');
}
await writeFile(
	resolve(output, '_headers'),
	`/*
  Content-Security-Policy: ${csp}
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: no-referrer
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Resource-Policy: same-origin
  Cache-Control: public, max-age=0, must-revalidate
`
);
// Only the root redirects. Unknown pages/assets must retain a real 404 status.
await writeFile(resolve(output, '_redirects'), '/ /Locked-In/ 302\n');
// Reuse the actual built app CSS (including local Geist faces), without its scripts.
// Absolute URLs keep recovery assets valid even at arbitrary nested missing paths.
const stylesheets = [...html.matchAll(/<link\b[^>]*>/gi)]
	.filter(([tag]) => /rel="stylesheet"/.test(tag))
	.map(([tag]) => {
		const href = tag.match(/href="([^"]+)"/)?.[1];
		if (!href) throw new Error('Built stylesheet is missing its URL.');
		const url = new URL(href, 'https://static.invalid/Locked-In/');
		if (url.origin !== 'https://static.invalid' || !url.pathname.startsWith('/Locked-In/_app/')) {
			throw new Error('Recovery styles must use local app assets.');
		}
		return `<link rel="stylesheet" href="${url.pathname}">`;
	});
if (!stylesheets.length) throw new Error('Recovery requires the built app stylesheets.');
await writeFile(
	resolve(output, '404.html'),
	`<!doctype html>
<html lang="en">
<head>
 <meta charset="utf-8">
 <meta name="viewport" content="width=device-width, initial-scale=1">
 <meta name="color-scheme" content="light dark">
 <title>Page not found · Locked-In</title>
 <link rel="icon" href="/Locked-In/favicon.png">
 ${stylesheets.join('\n ')}
</head>
<body>
 <div class="focus-screen not-found">
  <header><span class="not-found-brand">Locked-In</span></header>
  <main class="workspace">
   <div class="digits" aria-hidden="true">404</div>
   <h1>Page not found</h1>
   <p>This page isn’t available.</p>
   <a class="primary" href="/Locked-In/">Return to Locked-In</a>
  </main>
  <footer><span>A moment to refocus.</span></footer>
 </div>
</body>
</html>\n`
);
console.log('Cloudflare Pages artifact: build/cloudflare (static only; not published).');
