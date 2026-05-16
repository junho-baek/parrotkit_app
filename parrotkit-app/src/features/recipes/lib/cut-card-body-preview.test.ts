import { getCutCardBodyPreviewRows } from "./cut-card-body-preview";
import type { ShootBoardCut } from "./shoot-board-model";

const cut = {
  hook: "Start with the visible payoff before any context.",
  instruction: "Legacy hook fallback.",
  lineToSay: "This is the line the creator should say while filming.",
  shotAction: "Show the product in hand, then tilt toward the final result.",
  shootingGuideline: "Legacy action fallback.",
  speakingLine: "Legacy line fallback.",
} as ShootBoardCut;

const rows = getCutCardBodyPreviewRows(cut, "en");

if (rows.map((row) => row.id).join(",") !== "lineToSay,shotAction") {
  throw new Error(
    "Collapsed cut-card body should preview Line to Say and Shot guide only.",
  );
}

if (rows.map((row) => row.label).join(",") !== "Line to Say,Shot guide") {
  throw new Error(
    "Collapsed cut-card body should expose English labels for each preview row.",
  );
}

if (
  rows[0]?.value !==
  "This is the line the creator should say while filming."
) {
  throw new Error("Line to Say preview should read the cut-card lineToSay field.");
}

if (
  rows[1]?.value !==
  "Show the product in hand, then tilt toward the final result."
) {
  throw new Error("Shot guide preview should read the cut-card shotAction field.");
}

if (rows.some((row) => row.numberOfLines < 1 || row.numberOfLines > 2)) {
  throw new Error("Collapsed cut-card preview rows should be limited to 1-2 lines.");
}

const koreanRows = getCutCardBodyPreviewRows(cut, "ko");

if (koreanRows.map((row) => row.label).join(",") !== "말할 문장,촬영 가이드") {
  throw new Error(
    "Collapsed cut-card body should expose Korean labels for each preview row.",
  );
}

const fallbackCut = {
  hook: "",
  instruction: "Use the legacy hook fallback.",
  lineToSay: "",
  shotAction: "",
  shootingGuideline: "Use the legacy action fallback.",
  speakingLine: "Use the legacy line fallback.",
} as ShootBoardCut;

const fallbackRows = getCutCardBodyPreviewRows(fallbackCut, "en");

if (fallbackRows[0]?.value !== "Use the legacy line fallback.") {
  throw new Error("Line preview should fall back to the legacy speaking line.");
}

if (fallbackRows[1]?.value !== "Use the legacy action fallback.") {
  throw new Error("Action preview should fall back to the legacy shooting guideline.");
}
