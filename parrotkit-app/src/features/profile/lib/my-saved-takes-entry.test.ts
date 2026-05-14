import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  getSavedTakeProfileAccessEntries,
  getSavedTakeProfileDestination,
} from '../../recipes/lib/saved-take-home-access';
import type { SavedRecipeTakeRecord } from '../../recipes/lib/saved-take-storage';

const profileScreenPath = resolve(__dirname, '../screens/profile-screen.tsx');
const profileScreenSource = readFileSync(profileScreenPath, 'utf8');

assert.match(
  profileScreenSource,
  /<Text className="text-\[18px\] font-black text-ink">\{profileCopy\.savedTakesSection\}<\/Text>/,
  'The My/Profile screen must expose the localized Saved Takes section heading.'
);

assert.match(
  profileScreenSource,
  /profileEntries\.savedTakes\.map\(\(take\) => \([\s\S]*<SavedTakeRow[\s\S]*onPress=\{\(\) => openDestination\(take\.destination\)\}[\s\S]*take=\{take\}[\s\S]*\/>/,
  'The Saved Takes section must render saved take rows that reopen their saved-take destination.'
);

assert.match(
  profileScreenSource,
  /profileEntries = getSavedTakeProfileAccessEntries\(\{[\s\S]*recipes,[\s\S]*savedTakes: getSavedRecipeTakes\(\),[\s\S]*\}\)/,
  'The My/Profile screen must derive saved take entries from the shared saved-take access contract.'
);

const savedTake = {
  cardIds: ['cut-toast-hook'],
  cards: [
    {
      hook: 'Open with the toast reveal.',
      id: 'cut-toast-hook',
      lineToSay: 'Here is the fastest toast payoff.',
      note: 'Keep it tight.',
      order: 2,
      role: 'hook',
      shotAction: 'Show the finished toast.',
      title: 'Toast payoff hook',
    },
  ],
  createdAtIso: '2026-05-14T10:00:00.000Z',
  dataSource: 'local_mock',
  exportStatus: 'local',
  isFinalTake: true,
  label: 'Take 2',
  recordedAtLabel: 'Just now',
  recipeId: 'recipe toast/1',
  recipeTitle: 'Toast Recipe',
  sceneId: 'scene-toast-hook',
  sceneTitle: 'Toast payoff hook',
  takeId: 'take toast/2',
  takeStatus: 'final',
  uri: 'file:///tmp/toast-take.mov',
} satisfies SavedRecipeTakeRecord;

assert.equal(
  getSavedTakeProfileDestination(savedTake),
  '/recipe/recipe%20toast%2F1?sceneId=cut-toast-hook&takeId=take%20toast%2F2',
  'The My/Profile saved take destination must target the saved recipe cut and selected take.'
);

const profileEntries = getSavedTakeProfileAccessEntries({
  recipes: [],
  savedTakes: [savedTake],
});

assert.equal(
  profileEntries.savedTakes[0]?.destination,
  '/recipe/recipe%20toast%2F1?sceneId=cut-toast-hook&takeId=take%20toast%2F2',
  'The My/Profile saved take entry must reopen the selected take.'
);

assert.equal(
  profileEntries.savedTakes[0]?.cutOrder,
  2,
  'The My/Profile saved take entry should preserve cut order context for the row label.'
);

const appLanguagePath = resolve(__dirname, '../../../core/i18n/app-language.tsx');
const appLanguageSource = readFileSync(appLanguagePath, 'utf8');

assert.match(
  appLanguageSource,
  /savedTakesSection: 'Saved takes'/,
  'English profile copy must keep the Saved takes label.'
);

assert.match(
  appLanguageSource,
  /savedTakesSection: '저장한 테이크'/,
  'Korean profile copy must keep the Saved Takes label.'
);
