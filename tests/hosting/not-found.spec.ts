import { test, expect } from '@playwright/test';

for (const width of [320, 768, 1440]) {
	for (const theme of ['light', 'dark'] as const) {
		test.describe(`404 ${width} ${theme}`, () => {
			test.use({ javaScriptEnabled: false, viewport: { width, height: 900 }, colorScheme: theme });
			test('static LUM recovery loads local assets, fits and recovers by keyboard', async ({
				page,
				request
			}) => {
				const failedAssets: string[] = [];
				const scripts: string[] = [];
				const disabledScripts: string[] = [];
				let recovering = false;
				const fonts: string[] = [];
				page.on('request', (request) => {
					if (request.resourceType() === 'script') scripts.push(request.url());
				});
				page.on('requestfailed', (asset) => {
					// Chromium reports modulepreloads as `csp` when JavaScript is disabled.
					// Only classify those after leaving the script-free 404; verify their HTTP
					// availability below so a real missing asset still fails the test.
					const url = new URL(asset.url());
					if (
						recovering &&
						asset.resourceType() === 'script' &&
						asset.failure()?.errorText === 'csp' &&
						url.origin === 'http://127.0.0.1:8788' &&
						url.pathname.startsWith('/Locked-In/_app/')
					) {
						disabledScripts.push(asset.url());
					} else {
						failedAssets.push(`${asset.failure()?.errorText} ${asset.url()}`);
					}
				});
				page.on('response', (response) => {
					const type = response.request().resourceType();
					if (type !== 'document' && response.status() >= 400) failedAssets.push(response.url());
					if (type === 'font' && response.status() === 200) fonts.push(response.url());
				});
				const response = await page.goto('/arbitrary/nested/missing/page?recovery=1');
				expect(response?.status()).toBe(404);
				expect(response!.headers()['cache-control']).toMatch(
					/^(no-store|public, max-age=0, must-revalidate)$/
				);
				expect(response!.headers()['content-security-policy']).toContain("frame-ancestors 'none'");
				expect(response!.headers()['x-content-type-options']).toBe('nosniff');
				expect(response!.headers()['x-frame-options']).toBe('DENY');
				await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
				await expect(page.getByRole('timer')).toHaveCount(0);
				await expect(page.locator('script')).toHaveCount(0);
				await expect(page.locator('link[rel="modulepreload"]')).toHaveCount(0);
				await page.evaluate(() => document.fonts.ready);
				const style = await page.evaluate(() => ({
					background: getComputedStyle(document.documentElement).backgroundColor,
					foreground: getComputedStyle(document.documentElement).color,
					family: getComputedStyle(document.body).fontFamily,
					fonts: [...document.fonts]
						.filter((font) => font.status === 'loaded')
						.map((font) => font.family),
					overflow: document.documentElement.scrollWidth > innerWidth,
					sheets: [...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')].map(
						(link) => link.getAttribute('href')
					)
				}));
				expect(style.background).toBe(theme === 'dark' ? 'rgb(10, 10, 11)' : 'rgb(255, 255, 255)');
				expect(style.foreground).toBe(theme === 'dark' ? 'rgb(236, 236, 238)' : 'rgb(24, 24, 27)');
				expect(style.family).toContain('Geist Variable');
				expect(style.fonts).toEqual(
					expect.arrayContaining(['Geist Variable', 'Geist Mono Variable'])
				);
				expect(fonts.length).toBeGreaterThanOrEqual(2);
				expect(
					fonts.every(
						(url) =>
							new URL(url).origin === 'http://127.0.0.1:8788' &&
							new URL(url).pathname.startsWith('/Locked-In/_app/')
					)
				).toBe(true);
				expect(style.sheets.every((href) => href?.startsWith('/Locked-In/_app/'))).toBe(true);
				expect(style.overflow).toBe(false);
				const recovery = page.getByRole('link', { name: 'Return to Locked-In', exact: true });
				await expect(recovery).toHaveAttribute('href', '/Locked-In/');
				await page.keyboard.press('Tab');
				await expect(recovery).toBeFocused();
				const focus = await recovery.evaluate((link) => ({
					outline: getComputedStyle(link).outlineStyle,
					width: getComputedStyle(link).outlineWidth,
					bounds: link.getBoundingClientRect().toJSON()
				}));
				expect(focus.outline).toBe('solid');
				expect(focus.width).toBe('2px');
				expect(focus.bounds.height).toBeGreaterThanOrEqual(44);
				expect(focus.bounds.x).toBeGreaterThanOrEqual(0);
				expect(focus.bounds.right).toBeLessThanOrEqual(width);
				expect(focus.bounds.bottom).toBeLessThanOrEqual(900);
				expect(scripts).toEqual([]);
				expect(failedAssets).toEqual([]);
				await page.screenshot({ path: `work/security/404-${width}-${theme}.png`, fullPage: true });
				recovering = true;
				const [recovered] = await Promise.all([
					page.waitForNavigation(),
					page.keyboard.press('Enter')
				]);
				expect(recovered?.status()).toBe(200);
				expect(new URL(page.url()).pathname).toBe('/Locked-In/');
				await expect(page.getByRole('timer')).toHaveText('25:00');
				for (const url of disabledScripts) {
					const asset = await request.get(url);
					expect(asset.status(), url).toBe(200);
					expect(asset.headers()['content-type']).toContain('javascript');
				}
				expect(failedAssets).toEqual([]);
			});
		});
	}
}
