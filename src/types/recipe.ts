export interface RecipeScene {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  thumbnail: string;
  description: string;
  script?: string[];
  progress?: number;
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
  createdAt: string;
  updatedAt: string;
}
