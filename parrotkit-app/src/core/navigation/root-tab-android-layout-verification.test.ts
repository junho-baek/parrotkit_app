import {
  rootTabMinimumTouchTarget,
  rootTabNames,
} from './root-tab-config';
import {
  rootTabBarCenterActionDiameter,
  rootTabBarCenterActionTopOffset,
  rootTabBarContentHeight,
  rootTabBarMinBottomPadding,
  rootTabBarTopPadding,
} from './root-tab-safe-area';
import {
  getRootBottomNavQaViewportLayout,
  rootBottomNavQaViewports,
} from './root-tab-viewport-matrix';

const androidViewports = rootBottomNavQaViewports.filter(
  (viewport) => viewport.platform === 'android'
);

if (androidViewports.length < 2) {
  throw new Error('Android bottom navigation verification must cover multiple representative Android viewports.');
}

const centerTabIndex = rootTabNames.indexOf('source');

if (centerTabIndex !== 2) {
  throw new Error('Paste must remain the centered third slot in the five-tab bottom navigation.');
}

for (const viewport of androidViewports) {
  const layout = getRootBottomNavQaViewportLayout(viewport);
  const horizontalContentWidth = viewport.width - layout.paddingHorizontal * 2;
  const slotWidth = horizontalContentWidth / rootTabNames.length;
  const slotCenters = rootTabNames.map(
    (_tabName, index) => layout.paddingHorizontal + slotWidth * index + slotWidth / 2
  );
  const centerX = slotCenters[centerTabIndex];
  const expectedCenterX = viewport.width / 2;
  const centerOffset = Math.abs(centerX - expectedCenterX);

  if (!viewport.navigationMode.startsWith('android-')) {
    throw new Error(`${viewport.id} must represent Android gesture/navigation bar behavior.`);
  }

  if (slotWidth < rootTabMinimumTouchTarget) {
    throw new Error(`${viewport.id} must keep each nav slot at least ${rootTabMinimumTouchTarget}px wide.`);
  }

  if (layout.height < rootTabBarTopPadding + rootTabMinimumTouchTarget + layout.paddingBottom) {
    throw new Error(`${viewport.id} must reserve vertical room for tap targets plus gesture padding.`);
  }

  if (layout.paddingBottom < rootTabBarMinBottomPadding) {
    throw new Error(`${viewport.id} must keep minimum bottom clearance near Android gesture/navigation areas.`);
  }

  if (layout.paddingBottom !== Math.max(viewport.bottomInset, rootTabBarMinBottomPadding)) {
    throw new Error(`${viewport.id} must use the larger of reported Android inset and minimum gesture padding.`);
  }

  if (layout.height !== rootTabBarContentHeight + layout.paddingBottom) {
    throw new Error(`${viewport.id} tab bar height must be content height plus Android bottom clearance.`);
  }

  if (centerOffset > 0.5) {
    throw new Error(`${viewport.id} Paste center action must be visually centered in the viewport.`);
  }

  if (rootTabBarCenterActionDiameter < rootTabMinimumTouchTarget * 1.25) {
    throw new Error(`${viewport.id} Paste action must be visibly larger than neighboring tab targets.`);
  }

  if (slotWidth < rootTabBarCenterActionDiameter) {
    throw new Error(`${viewport.id} center slot must fit the prominent Paste circle without squeezing neighbors.`);
  }

  for (let index = 1; index < slotCenters.length; index += 1) {
    const spacing = slotCenters[index] - slotCenters[index - 1];

    if (Math.abs(spacing - slotWidth) > 0.5) {
      throw new Error(`${viewport.id} nav item spacing must remain even across all five slots.`);
    }
  }

  const firstTargetLeft = slotCenters[0] - rootTabMinimumTouchTarget / 2;
  const lastTargetRight = slotCenters[slotCenters.length - 1] + rootTabMinimumTouchTarget / 2;

  if (firstTargetLeft < layout.paddingHorizontal || lastTargetRight > viewport.width - layout.paddingHorizontal) {
    throw new Error(`${viewport.id} edge tab tap targets must stay inside the padded bottom bar.`);
  }

  const pasteTargetTop = layout.paddingTop + Math.min(0, rootTabBarCenterActionTopOffset);
  const pasteTargetBottom = pasteTargetTop + rootTabBarCenterActionDiameter;

  if (pasteTargetBottom > layout.height - layout.paddingBottom + rootTabBarCenterActionDiameter / 2) {
    throw new Error(`${viewport.id} Paste action must stay visually anchored above Android gesture clearance.`);
  }
}
