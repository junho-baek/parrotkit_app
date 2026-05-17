import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const source = readFileSync(resolve(__dirname, 'profile-screen.tsx'), 'utf8');

const forbiddenCopyOrComponents = [
  'proSection',
  'proStatusTitle',
  'proStatusBody',
  'savedTakeLocal',
  'listCard',
  'EmptyState',
  'Start filming',
  '촬영 시작',
  'profile.bio',
  'focusTags',
];

for (const value of forbiddenCopyOrComponents) {
  if (source.includes(value)) {
    throw new Error(`My page should not keep AI-slop profile/list UI: ${value}`);
  }
}

if (source.includes('rounded-[28px] border') || source.includes('rounded-[26px] border')) {
  throw new Error('My page should not wrap primary sections in bordered cards.');
}

if (!source.includes('profile.name')) {
  throw new Error('My page should keep the profile name as the primary heading.');
}

if (!source.includes('profileCopy.savedRecipesSection')) {
  throw new Error('My page should keep saved recipes as a direct section.');
}

if (!source.includes('profileCopy.savedTakesSection')) {
  throw new Error('My page should keep saved takes as a direct section.');
}
