import type {
  ReferenceBreakdownHookCategory,
  ReferenceBreakdownSchemaVersion,
  ReferenceBreakdownStorytellingCategory,
  ReferenceBreakdownVisualCategory,
} from './reference-breakdown';

export type ReferenceAnalysisArtifactStatus =
  | 'ready'
  | 'partial_ready'
  | 'failed'
  | 'canceled'
  | 'expired';

export type ReferenceAnalysisSectionStatus =
  | 'ready'
  | 'partial'
  | 'missing'
  | 'failed';

export type NormalizedReferenceMediaSource =
  | {
      kind: 'upload';
      originalFileName?: string;
    }
  | {
      kind: 'provider_normalized';
      platform: 'tiktok' | 'instagram' | 'youtube' | 'unknown';
      provider: string;
      sourceUrl?: string;
      creatorHandle?: string | null;
    };

export type NormalizedReferenceMediaInput = {
  assetVersion: string;
  byteSize: number;
  checksum?: string;
  dimensions: {
    height: number;
    width: number;
  };
  durationMs: number;
  fps?: number | null;
  languageHint?: string | null;
  mediaAssetId: string;
  mimeType: string;
  playable: boolean;
  source: NormalizedReferenceMediaSource;
  thumbnailUri?: string | null;
  transcriptUri?: string | null;
  uri: string;
  workspaceId: string;
};

export type ReferenceEvidenceRef =
  | {
      endMs: number;
      id: string;
      kind: 'timestamp_range';
      startMs: number;
    }
  | {
      id: string;
      kind: 'transcript_segment';
      transcriptSegmentId: string;
    }
  | {
      frameRefId: string;
      id: string;
      kind: 'visual_frame';
    }
  | {
      cutId: string;
      id: string;
      kind: 'source_cut';
    };

export type ReferenceConfidenceSummary = {
  notes: string[];
  overall: number;
};

export type ReferenceSectionBase = {
  confidence: number;
  evidenceRefs: ReferenceEvidenceRef[];
  missingArtifacts?: string[];
  status: ReferenceAnalysisSectionStatus;
};

export type ReferenceSummarySection = ReferenceSectionBase & {
  audience: string | null;
  oneLiner: string | null;
  promise: string | null;
  whyViewersKeepWatching: string | null;
};

export type ReferenceTranscriptSegment = {
  endMs: number;
  id: string;
  speakerLabel?: string | null;
  startMs: number;
  text: string;
};

export type ReferenceTranscriptSection = ReferenceSectionBase & {
  cleanText: string | null;
  detectedLanguage: string | null;
  notableLines: Array<{
    evidenceRefs: ReferenceEvidenceRef[];
    line: string;
    whyItMatters: string;
  }>;
  rawText?: string[] | null;
  segments: ReferenceTranscriptSegment[];
};

export type ReferenceIdeaAnalysisSection = ReferenceSectionBase & {
  commonBeliefToChallenge: string | null;
  contrarianReality: string | null;
  ideaSeed: string | null;
  supportingEvidence: string[];
  topic: string | null;
  uniqueAngle: string | null;
  userApplication: string | null;
};

export type ReferenceHookSection = ReferenceSectionBase & {
  adaptationRule: string | null;
  category: ReferenceBreakdownHookCategory | null;
  formula: string | null;
  spokenHook: string | null;
  visualHook: string | null;
  whyItWorks: string | null;
};

export type ReferenceStorytellingFormatSection = ReferenceSectionBase & {
  beatOrder: string[];
  category: ReferenceBreakdownStorytellingCategory | null;
  description: string | null;
  reuseWhen: string | null;
  whyItWorks: string | null;
};

export type ReferenceVisualLayoutSection = ReferenceSectionBase & {
  cameraMotion: string | null;
  captionStrategy: string | null;
  category: ReferenceBreakdownVisualCategory | null;
  framing: string | null;
  subCategory: string | null;
  subjectProductRelationship: string | null;
  userApplication: string | null;
};

export type ReferenceCutSegment = {
  confidence: number;
  cutId: string;
  durationMs: number;
  endMs: number;
  evidenceRefs: ReferenceEvidenceRef[];
  executionTitle: string;
  inferredPurpose: string;
  lineToSay: string | null;
  missingArtifacts: string[];
  myTakeRelationship: string;
  orderIndex: number;
  referenceObservation: string;
  referenceUsage: string;
  shootingGuide: string | null;
  sourceModalities: Array<'visual' | 'transcript' | 'audio' | 'metadata'>;
  startMs: number;
  successCriteria: string[];
  thumbnailRef?: string | null;
  transcriptRefs: string[];
  visualRefs: string[];
};

export type ReferenceBreakdownArtifactMetadata = {
  analysisProfileVersion: string;
  breakdownId: string;
  createdAt: string;
  jobId?: string;
  mediaAssetId: string;
  mediaAssetVersion: string;
  status: ReferenceAnalysisArtifactStatus;
  traceId?: string;
  updatedAt: string;
  workspaceId: string;
};

export type ReferenceBreakdownArtifact = ReferenceBreakdownArtifactMetadata & {
  confidence: ReferenceConfidenceSummary;
  cutSegments: ReferenceCutSegment[];
  hook: ReferenceHookSection;
  ideaAnalysis: ReferenceIdeaAnalysisSection;
  missingArtifacts: string[];
  schemaVersion: ReferenceBreakdownSchemaVersion;
  shootingBoardProjectionRef?: {
    projectionId: string;
    projectionSchemaVersion: ShootingBoardProjectionSchemaVersion;
  } | null;
  storytellingFormat: ReferenceStorytellingFormatSection;
  summary: ReferenceSummarySection;
  transcript: ReferenceTranscriptSection;
  visualLayout: ReferenceVisualLayoutSection;
};

export type ShootingBoardProjectionSchemaVersion =
  'parrotkit.shooting_board_projection.v1';

export type ShootingBoardProjectionEditableField =
  | 'executionTitle'
  | 'lineToSay'
  | 'shotGuide'
  | 'successCriteria'
  | 'order';

export type ShootingBoardProjectionItem = {
  durationSeconds: number;
  editableFields: ShootingBoardProjectionEditableField[];
  executionTitle: string;
  lineToSay: string | null;
  missingArtifacts: string[];
  myTakeRelationship: string;
  orderIndex: number;
  projectionCutId: string;
  referenceMediaRef: {
    endMs: number;
    mediaAssetId: string;
    startMs: number;
    thumbnailUri?: string | null;
  };
  referenceObservation: string;
  referenceUsage: string;
  shotGuide: string | null;
  sourceCutIds: string[];
  sourceTimeRangeMs: {
    endMs: number;
    startMs: number;
  };
  successCriteria: string[];
};

export type ShootingBoardProjection = {
  analysisProfileVersion: string;
  boardTitle: string;
  breakdownId: string;
  confidence: ReferenceConfidenceSummary;
  createdAt: string;
  estimatedDurationSeconds: number;
  items: ShootingBoardProjectionItem[];
  mediaAssetId: string;
  mediaAssetVersion: string;
  missingArtifacts: string[];
  projectionId: string;
  projectionSchemaVersion: ShootingBoardProjectionSchemaVersion;
  sourceCutCount: number;
  status: 'ready' | 'partial' | 'failed';
  updatedAt: string;
  workspaceId: string;
};

export type UserRecipeBoardCutOverride = {
  executionTitle?: string;
  lineToSay?: string | null;
  orderIndex?: number;
  projectionCutId: string;
  removed?: boolean;
  shotGuide?: string | null;
  successCriteria?: string[];
};

export type UserRecipeBoardOverrides = {
  addedCuts?: Array<Omit<UserRecipeBoardCutOverride, 'projectionCutId'> & { id: string }>;
  boardTitle?: string;
  cutOverrides: UserRecipeBoardCutOverride[];
  projectionId: string;
  recipeId: string;
  updatedAt: string;
  userId: string;
};

export const referenceProjectionTextLimits = {
  executionTitle: 56,
  lineToSay: 180,
  myTakeRelationship: 160,
  referenceObservation: 160,
  referenceUsage: 160,
  shotGuide: 220,
  successCriteriaCount: 4,
  successCriteriaItem: 80,
} as const;
