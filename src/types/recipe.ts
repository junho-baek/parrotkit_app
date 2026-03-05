export interface RecipeScene {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  thumbnail: string;
  description: string;
  script?: string[];
  progress?: number;
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
  createdAt: string;
  updatedAt: string;
}
