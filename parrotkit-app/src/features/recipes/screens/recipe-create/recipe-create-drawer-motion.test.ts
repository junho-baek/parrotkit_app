import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const screenSource = readFileSync(
  resolve(__dirname, '../recipe-create-screen.tsx'),
  'utf8'
);
const stylesSource = readFileSync(
  resolve(__dirname, 'recipe-create-styles.ts'),
  'utf8'
);

const requiredScreenSnippets = [
  "import { ComponentProps, useEffect, useRef, useState } from 'react';",
  'Animated.Value(0)',
  'Easing.out(Easing.cubic)',
  'duration: 280',
  'outputRange: [56, 0]',
  'transform: [{ translateY: sheetTranslateY }]',
  'paddingBottom: Math.max(insets.bottom + 18, 28)',
];

for (const snippet of requiredScreenSnippets) {
  if (!screenSource.includes(snippet)) {
    throw new Error(
      `Recipe create drawer motion contract missing screen snippet: ${snippet}`
    );
  }
}

const requiredStyleSnippets = [
  'backdrop: {',
  "backgroundColor: 'rgba(0, 0, 0, 0.72)'",
  'sheetMotion: {',
  "backgroundColor: 'transparent'",
];

for (const snippet of requiredStyleSnippets) {
  if (!stylesSource.includes(snippet)) {
    throw new Error(
      `Recipe create drawer motion contract missing style snippet: ${snippet}`
    );
  }
}
