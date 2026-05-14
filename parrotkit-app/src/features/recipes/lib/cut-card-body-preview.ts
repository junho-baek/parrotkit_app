import type { AppLanguage } from "@/core/i18n/app-language";
import type { ShootBoardCut } from "@/features/recipes/lib/shoot-board-model";

export type CutCardBodyPreviewRowId = "hook" | "lineToSay" | "shotAction";

export type CutCardBodyPreviewRow = {
  id: CutCardBodyPreviewRowId;
  label: string;
  numberOfLines: 1 | 2;
  value: string;
};

const previewCopy = {
  en: {
    hook: "Hook",
    lineToSay: "Line to Say",
    shotAction: "Shot/Action",
  },
  ko: {
    hook: "훅",
    lineToSay: "말할 문장",
    shotAction: "촬영 동작",
  },
} satisfies Record<AppLanguage, Record<CutCardBodyPreviewRowId, string>>;

export function getCutCardBodyPreviewRows(
  cut: ShootBoardCut,
  language: AppLanguage,
): CutCardBodyPreviewRow[] {
  return [
    {
      id: "hook",
      label: previewCopy[language].hook,
      numberOfLines: 1,
      value: getPreviewValue(cut.hook, cut.instruction),
    },
    {
      id: "lineToSay",
      label: previewCopy[language].lineToSay,
      numberOfLines: 2,
      value: getPreviewValue(cut.lineToSay, cut.speakingLine),
    },
    {
      id: "shotAction",
      label: previewCopy[language].shotAction,
      numberOfLines: 1,
      value: getPreviewValue(cut.shotAction, cut.shootingGuideline),
    },
  ];
}

function getPreviewValue(primary: string | undefined, fallback: string | undefined) {
  return primary?.trim() || fallback?.trim() || "";
}
