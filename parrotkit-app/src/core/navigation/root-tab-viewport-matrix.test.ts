import {
  rootPasteActionHref,
  rootTabHrefs,
  rootTabNames,
} from './root-tab-config';
import {
  rootTabBarCenterActionDiameter,
  rootTabBarMinBottomPadding,
} from './root-tab-safe-area';
import {
  getRootBottomNavQaViewportLayout,
  rootBottomNavQaViewports,
} from './root-tab-viewport-matrix';

if (rootBottomNavQaViewports.length < 2) {
  throw new Error('Bottom navigation QA matrix must cover both iOS and Android viewports.');
}

const iosSafeAreaViewport = rootBottomNavQaViewports.find(
  (viewport) =>
    viewport.platform === 'ios' &&
    viewport.hasDisplayCutout &&
    viewport.navigationMode === 'ios-home-indicator' &&
    viewport.bottomInset >= 34
);

if (!iosSafeAreaViewport) {
  throw new Error('Bottom navigation QA matrix must include a safe-area/notch iOS device.');
}

const androidGestureViewport = rootBottomNavQaViewports.find(
  (viewport) =>
    viewport.platform === 'android' &&
    viewport.navigationMode === 'android-gesture' &&
    viewport.width >= 360 &&
    viewport.bottomInset === 0
);

if (!androidGestureViewport) {
  throw new Error('Bottom navigation QA matrix must include an Android gesture-navigation-sized viewport.');
}

for (const viewport of rootBottomNavQaViewports) {
  if (viewport.expectedVisibleTabs.join(',') !== rootTabNames.join(',')) {
    throw new Error(`${viewport.id} must verify the production Home, Explore, Paste, Recipes, My tab order.`);
  }

  if (viewport.expectedVisibleTabs.length !== 5) {
    throw new Error(`${viewport.id} must verify exactly five bottom navigation slots.`);
  }

  if (viewport.expectedCenterAction !== 'source') {
    throw new Error(`${viewport.id} must treat Paste/source as the center primary action.`);
  }

  if (viewport.expectedPasteFlowHref !== rootPasteActionHref) {
    throw new Error(`${viewport.id} must verify Paste opens the reference-link recipe creation flow.`);
  }

  if (viewport.expectedRoutes !== rootTabHrefs) {
    throw new Error(`${viewport.id} must use the production root tab route map.`);
  }

  if (viewport.expectedRoutes.index !== '/') {
    throw new Error(`${viewport.id} must verify root/Home opens the canonical Home route.`);
  }

  if (!viewport.requiredChecks.includes('home-root-does-not-unmatch')) {
    throw new Error(`${viewport.id} must include Home/root unmatched-route regression coverage.`);
  }

  if (!viewport.requiredChecks.includes('paste-opens-reference-drawer')) {
    throw new Error(`${viewport.id} must include Paste drawer coverage.`);
  }

  const layout = getRootBottomNavQaViewportLayout(viewport);

  if (layout.paddingBottom < Math.max(viewport.bottomInset, rootTabBarMinBottomPadding)) {
    throw new Error(`${viewport.id} must preserve bottom safe-area or gesture padding.`);
  }

  if (layout.height <= rootTabBarCenterActionDiameter) {
    throw new Error(`${viewport.id} must reserve enough bottom bar height for the prominent Paste action.`);
  }
}
