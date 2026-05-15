export type PasteDrawerAction = 'open' | 'close' | 'dismiss' | 'created';

export type PasteDrawerState = {
  open: boolean;
  resetVersion: number;
};

export const initialPasteDrawerState: PasteDrawerState = {
  open: false,
  resetVersion: 0,
};

export function getNextPasteDrawerState(
  currentState: PasteDrawerState,
  action: PasteDrawerAction
): PasteDrawerState {
  if (action === 'open') {
    return currentState.open ? currentState : { ...currentState, open: true };
  }

  if (!currentState.open) {
    return { ...currentState, open: false };
  }

  return {
    open: false,
    resetVersion: currentState.resetVersion + 1,
  };
}

export function getNextPasteDrawerOpenState(
  currentOpen: boolean,
  action: PasteDrawerAction
) {
  return getNextPasteDrawerState(
    { open: currentOpen, resetVersion: 0 },
    action
  ).open;
}
