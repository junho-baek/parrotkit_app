export const rootTabBarContentHeight = 66;
export const rootTabBarMinBottomPadding = 10;
export const rootTabBarTopPadding = 10;
export const rootTabBarHorizontalPadding = 6;
export const rootTabBarCenterActionDiameter = 64;
export const rootTabBarCenterActionFrameHeight = 82;
export const rootTabBarCenterActionTopOffset = -26;

export type RootTabBarPlatform = 'android' | 'ios' | 'web' | 'windows' | 'macos';

export function getRootTabBarLayout({
  bottomInset,
  platform,
}: {
  bottomInset: number;
  platform: RootTabBarPlatform;
}): {
  height: number;
  paddingHorizontal: number;
  paddingBottom: number;
  paddingTop: number;
} {
  const safeBottomInset = Number.isFinite(bottomInset) ? Math.max(bottomInset, 0) : 0;
  const paddingBottom = Math.max(safeBottomInset, rootTabBarMinBottomPadding);

  return {
    height: rootTabBarContentHeight + paddingBottom,
    paddingHorizontal: rootTabBarHorizontalPadding,
    paddingBottom,
    paddingTop: rootTabBarTopPadding,
  };
}
