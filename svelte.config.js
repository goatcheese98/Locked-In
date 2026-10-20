import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const cloudflare = process.env.LOCKED_IN_HOSTING === 'cloudflare';
const output = cloudflare ? 'build/cloudflare/Locked-In' : 'docs';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({ pages: output, assets: output, precompress: false, strict: true }),
		paths: { base: process.env.NODE_ENV === 'production' ? '/Locked-In' : '' },
		// A static export cannot generate per-request nonces. Hash its bootstrap instead.
		...(cloudflare
			? {
					csp: {
						mode: 'hash',
						directives: {
							'default-src': ['self'],
							'script-src': ['self'],
							// Svelte and the optional effects set inline style properties.
							'style-src': ['self', 'unsafe-inline'],
							'img-src': ['self', 'data:'],
							'font-src': ['self'],
							'connect-src': ['self'],
							'object-src': ['none'],
							'base-uri': ['self'],
							'form-action': ['none']
						}
					}
				}
			: {})
	}
};
export default config;
