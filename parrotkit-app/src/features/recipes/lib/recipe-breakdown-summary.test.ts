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
    {
      id: "scene-2",
      sceneNumber: 2,
      title: "Make the product earn trust",
      startTime: "0:05",
      endTime: "0:15",
      thumbnail: "https://example.com/scene-2.jpg",
      analysis: {
        transcriptSnippet: "This serum made the base sit better.",
        transcriptOriginal: [],
        motionDescription: "Product appears after the result shot.",
        whyItWorks: ["The product is supported by visible evidence."],
        referenceSignals: [],
      },
      recipe: {
        objective: "Connect result to product proof.",
        appealPoint: "The product is supported by visible evidence.",
        keyLine: "This is what changed the base.",
        scriptLines: ["This is what changed the base."],
        keyMood: "Helpful",
        keyAction: "Bring the product into frame after the result.",
        mustInclude: ["Product after result"],
        mustAvoid: ["Unproven claim"],
      },
      prompter: { blocks: [] },
    },
  ],
};

const summary = getRecipeBreakdownSummary(recipe, "en");

if (summary.primaryTabLabel !== "Breakdown") {
  throw new Error(`Expected Breakdown label, got ${summary.primaryTabLabel}`);
}

if (summary.hook.title !== "Video hook") {
  throw new Error("Hook must be video-level, not a per-cut label");
}

if (!summary.hook.body.includes("This is the glow")) {
  throw new Error("Expected hook body to use opening transcript");
}

if (summary.sections.some((section) => section.title === "Cut hook")) {
  throw new Error("Breakdown must not create repeated per-cut hook sections");
}

if (!summary.applyToYourShoot.body.includes("Show the skin result")) {
  throw new Error("Expected recipe summary to become creator application");
}

