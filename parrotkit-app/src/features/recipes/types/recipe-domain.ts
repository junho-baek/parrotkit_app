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
export type PrompterPositionPreset = 'top' | 'upperThird' | 'center' | 'lowerThird' | 'bottom';

export type SceneReferenceSignal = {
  type: ReferenceSignalType;
  text: string;
};

export type SceneAnalysis = {
  transcriptOriginal?: string[];
  transcriptSnippet?: string | null;
  motionDescription?: string;
  whyItWorks: string[];
  referenceSignals: SceneReferenceSignal[];
};

export type SceneRecipePlan = {
  objective: string;
  appealPoint: string;
  keyLine: string;
  scriptLines: string[];
  keyMood: string;
  keyAction: string;
  mustInclude: string[];
  mustAvoid: string[];
  cta?: string;
};

export type PrompterBlock = {
  id: string;
  type: PrompterBlockType;
  label?: string;
  content: string;
  accentColor?: string;
  visible: boolean;
  size: PrompterBlockSize;
  positionPreset: PrompterPositionPreset;
  opacity?: number;
  scale?: number;
  x?: number;
  y?: number;
  order: number;
};

export type ScenePrompter = {
  blocks: PrompterBlock[];
};

export type NativeRecipeScene = {
  id: string;
  sceneNumber: number;
  title: string;
  startTime: string;
  endTime: string;
  thumbnail: string;
  analysis: SceneAnalysis;
  recipe: SceneRecipePlan;
  prompter: ScenePrompter;
  progress?: number;
  summary?: string;
  analysisLines?: string[];
  recipeLines?: string[];
  prompterLines?: string[];
};

export type NativeRecipe = {
  id: string;
  title: string;
  creator: string;
  platform: 'TikTok' | 'Instagram Reels' | 'YouTube Shorts';
  thumbnail: string;
  savedAt: string;
  sourceUrl: string;
  summary: string;
  niche: string;
  goal: string;
  notes: string;
  scenes: NativeRecipeScene[];
};
