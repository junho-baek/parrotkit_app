import {
  getRootTabBarLayout,
  rootTabBarCenterActionDiameter,
  rootTabBarCenterActionFrameHeight,
  rootTabBarCenterActionTopOffset,
  rootTabBarContentHeight,
  rootTabBarHorizontalPadding,
  rootTabBarMinBottomPadding,
  rootTabBarTopPadding,
} from './root-tab-safe-area';

const iosHomeIndicatorLayout = getRootTabBarLayout({
  bottomInset: 34,
  platform: 'ios',
});

if (iosHomeIndicatorLayout.height !== rootTabBarContentHeight + 34) {
  throw new Error('iOS tab bar height must include the home indicator inset exactly once.');
}

if (iosHomeIndicatorLayout.paddingBottom !== 34) {
  throw new Error('iOS tab bar bottom padding must preserve the safe-area inset when it is larger than the minimum.');
}

if (iosHomeIndicatorLayout.paddingTop !== rootTabBarTopPadding) {
  throw new Error('iOS tab bar top padding should keep regular tabs vertically centered under the raised Paste action.');
}

if (iosHomeIndicatorLayout.paddingHorizontal !== rootTabBarHorizontalPadding) {
  throw new Error('Root tab bar horizontal padding must keep the five nav slots off the screen edge.');
}

const androidGestureLayout = getRootTabBarLayout({
  bottomInset: 0,
  platform: 'android',
});

if (androidGestureLayout.height !== rootTabBarContentHeight + rootTabBarMinBottomPadding) {
  throw new Error('Android tab bar height must keep minimum bottom gesture padding even when no inset is reported.');
}

if (androidGestureLayout.paddingBottom !== rootTabBarMinBottomPadding) {
  throw new Error('Android tab bar bottom padding must not collapse into the system gesture area.');
}

const androidInsetLayout = getRootTabBarLayout({
  bottomInset: 24,
  platform: 'android',
});

if (androidInsetLayout.height !== rootTabBarContentHeight + 24) {
  throw new Error('Android tab bar height must expand for devices that report a bottom navigation inset.');
}

if (androidInsetLayout.paddingBottom !== 24) {
  throw new Error('Android tab bar bottom padding must use the reported inset when larger than the minimum.');
}

const invalidInsetLayout = getRootTabBarLayout({
  bottomInset: -12,
  platform: 'ios',
});

if (invalidInsetLayout.paddingBottom !== rootTabBarMinBottomPadding) {
  throw new Error('Root tab bar layout must clamp invalid bottom insets to the minimum gesture padding.');
}

if (rootTabBarCenterActionDiameter !== 64) {
  throw new Error('Paste center action should remain a stable 64px primary tab affordance.');
}

if (rootTabBarCenterActionFrameHeight < rootTabBarCenterActionDiameter + 16) {
  throw new Error('Paste center action frame must reserve room for the circular CTA and compact label.');
}

if (rootTabBarCenterActionTopOffset >= 0) {
  throw new Error('Paste center action should rise out of the tab bar instead of sitting flat with regular tabs.');
}

if (rootTabBarContentHeight + rootTabBarCenterActionTopOffset < rootTabBarCenterActionDiameter / 2) {
  throw new Error('Tab bar content height must keep the raised Paste action visually anchored to the container.');
}
