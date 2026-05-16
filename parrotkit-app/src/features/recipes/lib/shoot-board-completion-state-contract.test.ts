import {
  getShootBoardCutCompletionState,
  type ShootBoardCut,
} from "../../../domain/shoot-board/shoot-board-model";

const checkedChecklistCut = {
  finalTakeId: undefined,
  requiredChecklist: [
    { checked: true, id: "line", label: "Line ready", labelKo: "문장 준비" },
    { checked: true, id: "guide", label: "Guide ready", labelKo: "가이드 준비" },
  ],
  takeStatus: "none",
  takes: [],
} as unknown as ShootBoardCut;

if (getShootBoardCutCompletionState(checkedChecklistCut) !== "partial") {
  throw new Error("Checklist-only completion should remain partial until My Take exists.");
}

const savedTakeCut = {
  ...checkedChecklistCut,
  requiredChecklist: checkedChecklistCut.requiredChecklist.map((item) => ({
    ...item,
    checked: false,
  })),
  takeStatus: "saved",
  takes: [{ durationSeconds: 5, id: "take-1", label: "Take 1", recordedAtLabel: "Now", status: "saved" }],
} as unknown as ShootBoardCut;

if (getShootBoardCutCompletionState(savedTakeCut) !== "complete") {
  throw new Error("A saved My Take should complete the cut.");
}

const reshootCut = {
  ...savedTakeCut,
  takeStatus: "needs_reshoot",
} as unknown as ShootBoardCut;

if (getShootBoardCutCompletionState(reshootCut) !== "partial") {
  throw new Error("A needs-reshoot My Take should be partial, not complete.");
}
