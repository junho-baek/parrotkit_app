export type ReferenceBreakdownSchemaVersion = 'parrotkit.reference_breakdown.v1';

export type ReferenceBreakdownPlatform =
  | 'tiktok'
  | 'instagram'
  | 'youtube'
  | 'unknown';

export type ReferenceBreakdownHookCategory =
  | 'authority'
  | 'problem'
  | 'question'
  | 'comparison'
  | 'list'
  | 'contrarian'
  | 'curiosity'
  | 'proof'
  | 'other';

export type ReferenceBreakdownStorytellingCategory =
  | 'listicle'
  | 'review'
  | 'demo'
  | 'before_after'
  | 'case_study'
  | 'tutorial'
  | 'vlog'
  | 'comparison'
  | 'other';

export type ReferenceBreakdownVisualCategory =
  | 'in_world_vlog'
  | 'product_demo'
  | 'talking_head'
  | 'hands_only'
  | 'screen_led'
  | 'hybrid'
  | 'other';

export type ReferenceBreakdownVideoSectionLabel =
  | 'Summary'
  | 'Transcript'
  | 'Idea Analysis'
  | 'Hook'
  | 'Storytelling'
  | 'Visual Layout';

export type ReferenceBreakdown = {
  schema_version: ReferenceBreakdownSchemaVersion;
  reference: {
    source_url: string;
    platform: ReferenceBreakdownPlatform;
    creator_handle: string | null;
    title: string | null;
    duration_seconds: number | null;
    language: string;
    thumbnail_description: string;
  };
  summary: {
    one_liner: string;
    audience: string;
    promise: string;
    why_viewers_keep_watching: string;
  };
  transcript: {
    clean: string;
    notable_lines: Array<{
      line: string;
      time_range: string;
      why_it_matters: string;
    }>;
    raw: string[];
  };
  idea_analysis: {
    common_belief_to_challenge: string;
    contrarian_reality: string;
    idea_seed: string;
    supporting_evidence: string[];
    topic: string;
    unique_angle: string;
    user_application: string;
  };
  hook: {
    adaptation_rule: string;
    category: ReferenceBreakdownHookCategory;
    formula: string;
    spoken_hook: string;
    visual_hook: string;
    why_it_works: string;
  };
  storytelling_format: {
    beat_order: string[];
    category: ReferenceBreakdownStorytellingCategory;
    description: string;
    reuse_when: string;
    why_it_works: string;
  };
  visual_layout: {
    camera_motion: string;
    caption_strategy: string;
    category: ReferenceBreakdownVisualCategory;
    framing: string;
    sub_category: string;
    subject_product_relationship: string;
    user_application: string;
  };
  proof_structure: {
    proof_points: string[];
    trust_signals: string[];
    risk_or_gap: string;
  };
  cuts: Array<{
    id: string;
    time_range: string;
    execution_title: string;
    reference_observation: string;
    line_to_say: string;
    shooting_guide: string;
    why_this_beat_exists: string;
    my_take_success_criteria: string[];
  }>;
  shooting_projection: {
    board_title: string;
    video_level_breakdown: Array<{
      label: ReferenceBreakdownVideoSectionLabel;
      value: string;
    }>;
    cut_rows: Array<{
      cut_id: string;
      execution_title: string;
      line_to_say: string;
      shot_guide: string;
      reference_usage: string;
      my_take_relationship: string;
    }>;
  };
  vault_candidates: {
    idea: {
      title: string;
      tags: string[];
    };
    hook: {
      formula: string;
      category: string;
    };
    story_format: {
      name: string;
      tags: string[];
    };
    visual_layout: {
      name: string;
      tags: string[];
    };
    channel: {
      creator_handle: string | null;
      why_follow: string;
    };
  };
  confidence: {
    overall: number;
    transcript: number;
    visual: number;
    cut_segmentation: number;
    notes: string[];
  };
};

export type RecipeAnalysisMetadata = Record<string, unknown> & {
  reference_breakdown?: ReferenceBreakdown;
};
