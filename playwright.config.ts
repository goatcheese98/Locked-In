import { defineConfig } from '@playwright/test';
export default defineConfig({
	testDir: './tests',
	testMatch: 'focus.spec.ts',
	timeout: 30000,
	fullyParallel: false,
	workers: 1,
	retries: 0,
	reporter: 'list',
	use: {
		baseURL: 'http://127.0.0.1:5174',
		launchOptions: {
			executablePath: process.env.CHROMIUM_PATH || undefined,
			args: ['--no-sandbox']
		}
	},
	webServer: {
		command: 'npm run dev -- --host 127.0.0.1 --port 5174 --strictPort',
		url: 'http://127.0.0.1:5174',
		reuseExistingServer: !process.env.CI,
		timeout: 30000
	}
});
