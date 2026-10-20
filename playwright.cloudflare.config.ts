import { defineConfig } from '@playwright/test';
export default defineConfig({
	testDir: './tests/hosting',
	workers: 1,
	retries: 0,
	use: {
		baseURL: 'http://127.0.0.1:8788',
		launchOptions: {
			executablePath: process.env.CHROMIUM_PATH || undefined,
			args: ['--no-sandbox']
		}
	},
	webServer: {
		command: 'npm run preview:cloudflare',
		url: 'http://127.0.0.1:8788/Locked-In/',
		reuseExistingServer: !process.env.CI,
		timeout: 60000,
		env: { WRANGLER_SEND_METRICS: 'false' }
	}
});
