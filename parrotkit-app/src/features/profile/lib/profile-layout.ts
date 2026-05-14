const PROFILE_SCROLL_BASE_BOTTOM_PADDING = 196;

export function getProfileScrollBottomPadding(bottomInset: number): number {
  return PROFILE_SCROLL_BASE_BOTTOM_PADDING + bottomInset;
}
