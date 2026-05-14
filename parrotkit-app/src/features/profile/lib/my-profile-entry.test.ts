import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const myRoutePath = resolve(__dirname, '../../../app/(tabs)/my.tsx');
const myRouteSource = readFileSync(myRoutePath, 'utf8').trim();

assert.equal(
  myRouteSource,
  "export { ProfileScreen as default } from '@/features/profile/screens/profile-screen';",
  'The My tab route must remain the Profile screen entry point.'
);
