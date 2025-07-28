import { writable, derived, get } from 'svelte/store';

export type SessionType = 'Work' | 'Short Break' | 'Long Break';

export interface TimerSettings {
	workDuration: number; // in seconds
	shortBreakDuration: number; // in seconds
	longBreakDuration: number; // in seconds
	sessionsBeforeLongBreak: number;
	autoCycle: boolean;
}

export interface TimerState {
	currentSession: SessionType;
	timeRemaining: number; // in seconds
	isRunning: boolean;
	currentCycleCount: number; // Number of work sessions completed in the current cycle
}

const LOCAL_STORAGE_SETTINGS_KEY = 'zenZoneTimerSettings';

// Default settings (PRD F1.2)
// Ensure defaults themselves are valid according to constraints
const defaultSettings: TimerSettings = {
	workDuration: Math.max(1, 25) * 60, // 25 minutes
	shortBreakDuration: Math.max(1, 5) * 60, // 5 minutes
	longBreakDuration: Math.max(1, 15) * 60, // 15 minutes
	sessionsBeforeLongBreak: Math.max(1, 4),
	autoCycle: false // PRD F1.5, default to off initially
};

// Helper function to sanitize settings
function sanitizeSettings(settings: Partial<TimerSettings>): TimerSettings {
	const sane: TimerSettings = { ...defaultSettings, ...settings }; // Ensure all keys are present, potentially overriding defaults

	sane.workDuration = Math.max(1, Math.floor(sane.workDuration / 60)) * 60; // Ensure at least 1 minute, in seconds
	sane.shortBreakDuration = Math.max(1, Math.floor(sane.shortBreakDuration / 60)) * 60;
	sane.longBreakDuration = Math.max(1, Math.floor(sane.longBreakDuration / 60)) * 60;
	sane.sessionsBeforeLongBreak = Math.max(1, Math.floor(sane.sessionsBeforeLongBreak));
	// autoCycle is boolean, typically doesn't need sanitization beyond type check

	return sane;
}

// Function to load settings from localStorage
function loadSettings(): TimerSettings {
	if (typeof window !== 'undefined' && window.localStorage) {
		const storedSettings = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
		if (storedSettings) {
			try {
				const parsed = JSON.parse(storedSettings) as Partial<TimerSettings>; // Cast to Partial for processing
				// Basic validation for types is good, but primary sanitization will be done by sanitizeSettings
				if (
					parsed &&
					typeof parsed.workDuration === 'number' &&
					typeof parsed.shortBreakDuration === 'number' &&
					typeof parsed.longBreakDuration === 'number' &&
					typeof parsed.sessionsBeforeLongBreak === 'number' &&
					typeof parsed.autoCycle === 'boolean'
				) {
					// Return sanitized settings, ensuring they meet constraints
					return sanitizeSettings(parsed);
				} else if (parsed) {
					// If some keys are there but not all, or types are wrong, still try to sanitize what's given
					console.warn('Partially invalid settings found in localStorage, attempting to sanitize.');
					return sanitizeSettings(parsed);
				}
			} catch (error) {
				console.error('Error parsing timer settings from localStorage:', error);
				// Fallback to sanitized default if parsing fails
			}
		}
	}
	// Return sanitized default settings if nothing in localStorage or if errors occurred
	return sanitizeSettings(defaultSettings); // Ensure defaults are also passed through sanitizer for consistency
}

// Initial state
// const initialSettings = loadSettings(); // This will now be sanitized
const reevaluatedInitialSettings = loadSettings(); // Get the sanitized settings first
const initialState: TimerState = {
	// Define initialState after reevaluatedInitialSettings
	currentSession: 'Work',
	timeRemaining: reevaluatedInitialSettings.workDuration,
	isRunning: false,
	currentCycleCount: 0
};

// Create writable stores for settings and state
export const timerSettings = writable<TimerSettings>(loadSettings()); // Initialize with sanitized settings
export const timerState = writable<TimerState>(initialState); // initialState should use the sanitized settings

// Effect to save settings to localStorage whenever they change
if (typeof window !== 'undefined' && window.localStorage) {
	timerSettings.subscribe((settings) => {
		try {
			// Before saving, ensure settings are sanitized.
			// This is important if timerSettings.set() is called from somewhere else
			// with potentially un-sanitized values, although SettingsPanel already sanitizes.
			// However, the primary sanitization is now on load and in SettingsPanel's reactive block.
			// For consistency, we could re-sanitize here, but it might be overkill if SettingsPanel is the only updater.
			// Let's assume settings being set are already sanitized by the source (e.g., SettingsPanel).
			localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
		} catch (error) {
			console.error('Error saving timer settings to localStorage:', error);
			// Handle potential errors like localStorage being full
		}
	});

	// The initial timerState.timeRemaining is already set based on loadedSettings.workDuration.
	// If settings are changed dynamically (e.g. via a settings panel),
	// functions like resetTimer() or the logic for starting a new session (skip/auto-cycle)
	// will pick up the new durations from timerSettings directly at that point.

	// Ensure initialState.timeRemaining is correctly set using the sanitized settings
	// This is a bit tricky due to module execution order. Let's adjust where initialState is defined.
	// The `timerSettings` writable needs to be defined with loadSettings(),
	// then `initialState` needs to use the value from `timerSettings.get()` or the result of `loadSettings()`.

	// Revised initialization sequence:
	// 1. Load and sanitize settings.
	// 2. Create timerSettings store with these settings.
	// 3. Create initialState using these settings.
	// 4. Create timerState store.

	// This was already handled by moving initialState definition below reevaluatedInitialSettings.
}

// Derived store for formatted time MM:SS (PRD F1.4)
export const formattedTime = derived(timerState, ($timerState) => {
	const minutes = Math.floor($timerState.timeRemaining / 60);
	const seconds = $timerState.timeRemaining % 60;
	return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
});

// --- Timer Actions ---

let timerInterval: number | undefined;

export function startTimer() {
	const currentState = get(timerState);
	if (currentState.isRunning && currentState.timeRemaining > 0) return;

	let currentTimeRemaining = currentState.timeRemaining;
	if (currentTimeRemaining <= 0) {
		const settings = get(timerSettings);
		switch (currentState.currentSession) {
			case 'Work':
				currentTimeRemaining = settings.workDuration;
				break;
			case 'Short Break':
				currentTimeRemaining = settings.shortBreakDuration;
				break;
			case 'Long Break':
				currentTimeRemaining = settings.longBreakDuration;
				break;
		}
	}

	timerState.update((s) => ({ ...s, isRunning: true, timeRemaining: currentTimeRemaining }));

	if (timerInterval) clearInterval(timerInterval);
	timerInterval = setInterval(() => {
		const currentVal = get(timerState);
		if (currentVal.isRunning && currentVal.timeRemaining > 0) {
			timerState.update((s) => ({ ...s, timeRemaining: s.timeRemaining - 1 }));
		} else if (currentVal.isRunning && currentVal.timeRemaining <= 0) {
			if (timerInterval) clearInterval(timerInterval);
			timerInterval = undefined;
			handleSessionCompletion();
		}
	}, 1000) as unknown as number;
}

export function pauseTimer() {
	if (timerInterval) {
		clearInterval(timerInterval);
		timerInterval = undefined;
	}
	timerState.update((state) => ({ ...state, isRunning: false }));
}

export function skipSession() {
	if (timerInterval) {
		clearInterval(timerInterval);
		timerInterval = undefined;
	}

	timerState.update((state) => {
		let nextSession: SessionType;
		let nextTimeRemaining: number;
		let newCycleCount = state.currentCycleCount;

		// Subscribe to settings to get current durations
		let currentSettings: TimerSettings = defaultSettings; // Fallback, will be replaced
		const unsubscribe = timerSettings.subscribe((settings) => {
			currentSettings = settings;
		});
		unsubscribe(); // Unsubscribe immediately after getting the values

		if (state.currentSession === 'Work') {
			newCycleCount++;
			if (newCycleCount >= currentSettings.sessionsBeforeLongBreak) {
				nextSession = 'Long Break';
				nextTimeRemaining = currentSettings.longBreakDuration;
				newCycleCount = 0; // Reset cycle count
			} else {
				nextSession = 'Short Break';
				nextTimeRemaining = currentSettings.shortBreakDuration;
			}
		} else {
			// Currently on a Short Break or Long Break
			nextSession = 'Work';
			nextTimeRemaining = currentSettings.workDuration;
		}

		return {
			...state,
			currentSession: nextSession,
			timeRemaining: nextTimeRemaining,
			isRunning: false, // Stop the timer
			currentCycleCount: newCycleCount
		};
	});
}

export function resetTimer(forceSession?: SessionType) {
	if (timerInterval) {
		clearInterval(timerInterval);
		timerInterval = undefined;
	}

	const settings = get(timerSettings);
	const targetSession = forceSession || get(timerState).currentSession;
	let newTimeRemaining = settings.workDuration;
	let newCycleCount = get(timerState).currentCycleCount;

	switch (targetSession) {
		case 'Work':
			newTimeRemaining = settings.workDuration;
			if (forceSession === 'Work') newCycleCount = 0; // Reset cycles if explicitly going to Work
			break;
		case 'Short Break':
			newTimeRemaining = settings.shortBreakDuration;
			break;
		case 'Long Break':
			newTimeRemaining = settings.longBreakDuration;
			break;
	}

	timerState.update((s) => ({
		...s,
		currentSession: targetSession,
		timeRemaining: newTimeRemaining,
		isRunning: false,
		currentCycleCount: newCycleCount
	}));
}

export function updateCurrentSessionDuration(newDurationInSeconds: number) {
	timerState.update((state) => {
		if (state.isRunning) return state; // Only allow updates if timer is not running

		const newTime = Math.max(60, newDurationInSeconds); // Ensure at least 1 minute (60 seconds)

		timerSettings.update((settings) => {
			const updatedSettings = { ...settings };
			switch (state.currentSession) {
				case 'Work':
					updatedSettings.workDuration = newTime;
					break;
				case 'Short Break':
					updatedSettings.shortBreakDuration = newTime;
					break;
				case 'Long Break':
					updatedSettings.longBreakDuration = newTime;
					break;
			}
			return updatedSettings;
		});

		return {
			...state,
			timeRemaining: newTime
		};
	});
}

function handleSessionCompletion() {
	const state = get(timerState);
	const settings = get(timerSettings);
	let nextSession: SessionType;
	let newCycleCount = state.currentCycleCount;

	if (state.currentSession === 'Work') {
		newCycleCount++;
		if (newCycleCount >= settings.sessionsBeforeLongBreak) {
			nextSession = 'Long Break';
			newCycleCount = 0; // Reset for next set of sessions
		} else {
			nextSession = 'Short Break';
		}
	} else {
		// If current session was Short Break or Long Break
		nextSession = 'Work';
	}

	timerState.update((s) => ({
		...s,
		currentSession: nextSession,
		isRunning: false, // Stop timer until explicitly started
		currentCycleCount: newCycleCount
	}));
	resetTimer(nextSession); // Setup the next session

	if (settings.autoCycle) {
		// PRD F1.5
		startTimer();
	}
}
