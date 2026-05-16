export const rootDestinationTabNames = ['index', 'explore', 'recipes', 'my'] as const;
export const rootPasteActionName = 'paste' as const;
export const rootTabNames = ['index', 'explore', 'paste', 'recipes', 'my'] as const;
export const hiddenRootTabNames = [] as const;
export const rootPasteActionHref = '/recipe-create?mode=reference' as const;
export const rootTabMinimumTouchTarget = 48;
export const rootTabHrefs = {
  index: '/',
  explore: '/explore',
  paste: null,
  recipes: '/recipes',
  my: '/my',
} as const satisfies Record<(typeof rootTabNames)[number], string | null>;
export const rootDestinationTabHrefs = {
  index: '/',
  explore: '/explore',
  recipes: '/recipes',
  my: '/my',
} as const satisfies Record<(typeof rootDestinationTabNames)[number], string>;
export const rootTabAccessibilityRoles = {
  index: 'tab',
  explore: 'tab',
  paste: 'button',
  recipes: 'tab',
  my: 'tab',
} as const satisfies Record<(typeof rootTabNames)[number], 'button' | 'tab'>;

export type RootDestinationTabName = (typeof rootDestinationTabNames)[number];
export type RootPasteActionName = typeof rootPasteActionName;
export type RootTabName = (typeof rootTabNames)[number];
export type HiddenRootTabName = (typeof hiddenRootTabNames)[number];
