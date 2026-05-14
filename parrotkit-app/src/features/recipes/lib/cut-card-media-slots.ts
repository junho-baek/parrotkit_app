import type { ShootBoardMediaSlotStatus } from "@/features/recipes/components/shoot-board-media-slot";
import type { ShootBoardCut } from "@/features/recipes/lib/shoot-board-model";

export type CutCardMediaSlotId = "reference" | "myTake";

export type CutCardMediaSlot = {
  id: CutCardMediaSlotId;
  label: string;
  status: ShootBoardMediaSlotStatus;
  thumbnailUrl?: string;
};

export function getCutCardMediaSlots(cut: ShootBoardCut): CutCardMediaSlot[] {
  return [
    {
      id: "reference",
      label: "Reference",
      status: "saved",
      thumbnailUrl: cut.thumbnailUrl,
    },
    {
      id: "myTake",
      label: "My Take",
      status: getMyTakeSlotStatus(cut),
      thumbnailUrl: cut.takes.length > 0 ? cut.takeThumbnailUrl : undefined,
    },
  ];
}

function getMyTakeSlotStatus(cut: ShootBoardCut): ShootBoardMediaSlotStatus {
  if (cut.takeStatus === "final") return "final";
  if (cut.takeStatus === "needs_reshoot") return "needs_reshoot";
  if (cut.takes.length > 0 || cut.takeStatus === "saved") return "saved";
  return "empty";
}
