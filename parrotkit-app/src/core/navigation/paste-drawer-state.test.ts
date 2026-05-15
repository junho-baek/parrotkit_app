import {
  getNextPasteDrawerOpenState,
  getNextPasteDrawerState,
  initialPasteDrawerState,
} from './paste-drawer-state';

if (getNextPasteDrawerOpenState(false, 'open') !== true) {
  throw new Error('Paste drawer open action must show the drawer shell.');
}

if (getNextPasteDrawerOpenState(true, 'close') !== false) {
  throw new Error('Paste drawer close action must hide the drawer shell.');
}

if (getNextPasteDrawerOpenState(true, 'created') !== false) {
  throw new Error('Creating a recipe from Paste must close the drawer shell before navigation.');
}

if (getNextPasteDrawerOpenState(false, 'created') !== false) {
  throw new Error('Created action must keep a closed Paste drawer closed.');
}

const openedState = getNextPasteDrawerState(initialPasteDrawerState, 'open');

if (!openedState.open || openedState.resetVersion !== 0) {
  throw new Error('Paste drawer open action must start the first visible drawer session.');
}

const repeatedOpenState = getNextPasteDrawerState(openedState, 'open');

if (repeatedOpenState.resetVersion !== openedState.resetVersion) {
  throw new Error('Pressing Paste while open must not reset the active paste input session.');
}

const dismissedState = getNextPasteDrawerState(openedState, 'dismiss');

if (dismissedState.open || dismissedState.resetVersion !== 1) {
  throw new Error('Dismissing Paste must close the drawer and advance the next-session reset key.');
}

const reopenedState = getNextPasteDrawerState(dismissedState, 'open');

if (!reopenedState.open || reopenedState.resetVersion !== dismissedState.resetVersion) {
  throw new Error('Reopening Paste after dismiss must show a fresh drawer without changing the reset key mid-open.');
}

const createdState = getNextPasteDrawerState(reopenedState, 'created');

if (createdState.open || createdState.resetVersion !== 2) {
  throw new Error('Creating from Paste must close the drawer and reset local paste state for the next open.');
}

const closedDismissState = getNextPasteDrawerState(createdState, 'dismiss');

if (closedDismissState.open || closedDismissState.resetVersion !== createdState.resetVersion) {
  throw new Error('Dismissing an already closed Paste drawer must not advance the reset key.');
}
