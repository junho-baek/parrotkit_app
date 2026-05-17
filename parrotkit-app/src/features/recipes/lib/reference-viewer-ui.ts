import type { AppLanguage } from "@/core/i18n/app-language";
import type { ShootBoardCut } from "@/features/recipes/lib/shoot-board-model";

type ReferenceViewerCutLike = Pick<
  ShootBoardCut,
  "id" | "order" | "role" | "timeRangeLabel" | "title" | "titleKo"
> & {
  roleLabel?: ShootBoardCut["roleLabel"];
};

export type ReferenceViewerHeaderModel = {
  meta: string;
  title: string;
};

export type ReferenceViewerRailItem = {
  accessibilityLabel: string;
  active: boolean;
  cutId: string;
  order: number;
  visibleLabel: string;
};

export function getReferenceViewerHeader({
  cut,
  language,
}: {
  cut: ReferenceViewerCutLike;
  language: AppLanguage;
}): ReferenceViewerHeaderModel {
  const rawTitle =
    language === "ko" ? cut.titleKo || cut.title : cut.title || cut.titleKo;
  const title = isStructuralCutTitle(rawTitle)
    ? getReferenceExecutionTitle(cut, language)
    : rawTitle;

  return {
    meta: cut.timeRangeLabel.trim(),
    title: title.trim(),
  };
}

function isStructuralCutTitle(title: string) {
  return /^(Cut|컷)\s*#?\d+\s*:/.test(title.trim());
}

function getReferenceExecutionTitle(
  cut: ReferenceViewerCutLike,
  language: AppLanguage,
) {
  const titles = {
    en: {
      cta: "End with the save line",
      hook: "Open on the finished look",
      proof: "Show the proof close-up",
      scene: "Film the repeatable steps",
    },
    ko: {
      cta: "저장하고 싶게 마무리하기",
      hook: "완성된 결과 먼저 보여주기",
      proof: "증거 장면 클로즈업",
      scene: "따라 할 순서 촬영하기",
    },
  } as const;

  if (cut.role === "custom") {
    return cut.roleLabel?.trim() || (language === "ko" ? "직접 구성" : "Custom");
  }

  return titles[language][cut.role] ?? (language === "ko" ? cut.titleKo : cut.title);
}

export function getReferenceViewerRailItems({
  activeCutId,
  cuts,
  language,
}: {
  activeCutId: string;
  cuts: ReferenceViewerCutLike[];
  language: AppLanguage;
}): ReferenceViewerRailItem[] {
  return [...cuts]
    .sort((first, second) => first.order - second.order)
    .map((cut) => ({
      accessibilityLabel: getRailAccessibilityLabel({
        cutOrder: cut.order,
        language,
        timeRangeLabel: cut.timeRangeLabel,
      }),
      active: cut.id === activeCutId,
      cutId: cut.id,
      order: cut.order,
      visibleLabel: String(cut.order),
    }));
}

function getRailAccessibilityLabel({
  cutOrder,
  language,
  timeRangeLabel,
}: {
  cutOrder: number;
  language: AppLanguage;
  timeRangeLabel: string;
}) {
  const compactTimeRangeLabel = timeRangeLabel.trim();
  const baseLabel =
    language === "ko"
      ? `${cutOrder}번 컷 레퍼런스 열기`
      : `Open reference for cut ${cutOrder}`;

  return compactTimeRangeLabel
    ? `${baseLabel}, ${compactTimeRangeLabel}`
    : baseLabel;
}
