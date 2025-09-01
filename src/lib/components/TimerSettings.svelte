<script lang="ts">
	import { timerSettings } from '$lib/stores/timerStore';
	import { backgroundSettings, resetBackgroundSettingsToDefaults } from '$lib/stores/backgroundSettingsStore';
	import type { TimerSettings as TimerSettingsType } from '$lib/stores/timerStore';
	
	// Local Timer Settings State
	let localWorkDuration = $timerSettings.workDuration / 60;
	let localShortBreakDuration = $timerSettings.shortBreakDuration / 60;
	let localLongBreakDuration = $timerSettings.longBreakDuration / 60;
	let localSessionsBeforeLongBreak = $timerSettings.sessionsBeforeLongBreak;
	let localAutoCycle = $timerSettings.autoCycle;
	
	// Local Background Settings State
	let localIsFloatingEnabled = $backgroundSettings.isFloatingEnabled;
	
	// Update Timer Settings store when local values change
	$: {
		const newTimerSettings: TimerSettingsType = {
			workDuration: Math.max(1, localWorkDuration) * 60,
			shortBreakDuration: Math.max(1, localShortBreakDuration) * 60,
			longBreakDuration: Math.max(1, localLongBreakDuration) * 60,
			sessionsBeforeLongBreak: Math.max(1, localSessionsBeforeLongBreak),
			autoCycle: localAutoCycle
		};
		if (
			$timerSettings.workDuration !== newTimerSettings.workDuration ||
			$timerSettings.shortBreakDuration !== newTimerSettings.shortBreakDuration ||
			$timerSettings.longBreakDuration !== newTimerSettings.longBreakDuration ||
			$timerSettings.sessionsBeforeLongBreak !== newTimerSettings.sessionsBeforeLongBreak ||
			$timerSettings.autoCycle !== newTimerSettings.autoCycle
		) {
			timerSettings.set(newTimerSettings);
		}
	}
	
	// Update Background Settings store when local values change
	$: if ($backgroundSettings.isFloatingEnabled !== localIsFloatingEnabled) {
		backgroundSettings.update((currentSettings) => ({
			...currentSettings,
			isFloatingEnabled: localIsFloatingEnabled
		}));
	}
	
	// Subscribe to Timer Settings store for external changes
	timerSettings.subscribe((settings) => {
		if (settings.workDuration / 60 !== localWorkDuration)
			localWorkDuration = settings.workDuration / 60;
		if (settings.shortBreakDuration / 60 !== localShortBreakDuration)
			localShortBreakDuration = settings.shortBreakDuration / 60;
		if (settings.longBreakDuration / 60 !== localLongBreakDuration)
			localLongBreakDuration = settings.longBreakDuration / 60;
		if (settings.sessionsBeforeLongBreak !== localSessionsBeforeLongBreak)
			localSessionsBeforeLongBreak = settings.sessionsBeforeLongBreak;
		if (settings.autoCycle !== localAutoCycle) localAutoCycle = settings.autoCycle;
	});
	
	// Subscribe to Background Settings store for external changes
	backgroundSettings.subscribe((settings) => {
		if (settings.isFloatingEnabled !== localIsFloatingEnabled) {
			localIsFloatingEnabled = settings.isFloatingEnabled;
		}
	});
	
	// Reset function
	function handleResetDefaults() {
		resetBackgroundSettingsToDefaults();
		// Reset timer settings to defaults
		timerSettings.set({
			workDuration: 25 * 60,
			shortBreakDuration: 5 * 60,
			longBreakDuration: 15 * 60,
			sessionsBeforeLongBreak: 4,
			autoCycle: false
		});
	}
</script>

<div class="timer-settings-panel">
	<h3 class="panel-title">Timer Settings</h3>
	
	<div class="settings-grid">
		<div class="setting-item">
			<label for="work-duration" class="setting-label">
				Work (min)
			</label>
			<input
				id="work-duration"
				type="number"
				bind:value={localWorkDuration}
				min="1"
				max="120"
				class="setting-input"
			/>
		</div>
		<div class="setting-item">
			<label for="short-break-duration" class="setting-label">
				Short Break (min)
			</label>
			<input
				id="short-break-duration"
				type="number"
				bind:value={localShortBreakDuration}
				min="1"
				max="60"
				class="setting-input"
			/>
		</div>
		<div class="setting-item">
			<label for="long-break-duration" class="setting-label">
				Long Break (min)
			</label>
			<input
				id="long-break-duration"
				type="number"
				bind:value={localLongBreakDuration}
				min="1"
				max="120"
				class="setting-input"
			/>
		</div>
		<div class="setting-item">
			<label for="sessions-before-long-break" class="setting-label">
				Sessions Before Long Break
			</label>
			<input
				id="sessions-before-long-break"
				type="number"
				bind:value={localSessionsBeforeLongBreak}
				min="1"
				max="10"
				class="setting-input"
			/>
		</div>
	</div>
	
	<div class="toggles-section">
		<div class="toggle-item">
			<label for="auto-cycle" class="toggle-label">
				Auto-cycle sessions
			</label>
			<input
				id="auto-cycle"
				type="checkbox"
				bind:checked={localAutoCycle}
				class="toggle-input"
			/>
		</div>

		<div class="toggle-item">
			<label for="floating-enabled" class="toggle-label">
				Enable floating effects
			</label>
			<input
				id="floating-enabled"
				type="checkbox"
				bind:checked={localIsFloatingEnabled}
				class="toggle-input"
			/>
		</div>
	</div>

	<button
		type="button"
		on:click={handleResetDefaults}
		class="reset-button"
	>
		Reset to Defaults
	</button>
</div>

<style>
	.timer-settings-panel {
		background: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 12px;
		padding: 20px;
		width: 320px;
		color: white;
	}

	.panel-title {
		text-align: center;
		font-size: 18px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.9);
		margin-bottom: 24px;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.settings-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;
		margin-bottom: 24px;
	}

	.setting-item {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.setting-label {
		font-size: 13px;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.7);
		text-align: left;
	}

	.setting-input {
		width: 100%;
		padding: 10px 12px;
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 10px;
		color: white;
		font-size: 14px;
		font-weight: 500;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		outline: none;
	}

	.setting-input:hover {
		background: rgba(255, 255, 255, 0.12);
		border-color: rgba(255, 255, 255, 0.25);
	}

	.setting-input:focus {
		background: rgba(255, 255, 255, 0.15);
		border-color: rgba(59, 130, 246, 0.6);
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
	}

	.toggles-section {
		display: flex;
		flex-direction: column;
		gap: 16px;
		margin-bottom: 24px;
		padding: 20px;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.toggle-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.toggle-label {
		font-size: 14px;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.8);
	}

	.toggle-input {
		width: 44px;
		height: 24px;
		appearance: none;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 12px;
		position: relative;
		cursor: pointer;
		transition: background 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		flex-shrink: 0;
	}

	.toggle-input::before {
		content: '';
		position: absolute;
		top: 2px;
		left: 2px;
		width: 20px;
		height: 20px;
		background: white;
		border-radius: 10px;
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	.toggle-input:checked {
		background: rgba(59, 130, 246, 0.6);
	}

	.toggle-input:checked::before {
		transform: translateX(20px);
	}

	.reset-button {
		width: 100%;
		padding: 12px 16px;
		background: linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0.2));
		border: 1px solid rgba(239, 68, 68, 0.6);
		border-radius: 12px;
		color: #f87171;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.reset-button:hover {
		background: linear-gradient(135deg, rgba(239, 68, 68, 0.4), rgba(239, 68, 68, 0.3));
		border-color: rgba(239, 68, 68, 0.8);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
	}

	.reset-button:active {
		transform: translateY(0);
		transition-duration: 0.1s;
	}

	/* Custom number input styles to hide spinners */
	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	input[type='number'] {
		-moz-appearance: textfield;
	}

	/* Mobile adjustments */
	@media (max-width: 480px) {
		.timer-settings-panel {
			min-width: 320px;
			padding: 20px;
		}
		
		.settings-grid {
			gap: 12px;
		}
		
		.panel-title {
			font-size: 16px;
		}
	}
</style>