import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { get } from 'svelte/store';
import * as timer from '../src/lib/stores/timerStore.ts';
let now = 0;

Object.defineProperty(globalThis, 'window', {
	configurable: true,
	value: { localStorage: { getItem: () => null, setItem: () => {} } }
});
after(() => {
	timer.disposeTimer();
	Reflect.deleteProperty(globalThis, 'window');
});
test('background delay follows deadline; pause and reset stop elapsed time', (t) => {
	t.mock.method(Date, 'now', () => now);
	timer.initializeTimer();
	timer.startTimer();
	now += 600000;
	timer.refreshTimer();
	assert.equal(get(timer.timerState).timeRemaining, 900);
	timer.pauseTimer();
	now += 600000;
	timer.refreshTimer();
	assert.equal(get(timer.timerState).timeRemaining, 900);
	timer.startTimer();
	now += 10000;
	timer.refreshTimer();
	assert.equal(get(timer.timerState).timeRemaining, 890);
	timer.resetTimer();
	assert.equal(get(timer.timerState).timeRemaining, 1500);
});
test('external settings reject null, arrays, strings, NaN, infinities, fractions and bounds', () => {
	for (const value of [
		null,
		[],
		'bad',
		{},
		{ ...timer.defaultSettings, workDuration: NaN },
		{ ...timer.defaultSettings, workDuration: Infinity },
		{ ...timer.defaultSettings, workDuration: 61 },
		{ ...timer.defaultSettings, sessionsBeforeLongBreak: 1.5 },
		{ ...timer.defaultSettings, workDuration: 7260 }
	]) {
		assert.equal(timer.validSettings(value), false);
	}
	assert.equal(timer.validSettings(timer.defaultSettings), true);
});
test('saving while running rejects without changing deadline; denied storage stays in memory', () => {
	timer.initializeTimer();
	timer.startTimer();
	assert.equal(timer.saveTimerSettings({ ...timer.defaultSettings, workDuration: 120 }), false);
	assert.equal(get(timer.timerSettings).workDuration, 1500);
	timer.pauseTimer();
	window.localStorage.setItem = () => {
		throw new Error('denied');
	};
	assert.equal(timer.saveTimerSettings({ ...timer.defaultSettings, workDuration: 120 }), true);
	assert.equal(get(timer.timerState).timeRemaining, 120);
	assert.match(get(timer.storageNotice), /won't persist/);
});
test('corrupt and inaccessible storage fall back without throwing', () => {
	window.localStorage.getItem = () => '{bad';
	timer.initializeTimer();
	assert.equal(get(timer.timerState).timeRemaining, 1500);
	Object.defineProperty(window, 'localStorage', {
		get() {
			throw new Error('denied');
		}
	});
	assert.doesNotThrow(timer.initializeTimer);
	assert.equal(get(timer.timerState).isRunning, false);
});
