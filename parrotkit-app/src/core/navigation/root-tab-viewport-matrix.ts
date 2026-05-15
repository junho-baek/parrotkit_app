import {
  rootPasteActionHref,
  rootTabHrefs,
  type RootTabName,
  rootTabNames,
} from './root-tab-config';
import {
  getRootTabBarLayout,
  type RootTabBarPlatform,
} from './root-tab-safe-area';

export type RootBottomNavQaViewport = {
  bottomInset: number;
  deviceName: string;
  expectedCenterAction: Extract<RootTabName, 'source'>;
  expectedPasteFlowHref: typeof rootPasteActionHref;
  expectedRoutes: typeof rootTabHrefs;
  expectedVisibleTabs: typeof rootTabNames;
  hasDisplayCutout: boolean;
  height: number;
  id: string;
  navigationMode: 'android-gesture' | 'android-navigation-bar' | 'ios-home-indicator';
  platform: Extract<RootTabBarPlatform, 'android' | 'ios'>;
  requiredChecks: readonly RootBottomNavQaCheck[];
  width: number;
};

export type RootBottomNavQaCheck =
  | 'five-slot-nav-visible'
  | 'center-paste-prominent'
  | 'paste-opens-reference-drawer'
  | 'home-root-does-not-unmatch'
  | 'tab-route-mapping'
  | 'safe-area-bottom-clearance';

export const rootBottomNavQaViewports = [
  {
    bottomInset: 34,
    deviceName: 'iPhone 13 mini',
    expectedCenterAction: 'source',
    expectedPasteFlowHref: rootPasteActionHref,
    expectedRoutes: rootTabHrefs,
    expectedVisibleTabs: rootTabNames,
    hasDisplayCutout: true,
    height: 812,
    id: 'ios-iphone-13-mini-safe-area',
    navigationMode: 'ios-home-indicator',
    platform: 'ios',
    requiredChecks: [
      'five-slot-nav-visible',
      'center-paste-prominent',
      'paste-opens-reference-drawer',
      'home-root-does-not-unmatch',
      'tab-route-mapping',
      'safe-area-bottom-clearance',
    ],
    width: 375,
  },
  {
    bottomInset: 34,
    deviceName: 'iPhone 15',
    expectedCenterAction: 'source',
    expectedPasteFlowHref: rootPasteActionHref,
    expectedRoutes: rootTabHrefs,
    expectedVisibleTabs: rootTabNames,
    hasDisplayCutout: true,
    height: 852,
    id: 'ios-iphone-15-safe-area',
    navigationMode: 'ios-home-indicator',
    platform: 'ios',
    requiredChecks: [
      'five-slot-nav-visible',
      'center-paste-prominent',
      'paste-opens-reference-drawer',
      'home-root-does-not-unmatch',
      'tab-route-mapping',
      'safe-area-bottom-clearance',
    ],
    width: 393,
  },
  {
    bottomInset: 0,
    deviceName: 'Pixel 8 gesture navigation',
    expectedCenterAction: 'source',
    expectedPasteFlowHref: rootPasteActionHref,
    expectedRoutes: rootTabHrefs,
    expectedVisibleTabs: rootTabNames,
    hasDisplayCutout: false,
    height: 915,
    id: 'android-pixel-8-gesture',
    navigationMode: 'android-gesture',
    platform: 'android',
    requiredChecks: [
      'five-slot-nav-visible',
      'center-paste-prominent',
      'paste-opens-reference-drawer',
      'home-root-does-not-unmatch',
      'tab-route-mapping',
      'safe-area-bottom-clearance',
    ],
    width: 412,
  },
  {
    bottomInset: 24,
    deviceName: 'Galaxy compact navigation bar',
    expectedCenterAction: 'source',
    expectedPasteFlowHref: rootPasteActionHref,
    expectedRoutes: rootTabHrefs,
    expectedVisibleTabs: rootTabNames,
    hasDisplayCutout: false,
    height: 800,
    id: 'android-galaxy-compact-navigation-bar',
    navigationMode: 'android-navigation-bar',
    platform: 'android',
    requiredChecks: [
      'five-slot-nav-visible',
      'center-paste-prominent',
      'paste-opens-reference-drawer',
      'home-root-does-not-unmatch',
      'tab-route-mapping',
      'safe-area-bottom-clearance',
    ],
    width: 360,
  },
] as const satisfies readonly RootBottomNavQaViewport[];

export function getRootBottomNavQaViewportLayout(viewport: RootBottomNavQaViewport) {
  return getRootTabBarLayout({
    bottomInset: viewport.bottomInset,
    platform: viewport.platform,
  });
}
