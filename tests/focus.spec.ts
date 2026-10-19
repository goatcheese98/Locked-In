import { test, expect, type Page } from '@playwright/test';
const settings = {
	workDuration: 60,
	shortBreakDuration: 60,
	longBreakDuration: 120,
	sessionsBeforeLongBreak: 2,
	autoCycle: false
};
async function setup(page: Page, autoCycle = false) {
	await page.addInitScript(
		(value) => localStorage.setItem('zenZoneTimerSettings', JSON.stringify(value)),
		{ ...settings, autoCycle }
	);
	await page.clock.install();
	await page.goto('/');
	await expect(page.getByRole('timer')).toHaveText('01:00');
}
async function jump(page: Page, seconds: number) {
	const now = await page.evaluate(() => Date.now());
	await page.clock.setSystemTime(now + seconds * 1000);
	await page.evaluate(() => window.dispatchEvent(new Event('focus')));
}
test('deadline, pause/resume, background jump, reset and running mode switch', async ({ page }) => {
	await setup(page);
	const timer = page.getByRole('timer');
	await page.getByRole('button', { name: 'Start focus', exact: true }).click();
	await jump(page, 20);
	await expect(timer).toHaveText('00:40');
	await page.getByRole('button', { name: 'Pause', exact: true }).click();
	await jump(page, 300);
	await expect(timer).toHaveText('00:40');
	await page.getByRole('button', { name: 'Resume', exact: true }).click();
	await jump(page, 10);
	await expect(timer).toHaveText('00:30');
	await page.getByRole('button', { name: 'Reset', exact: true }).click();
	await expect(timer).toHaveText('01:00');
	await page.getByRole('button', { name: 'Start focus', exact: true }).click();
	await page.getByRole('radio', { name: 'Long break', exact: true }).click();
	await jump(page, 500);
	await expect(timer).toHaveText('02:00');
	await expect(page.getByRole('button', { name: 'Start break', exact: true })).toBeVisible();
});
test('complete short/long break cycle and announce once without per-tick live output', async ({
	page
}) => {
	await setup(page);
	for (const [start, next, time] of [
		['Start focus', 'Short break', '01:00'],
		['Start break', 'Focus', '01:00'],
		['Start focus', 'Long break', '02:00']
	] as const) {
		await page.getByRole('button', { name: start, exact: true }).click();
		await jump(page, 60);
		await expect(page.getByRole('radio', { name: next, exact: true })).toHaveAttribute(
			'aria-checked',
			'true'
		);
		await expect(page.getByRole('timer')).toHaveText(time);
		await expect(page.getByRole('status').filter({ hasText: 'complete' })).toContainText(
			'complete'
		);
	}
	await expect(page.getByRole('timer')).not.toHaveAttribute('aria-live');
	await page.getByRole('button', { name: 'Start break', exact: true }).click();
	await jump(page, 120);
	await expect(page.getByText('Focus session · 1 of 2')).toBeVisible();
});
test('auto-cycle catches up once and reload starts fresh while keeping preferences', async ({
	page
}) => {
	await setup(page, true);
	await page.getByRole('button', { name: 'Start focus', exact: true }).click();
	await jump(page, 600);
	await expect(page.getByRole('radio', { name: 'Short break', exact: true })).toHaveAttribute(
		'aria-checked',
		'true'
	);
	await expect(page.getByRole('button', { name: 'Pause', exact: true })).toBeVisible();
	await jump(page, 10);
	await expect(page.getByRole('timer')).toHaveText('00:50');
	await page.reload();
	await expect(page.getByRole('timer')).toHaveText('01:00');
	await expect(page.getByRole('button', { name: 'Start focus', exact: true })).toBeVisible();
});
test('settings validate, cancel, save, prohibit running changes and restore focus', async ({
	page
}) => {
	await setup(page);
	const trigger = page.getByRole('button', { name: 'Timer settings', exact: true });
	await trigger.click();
	const dialog = page.getByRole('dialog', { name: 'Timer settings', exact: true });
	const focus = dialog.getByLabel('Focus · 1–120 minutes');
	await focus.fill('0');
	await dialog.getByRole('button', { name: 'Save', exact: true }).click();
	await expect(dialog.getByRole('alert')).toContainText('whole minutes');
	await focus.fill('2');
	await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
	await expect(page.getByRole('timer')).toHaveText('01:00');
	await expect(trigger).toBeFocused();
	await trigger.click();
	await expect(focus).toHaveValue('1');
	await focus.fill('2');
	await dialog.getByRole('button', { name: 'Save', exact: true }).click();
	await expect(page.getByRole('timer')).toHaveText('02:00');
	await page.getByRole('button', { name: 'Start focus', exact: true }).click();
	await trigger.click();
	await expect(dialog.getByRole('button', { name: 'Save', exact: true })).toBeDisabled();
	await dialog.getByRole('button', { name: 'Cancel', exact: true }).focus();
	await page.keyboard.press('Tab');
	await expect(dialog.locator('input').first()).toBeFocused();
	await page.keyboard.press('Escape');
	await expect(trigger).toBeFocused();
	await jump(page, 10);
	await expect(page.getByRole('timer')).toHaveText('01:50');
});
for (const storage of ['corrupt', 'wrong-types', 'denied'] as const) {
	test(`${storage} storage keeps timer and settings usable`, async ({ page }) => {
		const errors: string[] = [];
		page.on('pageerror', (e) => errors.push(e.message));
		await page.addInitScript((kind) => {
			if (kind === 'denied')
				Object.defineProperty(window, 'localStorage', {
					get() {
						throw new DOMException('denied', 'SecurityError');
					}
				});
			else {
				localStorage.setItem(
					'zenZoneTimerSettings',
					kind === 'corrupt' ? '{bad' : '{"workDuration":"bad"}'
				);
				localStorage.setItem('backgroundSettings', '{"grainDensity":null}');
			}
		}, storage);
		await page.goto('/');
		await expect(page.getByRole('timer')).toHaveText('25:00');
		await expect(
			page.getByRole('status').filter({ hasText: /could not be read|won.t persist/ })
		).toBeVisible();
		await page.getByRole('button', { name: 'Start focus', exact: true }).click();
		await expect(page.getByRole('button', { name: 'Pause', exact: true })).toBeVisible();
		await page.getByRole('button', { name: 'Pause', exact: true }).click();
		await page.getByRole('button', { name: 'Timer settings', exact: true }).click();
		const dialog = page.getByRole('dialog', { name: 'Timer settings', exact: true });
		await dialog.getByLabel('Focus · 1–120 minutes').fill('2');
		await dialog.getByRole('button', { name: 'Save', exact: true }).click();
		await expect(page.getByRole('timer')).toHaveText('02:00');
		expect(errors).toEqual([]);
	});
}
for (const width of [320, 768, 1440])
	for (const theme of ['light', 'dark'] as const) {
		test(`layout ${width} ${theme}, keyboard modes, dock and reduced motion`, async ({ page }) => {
			const errors: string[] = [];
			page.on('pageerror', (e) => errors.push(e.message));
			await page.setViewportSize({ width, height: 900 });
			await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
			await page.goto('/');
			await expect(page.getByRole('timer')).toHaveText('25:00');
			await page.evaluate(() => document.fonts.ready);
			await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
			await page.screenshot({
				path: `docs/design/screens/cloud-${width}-${theme}.png`,
				fullPage: true
			});
			expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
				true
			);
			await page.getByRole('radio', { name: 'Focus', exact: true }).focus();
			await page.keyboard.press('ArrowRight');
			await expect(page.getByRole('radio', { name: 'Short break', exact: true })).toBeFocused();
			await page.getByRole('button', { name: 'Appearance', exact: true }).click();
			const appearance = page.getByRole('dialog', { name: 'Appearance', exact: true });
			await appearance.getByLabel('Background effects', { exact: true }).check();
			await expect(appearance).toContainText('Reduced motion');
			await page.keyboard.press('Escape');
			await expect(page.locator('canvas')).toHaveCount(0);
			await expect(
				page.getByText('Background effects · Off (reduced motion)', { exact: true })
			).toBeVisible();
			await page.getByRole('radio', { name: 'Focus', exact: true }).click();
			const dock = page.getByRole('toolbar', { name: 'Background Effects Dock' });
			await dock.getByRole('button').first().focus();
			await expect(dock).toHaveCSS('opacity', '1');
			expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
				true
			);
			expect(errors).toEqual([]);
		});
	}
test('optional effects and existing dock panels remain available', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (e) => errors.push(e.message));
	await page.goto('/');
	await page.getByRole('button', { name: 'Appearance', exact: true }).click();
	await page
		.getByRole('dialog', { name: 'Appearance', exact: true })
		.getByLabel('Background effects', { exact: true })
		.check();
	await page.keyboard.press('Escape');
	await expect(page.locator('canvas')).toHaveCount(1);
	await page.reload();
	await expect(page.locator('canvas')).toHaveCount(1);
	const particles = page.getByRole('button', { name: 'Particle Effects', exact: true });
	await particles.focus();
	await page.keyboard.press('Enter');
	const density = page.getByLabel('Density', { exact: true });
	await density.fill('100');
	await expect
		.poll(() =>
			page.evaluate(
				() => JSON.parse(localStorage.getItem('backgroundSettings') || '{}').grainDensity
			)
		)
		.toBe(100);
	await expect(density).toHaveValue('100');
	await page.getByRole('button', { name: 'Timer Settings', exact: true }).last().focus();
	await page.keyboard.press('Enter');
	await expect(page.getByRole('dialog', { name: 'Timer settings', exact: true })).toBeVisible();
	expect(errors).toEqual([]);
});
