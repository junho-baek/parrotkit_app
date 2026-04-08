export type ReferenceSignalType =
  | 'hook'
  | 'pacing'
  | 'motion'
  | 'caption'
  | 'emotion'
  | 'product'
  | 'cta';

export type PrompterBlockType =
  | 'key_line'
  | 'keyword'
  | 'appeal_point'
  | 'mood'
  | 'action'
  | 'warning'
  | 'cta';

export type PrompterBlockSize = 'sm' | 'md' | 'lg' | 'xl';

export type PrompterPositionPreset =
  | 'top'
  | 'upperThird'
  | 'center'
  | 'lowerThird'
  | 'bottom';

export interface SceneReferenceSignal {
  type: ReferenceSignalType;
  text: string;
}

export interface SceneAnalysis {
  // Reference transcript for the script drawer. Keep reading it for older recipes.
  transcriptOriginal?: string[];
  // Legacy/plain fallback transcript string kept for older payloads and persistence.
  transcriptSnippet?: string | null;
  motionDescription?: string;
  whyItWorks: string[];
  // Legacy-only analysis metadata. New UI should not depend on this field.
  referenceSignals: SceneReferenceSignal[];
}

export interface SceneRecipePlan {
  objective: string;
  appealPoint: string;
  keyLine: string;
  scriptLines: string[];
  keyMood: string;
  keyAction: string;
  mustInclude: string[];
  mustAvoid: string[];
  cta?: string;
}

export interface PrompterBlock {
  id: string;
  type: PrompterBlockType;
  label?: string;
  content: string;
  // Optional creator-selected accent used by the light recipe cue board.
  accentColor?: string;
  visible: boolean;
  size: PrompterBlockSize;
  positionPreset: PrompterPositionPreset;
  scale?: number;
  x?: number;
  y?: number;
  order: number;
}

export interface ScenePrompter {
  blocks: PrompterBlock[];
}

export interface BrandBrief {
  brandName: string;
  productName: string;
  objective: string;
  targetAudience: string[];
  tone: string[];
  keyMessages: string[];
  mustInclude: string[];
  mustAvoid: string[];
  shootingGuidelines: string[];
  captionRequirements: string[];
  hashtags: string[];
  tags: string[];
  sourceFileName?: string;
  extractionStatus?: 'success' | 'failed';
  extractionNotes?: string[];
}

export interface RecipeScene {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  thumbnail: string;
  analysis: SceneAnalysis;
  recipe: SceneRecipePlan;
  prompter: ScenePrompter;
  progress?: number;
  // Legacy flat fields persisted for backward compatibility with older saved recipes.
  description?: string;
  script?: string[];
  transcriptSnippet?: string | null;
}

export interface RecipeRecord {
  id: string;
  userId: string;
  referenceId: string | null;
  videoUrl: string;
  scenes: RecipeScene[];
  totalScenes: number;
  capturedCount: number;
  capturedSceneIds: number[];
  matchResults: Record<string, boolean>;
  analysisMetadata?: Record<string, unknown>;
  scriptSource?: string;
  brandBrief?: BrandBrief | null;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeViewData {
  scenes: RecipeScene[];
  videoUrl: string;
  capturedVideos: Record<number, boolean>;
  matchResults: Record<string, boolean>;
  recipeId: string;
  metadata?: Record<string, unknown>;
  transcript?: unknown[];
  brandBrief?: BrandBrief | null;
  analysisMetadata?: Record<string, unknown>;
}
