import type { AppLanguage } from "@/core/i18n/app-language";
import type { ReferenceBreakdown } from "@/domain/recipes/reference-breakdown";
import type { ReferenceAnalysisJobReadModel } from "@/domain/recipes/reference-analysis-job";
import type { NativeRecipe } from "@/features/recipes/types/recipe-domain";

export type RecipeBreakdownSectionId =
  | "summary"
  | "transcript"
  | "idea_analysis"
  | "hook"
  | "storytelling_format"
  | "visual_layout";

export type RecipeBreakdownSection = {
  body: string;
  id: RecipeBreakdownSectionId;
  title: string;
};

export type RecipeBreakdownAnalysisState = {
  body: string;
  kind: "failed";
};

export type RecipeBreakdownSummary = {
  analysisState?: RecipeBreakdownAnalysisState;
  primaryTabLabel: "Breakdown" | "분석";
  sections: RecipeBreakdownSection[];
  title: string;
};

const labels = {
  en: {
    breakdown: "Breakdown",
    failedBodyFallback: "Could not refresh Breakdown. Use the current guide for now.",
    hook: "Hook",
    ideaAnalysis: "Idea Analysis",
    story: "Storytelling",
    summary: "Summary",
    transcript: "Transcript",
    visual: "Visual Layout",
  },
  ko: {
    breakdown: "분석",
    failedBodyFallback: "분석을 새로고침하지 못했습니다. 지금은 현재 가이드를 사용하세요.",
    hook: "Hook",
    ideaAnalysis: "Idea Analysis",
    story: "Storytelling",
    summary: "Summary",
    transcript: "Transcript",
    visual: "Visual Layout",
  },
} satisfies Record<
  AppLanguage,
  {
    breakdown: "Breakdown" | "분석";
    failedBodyFallback: string;
    hook: string;
    ideaAnalysis: string;
    story: string;
    summary: string;
    transcript: string;
    visual: string;
  }
>;

function compactText(value: unknown) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function asList(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function compactList(values: unknown) {
  return asList(values).map(compactText).filter(Boolean);
}

function formatList(values: unknown) {
  return compactList(values).join("; ");
}

function displayCategory(value: string) {
  return compactText(value).replace(/_/g, " ");
}

function formatFields(
  fields: Array<readonly [label: string, value: string | number | null | undefined]>,
) {
  return fields
    .map(([label, value]) => {
      const text = compactText(value);
      return text.length > 0 ? `${label}: ${text}` : "";
    })
    .filter(Boolean)
    .join("\n");
}

function getReferenceBreakdownSections(
  breakdown: ReferenceBreakdown,
  copy: (typeof labels)[AppLanguage],
): RecipeBreakdownSection[] {
  const notableLines = asList(breakdown.transcript.notable_lines)
    .map((item) => {
      const notableLine = item as Record<string, unknown>;
      const timeRange = compactText(notableLine.time_range);
      const line = compactText(notableLine.line);
      const reason = compactText(notableLine.why_it_matters);

      if (!line) {
        return "";
      }

      return [
        timeRange ? `${timeRange}: ${line}` : line,
        reason ? `(${reason})` : "",
      ]
        .filter(Boolean)
        .join(" ");
    })
    .filter(Boolean)
    .join("\n");

  return [
    {
      body: formatFields([
        ["One-liner", breakdown.summary.one_liner],
        ["Audience", breakdown.summary.audience],
        ["Promise", breakdown.summary.promise],
        [
          "Why viewers keep watching",
          breakdown.summary.why_viewers_keep_watching,
        ],
      ]),
      id: "summary",
      title: copy.summary,
    },
    {
      body: formatFields([
        ["Clean", breakdown.transcript.clean],
        ["Notable lines", notableLines || formatList(breakdown.transcript.raw)],
      ]),
      id: "transcript",
      title: copy.transcript,
    },
    {
      body: formatFields([
        ["Topic", breakdown.idea_analysis.topic],
        ["Idea seed", breakdown.idea_analysis.idea_seed],
        ["Unique angle", breakdown.idea_analysis.unique_angle],
        [
          "Common belief to challenge",
          breakdown.idea_analysis.common_belief_to_challenge,
        ],
        ["Contrarian reality", breakdown.idea_analysis.contrarian_reality],
        [
          "Supporting evidence",
          formatList(breakdown.idea_analysis.supporting_evidence),
        ],
        ["User application", breakdown.idea_analysis.user_application],
      ]),
      id: "idea_analysis",
      title: copy.ideaAnalysis,
    },
    {
      body: formatFields([
        ["Category", displayCategory(breakdown.hook.category)],
        ["Formula", breakdown.hook.formula],
        ["Spoken hook", breakdown.hook.spoken_hook],
        ["Visual hook", breakdown.hook.visual_hook],
        ["Analysis", breakdown.hook.why_it_works],
        ["Adaptation rule", breakdown.hook.adaptation_rule],
      ]),
      id: "hook",
      title: copy.hook,
    },
    {
      body: formatFields([
        ["Category", displayCategory(breakdown.storytelling_format.category)],
        ["Description", breakdown.storytelling_format.description],
        ["Beat order", formatList(breakdown.storytelling_format.beat_order)],
        ["Analysis", breakdown.storytelling_format.why_it_works],
        ["Reuse when", breakdown.storytelling_format.reuse_when],
      ]),
      id: "storytelling_format",
      title: copy.story,
    },
    {
      body: formatFields([
        ["Category", displayCategory(breakdown.visual_layout.category)],
        ["Sub-category", breakdown.visual_layout.sub_category],
        ["Framing", breakdown.visual_layout.framing],
        ["Camera motion", breakdown.visual_layout.camera_motion],
        ["Caption strategy", breakdown.visual_layout.caption_strategy],
        [
          "Subject/product relationship",
          breakdown.visual_layout.subject_product_relationship,
        ],
        ["User application", breakdown.visual_layout.user_application],
      ]),
      id: "visual_layout",
      title: copy.visual,
    },
  ];
}

function getFallbackBreakdownSections(
  recipe: NativeRecipe,
  language: AppLanguage,
  copy: (typeof labels)[AppLanguage],
): RecipeBreakdownSection[] {
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

  return [
    {
      body: recipe.summary || recipe.notes || recipe.title,
      id: "summary",
      title: copy.summary,
    },
    {
      body: openingTranscript,
      id: "transcript",
      title: copy.transcript,
    },
    {
      body: formatFields([
        ["Idea seed", openingScene?.recipe.appealPoint || openingScene?.summary],
        ["Unique angle", openingScene?.recipe.objective],
        ["Supporting evidence", proofLines[0]],
      ]),
      id: "idea_analysis",
      title: copy.ideaAnalysis,
    },
    {
      body: formatFields([
        ["Spoken hook", openingTranscript],
        ["Visual hook", openingScene?.analysis.motionDescription],
      ]),
      id: "hook",
      title: copy.hook,
    },
    {
      body: storyFormat,
      id: "storytelling_format",
      title: copy.story,
    },
    {
      body: visualLayout,
      id: "visual_layout",
      title: copy.visual,
    },
  ];
}

function isReferenceAnalysisJobReadModel(
  value: unknown,
): value is ReferenceAnalysisJobReadModel {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<ReferenceAnalysisJobReadModel>;

  return (
    typeof candidate.jobId === "string" &&
    typeof candidate.clientStatus === "string" &&
    typeof candidate.retryable === "boolean"
  );
}

function getReferenceAnalysisJobReadModel(recipe: NativeRecipe) {
  const metadata = recipe.analysisMetadata;
  const rawJob =
    metadata?.reference_analysis_job ?? metadata?.referenceAnalysisJob;

  return isReferenceAnalysisJobReadModel(rawJob) ? rawJob : null;
}

export function getRecipeBreakdownAnalysisState(
  recipe: NativeRecipe,
  language: AppLanguage,
): RecipeBreakdownAnalysisState | undefined {
  const copy = labels[language];
  const job = getReferenceAnalysisJobReadModel(recipe);

  if (!job) {
    return undefined;
  }

  if (job.clientStatus === "failed") {
    return {
      body: compactText(job.error?.messageUser) || copy.failedBodyFallback,
      kind: "failed",
    };
  }

  return undefined;
}

export function getRecipeBreakdownSummary(
  recipe: NativeRecipe,
  language: AppLanguage,
): RecipeBreakdownSummary {
  const copy = labels[language];
  const referenceBreakdown =
    recipe.referenceBreakdown ?? recipe.analysisMetadata?.reference_breakdown;

  return {
    analysisState: getRecipeBreakdownAnalysisState(recipe, language),
    primaryTabLabel: copy.breakdown,
    sections: referenceBreakdown
      ? getReferenceBreakdownSections(referenceBreakdown, copy)
      : getFallbackBreakdownSections(recipe, language, copy),
    title: recipe.title,
  };
}
