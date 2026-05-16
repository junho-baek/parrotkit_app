# Sandcastle-Style Reference Breakdown Schema And Prompt

This document defines the durable reference-analysis payload ParrotKit should extract from a short-form reference video. It is intentionally richer than the shooting board UI. The board should only consume `shooting_projection`.

## Product Boundary

- `reference_media` is the video/image the creator is learning from.
- `my_take` is the user's filmed result.
- `hook` is video-level unless the first cut is specifically the opening hook.
- `cuts` describe observable beats in the reference, not generic template cards.
- `shooting_projection` is the compact execution layer shown in the board.

## JSON Schema

```json
{
  "schema_version": "parrotkit.reference_breakdown.v1",
  "reference": {
    "source_url": "string",
    "platform": "tiktok | instagram | youtube | unknown",
    "creator_handle": "string | null",
    "title": "string | null",
    "duration_seconds": "number | null",
    "language": "string",
    "thumbnail_description": "string"
  },
  "summary": {
    "one_liner": "string",
    "audience": "string",
    "promise": "string",
    "why_viewers_keep_watching": "string"
  },
  "transcript": {
    "raw": ["string"],
    "clean": "string",
    "notable_lines": [
      {
        "time_range": "0:00-0:03",
        "line": "string",
        "why_it_matters": "string"
      }
    ]
  },
  "idea_analysis": {
    "topic": "string",
    "idea_seed": "string",
    "unique_angle": "string",
    "common_belief_to_challenge": "string",
    "contrarian_reality": "string",
    "supporting_evidence": ["string"],
    "user_application": "string"
  },
  "hook": {
    "category": "authority | problem | question | comparison | list | contrarian | curiosity | proof | other",
    "formula": "string with placeholders",
    "spoken_hook": "string",
    "visual_hook": "string",
    "why_it_works": "string",
    "adaptation_rule": "string"
  },
  "storytelling_format": {
    "category": "listicle | review | demo | before_after | case_study | tutorial | vlog | comparison | other",
    "description": "string",
    "beat_order": ["string"],
    "why_it_works": "string",
    "reuse_when": "string"
  },
  "visual_layout": {
    "category": "in_world_vlog | product_demo | talking_head | hands_only | screen_led | hybrid | other",
    "sub_category": "string",
    "framing": "string",
    "camera_motion": "string",
    "caption_strategy": "string",
    "subject_product_relationship": "string",
    "user_application": "string"
  },
  "proof_structure": {
    "proof_points": ["string"],
    "trust_signals": ["string"],
    "risk_or_gap": "string"
  },
  "cuts": [
    {
      "id": "cut-1",
      "time_range": "0:00-0:05",
      "execution_title": "string",
      "reference_observation": "string",
      "line_to_say": "string",
      "shooting_guide": "string",
      "why_this_beat_exists": "string",
      "my_take_success_criteria": ["string"]
    }
  ],
  "shooting_projection": {
    "board_title": "string",
    "video_level_breakdown": [
      {
        "label": "Video hook",
        "value": "string"
      },
      {
        "label": "Why this works",
        "value": "string"
      },
      {
        "label": "Idea angle",
        "value": "string"
      },
      {
        "label": "Story format",
        "value": "string"
      },
      {
        "label": "Visual layout",
        "value": "string"
      },
      {
        "label": "Proof points",
        "value": "string"
      }
    ],
    "cut_rows": [
      {
        "cut_id": "cut-1",
        "execution_title": "string",
        "line_to_say": "string",
        "shot_guide": "string",
        "reference_usage": "string",
        "my_take_relationship": "string"
      }
    ]
  },
  "vault_candidates": {
    "idea": {
      "title": "string",
      "tags": ["string"]
    },
    "hook": {
      "formula": "string",
      "category": "string"
    },
    "story_format": {
      "name": "string",
      "tags": ["string"]
    },
    "visual_layout": {
      "name": "string",
      "tags": ["string"]
    },
    "channel": {
      "creator_handle": "string | null",
      "why_follow": "string"
    }
  },
  "confidence": {
    "overall": 0,
    "transcript": 0,
    "visual": 0,
    "cut_segmentation": 0,
    "notes": ["string"]
  }
}
```

## Extraction Prompt

```text
You are ParrotKit's reference-video analyst. Analyze the provided short-form reference video, transcript, frame descriptions, and metadata. Return only valid JSON matching schema_version "parrotkit.reference_breakdown.v1".

Inputs:
- metadata: {{metadata_json}}
- transcript: {{transcript_text_or_segments}}
- frame_descriptions: {{frame_descriptions_with_timestamps}}
- optional_user_context: {{creator_goal_niche_product_audience}}

Rules:
1. Do not invent specifics that are not supported by transcript, frames, or metadata.
2. If a field is unknown, use null for scalar metadata or a short "Unknown from provided evidence" note inside analysis fields.
3. Keep hook analysis video-level. Do not assign a generic hook to every cut.
4. Segment cuts only when there is a visible or spoken beat change: new shot, new product state, new proof, new instruction, new CTA, or major pacing change.
5. Every cut must include a time_range, execution_title, reference_observation, line_to_say, shooting_guide, why_this_beat_exists, and my_take_success_criteria.
6. Use execution titles a creator can act on, not taxonomy names. Prefer "Open on the finished look" over "Hook".
7. Keep shooting_projection compact. It should be suitable for a mobile filming board, not an analysis dashboard.
8. Distinguish reference_media from my_take: reference_media is what the creator studies; my_take is the user's filmed result.
9. Preserve Sandcastle-level insight in idea_analysis, hook, storytelling_format, visual_layout, proof_structure, and vault_candidates.
10. Use concise English. Do not include markdown fences, commentary, or extra keys outside the schema.

Output requirements:
- Return a single JSON object.
- All arrays must be present, even if empty.
- confidence values must be numbers from 0 to 1.
- time_range values must use "m:ss-m:ss".
- For placeholders in hook.formula, use bracket notation like "[product]", "[audience]", "[result]", "[time period]".

Before returning JSON, internally check:
- Is the board projection useful while filming?
- Did I avoid box-in-box UI concepts and analysis-console clutter?
- Did I avoid repeating hook metadata on every cut?
- Did each cut explain how the reference should be used and what a successful My Take looks like?
```

## UI Projection Guidance

Only these fields should normally reach the mobile execution screen:

- Board row: `cut.execution_title`
- Compact tools: `cut.line_to_say`, `cut.shooting_guide`
- Reference viewer: `cut.reference_observation`, time range, media frame
- My Take state: saved take count/final take/retake action
- Breakdown tab: `shooting_projection.video_level_breakdown`

Everything else is stored for future generation, search, vaults, and recipe refinement.
