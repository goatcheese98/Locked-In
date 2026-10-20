import { test, expect } from '@playwright/test';

test('prefix routing and missing pages/assets keep real statuses and revalidation', async ({
	request
}) => {
	const root = await request.get('/', { maxRedirects: 0 });
	expect(root.status()).toBe(302);
	expect(root.headers().location).toBe('/Locked-In/');
	const canonical = await request.get('/Locked-In', { maxRedirects: 0 });
	expect(canonical.status()).toBe(308);
	for (const path of [
		'/missing',
		'/Locked-In/missing',
		'/Locked-In/_app/immutable/missing.js',
		'/Locked-In/_app/immutable/missing.css',
		'/Locked-In/_app/immutable/missing.woff2'
	]) {
		const response = await request.get(path);
		expect(response.status(), path).toBe(404);
		expect(await response.text()).toContain('Page not found');
		expect(response.headers()['cache-control']).toMatch(
			/^(no-store|public, max-age=0, must-revalidate)$/
		);
		expect(response.headers()['x-content-type-options']).toBe('nosniff');
	}
});

test('static HTML and every requested script/style/font load with security headers under CSP', async ({
	page,
	request
}) => {
	const failures: string[] = [];
	page.on('pageerror', (error) => failures.push(error.message));
	page.on('response', (response) => {
		if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`);
	});
	const response = await page.goto('/Locked-In/');
	expect(response?.status()).toBe(200);
	const headers = response!.headers();
	expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
	expect(headers['content-security-policy']).toMatch(/script-src 'self' 'sha256-/);
	expect(headers['content-security-policy']).not.toMatch(/script-src[^;]*unsafe/);
	expect(headers['x-frame-options']).toBe('DENY');
	expect(headers['referrer-policy']).toBe('no-referrer');
	expect(headers['cache-control']).toBe('public, max-age=0, must-revalidate');
	await expect(page.getByRole('timer')).toHaveText('25:00');
	await page.getByRole('button', { name: 'Start focus', exact: true }).click();
	await expect(page.getByRole('button', { name: 'Pause', exact: true })).toBeVisible();
	await page.getByRole('button', { name: 'Appearance', exact: true }).click();
	await expect(page.getByRole('dialog', { name: 'Appearance', exact: true })).toBeVisible();
	await page.getByLabel('Background effects', { exact: true }).check();
	await page.getByRole('button', { name: 'Done', exact: true }).click();
	await page.getByRole('button', { name: 'Color Palette', exact: true }).focus();
	await page.keyboard.press('Enter');
	await expect(page.getByRole('heading', { name: 'Color palette', exact: true })).toBeVisible();
	await page.getByRole('slider', { name: /^Hue/ }).fill('150');
	const script = await page.locator('link[rel="modulepreload"]').first().getAttribute('href');
	expect(new URL(script!, page.url()).pathname).toContain('/Locked-In/');
	const asset = await request.get(new URL(script!, page.url()).href);
	expect(asset.status()).toBe(200);
	expect(asset.headers()['content-type']).toContain('javascript');
	expect(asset.headers()['cache-control']).toBe('public, max-age=0, must-revalidate');
	expect(asset.headers().etag).toBeTruthy();
	const conditional = await request.get(new URL(script!, page.url()).href, {
		headers: { 'If-None-Match': asset.headers().etag }
	});
	expect(conditional.status()).toBe(304);
	expect(failures).toEqual([]);
	await page.screenshot({ path: 'work/security/cloudflare-pages.png', fullPage: true });
});
