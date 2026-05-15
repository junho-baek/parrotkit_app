const HOME_SCROLL_BASE_BOTTOM_PADDING = 188;
const HOME_CREATE_ENTRY_MIN_HEIGHT = 64;
const HOME_CREATE_ENTRY_MIN_TAB_GAP = 24;
const HOME_SCREEN_HORIZONTAL_PADDING = 20;
const HOME_RECIPE_CARD_WIDTH_RATIO = 0.485;
const HOME_RECIPE_CARD_HORIZONTAL_PADDING = 24;
const HOME_RECIPE_CARD_ACTION_GAP = 8;
const HOME_RECIPE_CARD_ICON_BUTTON_WIDTH = 38;
const HOME_SAVED_TAKE_LIST_HORIZONTAL_PADDING = 24;
const HOME_SAVED_TAKE_ICON_WIDTH = 42;
const HOME_SAVED_TAKE_ROW_GAP = 10;
const HOME_SAVED_TAKE_TRAILING_METADATA_WIDTH = 58;
const HOME_SAVED_TAKE_CHEVRON_WIDTH = 20;
const HOME_SECTION_HEADER_TRAILING_WIDTH = 72;
const HOME_SECTION_HEADER_GAP = 12;
const HOME_CONTINUE_CARD_HORIZONTAL_PADDING = 28;
const HOME_CONTINUE_IMAGE_WIDTH = 92;
const HOME_CONTINUE_ROW_GAP = 12;
const HOME_CONTINUE_CHEVRON_WIDTH = 24;
const HOME_CREATE_ENTRY_HORIZONTAL_PADDING = 28;
const HOME_CREATE_ENTRY_ICON_WIDTH = 42;
const HOME_CREATE_ENTRY_CHEVRON_WIDTH = 22;
const HOME_CREATE_ENTRY_GAP = 12;

export function getHomeScrollBottomPadding(bottomInset: number): number {
  return HOME_SCROLL_BASE_BOTTOM_PADDING + bottomInset;
}

export function getHomeCreateEntryBottomClearance({
  bottomInset,
  createEntryHeight = HOME_CREATE_ENTRY_MIN_HEIGHT,
  tabBarHeight,
}: {
  bottomInset: number;
  createEntryHeight?: number;
  tabBarHeight: number;
}): {
  requiredClearance: number;
  scrollBottomPadding: number;
  visibleClearance: number;
} {
  const scrollBottomPadding = getHomeScrollBottomPadding(bottomInset);

  return {
    requiredClearance: createEntryHeight + HOME_CREATE_ENTRY_MIN_TAB_GAP,
    scrollBottomPadding,
    visibleClearance: scrollBottomPadding - tabBarHeight,
  };
}

export function getHomeRecipeCardContentWidth({
  contentHorizontalPadding = HOME_SCREEN_HORIZONTAL_PADDING,
  screenWidth,
}: {
  contentHorizontalPadding?: number;
  screenWidth: number;
}): number {
  const contentWidth = screenWidth - contentHorizontalPadding * 2;
  const cardOuterWidth = contentWidth * HOME_RECIPE_CARD_WIDTH_RATIO;

  return cardOuterWidth - HOME_RECIPE_CARD_HORIZONTAL_PADDING;
}

export function getHomeRecipeCardActionLayout(): {
  requiredWidth: number;
} {
  return {
    requiredWidth:
      HOME_RECIPE_CARD_ACTION_GAP +
      HOME_RECIPE_CARD_ICON_BUTTON_WIDTH * 2,
  };
}

export function getHomeRecipeCardMetadataLayout({
  contentWidth,
}: {
  contentWidth: number;
}): {
  availableMetadataWidth: number;
} {
  return {
    availableMetadataWidth: contentWidth,
  };
}

export function getHomeSavedTakeRowTextLayout({
  contentHorizontalPadding = HOME_SCREEN_HORIZONTAL_PADDING,
  screenWidth,
}: {
  contentHorizontalPadding?: number;
  screenWidth: number;
}): {
  availablePrimaryTextWidth: number;
  trailingMetadataWidth: number;
} {
  const rowWidth =
    screenWidth -
    contentHorizontalPadding * 2 -
    HOME_SAVED_TAKE_LIST_HORIZONTAL_PADDING;
  const fixedWidth =
    HOME_SAVED_TAKE_ICON_WIDTH +
    HOME_SAVED_TAKE_ROW_GAP * 3 +
    HOME_SAVED_TAKE_TRAILING_METADATA_WIDTH +
    HOME_SAVED_TAKE_CHEVRON_WIDTH;

  return {
    availablePrimaryTextWidth: rowWidth - fixedWidth,
    trailingMetadataWidth: HOME_SAVED_TAKE_TRAILING_METADATA_WIDTH,
  };
}

export function getHomeSectionHeaderTextLayout({
  contentHorizontalPadding = HOME_SCREEN_HORIZONTAL_PADDING,
  screenWidth,
  trailingWidth = HOME_SECTION_HEADER_TRAILING_WIDTH,
}: {
  contentHorizontalPadding?: number;
  screenWidth: number;
  trailingWidth?: number;
}): {
  availableHeadingWidth: number;
} {
  return {
    availableHeadingWidth:
      screenWidth -
      contentHorizontalPadding * 2 -
      trailingWidth -
      HOME_SECTION_HEADER_GAP,
  };
}

export function getHomeContinueCardTextLayout({
  contentHorizontalPadding = HOME_SCREEN_HORIZONTAL_PADDING,
  screenWidth,
}: {
  contentHorizontalPadding?: number;
  screenWidth: number;
}): {
  availableTitleWidth: number;
} {
  const cardInnerWidth =
    screenWidth -
    contentHorizontalPadding * 2 -
    HOME_CONTINUE_CARD_HORIZONTAL_PADDING;
  const fixedWidth =
    HOME_CONTINUE_IMAGE_WIDTH +
    HOME_CONTINUE_CHEVRON_WIDTH +
    HOME_CONTINUE_ROW_GAP * 2;

  return {
    availableTitleWidth: cardInnerWidth - fixedWidth,
  };
}

export function getHomeCreateEntryTextLayout({
  contentHorizontalPadding = HOME_SCREEN_HORIZONTAL_PADDING,
  screenWidth,
}: {
  contentHorizontalPadding?: number;
  screenWidth: number;
}): {
  availableLabelWidth: number;
} {
  const entryInnerWidth =
    screenWidth -
    contentHorizontalPadding * 2 -
    HOME_CREATE_ENTRY_HORIZONTAL_PADDING;
  const fixedWidth =
    HOME_CREATE_ENTRY_ICON_WIDTH +
    HOME_CREATE_ENTRY_CHEVRON_WIDTH +
    HOME_CREATE_ENTRY_GAP * 2;

  return {
    availableLabelWidth: entryInnerWidth - fixedWidth,
  };
}
