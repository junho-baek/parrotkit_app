import type { AppLanguage } from "@/core/i18n/app-language";
import type { ShootBoardCut } from "@/features/recipes/lib/shoot-board-model";

const executionTitles = {
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

export function getCutCardExecutionTitle(
  cut: ShootBoardCut,
  language: AppLanguage,
) {
  if (cut.role === "custom") {
    return (
      cut.roleLabel.trim() || (language === "ko" ? "직접 구성" : "Custom")
    );
  }

  return executionTitles[language][cut.role];
}
