import type { AppLanguage } from "@/core/i18n/app-language";
import type { ShootBoardCut } from "@/features/recipes/lib/shoot-board-model";

export type CutCardReferenceSourceKind = "attached" | "linked" | "empty";

export type CutCardReferenceViewerSection = {
  body: string;
  mediaUrl?: string | number;
  primaryActionLabel: string;
  sourceKind: CutCardReferenceSourceKind;
  statusLabel: string;
  thumbnailUrl?: string;
  title: string;
};

const copy: Record<
  AppLanguage,
  {
    attachedBody: string;
    attachedStatus: string;
    emptyBody: string;
    emptyStatus: string;
    linkedBody: string;
    linkedStatus: string;
    primaryAction: string;
    title: string;
  }
> = {
  en: {
    attachedBody: "Use the attached frame as the visual guide for this cut.",
    attachedStatus: "Attached reference",
    emptyBody: "Add or link reference media later without blocking this recipe.",
    emptyStatus: "No reference",
    linkedBody: "Open the linked reference clip and compare the beat before shooting.",
    linkedStatus: "Linked reference",
    primaryAction: "View reference",
    title: "Reference viewer",
  },
  ko: {
    attachedBody: "첨부된 프레임을 이 컷의 촬영 기준으로 확인하세요.",
    attachedStatus: "첨부 레퍼런스",
    emptyBody: "레퍼런스가 없어도 레시피 작성과 촬영을 계속할 수 있어요.",
    emptyStatus: "레퍼런스 없음",
    linkedBody: "연결된 레퍼런스 클립을 열어 촬영 전 박자를 비교하세요.",
    linkedStatus: "연결된 레퍼런스",
    primaryAction: "레퍼런스 보기",
    title: "Reference viewer",
  },
};

export function getCutCardReferenceViewerSection(
  cut: ShootBoardCut,
  language: AppLanguage,
): CutCardReferenceViewerSection {
  const localizedCopy = copy[language];
  const thumbnailUrl = cut.thumbnailUrl || undefined;

  if (cut.referenceVideoUrl) {
    return {
      body: localizedCopy.linkedBody,
      mediaUrl: cut.referenceVideoUrl,
      primaryActionLabel: localizedCopy.primaryAction,
      sourceKind: "linked",
      statusLabel: localizedCopy.linkedStatus,
      thumbnailUrl,
      title: localizedCopy.title,
    };
  }

  if (thumbnailUrl) {
    return {
      body: localizedCopy.attachedBody,
      primaryActionLabel: localizedCopy.primaryAction,
      sourceKind: "attached",
      statusLabel: localizedCopy.attachedStatus,
      thumbnailUrl,
      title: localizedCopy.title,
    };
  }

  return {
    body: localizedCopy.emptyBody,
    primaryActionLabel: localizedCopy.primaryAction,
    sourceKind: "empty",
    statusLabel: localizedCopy.emptyStatus,
    title: localizedCopy.title,
  };
}
