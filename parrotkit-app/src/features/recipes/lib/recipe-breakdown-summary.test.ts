import { getRecipeBreakdownSummary } from "./recipe-breakdown-summary";
import type { NativeRecipe } from "@/features/recipes/types/recipe-domain";

const recipe: NativeRecipe = {
  id: "recipe-1",
  title: "Beauty Conversion Hook Guide",
  creator: "@avabeauty",
  platform: "YouTube Shorts",
  thumbnail: "https://example.com/ref.jpg",
  savedAt: "2026-05-17T00:00:00.000Z",
  sourceUrl: "https://example.com/shorts/1",
  referenceBreakdown: {
    schema_version: "parrotkit.reference_breakdown.v1",
    reference: {
      source_url: "https://example.com/shorts/1",
      platform: "youtube",
      creator_handle: "@avabeauty",
      title: "Beauty Conversion Hook Guide",
      duration_seconds: 21,
      language: "en",
      thumbnail_description: "Creator holds serum beside finished skin.",
    },
    summary: {
      one_liner:
        "A beauty reference that sells the product by proving the skin result first.",
      audience: "Beauty creators selling routine or product trust.",
      promise: "Show the finished skin before explaining the serum.",
      why_viewers_keep_watching:
        "The result is visible before the product claim appears.",
    },
    transcript: {
      clean: "This is the glow I wanted before touching concealer.",
      notable_lines: [
        {
          time_range: "0:00-0:03",
          line: "This is the glow I wanted before touching concealer.",
          why_it_matters: "It frames the payoff before the product pitch.",
        },
      ],
      raw: ["This is the glow I wanted before touching concealer."],
    },
    idea_analysis: {
      topic: "Beauty conversion routine",
      idea_seed: "Lead with the finished look before product explanation.",
      unique_angle: "The product earns attention after visible proof.",
      common_belief_to_challenge:
        "Creators need to name the product before proving the result.",
      contrarian_reality:
        "The visible skin result can make the product explanation feel earned.",
      supporting_evidence: [
        "The first frame shows finished skin.",
        "The product arrives after the promise is already clear.",
      ],
      user_application:
        "Open with your best final frame, then name the product after the viewer understands the result.",
    },
    hook: {
      category: "authority",
      formula:
        "There were so many requests to [compare/review X]. I can summarize it in [short time period].",
      spoken_hook: "This is the glow I wanted before touching concealer.",
      visual_hook: "Finished skin result in the first frame.",
      why_it_works:
        "The spoken and visual hook point at the same cosmetic payoff.",
      adaptation_rule:
        "Name the result first, then introduce the product as the reason it is repeatable.",
    },
    storytelling_format: {
      category: "demo",
      description: "Result, product proof, repeatable routine.",
      beat_order: ["Finished look", "Product earns attention", "Repeatable close"],
      why_it_works:
        "Each beat gives the viewer a clearer reason to believe the routine.",
      reuse_when: "Use when product trust depends on visible results.",
    },
    visual_layout: {
      category: "talking_head",
      sub_category: "Beauty close-up",
      framing: "Face fills the frame with product near cheek.",
      camera_motion: "Mostly static with product brought into frame.",
      caption_strategy: "Short result-first caption near the lower third.",
      subject_product_relationship:
        "The creator stays primary; product is secondary until the proof lands.",
      user_application:
        "Keep your final look visible while the product enters after the claim.",
    },
    proof_structure: {
      proof_points: ["Finished skin appears first."],
      trust_signals: ["Creator face and product shown together."],
      risk_or_gap: "Actual before/after timing is not fully visible.",
    },
    cuts: [],
    shooting_projection: {
      board_title: "Beauty Conversion Hook Guide",
      video_level_breakdown: [
        {
          label: "Summary",
          value:
            "A beauty reference that sells by proving the skin result first.",
        },
        {
          label: "Transcript",
          value: "This is the glow I wanted before touching concealer.",
        },
        {
          label: "Idea Analysis",
          value: "Lead with the finished look before product explanation.",
        },
        {
          label: "Hook",
          value: "Result-first authority hook.",
        },
        {
          label: "Storytelling",
          value: "Result, product proof, repeatable routine.",
        },
        {
          label: "Visual Layout",
          value: "Beauty close-up talking head.",
        },
      ],
      cut_rows: [],
    },
    vault_candidates: {
      idea: {
        title: "Result-first beauty routine",
        tags: ["beauty", "conversion"],
      },
      hook: {
        formula:
          "There were so many requests to [compare/review X]. I can summarize it in [short time period].",
        category: "authority",
      },
      story_format: {
        name: "Result proof routine",
        tags: ["demo"],
      },
      visual_layout: {
        name: "Beauty close-up talking head",
        tags: ["talking_head"],
      },
      channel: {
        creator_handle: "@avabeauty",
        why_follow: "Strong beauty result-first references.",
      },
    },
    confidence: {
      overall: 0.86,
      transcript: 0.9,
      visual: 0.8,
      cut_segmentation: 0.72,
      notes: [],
    },
  },
  summary:
    "Show the skin result before the product explanation so viewers understand the payoff.",
  niche: "Beauty",
  goal: "Conversion",
  notes: "Lead with the result, then make the product earn trust.",
  scenes: [
    {
      id: "scene-1",
      sceneNumber: 1,
      title: "Open on the finished look",
      startTime: "0:00",
      endTime: "0:05",
      thumbnail: "https://example.com/scene-1.jpg",
      analysis: {
        transcriptSnippet:
          "This is the glow I wanted before touching concealer.",
        transcriptOriginal: [
          "This is the glow I wanted before touching concealer.",
        ],
        motionDescription: "Creator opens on a finished skin result.",
        whyItWorks: ["It proves the result before explaining the product."],
        referenceSignals: [],
      },
      recipe: {
        objective: "Start with the result.",
        appealPoint: "The payoff is visible before the product pitch.",
        keyLine: "Here is the glow before concealer.",
        scriptLines: ["Here is the glow before concealer."],
        keyMood: "Confident",
        keyAction: "Open on the finished look.",
        mustInclude: ["Finished skin result"],
        mustAvoid: ["Starting with product specs"],
      },
      prompter: { blocks: [] },
    },
  ],
};

const summary = getRecipeBreakdownSummary(recipe, "en");

if (summary.primaryTabLabel !== "Breakdown") {
  throw new Error(`Expected Breakdown label, got ${summary.primaryTabLabel}`);
}

const sectionTitles = summary.sections.map((section) => section.title);
const expectedTitles = [
  "Summary",
  "Transcript",
  "Idea Analysis",
  "Hook",
  "Storytelling",
  "Visual Layout",
];

if (sectionTitles.join("|") !== expectedTitles.join("|")) {
  throw new Error(`Unexpected breakdown sections: ${sectionTitles.join(", ")}`);
}

const forbiddenTitles = [
  "Video hook",
  "Why this works",
  "Idea angle",
  "Story format",
  "Proof points",
  "Cut hook",
];

if (summary.sections.some((section) => forbiddenTitles.includes(section.title))) {
  throw new Error("Breakdown must use Sandcastle section names only");
}

const ideaAnalysis = summary.sections.find(
  (section) => section.id === "idea_analysis",
);

if (!ideaAnalysis?.body.includes("Supporting evidence")) {
  throw new Error("Idea Analysis must carry supporting evidence inline");
}

if (!ideaAnalysis.body.includes("The first frame shows finished skin.")) {
  throw new Error("Idea Analysis must preserve extracted evidence");
}

const hook = summary.sections.find((section) => section.id === "hook");

if (!hook?.body.includes("There were so many requests")) {
  throw new Error("Hook section must preserve Sandcastle hook formula");
}

const missingNotableLinesSummary = getRecipeBreakdownSummary(
  {
    ...recipe,
    referenceBreakdown: {
      ...recipe.referenceBreakdown,
      transcript: {
        clean: "Live smoke transcript exists but notable lines were omitted.",
        raw: ["Live smoke transcript exists but notable lines were omitted."],
      },
    } as NativeRecipe["referenceBreakdown"],
  },
  "en",
);

const missingNotableTranscript = missingNotableLinesSummary.sections.find(
  (section) => section.id === "transcript",
);

if (!missingNotableTranscript?.body.includes("Live smoke transcript exists")) {
  throw new Error("Breakdown transcript must render when notable_lines is omitted");
}

const partialSummary = getRecipeBreakdownSummary(
  {
    ...recipe,
    analysisMetadata: {
      ...recipe.analysisMetadata,
      reference_analysis_job: {
        artifacts: { breakdownId: "breakdown-1" },
        clientStatus: "partial",
        createdAt: "2026-05-17T00:00:00.000Z",
        jobId: "job-partial",
        missingArtifacts: ["shooting_board_projection"],
        progressStage: "partial_ready",
        retryable: false,
        stageChecklist: [],
        traceId: "trace-partial",
        updatedAt: "2026-05-17T00:01:00.000Z",
      },
    },
  },
  "en",
);

if (partialSummary.analysisState) {
  throw new Error("Partial reference analysis jobs must not render alert-like Breakdown state");
}

if (partialSummary.sections.length !== expectedTitles.length) {
  throw new Error("Partial jobs must keep the normal readable Breakdown sections");
}

const failedSummary = getRecipeBreakdownSummary(
  {
    ...recipe,
    referenceBreakdown: undefined,
    analysisMetadata: {
      reference_analysis_job: {
        clientStatus: "failed",
        createdAt: "2026-05-17T00:00:00.000Z",
        error: {
          code: "provider_timeout",
          messageUser: "Could not refresh Breakdown. Use the current guide for now.",
        },
        jobId: "job-failed",
        missingArtifacts: [],
        progressStage: "failed",
        retryable: true,
        stageChecklist: [],
        traceId: "trace-failed",
        updatedAt: "2026-05-17T00:01:00.000Z",
      },
    },
  },
  "en",
);

if (failedSummary.analysisState?.kind !== "failed") {
  throw new Error("Failed reference analysis jobs must surface a Breakdown state");
}

if (!failedSummary.analysisState.body.includes("Could not refresh Breakdown.")) {
  throw new Error("Failed state must preserve the client-safe error message");
}
