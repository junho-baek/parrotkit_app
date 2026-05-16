import type { AppLanguage } from "@/core/i18n/app-language";
import type { NativeRecipe } from "@/features/recipes/types/recipe-domain";

export type RecipeBreakdownSectionId =
  | "summary"
  | "idea"
  | "hook"
  | "story"
  | "visual"
  | "evidence";

export type RecipeBreakdownSection = {
  body: string;
  id: RecipeBreakdownSectionId;
  title: string;
};

export type RecipeBreakdownSummary = {
  applyToYourShoot: RecipeBreakdownSection;
  hook: RecipeBreakdownSection;
  primaryTabLabel: "Breakdown" | "분석";
  sections: RecipeBreakdownSection[];
  title: string;
};

const labels = {
  en: {
    apply: "Apply to your shoot",
    breakdown: "Breakdown",
    evidence: "Proof points",
    hook: "Video hook",
    idea: "Idea angle",
    story: "Story format",
    summary: "Why this works",
    visual: "Visual layout",
  },
  ko: {
    apply: "내 촬영에 적용",
    breakdown: "분석",
    evidence: "근거",
    hook: "영상 훅",
    idea: "아이디어 각도",
    story: "전개 방식",
    summary: "왜 먹히는지",
    visual: "화면 구조",
  },
} satisfies Record<
  AppLanguage,
  {
    apply: string;
    breakdown: "Breakdown" | "분석";
    evidence: string;
    hook: string;
    idea: string;
    story: string;
    summary: string;
    visual: string;
  }
>;

export function getRecipeBreakdownSummary(
  recipe: NativeRecipe,
  language: AppLanguage,
): RecipeBreakdownSummary {
  const copy = labels[language];
  const openingScene = recipe.scenes[0];
  const proofLines = recipe.scenes
    .flatMap((scene) => scene.analysis.whyItWorks)
    .filter(Boolean);
  const openingTranscript =
    openingScene?.analysis.transcriptOriginal?.[0] ||
    openingScene?.analysis.transcriptSnippet ||
    openingScene?.recipe.keyLine ||
    openingScene?.title ||
    recipe.title;
  const visualLayout =
    openingScene?.analysis.motionDescription ||
    openingScene?.recipe.keyAction ||
    (language === "ko"
      ? "예시 프레임을 먼저 보고, 설명은 그 다음에 붙입니다."
      : "Use the reference frame as the visual anchor before adding explanation.");
  const storyFormat =
    recipe.scenes.length > 1
      ? language === "ko"
        ? `${recipe.scenes.length}개의 짧은 실행 beat로 약속, 근거, 행동을 이어갑니다.`
        : `${recipe.scenes.length} short beats that move from promise to proof to action.`
      : language === "ko"
        ? "하나의 짧은 beat로 레퍼런스를 바로 찍을 수 있는 행동으로 바꿉니다."
        : "One compact beat that turns a reference into a shootable action.";

  const sections: RecipeBreakdownSection[] = [
    {
      body: recipe.summary || recipe.notes || recipe.title,
      id: "summary",
      title: copy.summary,
    },
    {
      body:
        openingScene?.recipe.appealPoint ||
        openingScene?.recipe.objective ||
        openingScene?.summary ||
        (language === "ko"
          ? "가장 분명한 결과를 먼저 보여주고, 설명은 그 뒤에 붙입니다."
          : "Lead with the clearest viewer payoff before explaining the steps."),
      id: "idea",
      title: copy.idea,
    },
    {
      body: storyFormat,
      id: "story",
      title: copy.story,
    },
    {
      body: visualLayout,
      id: "visual",
      title: copy.visual,
    },
    {
      body:
        proofLines[0] ||
        (language === "ko"
          ? "믿으라고 말하기 전에 보이는 근거를 먼저 둡니다."
          : "Use visible proof before asking the viewer to believe the claim."),
      id: "evidence",
      title: copy.evidence,
    },
  ];

  return {
    applyToYourShoot: {
      body:
        recipe.summary ||
        recipe.notes ||
        (language === "ko"
          ? "레퍼런스 아이디어를 복붙할 문장이 아니라 촬영 가이드로 사용합니다."
          : "Use the reference idea as a filming guide, not as copy to paste."),
      id: "summary",
      title: copy.apply,
    },
    hook: {
      body: openingTranscript,
      id: "hook",
      title: copy.hook,
    },
    primaryTabLabel: copy.breakdown,
    sections,
    title: recipe.title,
  };
}

