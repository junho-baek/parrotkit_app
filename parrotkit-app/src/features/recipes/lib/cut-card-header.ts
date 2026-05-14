import type { AppLanguage } from "@/core/i18n/app-language";
import type { ShootBoardCut } from "@/features/recipes/lib/shoot-board-model";

export type CutCardHeaderParts = {
  numberLabel: string;
  roleLabel: string;
};

export function getCutCardHeaderParts(
  cut: ShootBoardCut,
  language: AppLanguage,
): CutCardHeaderParts {
  return {
    numberLabel: language === "ko" ? `컷 #${cut.order}` : `Cut #${cut.order}`,
    roleLabel:
      cut.roleLabel.trim() ||
      (language === "ko" ? "직접 구성" : "Custom"),
  };
}
