import type {
  NormalizedReferenceMediaInput,
  ReferenceTranscriptSegment,
} from './reference-analysis-contract';

export type ReferenceAnalysisFrameDescription = {
  description: string;
  frameRefId: string;
  timeMs: number;
};

export type ReferenceAnalysisOptionalUserContext = {
  audience?: string | null;
  goal?: string | null;
  niche?: string | null;
  notes?: string | null;
  product?: string | null;
};

export type ReferenceAnalysisPromptInput = {
  frameDescriptions?: ReferenceAnalysisFrameDescription[];
  media: NormalizedReferenceMediaInput;
  metadata?: Record<string, unknown>;
  optionalUserContext?: ReferenceAnalysisOptionalUserContext | null;
  transcriptSegments?: ReferenceTranscriptSegment[];
};

export type ReferenceAnalysisPromptContract = {
  outputSchema: typeof referenceAnalysisPromptJsonSchema;
  outputSchemaName: typeof referenceAnalysisPromptSchemaName;
  responseFormat: {
    jsonSchema: typeof referenceAnalysisPromptJsonSchema;
    name: typeof referenceAnalysisPromptSchemaName;
    strict: true;
    type: 'json_schema';
  };
  system: string;
  user: string;
};

export const referenceAnalysisPromptSchemaName =
  'parrotkit_reference_breakdown_v1';

export const referenceAnalysisSandcastleSectionLabels = [
  'Summary',
  'Transcript',
  'Idea Analysis',
  'Hook',
  'Storytelling',
  'Visual Layout',
] as const;

export const referenceAnalysisForbiddenBoardLabels = [
  'Hook',
  'Proof',
  'Storytelling',
  'Storytelling Format',
  'Visual Layout',
  'Proof point',
  'Proof Point',
  'confidence',
  'model',
  'prompt',
] as const;

export const referenceAnalysisPromptJsonSchema = {
  additionalProperties: false,
  properties: {
    confidence: {
      additionalProperties: false,
      properties: {
        cut_segmentation: { maximum: 1, minimum: 0, type: 'number' },
        notes: { items: { type: 'string' }, type: 'array' },
        overall: { maximum: 1, minimum: 0, type: 'number' },
        transcript: { maximum: 1, minimum: 0, type: 'number' },
        visual: { maximum: 1, minimum: 0, type: 'number' },
      },
      required: ['overall', 'transcript', 'visual', 'cut_segmentation', 'notes'],
      type: 'object',
    },
    cuts: {
      items: {
        additionalProperties: false,
        properties: {
          execution_title: { type: 'string' },
          id: { type: 'string' },
          line_to_say: { type: 'string' },
          my_take_success_criteria: {
            items: { type: 'string' },
            type: 'array',
          },
          reference_observation: { type: 'string' },
          shooting_guide: { type: 'string' },
          time_range: { type: 'string' },
          why_this_beat_exists: { type: 'string' },
        },
        required: [
          'id',
          'time_range',
          'execution_title',
          'reference_observation',
          'line_to_say',
          'shooting_guide',
          'why_this_beat_exists',
          'my_take_success_criteria',
        ],
        type: 'object',
      },
      type: 'array',
    },
    hook: {
      additionalProperties: false,
      properties: {
        adaptation_rule: { type: 'string' },
        category: { type: 'string' },
        formula: { type: 'string' },
        spoken_hook: { type: 'string' },
        visual_hook: { type: 'string' },
        why_it_works: { type: 'string' },
      },
      required: [
        'category',
        'formula',
        'spoken_hook',
        'visual_hook',
        'why_it_works',
        'adaptation_rule',
      ],
      type: 'object',
    },
    idea_analysis: {
      additionalProperties: false,
      properties: {
        common_belief_to_challenge: { type: 'string' },
        contrarian_reality: { type: 'string' },
        idea_seed: { type: 'string' },
        supporting_evidence: { items: { type: 'string' }, type: 'array' },
        topic: { type: 'string' },
        unique_angle: { type: 'string' },
        user_application: { type: 'string' },
      },
      required: [
        'topic',
        'idea_seed',
        'unique_angle',
        'common_belief_to_challenge',
        'contrarian_reality',
        'supporting_evidence',
        'user_application',
      ],
      type: 'object',
    },
    proof_structure: {
      additionalProperties: false,
      properties: {
        proof_points: { items: { type: 'string' }, type: 'array' },
        risk_or_gap: { type: 'string' },
        trust_signals: { items: { type: 'string' }, type: 'array' },
      },
      required: ['proof_points', 'trust_signals', 'risk_or_gap'],
      type: 'object',
    },
    reference: {
      additionalProperties: false,
      properties: {
        creator_handle: { type: ['string', 'null'] },
        duration_seconds: { type: ['number', 'null'] },
        language: { type: 'string' },
        platform: { type: 'string' },
        source_url: { type: 'string' },
        thumbnail_description: { type: 'string' },
        title: { type: ['string', 'null'] },
      },
      required: [
        'source_url',
        'platform',
        'creator_handle',
        'title',
        'duration_seconds',
        'language',
        'thumbnail_description',
      ],
      type: 'object',
    },
    schema_version: { const: 'parrotkit.reference_breakdown.v1' },
    shooting_projection: {
      additionalProperties: false,
      properties: {
        board_title: { type: 'string' },
        cut_rows: {
          items: {
            additionalProperties: false,
            properties: {
              cut_id: { type: 'string' },
              execution_title: { type: 'string' },
              line_to_say: { type: 'string' },
              my_take_relationship: { type: 'string' },
              reference_usage: { type: 'string' },
              shot_guide: { type: 'string' },
            },
            required: [
              'cut_id',
              'execution_title',
              'line_to_say',
              'shot_guide',
              'reference_usage',
              'my_take_relationship',
            ],
            type: 'object',
          },
          type: 'array',
        },
        video_level_breakdown: {
          items: {
            additionalProperties: false,
            properties: {
              label: {
                enum: referenceAnalysisSandcastleSectionLabels,
                type: 'string',
              },
              value: { type: 'string' },
            },
            required: ['label', 'value'],
            type: 'object',
          },
          type: 'array',
        },
      },
      required: ['board_title', 'video_level_breakdown', 'cut_rows'],
      type: 'object',
    },
    storytelling_format: {
      additionalProperties: false,
      properties: {
        beat_order: { items: { type: 'string' }, type: 'array' },
        category: { type: 'string' },
        description: { type: 'string' },
        reuse_when: { type: 'string' },
        why_it_works: { type: 'string' },
      },
      required: [
        'category',
        'description',
        'beat_order',
        'why_it_works',
        'reuse_when',
      ],
      type: 'object',
    },
    summary: {
      additionalProperties: false,
      properties: {
        audience: { type: 'string' },
        one_liner: { type: 'string' },
        promise: { type: 'string' },
        why_viewers_keep_watching: { type: 'string' },
      },
      required: [
        'one_liner',
        'audience',
        'promise',
        'why_viewers_keep_watching',
      ],
      type: 'object',
    },
    transcript: {
      additionalProperties: false,
      properties: {
        clean: { type: 'string' },
        notable_lines: {
          items: {
            additionalProperties: false,
            properties: {
              line: { type: 'string' },
              time_range: { type: 'string' },
              why_it_matters: { type: 'string' },
            },
            required: ['time_range', 'line', 'why_it_matters'],
            type: 'object',
          },
          type: 'array',
        },
        raw: { items: { type: 'string' }, type: 'array' },
      },
      required: ['raw', 'clean', 'notable_lines'],
      type: 'object',
    },
    vault_candidates: {
      additionalProperties: false,
      properties: {
        channel: {
          additionalProperties: false,
          properties: {
            creator_handle: { type: ['string', 'null'] },
            why_follow: { type: 'string' },
          },
          required: ['creator_handle', 'why_follow'],
          type: 'object',
        },
        hook: {
          additionalProperties: false,
          properties: {
            category: { type: 'string' },
            formula: { type: 'string' },
          },
          required: ['formula', 'category'],
          type: 'object',
        },
        idea: {
          additionalProperties: false,
          properties: {
            tags: { items: { type: 'string' }, type: 'array' },
            title: { type: 'string' },
          },
          required: ['title', 'tags'],
          type: 'object',
        },
        story_format: {
          additionalProperties: false,
          properties: {
            name: { type: 'string' },
            tags: { items: { type: 'string' }, type: 'array' },
          },
          required: ['name', 'tags'],
          type: 'object',
        },
        visual_layout: {
          additionalProperties: false,
          properties: {
            name: { type: 'string' },
            tags: { items: { type: 'string' }, type: 'array' },
          },
          required: ['name', 'tags'],
          type: 'object',
        },
      },
      required: ['idea', 'hook', 'story_format', 'visual_layout', 'channel'],
      type: 'object',
    },
    visual_layout: {
      additionalProperties: false,
      properties: {
        camera_motion: { type: 'string' },
        caption_strategy: { type: 'string' },
        category: { type: 'string' },
        framing: { type: 'string' },
        sub_category: { type: 'string' },
        subject_product_relationship: { type: 'string' },
        user_application: { type: 'string' },
      },
      required: [
        'category',
        'sub_category',
        'framing',
        'camera_motion',
        'caption_strategy',
        'subject_product_relationship',
        'user_application',
      ],
      type: 'object',
    },
  },
  required: [
    'schema_version',
    'reference',
    'summary',
    'transcript',
    'idea_analysis',
    'hook',
    'storytelling_format',
    'visual_layout',
    'proof_structure',
    'cuts',
    'shooting_projection',
    'vault_candidates',
    'confidence',
  ],
  type: 'object',
} as const;

const systemPrompt = [
  "You are ParrotKit's reference-video analyst.",
  'Return only valid JSON matching schema_version "parrotkit.reference_breakdown.v1".',
  'Preserve Sandcastle-level insight in Summary, Transcript, Idea Analysis, Hook, Storytelling, and Visual Layout.',
  'Keep hook analysis video-level. Do not assign a generic hook to every cut.',
  'Segment cuts only on visible or spoken beat changes: shot, product state, proof, instruction, CTA, or major pacing change.',
  'Use creator-action execution titles, not taxonomy names. Prefer "Open on the finished look" over "Hook".',
  'Keep shooting_projection compact and mobile filming friendly.',
  'Do not place analysis labels, confidence, model, prompt, provider, or debug metadata in cut_rows.',
  'If transcript is unavailable, produce a visual-only partial analysis from frames and metadata when enough visual evidence exists.',
  'Do not invent unsupported specifics. Use "Unknown from provided evidence" when evidence is missing.',
].join('\n');

export function createReferenceAnalysisPrompt(
  input: ReferenceAnalysisPromptInput,
): ReferenceAnalysisPromptContract {
  const normalized = normalizePromptInput(input);

  return {
    outputSchema: referenceAnalysisPromptJsonSchema,
    outputSchemaName: referenceAnalysisPromptSchemaName,
    responseFormat: {
      jsonSchema: referenceAnalysisPromptJsonSchema,
      name: referenceAnalysisPromptSchemaName,
      strict: true,
      type: 'json_schema',
    },
    system: systemPrompt,
    user: [
      'Analyze this short-form reference and return a single JSON object.',
      '',
      `metadata: ${JSON.stringify(normalized.metadata)}`,
      `normalized_media: ${JSON.stringify(normalized.media)}`,
      `transcript_status: ${normalized.transcriptStatus}`,
      `transcript_segments: ${JSON.stringify(normalized.transcriptSegments)}`,
      `frame_descriptions: ${JSON.stringify(normalized.frameDescriptions)}`,
      `optional_user_context: ${JSON.stringify(normalized.optionalUserContext)}`,
      '',
      'Board projection rules:',
      '- cut_rows.execution_title must be an action name a creator can perform.',
      '- cut_rows.reference_usage says what to borrow from the reference.',
      '- cut_rows.my_take_relationship says how the user should adapt it in their own take.',
      '- Never put Hook, Proof, Storytelling, Visual Layout, confidence, model, prompt, provider, or debug labels in cut_rows.',
    ].join('\n'),
  };
}

export function hasReferenceAnalysisForbiddenBoardLabel(
  value?: string | null,
) {
  if (!value) return false;

  const normalized = value.trim().toLowerCase();
  if (!normalized) return false;

  return referenceAnalysisForbiddenBoardLabels.some((label) => {
    const forbidden = label.toLowerCase();
    return normalized === forbidden || normalized.startsWith(`${forbidden}:`);
  });
}

function normalizePromptInput(input: ReferenceAnalysisPromptInput) {
  const transcriptSegments = input.transcriptSegments ?? [];
  const frameDescriptions = input.frameDescriptions ?? [];

  return {
    frameDescriptions,
    media: input.media,
    metadata: {
      ...input.metadata,
      source: input.media.source,
      duration_ms: input.media.durationMs,
      dimensions: input.media.dimensions,
      mime_type: input.media.mimeType,
    },
    optionalUserContext: input.optionalUserContext ?? null,
    transcriptSegments,
    transcriptStatus:
      transcriptSegments.length > 0 ? 'available' : 'transcript_unavailable',
  };
}
