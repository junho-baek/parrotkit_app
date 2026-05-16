import {
  getHomeContinueCardTextLayout,
  getHomeCreateEntryBottomClearance,
  getHomeCreateEntryTextLayout,
  getHomeRecipeCardContentWidth,
  getHomeScrollBottomPadding,
  getHomeSectionHeaderTextLayout,
  getHomeSavedTakeRowTextLayout,
} from './home-layout';

const compactPadding = getHomeScrollBottomPadding(0);
const homeIndicatorPadding = getHomeScrollBottomPadding(34);

if (compactPadding < 188) {
  throw new Error('Home needs enough bottom padding to keep the lower Create recipe entry above the tab bar on compact phones.');
}

if (homeIndicatorPadding !== compactPadding + 34) {
  throw new Error('Home bottom padding should preserve safe-area bottom inset exactly once.');
}

if (homeIndicatorPadding < 222) {
  throw new Error('Home needs home-indicator-aware bottom padding so Create recipe does not clip behind native tabs.');
}

const iphoneCreateEntryClearance = getHomeCreateEntryBottomClearance({
  bottomInset: 34,
  tabBarHeight: 83,
});

if (
  iphoneCreateEntryClearance.visibleClearance <
  iphoneCreateEntryClearance.requiredClearance
) {
  throw new Error('iPhone Home needs enough visible clearance for the full Create recipe entry above the native tab bar.');
}

const androidCreateEntryClearance = getHomeCreateEntryBottomClearance({
  bottomInset: 0,
  tabBarHeight: 68,
});

if (
  androidCreateEntryClearance.visibleClearance <
  androidCreateEntryClearance.requiredClearance
) {
  throw new Error('Android Home needs enough visible clearance for the full Create recipe entry above the native tab bar.');
}

const compactRecipeCardContentWidth = getHomeRecipeCardContentWidth({
  contentHorizontalPadding: 20,
  screenWidth: 375,
});

if (compactRecipeCardContentWidth < 136) {
  throw new Error('Compact iPhone recipe card title width should model the two-column Home card layout.');
}

const compactSavedTakeRowTextLayout = getHomeSavedTakeRowTextLayout({
  screenWidth: 375,
});

if (compactSavedTakeRowTextLayout.availablePrimaryTextWidth < 160) {
  throw new Error('Home saved-take rows need enough compact width for recipe title and cut description text.');
}

if (compactSavedTakeRowTextLayout.trailingMetadataWidth > 58) {
  throw new Error('Home saved-take trailing metadata should stay compact so list text does not clip.');
}

const representativeHomeViewports = [
  {
    bottomInset: 34,
    minContinueTitleWidth: 160,
    minCreateLabelWidth: 210,
    minHeaderWidth: 230,
    minRecipeCardContentWidth: 136,
    minSavedTakePrimaryWidth: 160,
    name: 'iPhone compact Home viewport',
    screenWidth: 375,
    tabBarHeight: 83,
  },
  {
    bottomInset: 0,
    minContinueTitleWidth: 145,
    minCreateLabelWidth: 195,
    minHeaderWidth: 220,
    minRecipeCardContentWidth: 130,
    minSavedTakePrimaryWidth: 145,
    name: 'Android compact Home viewport',
    screenWidth: 360,
    tabBarHeight: 68,
  },
] as const;

for (const viewport of representativeHomeViewports) {
  const clearance = getHomeCreateEntryBottomClearance({
    bottomInset: viewport.bottomInset,
    tabBarHeight: viewport.tabBarHeight,
  });

  if (clearance.visibleClearance < clearance.requiredClearance) {
    throw new Error(`${viewport.name} should keep the lower Create recipe entry fully above the native tab bar.`);
  }

  const headerLayout = getHomeSectionHeaderTextLayout({
    screenWidth: viewport.screenWidth,
  });

  if (headerLayout.availableHeadingWidth < viewport.minHeaderWidth) {
    throw new Error(`${viewport.name} should leave enough heading width for Home section titles without clipping.`);
  }

  const continueLayout = getHomeContinueCardTextLayout({
    screenWidth: viewport.screenWidth,
  });

  if (continueLayout.availableTitleWidth < viewport.minContinueTitleWidth) {
    throw new Error(`${viewport.name} should leave enough Continue-card title width for two-line recipe copy.`);
  }

  const recipeCardContentWidth = getHomeRecipeCardContentWidth({
    screenWidth: viewport.screenWidth,
  });

  if (recipeCardContentWidth < viewport.minRecipeCardContentWidth) {
    throw new Error(`${viewport.name} should keep two-column recipe card title text above the compact clipping threshold.`);
  }

  const savedTakeLayout = getHomeSavedTakeRowTextLayout({
    screenWidth: viewport.screenWidth,
  });

  if (savedTakeLayout.availablePrimaryTextWidth < viewport.minSavedTakePrimaryWidth) {
    throw new Error(`${viewport.name} should leave enough saved-take row width for title and cut text.`);
  }

  const createEntryLayout = getHomeCreateEntryTextLayout({
    screenWidth: viewport.screenWidth,
  });

  if (createEntryLayout.availableLabelWidth < viewport.minCreateLabelWidth) {
    throw new Error(`${viewport.name} should leave enough lower Create recipe label width without clipping.`);
  }
}
