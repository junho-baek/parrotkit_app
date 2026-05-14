import { shootBoardSceneCardLayout } from "@/features/recipes/components/shoot-board-scene-card-layout";

const { collapsedThumbnail, expandedThumbnail } = shootBoardSceneCardLayout;
const titleFirstLayout = shootBoardSceneCardLayout as typeof shootBoardSceneCardLayout & {
  collapsedInstructionLines?: number;
  copyTextClamped?: boolean;
  expandedBodyLeftInset?: number;
  expandedInstructionLines?: number;
  thumbnailPlacement?: string;
};

function assertNineSixteen(name: string, size: { height: number; width: number }) {
  const ratio = size.height / size.width;

  if (Math.abs(ratio - 16 / 9) > 0.02) {
    throw new Error(`${name} should use a 9:16 thumbnail ratio.`);
  }
}

assertNineSixteen("Expanded card", expandedThumbnail);
assertNineSixteen("Collapsed row", collapsedThumbnail);

if (expandedThumbnail.width > 44) {
  throw new Error("Expanded card thumbnail should stay small when placed above the title.");
}

if (collapsedThumbnail.width >= expandedThumbnail.width) {
  throw new Error("Collapsed row thumbnail should be smaller than expanded card thumbnail.");
}

if (titleFirstLayout.thumbnailPlacement !== "above-title") {
  throw new Error("Scene thumbnails should be placed above the title so text keeps full width.");
}

if (titleFirstLayout.expandedBodyLeftInset !== 0) {
  throw new Error("Expanded card content should not be indented away from the left edge.");
}

if ((titleFirstLayout.collapsedInstructionLines ?? 0) < 2) {
  throw new Error("Collapsed card descriptions should allow at least two lines.");
}

if ((titleFirstLayout.expandedInstructionLines ?? 0) < 3) {
  throw new Error("Expanded card descriptions should allow at least three lines.");
}

if (titleFirstLayout.copyTextClamped !== false) {
  throw new Error("Scene titles and descriptions should render without line clamping.");
}
