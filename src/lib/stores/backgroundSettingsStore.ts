import { writable, get } from 'svelte/store';

const MAX_HISTORY_SIZE = 20;

export interface BackgroundSettings {
	gradientColor1: string;
	gradientColor2: string;
	isFloatingEnabled: boolean;
	gradientColor1History: string[];
	gradientColor1HistoryIndex: number;
	gradientColor2History: string[];
	gradientColor2HistoryIndex: number;
	isAutoCyclingColor1: boolean;
	isAutoCyclingColor2: boolean;
}

const defaultBackgroundSettings: BackgroundSettings = {
	gradientColor1: 'hsl(210, 70%, 25%)',
	gradientColor2: 'hsl(200, 68%, 27%)',
	isFloatingEnabled: true,
	gradientColor1History: ['hsl(210, 70%, 25%)'],
	gradientColor1HistoryIndex: 0,
	gradientColor2History: ['hsl(200, 68%, 27%)'],
	gradientColor2HistoryIndex: 0,
	isAutoCyclingColor1: false,
	isAutoCyclingColor2: false
};

function generateRandomHslColor(options?: { maxLightness?: number }): string {
	const h = Math.floor(Math.random() * 361);
	const s = Math.floor(Math.random() * 51) + 50;
	const minLightness = 0;
	const upperLightnessLimit = options?.maxLightness ?? 50;
	const actualMaxLightness = Math.max(minLightness, upperLightnessLimit);
	const l = Math.floor(Math.random() * (actualMaxLightness - minLightness + 1)) + minLightness;
	return `hsl(${h}, ${s}%, ${l}%)`;
}

// Utility to parse HSL strings (needed for controlled randomization)
function parseHslString(
	hslStr: string | null | undefined
): { h: number; s: number; l: number } | null {
	if (!hslStr) return null;
	const match = hslStr.match(/hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/);
	return match ? { h: parseInt(match[1]), s: parseInt(match[2]), l: parseInt(match[3]) } : null;
}

// NEW: Function for controlled random step
export function generateControlledRandomStep(currentHslString: string): string {
	const currentHsl = parseHslString(currentHslString);
	if (!currentHsl) {
		console.warn('Could not parse current HSL for controlled step:', currentHslString);
		return currentHslString; // Return original if parsing fails
	}

	const deltaH = Math.random() * 36 - 18; // +/- 18

	// Calculate deltaS with oscillation logic
	let deltaS;
	if (currentHsl.s <= 0) {
		deltaS = Math.random() * 5; // Only increase
	} else if (currentHsl.s >= 100) {
		deltaS = Math.random() * -5; // Only decrease
	} else {
		deltaS = Math.random() * 10 - 5; // +/- 5
	}

	// Calculate deltaL with oscillation logic (Max L is 50)
	let deltaL;
	if (currentHsl.l <= 0) {
		deltaL = Math.random() * 3; // Only increase
	} else if (currentHsl.l >= 50) {
		deltaL = Math.random() * -3; // Only decrease
	} else {
		deltaL = Math.random() * 6 - 3; // +/- 3
	}

	const newH = (currentHsl.h + deltaH + 360) % 360;
	const newS = Math.max(0, Math.min(100, currentHsl.s + deltaS));
	const newL = Math.max(0, Math.min(50, currentHsl.l + deltaL)); // Still clamp just in case

	return `hsl(${Math.round(newH)}, ${Math.round(newS)}%, ${Math.round(newL)}%)`;
}

// const LOCAL_STORAGE_KEY = 'backgroundSettings'; // Keep this if we decide to use it consistently, or remove

function loadBackgroundSettings(): BackgroundSettings {
	let settingsToReturn = {
		...defaultBackgroundSettings,
		gradientColor1History: [...defaultBackgroundSettings.gradientColor1History],
		gradientColor2History: [...defaultBackgroundSettings.gradientColor2History]
	};
	if (typeof localStorage !== 'undefined') {
		const storedSettings = localStorage.getItem('backgroundSettings');
		if (storedSettings) {
			try {
				const parsed = JSON.parse(storedSettings) as Partial<BackgroundSettings>;

				settingsToReturn = {
					...settingsToReturn,
					...parsed,
					isAutoCyclingColor1:
						parsed.isAutoCyclingColor1 ?? defaultBackgroundSettings.isAutoCyclingColor1,
					isAutoCyclingColor2:
						parsed.isAutoCyclingColor2 ?? defaultBackgroundSettings.isAutoCyclingColor2
				};

				if (!parsed.gradientColor1History || parsed.gradientColor1History.length === 0) {
					settingsToReturn.gradientColor1History = [settingsToReturn.gradientColor1];
					settingsToReturn.gradientColor1HistoryIndex = 0;
				} else {
					settingsToReturn.gradientColor1HistoryIndex = Math.max(
						0,
						Math.min(
							parsed.gradientColor1HistoryIndex ?? 0,
							parsed.gradientColor1History.length - 1
						)
					);
					settingsToReturn.gradientColor1 =
						parsed.gradientColor1History[settingsToReturn.gradientColor1HistoryIndex];
				}

				if (!parsed.gradientColor2History || parsed.gradientColor2History.length === 0) {
					settingsToReturn.gradientColor2History = [settingsToReturn.gradientColor2];
					settingsToReturn.gradientColor2HistoryIndex = 0;
				} else {
					settingsToReturn.gradientColor2HistoryIndex = Math.max(
						0,
						Math.min(
							parsed.gradientColor2HistoryIndex ?? 0,
							parsed.gradientColor2History.length - 1
						)
					);
					settingsToReturn.gradientColor2 =
						parsed.gradientColor2History[settingsToReturn.gradientColor2HistoryIndex];
				}
			} catch (e) {
				console.error('Failed to parse background settings from localStorage', e);
				return {
					...defaultBackgroundSettings,
					gradientColor1History: [...defaultBackgroundSettings.gradientColor1History],
					gradientColor2History: [...defaultBackgroundSettings.gradientColor2History]
				};
			}
		}
	}
	return settingsToReturn;
}

const initialSettings = loadBackgroundSettings();
export const backgroundSettings = writable<BackgroundSettings>(initialSettings);

if (typeof localStorage !== 'undefined') {
	backgroundSettings.subscribe((value) => {
		localStorage.setItem('backgroundSettings', JSON.stringify(value));
	});
}

function pushColorToHistory(
	newColor: string,
	currentHistory: string[],
	currentIndex: number
): { history: string[]; index: number } {
	let newHistory = [...currentHistory];
	if (currentIndex < newHistory.length - 1) {
		newHistory = newHistory.slice(0, currentIndex + 1);
	}
	newHistory.push(newColor);
	if (newHistory.length > MAX_HISTORY_SIZE) {
		newHistory = newHistory.slice(newHistory.length - MAX_HISTORY_SIZE);
	}
	const newIndex = newHistory.length - 1;
	return { history: newHistory, index: newIndex };
}

export function setGradientColor1(newColor: string) {
	const current = get(backgroundSettings);
	if (current.gradientColor1 === newColor) return;

	const { history, index } = pushColorToHistory(
		newColor,
		current.gradientColor1History,
		current.gradientColor1HistoryIndex
	);
	backgroundSettings.update((settings) => ({
		...settings,
		gradientColor1: newColor,
		gradientColor1History: history,
		gradientColor1HistoryIndex: index
	}));
}

export function setGradientColor2(newColor: string) {
	const current = get(backgroundSettings);
	if (current.gradientColor2 === newColor) return;

	const { history, index } = pushColorToHistory(
		newColor,
		current.gradientColor2History,
		current.gradientColor2HistoryIndex
	);
	backgroundSettings.update((settings) => ({
		...settings,
		gradientColor2: newColor,
		gradientColor2History: history,
		gradientColor2HistoryIndex: index
	}));
}

export function randomizeGradientColor1(): string {
	return generateRandomHslColor({ maxLightness: 50 });
}

export function randomizeGradientColor2(): string {
	return generateRandomHslColor({ maxLightness: 50 });
}

export function previousGradientColor1() {
	backgroundSettings.update((settings) => {
		if (settings.gradientColor1HistoryIndex > 0) {
			const newIndex = settings.gradientColor1HistoryIndex - 1;
			return {
				...settings,
				gradientColor1: settings.gradientColor1History[newIndex],
				gradientColor1HistoryIndex: newIndex
			};
		}
		return settings;
	});
}

export function nextGradientColor1() {
	backgroundSettings.update((settings) => {
		if (settings.gradientColor1HistoryIndex < settings.gradientColor1History.length - 1) {
			const newIndex = settings.gradientColor1HistoryIndex + 1;
			return {
				...settings,
				gradientColor1: settings.gradientColor1History[newIndex],
				gradientColor1HistoryIndex: newIndex
			};
		}
		return settings;
	});
}

export function previousGradientColor2() {
	backgroundSettings.update((settings) => {
		if (settings.gradientColor2HistoryIndex > 0) {
			const newIndex = settings.gradientColor2HistoryIndex - 1;
			return {
				...settings,
				gradientColor2: settings.gradientColor2History[newIndex],
				gradientColor2HistoryIndex: newIndex
			};
		}
		return settings;
	});
}

export function nextGradientColor2() {
	backgroundSettings.update((settings) => {
		if (settings.gradientColor2HistoryIndex < settings.gradientColor2History.length - 1) {
			const newIndex = settings.gradientColor2HistoryIndex + 1;
			return {
				...settings,
				gradientColor2: settings.gradientColor2History[newIndex],
				gradientColor2HistoryIndex: newIndex
			};
		}
		return settings;
	});
}

export function resetBackgroundSettingsToDefaults() {
	backgroundSettings.set({
		...defaultBackgroundSettings,
		gradientColor1History: [...defaultBackgroundSettings.gradientColor1History],
		gradientColor2History: [...defaultBackgroundSettings.gradientColor2History]
	});
}

export function toggleAutoCycleColor1() {
	backgroundSettings.update((settings) => ({
		...settings,
		isAutoCyclingColor1: !settings.isAutoCyclingColor1
	}));
}

export function toggleAutoCycleColor2() {
	backgroundSettings.update((settings) => ({
		...settings,
		isAutoCyclingColor2: !settings.isAutoCyclingColor2
	}));
}
