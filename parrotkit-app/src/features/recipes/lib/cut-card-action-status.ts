import type { AppLanguage } from "@/core/i18n/app-language";
import type { ShootBoardCut } from "@/features/recipes/lib/shoot-board-model";

export type CutCardActionStatusTone =
  | "empty"
  | "saved"
  | "final"
  | "needs_reshoot";

export type CutCardActionStatus = {
  ctaLabel: string;
  statusLabel: string;
  statusTone: CutCardActionStatusTone;
  takeCountLabel: string;
};

export function getCutCardActionStatus(
  cut: ShootBoardCut,
  language: AppLanguage,
): CutCardActionStatus {
  const statusTone = getActionStatusTone(cut);
  const hasTake = statusTone !== "empty";

  return {
    ctaLabel: getCtaLabel(statusTone, language),
    statusLabel: getStatusLabel(statusTone, language),
    statusTone,
    takeCountLabel: formatTakeCount(cut.takes.length, language),
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

function getStatusLabel(
  tone: CutCardActionStatusTone,
  language: AppLanguage,
) {
  if (language === "ko") {
    if (tone === "final") return "최종 테이크";
    if (tone === "needs_reshoot") return "재촬영 필요";
    if (tone === "saved") return "테이크 저장됨";
    return "아직 테이크 없음";
  }

  if (tone === "final") return "Final take";
  if (tone === "needs_reshoot") return "Needs retake";
  if (tone === "saved") return "Take saved";
  return "No take yet";
}

function formatTakeCount(count: number, language: AppLanguage) {
  if (language === "ko") return `${count}개 테이크`;
  return `${count} ${count === 1 ? "take" : "takes"}`;
}
