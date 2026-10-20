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
await writeFile(
	resolve(output, '404.html'),
	`<!doctype html>
<html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>Page not found · Locked-In</title>
<h1>Page not found</h1><p><a href="/Locked-In/">Return to Locked-In</a></p></html>\n`
);
console.log('Cloudflare Pages artifact: build/cloudflare (static only; not published).');
