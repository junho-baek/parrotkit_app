import type { AppLanguage } from "@/core/i18n/app-language";
import type {
  ShootBoardCut,
  ShootBoardCutTextPatch,
} from "@/features/recipes/lib/shoot-board-model";

export type CutCardEditorFieldId =
  | "hook"
  | "lineToSay"
  | "shotAction"
  | "note";

export type CutCardEditorFieldDefinition = {
  id: CutCardEditorFieldId;
  emptyText: string;
  label: string;
  multiline: true;
  placeholder: string;
  createPatch: (value: string) => ShootBoardCutTextPatch;
};

const cutCardEditorFieldIds: CutCardEditorFieldId[] = [
  "lineToSay",
  "shotAction",
  "hook",
  "note",
];

const fieldCopy = {
  en: {
    hook: {
      emptyText: "No application note yet.",
      label: "Apply to your case",
      placeholder: "Write how this reference structure should work for your case",
    },
    lineToSay: {
      emptyText: "No line to say yet.",
      label: "Line to Say",
      placeholder: "Write the line you will say while shooting",
    },
    note: {
      emptyText: "No note yet.",
      label: "Note",
      placeholder: "Add a memo for timing, tone, or product details",
    },
    shotAction: {
      emptyText: "No shot/action detail yet.",
      label: "Shot guide",
      placeholder: "Describe what should be shown or done on camera",
    },
  },
  ko: {
    hook: {
      emptyText: "아직 적용 메모가 없습니다.",
      label: "내 경우 적용",
      placeholder: "이 레퍼런스 구조를 내 경우에 어떻게 쓸지 입력하세요",
    },
    lineToSay: {
      emptyText: "아직 말할 문장이 없습니다.",
      label: "말할 문장",
      placeholder: "촬영 중 말할 문장을 입력하세요",
    },
    note: {
      emptyText: "아직 메모가 없습니다.",
      label: "메모",
      placeholder: "타이밍, 톤, 제품 디테일 메모를 입력하세요",
    },
    shotAction: {
      emptyText: "아직 촬영 가이드가 없습니다.",
      label: "촬영 가이드",
      placeholder: "카메라에 보여줄 행동이나 화면을 입력하세요",
    },
  },
} satisfies Record<
  AppLanguage,
  Record<
    CutCardEditorFieldId,
    { emptyText: string; label: string; placeholder: string }
  >
>;

export function getCutCardEditorFieldDefinitions(
  language: AppLanguage,
): CutCardEditorFieldDefinition[] {
  return cutCardEditorFieldIds.map((id) => ({
    id,
    emptyText: fieldCopy[language][id].emptyText,
    label: fieldCopy[language][id].label,
    multiline: true,
    placeholder: fieldCopy[language][id].placeholder,
    createPatch: (value) => ({ [id]: value }),
  }));
}

export function getCutCardEditorFieldValue(
  fieldId: CutCardEditorFieldId,
  cut: ShootBoardCut,
) {
  if (fieldId === "hook") return cut.hook ?? cut.instruction;
  if (fieldId === "lineToSay") return cut.lineToSay ?? cut.speakingLine;
  if (fieldId === "shotAction") {
    return cut.shotAction ?? cut.shootingGuideline;
  }

  return cut.note ?? cut.notes ?? cut.purpose;
}
