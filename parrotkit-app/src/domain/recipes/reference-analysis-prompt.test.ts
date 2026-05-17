import type {
  NormalizedReferenceMediaInput,
  ReferenceTranscriptSegment,
} from './reference-analysis-contract';
import {
  createReferenceAnalysisPrompt,
  hasReferenceAnalysisForbiddenBoardLabel,
  referenceAnalysisSandcastleSectionLabels,
} from './reference-analysis-prompt';

const media: NormalizedReferenceMediaInput = {
  assetVersion: 'sha256:beauty-reference-v1',
  byteSize: 4200000,
  checksum: 'sha256:beauty-reference-v1',
  dimensions: { height: 1920, width: 1080 },
  durationMs: 31000,
  mediaAssetId: 'media_beauty_reference',
  mimeType: 'video/mp4',
  playable: true,
  source: {
    creatorHandle: '@avabeauty',
    kind: 'provider_normalized',
    platform: 'instagram',
    provider: 'supadata',
    sourceUrl: 'https://example.com/reel/1',
  },
  uri: 'https://cdn.example.com/reference.mp4',
  workspaceId: 'workspace_1',
};

const transcriptSegments: ReferenceTranscriptSegment[] = [
  {
    endMs: 3000,
    id: 'tr_001',
    startMs: 0,
    text: 'This is the glow I wanted before touching concealer.',
  },
];

const prompt = createReferenceAnalysisPrompt({
  frameDescriptions: [
    {
      description: 'Creator holds a skincare bottle next to the finished result.',
      frameRefId: 'frame_001',
      timeMs: 800,
    },
  ],
  media,
  metadata: {
    title: 'Beauty conversion reference',
  },
  optionalUserContext: {
    goal: 'conversion',
    niche: 'beauty',
    product: 'serum',
  },
  transcriptSegments,
});

if (prompt.responseFormat.type !== 'json_schema') {
  throw new Error('Prompt should request JSON schema output.');
}

if (!prompt.responseFormat.strict) {
  throw new Error('Prompt JSON schema should be strict.');
}

if (prompt.outputSchemaName !== 'parrotkit_reference_breakdown_v1') {
  throw new Error(`Unexpected prompt schema name: ${prompt.outputSchemaName}`);
}

for (const label of referenceAnalysisSandcastleSectionLabels) {
  const serializedSchema = JSON.stringify(prompt.outputSchema);
  if (!serializedSchema.includes(label)) {
    throw new Error(`Prompt schema should include Sandcastle label ${label}.`);
  }
}

if (JSON.stringify(prompt.outputSchema).includes('Proof Point')) {
  throw new Error('Prompt schema should not add Proof Point as a board section.');
}

if (!prompt.system.includes('Do not assign a generic hook to every cut')) {
  throw new Error('Prompt should keep hook analysis video-level.');
}

if (!prompt.system.includes('transcript is unavailable')) {
  throw new Error('Prompt should support visual-only partial analysis.');
}

if (!prompt.user.includes('"mediaAssetId":"media_beauty_reference"')) {
  throw new Error('Prompt user payload should include normalized media.');
}

if (!prompt.user.includes('"text":"This is the glow I wanted before touching concealer."')) {
  throw new Error('Prompt user payload should include transcript segments.');
}

if (!hasReferenceAnalysisForbiddenBoardLabel('Hook')) {
  throw new Error('Hook should be forbidden as a board row label.');
}

if (!hasReferenceAnalysisForbiddenBoardLabel('Hook: show payoff')) {
  throw new Error('Prefixed Hook labels should be forbidden on board rows.');
}

if (hasReferenceAnalysisForbiddenBoardLabel('Open on the finished look')) {
  throw new Error('Execution titles should remain allowed.');
}

const visualOnlyPrompt = createReferenceAnalysisPrompt({
  frameDescriptions: [
    {
      description: 'The final result fills the vertical frame.',
      frameRefId: 'frame_001',
      timeMs: 500,
    },
  ],
  media,
});

if (!visualOnlyPrompt.user.includes('transcript_status: transcript_unavailable')) {
  throw new Error('Prompt should explicitly mark missing transcript.');
}
