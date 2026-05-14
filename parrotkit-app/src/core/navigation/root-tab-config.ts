export const rootTabNames = ['index', 'explore', 'my'] as const;

export type RootTabName = (typeof rootTabNames)[number];
