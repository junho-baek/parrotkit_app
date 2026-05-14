import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const profileScreenPath = resolve(__dirname, '../screens/profile-screen.tsx');
const profileScreenSource = readFileSync(profileScreenPath, 'utf8');

assert.match(
  profileScreenSource,
  /<Text className="text-\[18px\] font-black text-ink">\{profileCopy\.settingsSection\}<\/Text>/,
  'The My/Profile screen must expose the localized Settings section heading.'
);

assert.match(
  profileScreenSource,
  /<LanguageOption[\s\S]*label=\{profileCopy\.english\}[\s\S]*language="en"[\s\S]*\/>/,
  'The Settings entry point must include the English language option.'
);

assert.match(
  profileScreenSource,
  /<LanguageOption[\s\S]*label=\{profileCopy\.korean\}[\s\S]*language="ko"[\s\S]*\/>/,
  'The Settings entry point must include the Korean language option.'
);

const appLanguagePath = resolve(__dirname, '../../../core/i18n/app-language.tsx');
const appLanguageSource = readFileSync(appLanguagePath, 'utf8');

assert.match(
  appLanguageSource,
  /settingsSection: 'Settings'/,
  'English profile copy must keep the Settings label.'
);

assert.match(
  appLanguageSource,
  /settingsSection: '설정'/,
  'Korean profile copy must keep the Settings label.'
);
