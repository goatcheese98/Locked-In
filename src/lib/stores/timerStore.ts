import { writable, derived, get } from 'svelte/store';

export type SessionType = 'Work' | 'Short Break' | 'Long Break';
export interface TimerSettings {
	workDuration: number;
	shortBreakDuration: number;
	longBreakDuration: number;
	sessionsBeforeLongBreak: number;
	autoCycle: boolean;
}
export interface TimerState {
	currentSession: SessionType;
	timeRemaining: number;
	isRunning: boolean;
	currentCycleCount: number;
	hasStarted: boolean;
}
export const defaultSettings: TimerSettings = {
	workDuration: 1500,
	shortBreakDuration: 300,
	longBreakDuration: 900,
	sessionsBeforeLongBreak: 4,
	autoCycle: false
};
export const storageNotice = writable('');
export const timerAnnouncement = writable('');
export const timerSettings = writable<TimerSettings>({ ...defaultSettings });
export const timerState = writable<TimerState>({
	currentSession: 'Work',
	timeRemaining: 1500,
	isRunning: false,
	currentCycleCount: 0,
	hasStarted: false
});
export const formattedTime = derived(
	timerState,
	(s) =>
		`${String(Math.floor(s.timeRemaining / 60)).padStart(2, '0')}:${String(s.timeRemaining % 60).padStart(2, '0')}`
);
const key = 'zenZoneTimerSettings';
let deadline: number | undefined;
let interval: ReturnType<typeof setInterval> | undefined;

export function validSettings(value: unknown): value is TimerSettings {
	if (!value || typeof value !== 'object') return false;
	const s = value as Record<string, unknown>;
	const integer = (v: unknown, max: number, step = 1) =>
		typeof v === 'number' && Number.isInteger(v) && v >= step && v <= max && v % step === 0;
	return (
		integer(s.workDuration, 7200, 60) &&
		integer(s.shortBreakDuration, 3600, 60) &&
		integer(s.longBreakDuration, 7200, 60) &&
		integer(s.sessionsBeforeLongBreak, 10) &&
		typeof s.autoCycle === 'boolean'
	);
}

// Reload deliberately starts a fresh focus session. Only preferences persist.
export function initializeTimer(): void {
	try {
		const stored = window.localStorage.getItem(key);
		if (stored !== null) {
			const parsed: unknown = JSON.parse(stored);
			if (!validSettings(parsed)) throw new Error('Invalid settings');
			timerSettings.set(parsed);
		}
	} catch {
		storageNotice.set(
			'Saved timer settings could not be read. Using defaults; settings may not persist.'
		);
		timerSettings.set({ ...defaultSettings });
	}
	resetTimer('Work');
}
function duration(session: SessionType): number {
	const s = get(timerSettings);
	return session === 'Work'
		? s.workDuration
		: session === 'Short Break'
			? s.shortBreakDuration
			: s.longBreakDuration;
}
function stopClock(): void {
	if (interval !== undefined) clearInterval(interval);
	interval = undefined;
	deadline = undefined;
}
export function refreshTimer(): void {
	if (deadline === undefined) return;
	const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
	timerState.update((s) => ({ ...s, timeRemaining: remaining }));
	if (remaining === 0) {
		const completed = get(timerState).currentSession;
		const auto = get(timerSettings).autoCycle;
		skipSession();
		if (auto) startTimer();
		timerAnnouncement.set(
			`${completed === 'Work' ? 'Focus' : completed} complete. ${get(timerState).currentSession === 'Work' ? 'Focus' : get(timerState).currentSession} ${auto ? 'started' : 'ready'}.`
		);
	}
}
export function startTimer(): void {
	const s = get(timerState);
	if (s.isRunning) return;
	const remaining = s.timeRemaining > 0 ? s.timeRemaining : duration(s.currentSession);
	deadline = Date.now() + remaining * 1000;
	timerState.update((s) => ({ ...s, isRunning: true, hasStarted: true, timeRemaining: remaining }));
	interval = setInterval(refreshTimer, 250);
	timerAnnouncement.set('Timer running.');
}
export function pauseTimer(): void {
	refreshTimer();
	stopClock();
	timerState.update((s) => ({ ...s, isRunning: false }));
	timerAnnouncement.set('Timer paused.');
}
export function skipSession(): void {
	stopClock();
	const s = get(timerState);
	const count = s.currentSession === 'Work' ? s.currentCycleCount + 1 : s.currentCycleCount;
	const long = count >= get(timerSettings).sessionsBeforeLongBreak;
	const next: SessionType =
		s.currentSession === 'Work' ? (long ? 'Long Break' : 'Short Break') : 'Work';
	timerState.set({
		currentSession: next,
		timeRemaining: duration(next),
		isRunning: false,
		currentCycleCount: next === 'Long Break' ? 0 : count,
		hasStarted: false
	});
	timerAnnouncement.set(`${next === 'Work' ? 'Focus' : next} ready.`);
}
export function resetTimer(forceSession?: SessionType): void {
	stopClock();
	const s = get(timerState);
	const session = forceSession ?? s.currentSession;
	timerState.set({
		...s,
		currentSession: session,
		timeRemaining: duration(session),
		isRunning: false,
		hasStarted: false,
		currentCycleCount: forceSession === 'Work' ? 0 : s.currentCycleCount
	});
	timerAnnouncement.set(`${session === 'Work' ? 'Focus' : session} reset and paused.`);
}
export function saveTimerSettings(value: unknown): boolean {
	if (!validSettings(value) || get(timerState).isRunning) return false;
	timerSettings.set({ ...value });
	resetTimer();
	timerState.update((s) => ({
		...s,
		currentCycleCount: Math.min(s.currentCycleCount, value.sessionsBeforeLongBreak - 1)
	}));
	try {
		window.localStorage.setItem(key, JSON.stringify(value));
	} catch {
		storageNotice.set(
			"Settings saved for this visit. Storage is unavailable; settings won't persist."
		);
	}
	timerAnnouncement.set('Timer settings saved. Current session reset.');
	return true;
}
export function updateCurrentSessionDuration(seconds: number): void {
	if (get(timerState).isRunning || !Number.isFinite(seconds)) return;
	const s = get(timerState).currentSession;
	const field =
		s === 'Work'
			? 'workDuration'
			: s === 'Short Break'
				? 'shortBreakDuration'
				: 'longBreakDuration';
	saveTimerSettings({
		...get(timerSettings),
		[field]: Math.max(60, Math.floor(seconds / 60) * 60)
	});
}
export function disposeTimer(): void {
	stopClock();
}
