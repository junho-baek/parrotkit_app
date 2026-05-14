import {
  DEFAULT_PROMPTER_TEXT_SIZE_LEVEL,
  resolvePrompterTextSizeLevel,
  type PrompterTextSizeLevel,
} from './prompter-text-size';
import type { PrompterDisplayMode } from './prompter-display';

export type PrompterPlaybackStatus = 'idle' | 'playing' | 'paused';
export type PrompterSpeedSetting = 'slow' | 'normal' | 'fast';

export type PrompterModeState = {
  playbackStatus: PrompterPlaybackStatus;
  scrollOffset: number;
  speedSetting: PrompterSpeedSetting;
  textSizeLevel: PrompterTextSizeLevel;
};

export type PrompterModeStateByMode = Record<PrompterDisplayMode, PrompterModeState>;

export type PrompterModeSettingsUpdate = Partial<Pick<PrompterModeState, 'speedSetting' | 'textSizeLevel'>>;
export type PrompterModeMaxOffsets = Partial<Record<PrompterDisplayMode, number>>;

export type PrompterModeSwitchState = {
  restoredModeState: PrompterModeState;
  restoredScrollOffset: number;
  state: PrompterModeStateByMode;
};

export const DEFAULT_PROMPTER_MODE_STATE: PrompterModeState = {
  playbackStatus: 'idle',
  scrollOffset: 0,
  speedSetting: 'normal',
  textSizeLevel: DEFAULT_PROMPTER_TEXT_SIZE_LEVEL,
};

const PROMPTER_SPEED_SETTINGS: PrompterSpeedSetting[] = ['slow', 'normal', 'fast'];

function copyDefaultPrompterModeState(): PrompterModeState {
  return { ...DEFAULT_PROMPTER_MODE_STATE };
}

function clampPrompterModeScrollOffset(scrollOffset: number, maxOffset: number) {
  if (!Number.isFinite(scrollOffset)) return 0;

  return Math.min(Math.max(0, scrollOffset), Math.max(0, maxOffset));
}

function resolvePrompterSpeedSetting(speedSetting: unknown): PrompterSpeedSetting {
  return typeof speedSetting === 'string' && PROMPTER_SPEED_SETTINGS.includes(speedSetting as PrompterSpeedSetting)
    ? speedSetting as PrompterSpeedSetting
    : DEFAULT_PROMPTER_MODE_STATE.speedSetting;
}

function resolvePrompterPlaybackStatus(playbackStatus: unknown): PrompterPlaybackStatus {
  return playbackStatus === 'playing' || playbackStatus === 'paused' || playbackStatus === 'idle'
    ? playbackStatus
    : DEFAULT_PROMPTER_MODE_STATE.playbackStatus;
}

export function createPrompterModeStateByMode(
  overrides: Partial<Record<PrompterDisplayMode, Partial<PrompterModeState>>> = {}
): PrompterModeStateByMode {
  return {
    card: {
      ...copyDefaultPrompterModeState(),
      ...overrides.card,
      playbackStatus: resolvePrompterPlaybackStatus(overrides.card?.playbackStatus),
      scrollOffset: clampPrompterModeScrollOffset(overrides.card?.scrollOffset ?? 0, Number.MAX_SAFE_INTEGER),
      speedSetting: resolvePrompterSpeedSetting(overrides.card?.speedSetting),
      textSizeLevel: resolvePrompterTextSizeLevel(overrides.card?.textSizeLevel),
    },
    'full-script': {
      ...copyDefaultPrompterModeState(),
      ...overrides['full-script'],
      playbackStatus: resolvePrompterPlaybackStatus(overrides['full-script']?.playbackStatus),
      scrollOffset: clampPrompterModeScrollOffset(
        overrides['full-script']?.scrollOffset ?? 0,
        Number.MAX_SAFE_INTEGER
      ),
      speedSetting: resolvePrompterSpeedSetting(overrides['full-script']?.speedSetting),
      textSizeLevel: resolvePrompterTextSizeLevel(overrides['full-script']?.textSizeLevel),
    },
  };
}

export function getPrompterModeState(
  state: Partial<PrompterModeStateByMode> | null | undefined,
  mode: PrompterDisplayMode
): PrompterModeState {
  return createPrompterModeStateByMode(state ?? {})[mode];
}

export function persistPrompterModeScrollOffset({
  maxOffset,
  mode,
  scrollOffset,
  state,
}: {
  maxOffset: number;
  mode: PrompterDisplayMode;
  scrollOffset: number;
  state: PrompterModeStateByMode;
}): PrompterModeStateByMode {
  return {
    ...state,
    [mode]: {
      ...getPrompterModeState(state, mode),
      scrollOffset: clampPrompterModeScrollOffset(scrollOffset, maxOffset),
    },
  };
}

export function persistPrompterModePlaybackStatus({
  mode,
  playbackStatus,
  state,
}: {
  mode: PrompterDisplayMode;
  playbackStatus: PrompterPlaybackStatus;
  state: PrompterModeStateByMode;
}): PrompterModeStateByMode {
  return {
    ...state,
    [mode]: {
      ...getPrompterModeState(state, mode),
      playbackStatus: resolvePrompterPlaybackStatus(playbackStatus),
    },
  };
}

export function persistPrompterModeSettings({
  mode,
  settings,
  state,
}: {
  mode: PrompterDisplayMode;
  settings: PrompterModeSettingsUpdate;
  state: PrompterModeStateByMode;
}): PrompterModeStateByMode {
  const currentModeState = getPrompterModeState(state, mode);

  return {
    ...state,
    [mode]: {
      ...currentModeState,
      speedSetting: settings.speedSetting
        ? resolvePrompterSpeedSetting(settings.speedSetting)
        : currentModeState.speedSetting,
      textSizeLevel: settings.textSizeLevel
        ? resolvePrompterTextSizeLevel(settings.textSizeLevel)
        : currentModeState.textSizeLevel,
    },
  };
}

export function resolvePrompterModeSwitchState({
  currentMaxOffset,
  currentMode,
  currentScrollOffset,
  modeMaxOffsets,
  requestedMode,
  state,
}: {
  currentMaxOffset: number;
  currentMode: PrompterDisplayMode;
  currentScrollOffset: number;
  modeMaxOffsets?: PrompterModeMaxOffsets;
  requestedMode: PrompterDisplayMode;
  state: PrompterModeStateByMode;
}): PrompterModeSwitchState {
  const stateWithOutgoingOffset = persistPrompterModeScrollOffset({
    maxOffset: currentMaxOffset,
    mode: currentMode,
    scrollOffset: currentScrollOffset,
    state,
  });
  const requestedModeState = getPrompterModeState(stateWithOutgoingOffset, requestedMode);
  const requestedModeMaxOffset = modeMaxOffsets?.[requestedMode];
  const restoredScrollOffset = clampPrompterModeScrollOffset(
    requestedModeState.scrollOffset,
    typeof requestedModeMaxOffset === 'number' ? requestedModeMaxOffset : Number.MAX_SAFE_INTEGER
  );

  return {
    restoredModeState: {
      ...requestedModeState,
      scrollOffset: restoredScrollOffset,
    },
    restoredScrollOffset,
    state: restoredScrollOffset === requestedModeState.scrollOffset
      ? stateWithOutgoingOffset
      : persistPrompterModeScrollOffset({
        maxOffset: requestedModeMaxOffset ?? 0,
        mode: requestedMode,
        scrollOffset: restoredScrollOffset,
        state: stateWithOutgoingOffset,
      }),
  };
}
