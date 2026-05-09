import { shootBoardSceneCardLayout } from "@/features/recipes/components/shoot-board-scene-card-layout";

const { collapsedThumbnail, expandedThumbnail } = shootBoardSceneCardLayout;

function assertNineSixteen(name: string, size: { height: number; width: number }) {
  const ratio = size.height / size.width;

  if (Math.abs(ratio - 16 / 9) > 0.02) {
    throw new Error(`${name} should use a 9:16 thumbnail ratio.`);
  }
}

assertNineSixteen("Expanded card", expandedThumbnail);
assertNineSixteen("Collapsed row", collapsedThumbnail);

if (expandedThumbnail.width < 60) {
  throw new Error("Expanded card thumbnail should be large enough to read as UGC media.");
}

if (collapsedThumbnail.width >= expandedThumbnail.width) {
  throw new Error("Collapsed row thumbnail should be smaller than expanded card thumbnail.");
}
