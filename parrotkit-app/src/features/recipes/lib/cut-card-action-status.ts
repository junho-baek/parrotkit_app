import type { AppLanguage } from "@/core/i18n/app-language";
import type { ShootBoardCut } from "@/features/recipes/lib/shoot-board-model";

export type CutCardActionStatusTone =
  | "empty"
  | "saved"
  | "final"
  | "needs_reshoot";

export type CutCardActionStatus = {
  ctaLabel: string;
  statusTone: CutCardActionStatusTone;
};

export function getCutCardActionStatus(
  cut: ShootBoardCut,
  language: AppLanguage,
): CutCardActionStatus {
  const statusTone = getActionStatusTone(cut);
  const hasTake = statusTone !== "empty";

  return {
    ctaLabel: getCtaLabel(statusTone, language),
    statusTone,
  };

  function getCtaLabel(
    tone: CutCardActionStatusTone,
    currentLanguage: AppLanguage,
  ) {
    if (currentLanguage === "ko") {
      if (tone === "needs_reshoot") return "재촬영";
      return hasTake ? "다시 촬영" : "촬영";
    }

    return hasTake ? "Reshoot" : "Film";
  }
}

function getActionStatusTone(cut: ShootBoardCut): CutCardActionStatusTone {
  if (cut.takeStatus === "final") return "final";
  if (cut.takeStatus === "needs_reshoot") return "needs_reshoot";
  if (cut.takes.length > 0 || cut.takeStatus === "saved") return "saved";
  return "empty";
}
