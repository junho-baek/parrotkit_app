export const rootTabNames = ['index', 'explore', 'source', 'recipes', 'my'] as const;
export const hiddenRootTabNames = [] as const;
export const rootPasteActionHref = '/recipe-create?mode=reference' as const;
export const rootTabMinimumTouchTarget = 48;
export const rootTabHrefs = {
  index: '/',
  explore: '/explore',
  source: rootPasteActionHref,
  recipes: '/recipes',
  my: '/my',
} as const satisfies Record<(typeof rootTabNames)[number], string>;
export const rootTabAccessibilityRoles = {
  index: 'tab',
  explore: 'tab',
  source: 'button',
  recipes: 'tab',
  my: 'tab',
} as const satisfies Record<(typeof rootTabNames)[number], 'button' | 'tab'>;

export type RootTabName = (typeof rootTabNames)[number];
export type HiddenRootTabName = (typeof hiddenRootTabNames)[number];
