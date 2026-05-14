import {
  DEFAULT_PROMPTER_MODE_STATE,
  createPrompterModeStateByMode,
  getPrompterModeState,
  persistPrompterModeScrollOffset,
  persistPrompterModeSettings,
  persistPrompterModePlaybackStatus,
  resolvePrompterModeSwitchState,
} from './prompter-mode-state';

const initialState = createPrompterModeStateByMode();

if (initialState.card.scrollOffset !== 0 || initialState['full-script'].scrollOffset !== 0) {
  throw new Error('Prompter mode state should initialize each mode with an independent scroll offset.');
}

if (
  initialState.card.playbackStatus !== DEFAULT_PROMPTER_MODE_STATE.playbackStatus ||
  initialState.card.speedSetting !== DEFAULT_PROMPTER_MODE_STATE.speedSetting
) {
  throw new Error('Prompter mode state should initialize playback and speed settings from the default contract.');
}

const cardScrolledState = persistPrompterModeScrollOffset({
  maxOffset: 240,
  mode: 'card',
  scrollOffset: 112,
  state: initialState,
});
const fullScriptScrolledState = persistPrompterModeScrollOffset({
  maxOffset: 400,
  mode: 'full-script',
  scrollOffset: 320,
  state: cardScrolledState,
});

if (getPrompterModeState(fullScriptScrolledState, 'card').scrollOffset !== 112) {
  throw new Error('Prompter should preserve the current cut scroll offset while full script mode changes.');
}

if (getPrompterModeState(fullScriptScrolledState, 'full-script').scrollOffset !== 320) {
  throw new Error('Prompter should restore the full script scroll offset when switching back to full script mode.');
}

const clampedState = persistPrompterModeScrollOffset({
  maxOffset: 180,
  mode: 'full-script',
  scrollOffset: 900,
  state: fullScriptScrolledState,
});

if (getPrompterModeState(clampedState, 'full-script').scrollOffset !== 180) {
  throw new Error('Prompter mode scroll persistence should clamp stale offsets to the available script height.');
}

const pausedCardState = persistPrompterModePlaybackStatus({
  mode: 'card',
  playbackStatus: 'paused',
  state: clampedState,
});

if (getPrompterModeState(pausedCardState, 'card').playbackStatus !== 'paused') {
  throw new Error('Prompter should preserve playback status per display mode.');
}

if (getPrompterModeState(pausedCardState, 'full-script').playbackStatus !== 'idle') {
  throw new Error('Changing one prompter mode playback status should not overwrite the other mode.');
}

const settingsState = persistPrompterModeSettings({
  mode: 'full-script',
  settings: {
    speedSetting: 'fast',
    textSizeLevel: 'xl',
  },
  state: pausedCardState,
});

const fullScriptState = getPrompterModeState(settingsState, 'full-script');

if (fullScriptState.speedSetting !== 'fast' || fullScriptState.textSizeLevel !== 'xl') {
  throw new Error('Prompter should preserve speed and reading settings for each mode.');
}

if (getPrompterModeState(settingsState, 'card').speedSetting !== 'normal') {
  throw new Error('Prompter mode settings should remain independent between current cut and full script.');
}

const modeSwitchState = resolvePrompterModeSwitchState({
  currentMaxOffset: 120,
  currentMode: 'card',
  currentScrollOffset: 88,
  modeMaxOffsets: {
    card: 120,
  },
  requestedMode: 'full-script',
  state: persistPrompterModeScrollOffset({
    maxOffset: 800,
    mode: 'full-script',
    scrollOffset: 420,
    state: settingsState,
  }),
});

if (getPrompterModeState(modeSwitchState.state, 'card').scrollOffset !== 88) {
  throw new Error('Prompter mode switch should preserve the outgoing in-flow prompter scroll position.');
}

if (modeSwitchState.restoredScrollOffset !== 420) {
  throw new Error('Prompter mode switch should not clamp the selected mode to the outgoing mode height.');
}

if (modeSwitchState.restoredModeState.textSizeLevel !== 'xl') {
  throw new Error('Prompter mode switch should restore the selected mode reading settings immediately.');
}

const playingCardToPausedFullScriptState = resolvePrompterModeSwitchState({
  currentMaxOffset: 600,
  currentMode: 'card',
  currentScrollOffset: 333,
  modeMaxOffsets: {
    card: 600,
    'full-script': 1200,
  },
  requestedMode: 'full-script',
  state: persistPrompterModeScrollOffset({
    maxOffset: 1200,
    mode: 'full-script',
    scrollOffset: 740,
    state: persistPrompterModePlaybackStatus({
      mode: 'full-script',
      playbackStatus: 'paused',
      state: persistPrompterModePlaybackStatus({
        mode: 'card',
        playbackStatus: 'playing',
        state: settingsState,
      }),
    }),
  }),
});

if (getPrompterModeState(playingCardToPausedFullScriptState.state, 'card').playbackStatus !== 'playing') {
  throw new Error('Switching modes while playing should preserve the outgoing mode playback status.');
}

if (getPrompterModeState(playingCardToPausedFullScriptState.state, 'card').scrollOffset !== 333) {
  throw new Error('Switching modes while playing should save the outgoing manually scrolled position.');
}

if (playingCardToPausedFullScriptState.restoredModeState.playbackStatus !== 'paused') {
  throw new Error('Switching into a paused mode should restore the paused playback status.');
}

if (playingCardToPausedFullScriptState.restoredScrollOffset !== 740) {
  throw new Error('Switching into a paused mode should restore that mode manual scroll position.');
}

const manuallyScrolledBackToPlayingCardState = resolvePrompterModeSwitchState({
  currentMaxOffset: 1200,
  currentMode: 'full-script',
  currentScrollOffset: 812,
  modeMaxOffsets: {
    card: 600,
    'full-script': 1200,
  },
  requestedMode: 'card',
  state: playingCardToPausedFullScriptState.state,
});

if (getPrompterModeState(manuallyScrolledBackToPlayingCardState.state, 'full-script').playbackStatus !== 'paused') {
  throw new Error('Switching away from a paused mode should preserve its paused playback status.');
}

if (getPrompterModeState(manuallyScrolledBackToPlayingCardState.state, 'full-script').scrollOffset !== 812) {
  throw new Error('Switching away from a manually scrolled paused mode should save its latest scroll position.');
}

if (manuallyScrolledBackToPlayingCardState.restoredModeState.playbackStatus !== 'playing') {
  throw new Error('Switching back should restore the card mode playing playback status.');
}

if (manuallyScrolledBackToPlayingCardState.restoredScrollOffset !== 333) {
  throw new Error('Switching back should restore the card mode manually scrolled position.');
}
