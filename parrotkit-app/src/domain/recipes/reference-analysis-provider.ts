import type {
  NormalizedReferenceMediaInput,
  ReferenceBreakdownArtifact,
  ReferenceTranscriptSegment,
  ShootingBoardProjection,
} from './reference-analysis-contract';
import type {
  ReferenceAnalysisJobError,
  ReferenceAnalysisJobErrorCode,
} from './reference-analysis-job';
import type {
  ReferenceAnalysisFrameDescription,
  ReferenceAnalysisOptionalUserContext,
  ReferenceAnalysisPromptContract,
} from './reference-analysis-prompt';
import {
  hasReferenceAnalysisForbiddenBoardLabel,
} from './reference-analysis-prompt';
import type { ReferenceBreakdown } from './reference-breakdown';

export type ReferenceAnalysisProviderKind =
  | 'supadata'
  | 'superdata'
  | 'replicate'
  | 'gemini'
  | 'openai'
  | 'anthropic'
  | 'custom';

export type ReferenceAnalysisProviderTrace = {
  model?: string;
  provider: ReferenceAnalysisProviderKind | string;
  providerRequestId?: string;
  providerStatus?: string;
  queueId?: string;
  rawError?: unknown;
  rawOutputPreview?: unknown;
};

export type ReferenceAnalysisProviderRuntimeConfig = {
  anthropicApiKeyEnv: 'ANTHROPIC_API_KEY';
  defaultModelProvider:
    | 'replicate'
    | 'gemini'
    | 'openai'
    | 'anthropic'
    | 'custom';
  geminiApiKeyEnv: 'GEMINI_API_KEY';
  openaiApiKeyEnv: 'OPENAI_API_KEY';
  replicateApiTokenEnv: 'REPLICATE_API_TOKEN';
  supadataApiKeyEnv: 'SUPADATA_API_KEY';
};

export const referenceAnalysisProviderRuntimeConfig: ReferenceAnalysisProviderRuntimeConfig =
  {
    anthropicApiKeyEnv: 'ANTHROPIC_API_KEY',
    defaultModelProvider: 'replicate',
    geminiApiKeyEnv: 'GEMINI_API_KEY',
    openaiApiKeyEnv: 'OPENAI_API_KEY',
    replicateApiTokenEnv: 'REPLICATE_API_TOKEN',
    supadataApiKeyEnv: 'SUPADATA_API_KEY',
  };

export type ReferenceLinkNormalizationInput = {
  idempotencyKey?: string;
  requesterUserId: string;
  sourceUrl: string;
  workspaceId: string;
};

export type ReferenceMediaExtractionSuccess = {
  frameDescriptions?: ReferenceAnalysisFrameDescription[];
  internalTrace?: ReferenceAnalysisProviderTrace;
  media: NormalizedReferenceMediaInput;
  ok: true;
  transcriptSegments?: ReferenceTranscriptSegment[];
};

export type ReferenceAnalysisProviderFailureKind =
  | 'auth'
  | 'invalid_output'
  | 'low_confidence'
  | 'media_decode_failed'
  | 'moderation'
  | 'quota'
  | 'timeout'
  | 'transcript_unavailable'
  | 'unavailable'
  | 'unsupported_media'
  | 'unknown';

export type ReferenceAnalysisProviderFailure = {
  error: ReferenceAnalysisJobError & {
    retryable: boolean;
  };
  internalTrace?: ReferenceAnalysisProviderTrace;
  missingArtifacts: string[];
  ok: false;
};

export type ReferenceMediaExtractionResult =
  | ReferenceMediaExtractionSuccess
  | ReferenceAnalysisProviderFailure;

export type ReferenceMediaExtractionAdapter = {
  normalizeLink(
    input: ReferenceLinkNormalizationInput,
  ): Promise<ReferenceMediaExtractionResult>;
  provider: ReferenceAnalysisProviderKind;
};

export type ReferenceAnalysisModelAdapterInput = {
  frameDescriptions?: ReferenceAnalysisFrameDescription[];
  media: NormalizedReferenceMediaInput;
  metadata?: Record<string, unknown>;
  optionalUserContext?: ReferenceAnalysisOptionalUserContext | null;
  prompt: ReferenceAnalysisPromptContract;
  transcriptSegments?: ReferenceTranscriptSegment[];
};

export type ReferenceAnalysisProviderSuccess = {
  artifact: ReferenceBreakdownArtifact;
  internalTrace?: ReferenceAnalysisProviderTrace;
  legacyBreakdown?: ReferenceBreakdown;
  missingArtifacts: string[];
  ok: true;
  projection: ShootingBoardProjection;
  status: 'ready' | 'partial_ready';
};

export type ReferenceAnalysisProviderResult =
  | ReferenceAnalysisProviderSuccess
  | ReferenceAnalysisProviderFailure;

export type ReferenceAnalysisModelAdapter = {
  analyze(
    input: ReferenceAnalysisModelAdapterInput,
  ): Promise<ReferenceAnalysisProviderResult>;
  provider: ReferenceAnalysisProviderKind;
};

export function createReferenceAnalysisProviderResult({
  allowTranscriptMissing = true,
  artifact,
  internalTrace,
  legacyBreakdown,
  projection,
}: {
  allowTranscriptMissing?: boolean;
  artifact: ReferenceBreakdownArtifact;
  internalTrace?: ReferenceAnalysisProviderTrace;
  legacyBreakdown?: ReferenceBreakdown;
  projection: ShootingBoardProjection;
}): ReferenceAnalysisProviderResult {
  const validationError = validateReferenceAnalysisArtifacts({
    allowTranscriptMissing,
    artifact,
    projection,
  });

  if (validationError) {
    return {
      error: validationError,
      internalTrace,
      missingArtifacts: validationError.code === 'transcript_unavailable'
        ? ['transcript']
        : [],
      ok: false,
    };
  }

  const missingArtifacts = unique([
    ...artifact.missingArtifacts,
    ...projection.missingArtifacts,
    ...(isTranscriptMissing(artifact) ? ['transcript'] : []),
  ]);
  const partial = missingArtifacts.length > 0 || projection.status === 'partial';
  const normalizedArtifact: ReferenceBreakdownArtifact = partial
    ? {
        ...artifact,
        missingArtifacts,
        status: 'partial_ready',
      }
    : artifact;
  const normalizedProjection: ShootingBoardProjection = partial
    ? {
        ...projection,
        missingArtifacts,
        status: 'partial',
      }
    : projection;

  return {
    artifact: normalizedArtifact,
    internalTrace,
    legacyBreakdown,
    missingArtifacts,
    ok: true,
    projection: normalizedProjection,
    status: partial ? 'partial_ready' : 'ready',
  };
}

export function mapReferenceAnalysisProviderError({
  kind,
  messageUser,
}: {
  kind: ReferenceAnalysisProviderFailureKind;
  messageUser?: string;
}): ReferenceAnalysisProviderFailure['error'] {
  const code = mapFailureKindToErrorCode(kind);

  return {
    code,
    messageUser: messageUser ?? defaultProviderErrorMessage(code),
    retryable: isProviderFailureRetryable(code),
  };
}

export function createReferenceAnalysisProviderFailure({
  internalTrace,
  kind,
  messageUser,
  missingArtifacts = [],
}: {
  internalTrace?: ReferenceAnalysisProviderTrace;
  kind: ReferenceAnalysisProviderFailureKind;
  messageUser?: string;
  missingArtifacts?: string[];
}): ReferenceAnalysisProviderFailure {
  return {
    error: mapReferenceAnalysisProviderError({ kind, messageUser }),
    internalTrace,
    missingArtifacts,
    ok: false,
  };
}

export function stripReferenceAnalysisProviderInternalTrace(
  result: ReferenceAnalysisProviderResult,
): Omit<ReferenceAnalysisProviderSuccess, 'internalTrace'> | Omit<ReferenceAnalysisProviderFailure, 'internalTrace'> {
  if (result.ok) {
    const { internalTrace: _internalTrace, ...clientSafe } = result;
    return clientSafe;
  }

  const { internalTrace: _internalTrace, ...clientSafe } = result;
  return clientSafe;
}

function validateReferenceAnalysisArtifacts({
  allowTranscriptMissing,
  artifact,
  projection,
}: {
  allowTranscriptMissing: boolean;
  artifact: ReferenceBreakdownArtifact;
  projection: ShootingBoardProjection;
}): ReferenceAnalysisProviderFailure['error'] | null {
  if (artifact.schemaVersion !== 'parrotkit.reference_breakdown.v1') {
    return mapReferenceAnalysisProviderError({ kind: 'invalid_output' });
  }

  if (projection.projectionSchemaVersion !== 'parrotkit.shooting_board_projection.v1') {
    return mapReferenceAnalysisProviderError({ kind: 'invalid_output' });
  }

  if (artifact.mediaAssetId !== projection.mediaAssetId) {
    return mapReferenceAnalysisProviderError({ kind: 'invalid_output' });
  }

  if (artifact.cutSegments.length === 0 || projection.items.length === 0) {
    return mapReferenceAnalysisProviderError({ kind: 'invalid_output' });
  }

  if (artifact.status === 'failed') {
    return mapReferenceAnalysisProviderError({ kind: 'invalid_output' });
  }

  if (isTranscriptMissing(artifact) && !allowTranscriptMissing) {
    return mapReferenceAnalysisProviderError({ kind: 'transcript_unavailable' });
  }

  if (isTranscriptMissing(artifact) && !hasVisualFallback(artifact, projection)) {
    return mapReferenceAnalysisProviderError({ kind: 'transcript_unavailable' });
  }

  if (projection.items.some(hasProjectionLabelLeak)) {
    return mapReferenceAnalysisProviderError({ kind: 'invalid_output' });
  }

  return null;
}

function hasProjectionLabelLeak(item: ShootingBoardProjection['items'][number]) {
  return [
    item.executionTitle,
    item.lineToSay,
    item.referenceUsage,
    item.myTakeRelationship,
    item.shotGuide,
  ].some(hasReferenceAnalysisForbiddenBoardLabel);
}

function hasVisualFallback(
  artifact: ReferenceBreakdownArtifact,
  projection: ShootingBoardProjection,
) {
  return (
    artifact.cutSegments.some((cut) => cut.sourceModalities.includes('visual')) &&
    projection.items.length > 0
  );
}

function isTranscriptMissing(artifact: ReferenceBreakdownArtifact) {
  return (
    artifact.transcript.status === 'missing' ||
    artifact.missingArtifacts.includes('transcript') ||
    artifact.transcript.missingArtifacts?.includes('transcript') === true
  );
}

function mapFailureKindToErrorCode(
  kind: ReferenceAnalysisProviderFailureKind,
): ReferenceAnalysisJobErrorCode {
  switch (kind) {
    case 'auth':
      return 'media_permission_denied';
    case 'invalid_output':
      return 'model_invalid_output';
    case 'low_confidence':
      return 'low_confidence';
    case 'media_decode_failed':
      return 'media_decode_failed';
    case 'moderation':
      return 'moderation_restricted';
    case 'quota':
      return 'quota_exceeded';
    case 'timeout':
      return 'provider_timeout';
    case 'transcript_unavailable':
      return 'transcript_unavailable';
    case 'unavailable':
      return 'provider_unavailable';
    case 'unsupported_media':
      return 'unsupported_media';
    case 'unknown':
      return 'internal_error';
  }
}

function isProviderFailureRetryable(code: ReferenceAnalysisJobErrorCode) {
  return (
    code === 'provider_timeout' ||
    code === 'provider_unavailable' ||
    code === 'model_unavailable' ||
    code === 'internal_error'
  );
}

function defaultProviderErrorMessage(code: ReferenceAnalysisJobErrorCode) {
  switch (code) {
    case 'model_invalid_output':
      return 'The analysis model returned an unreadable result. Try again.';
    case 'transcript_unavailable':
      return 'Transcript is unavailable, but a visual guide may still be created.';
    case 'media_decode_failed':
      return 'We could not read this video.';
    case 'unsupported_media':
      return 'This reference format is not supported yet.';
    case 'provider_timeout':
      return 'Analysis is taking longer than expected. Try again.';
    case 'quota_exceeded':
      return 'The analysis provider is temporarily rate limited.';
    case 'media_permission_denied':
      return 'The reference could not be accessed.';
    case 'moderation_restricted':
      return 'This reference cannot be analyzed.';
    default:
      return 'Reference analysis is unavailable. Try again.';
  }
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}
