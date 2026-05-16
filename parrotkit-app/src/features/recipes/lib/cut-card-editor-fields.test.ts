import {
  getCutCardEditorFieldDefinitions,
  getCutCardEditorFieldValue,
} from "./cut-card-editor-fields";
import type { ShootBoardCut } from "./shoot-board-model";

const fields = getCutCardEditorFieldDefinitions("en");
const fieldIds = fields.map((field) => field.id);
const koreanFields = getCutCardEditorFieldDefinitions("ko");
const koreanLabels = koreanFields.map((field) => field.label);
const emptyTexts = fields.map((field) => field.emptyText);
const koreanEmptyTexts = koreanFields.map((field) => field.emptyText);

if (fieldIds.join(",") !== "lineToSay,shotAction,hook,note") {
  throw new Error(
    "Cut-card editor should expose Line to Say, Shot guide, Apply to your case, and Note in order.",
  );
}

if (fields.some((field) => field.multiline !== true)) {
  throw new Error("Every cut-card editor field should support multiline input.");
}

if (koreanLabels.join(",") !== "말할 문장,촬영 가이드,내 경우 적용,메모") {
  throw new Error(
    "Korean cut-card editor labels should render as 말할 문장, 촬영 가이드, 내 경우 적용, 메모.",
  );
}

if (
  emptyTexts.join("|") !==
  "No line to say yet.|No shot/action detail yet.|No application note yet.|No note yet."
) {
  throw new Error(
    "Cut-card detail fields should expose read-only empty states for every v1 field.",
  );
}

if (
  koreanEmptyTexts.join("|") !==
  "아직 말할 문장이 없습니다.|아직 촬영 가이드가 없습니다.|아직 적용 메모가 없습니다.|아직 메모가 없습니다."
) {
  throw new Error(
    "Korean cut-card detail fields should expose localized read-only empty states.",
  );
}

const patches = Object.fromEntries(
  fields.map((field) => [field.id, field.createPatch(`Edited ${field.id}`)]),
);

if (patches.hook?.hook !== "Edited hook") {
  throw new Error("Hook editor field should patch the hook field.");
}

if (patches.lineToSay?.lineToSay !== "Edited lineToSay") {
  throw new Error("Line to Say editor field should patch the lineToSay field.");
}

if (patches.shotAction?.shotAction !== "Edited shotAction") {
  throw new Error("Shot/Action editor field should patch the shotAction field.");
}

if (patches.note?.note !== "Edited note") {
  throw new Error("Note editor field should patch the note field.");
}

const cut = {
  hook: "Start with the visible payoff.",
  instruction: "Legacy hook fallback.",
  lineToSay: "This is the line to say.",
  note: "Keep the final claim specific.",
  purpose: "Legacy note fallback.",
  shotAction: "Show the product in hand.",
  shootingGuideline: "Legacy shot fallback.",
  speakingLine: "Legacy line fallback.",
} as ShootBoardCut;

if (
  getCutCardEditorFieldValue("hook", cut) !== "Start with the visible payoff."
) {
  throw new Error("Hook editor value should read the cut-card hook field.");
}

if (
  getCutCardEditorFieldValue("lineToSay", cut) !==
  "This is the line to say."
) {
  throw new Error(
    "Line to Say editor value should read the cut-card lineToSay field.",
  );
}

if (
  getCutCardEditorFieldValue("shotAction", cut) !==
  "Show the product in hand."
) {
  throw new Error(
    "Shot/Action editor value should read the cut-card shotAction field.",
  );
}

if (
  getCutCardEditorFieldValue("note", cut) !== "Keep the final claim specific."
) {
  throw new Error("Note editor value should read the cut-card note field.");
}
