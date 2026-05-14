import assert from 'node:assert/strict';

import { getProfileScrollBottomPadding } from './profile-layout';

function test(name: string, run: () => void) {
  try {
    run();
    console.log(`ok - ${name}`);
  } catch (error) {
    console.error(`not ok - ${name}`);
    throw error;
  }
}

test('profile scroll padding clears the iPhone home indicator FAB stack', () => {
  assert.equal(getProfileScrollBottomPadding(34), 230);
});

test('profile scroll padding still clears compact iPhones without a home indicator', () => {
  assert.equal(getProfileScrollBottomPadding(0), 196);
});

test('profile scroll padding applies the safe-area inset exactly once', () => {
  const compactPadding = getProfileScrollBottomPadding(0);
  const homeIndicatorPadding = getProfileScrollBottomPadding(34);

  assert.equal(homeIndicatorPadding - compactPadding, 34);
});
