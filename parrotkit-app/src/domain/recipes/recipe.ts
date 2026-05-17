import type {
  RecipeAnalysisMetadata,
  ReferenceBreakdown,
} from '@/domain/recipes/reference-breakdown';

export type RecipePlatform = 'TikTok' | 'Instagram Reels' | 'YouTube Shorts';
export type CreatorTrust = 'verified' | 'community';
export type RecipeOwnership = 'owned' | 'downloaded' | 'remixed' | 'community';
export type RecipeVerification = 'verified_creator' | 'community';
export type RecipeShootStatus = 'continue' | 'ready' | 'draft';

export type RecipeImageUriSource = {
  uri?: string;
  bundle?: string;
  method?: string;
  headers?: Record<string, string>;
  cache?: 'default' | 'reload' | 'force-cache' | 'only-if-cached';
  body?: string;
  width?: number;
  height?: number;
  scale?: number;
};

export type RecipeImageSource = string | number | RecipeImageUriSource | RecipeImageUriSource[];

export type Reference = {
  id: string;
  title: string;
  creator: string;
  thumbnail: RecipeImageSource;
  duration: string;
  views: string;
  likes: number;
  category: string;
  platform: RecipePlatform;
  videoUrl: string;
  createdAt: string;
  isLiked: boolean;
  recipeId?: string;
};

export type PartnerCreator = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  trust: CreatorTrust;
  specialty: string;
};

export type RecipeScene = {
  id: string;
  isOptional?: boolean;
  sceneNumber?: number;
  title: string;
  summary: string;
  startTime?: string;
  endTime?: string;
  thumbnail?: RecipeImageSource;
  analysisLines: string[];
  recipeLines: string[];
  prompterLines: string[];
  analysis?: {
    transcriptOriginal?: string[];
    transcriptSnippet?: string | null;
    motionDescription?: string;
    whyItWorks?: string[];
    referenceSignals?: Array<{ type: string; text: string }>;
  };
  recipe?: {
    objective?: string;
    appealPoint?: string;
    keyLine?: string;
    scriptLines?: string[];
    keyMood?: string;
    keyAction?: string;
    mustInclude?: string[];
    mustAvoid?: string[];
    cta?: string;
  };
  prompter?: {
    blocks?: Array<{
      id: string;
      type: 'key_line' | 'keyword' | 'appeal_point' | 'mood' | 'action' | 'warning' | 'cta';
      label?: string;
      content: string;
      accentColor?: string;
      visible: boolean;
      size: 'sm' | 'md' | 'lg' | 'xl';
      positionPreset: 'top' | 'upperThird' | 'center' | 'lowerThird' | 'bottom';
      scale?: number;
      x?: number;
      y?: number;
      order: number;
    }>;
  };
  progress?: number;
};

export type Recipe = {
  id: string;
  title: string;
  creator: string;
  platform: RecipePlatform;
  thumbnail: RecipeImageSource;
  savedAt: string;
  sourceUrl: string;
  referenceVideoSource?: string | number;
  referenceBreakdown?: ReferenceBreakdown;
  analysisMetadata?: RecipeAnalysisMetadata;
  summary: string;
  niche: string;
  goal: string;
  notes: string;
  ownership: RecipeOwnership;
  verification: RecipeVerification;
  ownerHandle: string;
  ownerName: string;
  downloadCount: number;
  explicitCompletion?: boolean;
  shootStatus: RecipeShootStatus;
  shotSceneCount: number;
  totalSceneCount: number;
  lastShotAt?: string;
  remixOfRecipeId?: string;
  scenes: RecipeScene[];
};
