import type { ComponentProps } from 'react';
import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { type RootTabName, rootTabNames } from './root-tab-config';

export type RootTabIconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export const rootTabIconNames: Record<
  RootTabName,
  {
    focused: RootTabIconName;
    unfocused: RootTabIconName;
  }
> = {
  index: {
    focused: 'home-variant',
    unfocused: 'home-variant-outline',
  },
  explore: {
    focused: 'compass',
    unfocused: 'compass-outline',
  },
  source: {
    focused: 'link-variant',
    unfocused: 'link-variant',
  },
  recipes: {
    focused: 'book-open-page-variant',
    unfocused: 'book-open-page-variant-outline',
  },
  my: {
    focused: 'account',
    unfocused: 'account-outline',
  },
};

export function getVisibleRootTabName(tabName: string): RootTabName | null {
  return rootTabNames.includes(tabName as RootTabName) ? (tabName as RootTabName) : null;
}

export function getRootTabIcon(tabName: RootTabName, focused: boolean): RootTabIconName {
  const iconNames = rootTabIconNames[tabName];

  return focused ? iconNames.focused : iconNames.unfocused;
}
