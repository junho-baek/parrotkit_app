# Issue 31 Source Timestamp Mapping and Playback Links Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish GitHub issue #31 only by ensuring sourceFaithful cuts use transcript-derived source spans and app board cuts can open the original YouTube reference at the selected cut timestamp.

**Architecture:** Keep the #29/#30 sourceFaithful and Breakdown work intact. Tighten the Go timestamp resolver so any available transcript timestamp remains the primary source, then map API cutBoard spans into the app's shooting board projection and generate timestamped YouTube `t=` links from those spans. Wire the existing preview action to open external timestamp links while preserving local playable reference behavior.

**Tech Stack:** Go reference API, `superdata.TranscriptSegment`, TypeScript domain mapping, React Native `Linking`, sucrase-node focused tests, `tsc --noEmit`.

---

## 배경

- GitHub issue #31 covers source timestamp mapping and reference playback links only.
- Current `HEAD` includes `308e549 feat: ground reference recipe variants` and `269b727 feat: structure reference breakdown artifact`.
- Existing backend sourceFaithful cuts already preserve transcript text, source-specific signals, and direct transcript spans when scene index and transcript index align.
- Audit gap: `sourceTimeRangeForScene` falls back to generated scene duration accumulation when a draft scene has no same-index transcript segment, even if other timestamped transcript segments exist.
- Existing app `ShootingBoardProjectionItem` already has `referenceMediaRef` and `sourceTimeRangeMs`, but `mapShootingBoardProjectionToCuts` currently uses the raw recipe reference URL rather than a YouTube `t=` link.
- Existing generated reference flow maps the API recipe scenes but does not preserve the API cutBoard as a `shooting_board_projection`, so generated boards can lose cut-level source spans.
- User instruction overrides normal repo commit/push rules: Hermes will verify, commit, comment, and close. Do not stage, commit, push, comment on GitHub, or close the issue.

## 목표

- CutBoard items use transcript segment start/end times whenever timestamped transcript data exists.
- Generated duration accumulation is used only when no valid transcript timestamp span exists.
- Every sourceFaithful cut keeps original transcript beat text, source-specific signal/template data, and a concrete source timestamp/transcript span.
- App domain board cuts generated from `ShootingBoardProjectionItem` expose timestamped original YouTube links with `t=<seconds>`.
- The recipe detail preview action opens the external timestamp link for YouTube references and keeps the in-app reference modal for local playable media.
- API reference generation preserves cutBoard source spans in `referenceBreakdown.shooting_board_projection` without implementing sibling #32 UI freshness behavior.

## 범위

- In scope: Go response builder timestamp resolution and tests; TypeScript projection/link mapping; generated API cutBoard-to-projection preservation; recipe detail external open wiring; focused tests; context documentation.
- Out of scope: broad UI freshness/race reconciliation for #32, live/deployed smoke for #33, embedded YouTube player, Instagram/TikTok playback, Notion upload, staging, commit, push, issue close.

## 변경 파일

- Modify: `services/reference-api/internal/analysis/response_builder.go`
- Modify: `services/reference-api/internal/analysis/response_builder_test.go`
- Modify: `parrotkit-app/src/domain/shoot-board/shoot-board-model.ts`
- Modify: `parrotkit-app/src/domain/shoot-board/shoot-board-projection.ts`
- Modify: `parrotkit-app/src/domain/shoot-board/shoot-board-projection.test.ts`
- Modify: `parrotkit-app/src/features/recipes/lib/reference-recipe-generation.ts`
- Modify: `parrotkit-app/src/features/recipes/lib/reference-recipe-generation.test.ts`
- Modify: `parrotkit-app/src/application/workspace/mock-workspace-provider.tsx`
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-create-screen.tsx`
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-detail/recipe-detail-board-state.ts`
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-detail/recipe-detail-board-state.test.ts`
- Modify if needed: `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
- Create/update at completion: `context/context_20260520_issue_31_source_timestamp_mapping_playback_links.md`
- Update at completion: `plans/20260520_issue_31_source_timestamp_mapping_playback_links_superpowers.md`

## 테스트

- `cd services/reference-api && go test ./internal/analysis -run 'TestBuildRecipeAndBoardUsesTranscriptTimeRangesBeforeGeneratedDurations|TestBuildRecipeAndBoardReusesTranscriptTimestampWhenSceneHasNoDirectSegment|TestBuildReferenceAnalysisResponseSourceFaithfulCutsKeepTranscriptSignalsAndSpans' -count=1`
- `cd services/reference-api && go test ./...`
- `cd parrotkit-app && NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/domain/shoot-board/shoot-board-projection.test.ts`
- `cd parrotkit-app && NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/reference-recipe-generation.test.ts`
- `cd parrotkit-app && NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-board-state.test.ts`
- `npx --prefix parrotkit-app tsc --noEmit -p parrotkit-app/tsconfig.json`
- `git diff --check`

## 롤백

- Revert this plan, the issue #31 context file, and the focused edits listed under 변경 파일.
- No database, env, deployment, Notion, GitHub issue, staging, commit, or push changes are part of this plan.

## 리스크

- `go test ./...` may hit sandbox loopback bind failures in provider tests, as recorded by #29/#30 contexts. If that occurs, record focused passing tests and the sandbox blocker.
- Current working tree contains unrelated untracked context, plan, and QA output files. Preserve them.
- Opening external YouTube links is v1 behavior; embedded playback remains out of scope.
- The repo is currently on `main`, but the user explicitly selected this clone and forbade commit/push. Keep changes unstaged and issue-scoped.

---

### Task 1: Prove Timestamped Transcript Spans Stay Primary

**Files:**
- Modify: `services/reference-api/internal/analysis/response_builder_test.go`
- Modify: `services/reference-api/internal/analysis/response_builder.go`

- [x] **Step 1: Add a focused failing Go test for no-direct-segment fallback**

Add this test near `TestBuildRecipeAndBoardUsesTranscriptTimeRangesBeforeGeneratedDurations`:

```go
func TestBuildRecipeAndBoardReusesTranscriptTimestampWhenSceneHasNoDirectSegment(t *testing.T) {
	thumb := "https://cdn.example/thumb.jpg"
	media := &contracts.ReferenceMedia{ThumbnailURL: &thumb}
	draft := RecipeDraft{
		Title: "Reference board",
		Scenes: []RecipeDraftScene{
			{Title: "First beat", DurationSec: 2},
			{Title: "Second beat", DurationSec: 8},
		},
	}
	transcript := []superdata.TranscriptSegment{
		{ID: "seg-1", StartMs: 11000, EndMs: 17000, Text: "Only timestamped transcript beat."},
	}

	_, board, cuts := buildRecipeAndBoard(draft, media, transcript, "media-1")

	if len(board.Items) != 2 {
		t.Fatalf("items = %#v", board.Items)
	}
	secondRef := board.Items[1].ReferenceMediaRef
	if secondRef.StartMs != 11000 || secondRef.EndMs != 17000 {
		t.Fatalf("second reference range should reuse transcript timestamp, got %#v", secondRef)
	}
	if secondRef.StartMs == 2000 || secondRef.EndMs == 10000 {
		t.Fatalf("second reference range used generated duration accumulation: %#v", secondRef)
	}
	if ids := cuts[1]["source_transcript_ids"].([]string); len(ids) != 1 || ids[0] != "seg-1" {
		t.Fatalf("second cut transcript ids = %#v", cuts[1]["source_transcript_ids"])
	}
	if text := cuts[1]["source_transcript_text"]; text != "Only timestamped transcript beat." {
		t.Fatalf("second cut transcript text = %#v", text)
	}
}
```

- [x] **Step 2: Run the focused Go timestamp tests and confirm failure before implementation**

Run:

```bash
cd services/reference-api && go test ./internal/analysis -run 'TestBuildRecipeAndBoardUsesTranscriptTimeRangesBeforeGeneratedDurations|TestBuildRecipeAndBoardReusesTranscriptTimestampWhenSceneHasNoDirectSegment' -count=1
```

Expected before implementation: `TestBuildRecipeAndBoardReusesTranscriptTimestampWhenSceneHasNoDirectSegment` fails with second range `2000..10000`.

- [x] **Step 3: Replace generated-duration fallback when timestamped transcript spans exist**

In `services/reference-api/internal/analysis/response_builder.go`, add helpers near `sourceTimeRangeForScene` and update `sourceTimeRangeForScene`, `transcriptLine`, and `transcriptIDsForScene` to use them:

```go
func sourceTimeRangeForScene(transcript []superdata.TranscriptSegment, index int, fallbackStartMs int, fallbackEndMs int) (int, int) {
	if segment, ok := timedTranscriptSegmentForScene(transcript, index); ok {
		return segment.StartMs, segment.EndMs
	}
	return fallbackStartMs, fallbackEndMs
}

func transcriptLine(transcript []superdata.TranscriptSegment, index int) string {
	if segment, ok := transcriptSegmentForScene(transcript, index); ok {
		return strings.TrimSpace(segment.Text)
	}
	return ""
}

func transcriptIDsForScene(transcript []superdata.TranscriptSegment, index int) []string {
	if segment, ok := transcriptSegmentForScene(transcript, index); ok && segment.ID != "" {
		return []string{segment.ID}
	}
	return []string{}
}

func transcriptSegmentForScene(transcript []superdata.TranscriptSegment, index int) (superdata.TranscriptSegment, bool) {
	if len(transcript) == 0 {
		return superdata.TranscriptSegment{}, false
	}
	if index < 0 {
		index = 0
	}
	if index >= len(transcript) {
		index = len(transcript) - 1
	}
	return transcript[index], true
}

func timedTranscriptSegmentForScene(transcript []superdata.TranscriptSegment, index int) (superdata.TranscriptSegment, bool) {
	if segment, ok := transcriptSegmentForScene(transcript, index); ok && segment.EndMs > segment.StartMs {
		return segment, true
	}
	for offset := 1; offset < len(transcript); offset++ {
		before := index - offset
		if before >= 0 && before < len(transcript) && transcript[before].EndMs > transcript[before].StartMs {
			return transcript[before], true
		}
		after := index + offset
		if after >= 0 && after < len(transcript) && transcript[after].EndMs > transcript[after].StartMs {
			return transcript[after], true
		}
	}
	return superdata.TranscriptSegment{}, false
}
```

- [x] **Step 4: Run focused Go timestamp/sourceFaithful tests**

Run:

```bash
cd services/reference-api && go test ./internal/analysis -run 'TestBuildRecipeAndBoardUsesTranscriptTimeRangesBeforeGeneratedDurations|TestBuildRecipeAndBoardReusesTranscriptTimestampWhenSceneHasNoDirectSegment|TestBuildReferenceAnalysisResponseSourceFaithfulCutsKeepTranscriptSignalsAndSpans' -count=1
```

Expected: PASS.

### Task 2: Generate Timestamped YouTube Links from Projection Spans

**Files:**
- Modify: `parrotkit-app/src/domain/shoot-board/shoot-board-model.ts`
- Modify: `parrotkit-app/src/domain/shoot-board/shoot-board-projection.ts`
- Modify: `parrotkit-app/src/domain/shoot-board/shoot-board-projection.test.ts`

- [x] **Step 1: Preserve projection source milliseconds on board cuts**

In `ShootBoardCut`, add:

```ts
  sourceTimeRangeMs?: {
    endMs: number;
    startMs: number;
  };
```

In `mapProjectionItemToCut`, add:

```ts
    sourceTimeRangeMs: { ...item.sourceTimeRangeMs },
```

- [x] **Step 2: Add timestamp-link helpers**

In `parrotkit-app/src/domain/shoot-board/shoot-board-projection.ts`, replace `getProjectionCutReferenceVideoSource` with a version that uses the projection item:

```ts
export function getProjectionCutReferenceVideoSource({
  item,
  recipe,
}: {
  item: ShootingBoardProjectionItem;
  recipe: NativeRecipe;
}) {
  const originalSource = getOriginalYouTubeSourceUrl(recipe);

  if (originalSource) {
    return createYouTubeTimestampUrl({
      sourceUrl: originalSource,
      startMs: item.sourceTimeRangeMs.startMs,
    });
  }

  return recipe.referenceVideoSource ?? recipe.sourceUrl;
}

export function createYouTubeTimestampUrl({
  sourceUrl,
  startMs,
}: {
  sourceUrl: string;
  startMs: number;
}) {
  const trimmed = sourceUrl.trim();
  if (!trimmed) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (!isYouTubeHost(parsed.hostname)) {
      return trimmed;
    }

    parsed.searchParams.set(
      't',
      String(Math.max(0, Math.floor(startMs / 1000))),
    );
    return parsed.toString();
  } catch {
    return trimmed;
  }
}

function getOriginalYouTubeSourceUrl(recipe: NativeRecipe) {
  for (const source of [recipe.sourceUrl, recipe.referenceVideoSource]) {
    if (typeof source !== 'string') {
      continue;
    }
    const trimmed = source.trim();
    if (!trimmed) {
      continue;
    }
    try {
      const parsed = new URL(trimmed);
      if (isYouTubeHost(parsed.hostname)) {
        return trimmed;
      }
    } catch {
      continue;
    }
  }

  return null;
}

function isYouTubeHost(hostname: string) {
  const normalized = hostname.toLowerCase().replace(/^www\./, '');
  return normalized === 'youtube.com' || normalized === 'youtu.be';
}
```

- [x] **Step 3: Add focused projection tests for `t=` links**

In `parrotkit-app/src/domain/shoot-board/shoot-board-projection.test.ts`, update the fixture `recipe.sourceUrl` to a YouTube Shorts URL with an existing query and `projection.items[1].sourceTimeRangeMs.startMs` to `23000` if needed. Add assertions after the existing `referenceVideoUrl` check:

```ts
if (cuts[1]?.sourceTimeRangeMs?.startMs !== 5000) {
  throw new Error('Projection board cut should preserve sourceTimeRangeMs.');
}

const youtubeRecipe = {
  ...recipe,
  id: 'recipe_youtube_reference',
  referenceVideoSource: undefined,
  sourceUrl: 'https://youtube.com/shorts/ySDpL4wUX7Y?si=abc',
};
const youtubeProjection: ShootingBoardProjection = {
  ...projection,
  items: projection.items.map((item, index) => ({
    ...item,
    referenceMediaRef: {
      ...item.referenceMediaRef,
      startMs: index === 0 ? 0 : 23000,
      endMs: index === 0 ? 5000 : 31000,
    },
    sourceTimeRangeMs: {
      startMs: index === 0 ? 0 : 23000,
      endMs: index === 0 ? 5000 : 31000,
    },
  })),
};
const youtubeCuts = mapShootingBoardProjectionToCuts({
  projection: youtubeProjection,
  recipe: youtubeRecipe,
});

if (youtubeCuts[1]?.referenceVideoUrl !== 'https://youtube.com/shorts/ySDpL4wUX7Y?si=abc&t=23') {
  throw new Error(`YouTube projection cut should use timestamped source link. Found: ${youtubeCuts[1]?.referenceVideoUrl}`);
}
```

- [x] **Step 4: Run the focused projection test**

Run:

```bash
cd parrotkit-app && NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/domain/shoot-board/shoot-board-projection.test.ts
```

Expected: PASS.

### Task 3: Preserve API CutBoard Spans in Generated Recipe Projections

**Files:**
- Modify: `parrotkit-app/src/features/recipes/lib/reference-recipe-generation.ts`
- Modify: `parrotkit-app/src/features/recipes/lib/reference-recipe-generation.test.ts`
- Modify: `parrotkit-app/src/application/workspace/mock-workspace-provider.tsx`
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-create-screen.tsx`

- [x] **Step 1: Extend generated result and API cutBoard types**

In `ReferenceRecipeGenerationResult`, add:

```ts
  referenceBreakdown?: ReferenceBreakdown;
```

Import the needed types:

```ts
import type { ReferenceBreakdown, ReferenceBreakdownBoardVariantId } from '@/domain/recipes/reference-breakdown';
import type { ShootingBoardProjection } from '@/domain/recipes/reference-analysis-contract';
```

Extend `ReferenceAnalysisAPIResponse['cutBoard']` with variants:

```ts
    variants?: Partial<
      Record<
        ReferenceBreakdownBoardVariantId,
        {
          boardTitle?: string;
          estimatedDurationSeconds?: number;
          items?: ReferenceAnalysisAPICutBoardItem[];
          label?: string;
        }
      >
    >;
```

- [x] **Step 2: Add cutBoard-to-projection helpers**

Add these helpers below `hasReferenceThumbnail`:

```ts
function mapApiCutBoardToProjection({
  apiResponse,
  boardTitle,
  items,
  projectionId,
  referenceUrl,
}: {
  apiResponse: ReferenceAnalysisAPIResponse;
  boardTitle: string;
  items: ReferenceAnalysisAPICutBoardItem[];
  projectionId: string;
  referenceUrl: string;
}): ShootingBoardProjection {
  const generatedAt = apiResponse.generatedAt || new Date().toISOString();
  const mediaAssetId =
    apiResponse.referenceMedia?.mediaAssetId ||
    items.find((item) => item.referenceMediaRef?.mediaAssetId)?.referenceMediaRef?.mediaAssetId ||
    apiResponse.requestId ||
    'reference-media';
  const projectionItems = items.map((item, index) => {
    const startMs = safeMilliseconds(item.referenceMediaRef?.startMs);
    const endMs = Math.max(
      safeMilliseconds(item.referenceMediaRef?.endMs),
      startMs,
    );

    return {
      durationSeconds:
        Number.isFinite(item.durationSeconds) && item.durationSeconds
          ? item.durationSeconds
          : Math.max(1, Math.ceil((endMs - startMs) / 1000)),
      editableFields: ['lineToSay', 'shotGuide', 'successCriteria'],
      executionTitle: compactText(item.executionTitle, `Cut ${index + 1}`),
      lineToSay: item.lineToSay ?? null,
      missingArtifacts: apiResponse.generation?.missingArtifacts ?? [],
      myTakeRelationship: compactText(item.myTakeRelationship, 'Apply this source beat to your own take.'),
      orderIndex: Number.isFinite(item.orderIndex) ? item.orderIndex : index,
      projectionCutId: compactText(item.projectionCutId, `cut-${index + 1}`),
      referenceMediaRef: {
        endMs,
        mediaAssetId: item.referenceMediaRef?.mediaAssetId || mediaAssetId,
        startMs,
        thumbnailUri: item.referenceMediaRef?.thumbnailUri ?? apiResponse.referenceMedia?.thumbnailUrl ?? null,
      },
      referenceObservation: compactText(item.referenceObservation, 'The source uses this beat clearly.'),
      referenceUsage: compactText(item.referenceUsage, 'Keep the same source role for this cut.'),
      shotGuide: item.shotGuide ?? null,
      sourceCutIds: item.sourceCutIds?.filter(Boolean).length
        ? item.sourceCutIds.filter(Boolean)
        : [compactText(item.projectionCutId, `cut-${index + 1}`)],
      sourceTimeRangeMs: {
        endMs,
        startMs,
      },
      successCriteria: item.successCriteria?.filter(Boolean).length
        ? item.successCriteria.filter(Boolean)
        : ['The source beat is still recognizable.'],
    };
  });

  return {
    analysisProfileVersion: 'reference-analysis-v1',
    boardTitle,
    breakdownId: apiResponse.requestId || 'reference-breakdown',
    confidence: { overall: apiResponse.status === 'ready' ? 0.82 : 0.68, notes: [] },
    createdAt: generatedAt,
    estimatedDurationSeconds:
      apiResponse.cutBoard?.estimatedDurationSeconds ??
      projectionItems.reduce((sum, item) => sum + item.durationSeconds, 0),
    items: projectionItems,
    mediaAssetId,
    mediaAssetVersion: 'v1',
    missingArtifacts: apiResponse.generation?.missingArtifacts ?? [],
    projectionId,
    projectionSchemaVersion: 'parrotkit.shooting_board_projection.v1',
    sourceCutCount: projectionItems.length,
    status: apiResponse.status === 'ready' ? 'ready' : 'partial',
    updatedAt: generatedAt,
    workspaceId: 'local',
  };
}

function mapApiResponseToReferenceBreakdown({
  apiResponse,
  referenceUrl,
}: {
  apiResponse: ReferenceAnalysisAPIResponse;
  referenceUrl: string;
}): ReferenceBreakdown | undefined {
  const sourceItems =
    apiResponse.cutBoard?.variants?.sourceFaithful?.items ??
    apiResponse.cutBoard?.items ??
    [];
  if (!sourceItems.length) {
    return undefined;
  }

  const sourceProjection = mapApiCutBoardToProjection({
    apiResponse,
    boardTitle:
      apiResponse.cutBoard?.variants?.sourceFaithful?.boardTitle ??
      apiResponse.cutBoard?.boardTitle ??
      apiResponse.recipe?.title ??
      'Reference shooting board',
    items: sourceItems,
    projectionId: `${apiResponse.requestId || 'reference'}-sourceFaithful`,
    referenceUrl,
  });
  const goalItems = apiResponse.cutBoard?.variants?.goalAdapted?.items ?? [];
  const goalProjection = goalItems.length
    ? mapApiCutBoardToProjection({
        apiResponse,
        boardTitle:
          apiResponse.cutBoard?.variants?.goalAdapted?.boardTitle ??
          apiResponse.cutBoard?.boardTitle ??
          sourceProjection.boardTitle,
        items: goalItems,
        projectionId: `${apiResponse.requestId || 'reference'}-goalAdapted`,
        referenceUrl,
      })
    : undefined;
  const existingBreakdown =
    isRecord(apiResponse.breakdown) &&
    apiResponse.breakdown.schema_version === 'parrotkit.reference_breakdown.v1'
      ? (apiResponse.breakdown as ReferenceBreakdown)
      : null;
  const mergedBreakdown = existingBreakdown ?? createMinimalReferenceBreakdown({
    apiResponse,
    referenceUrl,
    sourceProjection,
  });

  return {
    ...mergedBreakdown,
    reference: {
      ...mergedBreakdown.reference,
      source_url: referenceUrl,
    },
    shooting_board_projection: sourceProjection,
    shooting_board_projection_variants: {
      sourceFaithful: sourceProjection,
      ...(goalProjection ? { goalAdapted: goalProjection } : null),
    },
  };
}

function safeMilliseconds(value: unknown) {
  return Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
```

Also add `createMinimalReferenceBreakdown` using current API fields and projection items so fallback shape remains contract-compatible:

```ts
function createMinimalReferenceBreakdown({
  apiResponse,
  referenceUrl,
  sourceProjection,
}: {
  apiResponse: ReferenceAnalysisAPIResponse;
  referenceUrl: string;
  sourceProjection: ShootingBoardProjection;
}): ReferenceBreakdown {
  const transcriptClean = sourceProjection.items
    .map((item) => item.lineToSay)
    .filter((line): line is string => Boolean(line))
    .join(' ');

  return {
    schema_version: 'parrotkit.reference_breakdown.v1',
    reference: {
      source_url: referenceUrl,
      platform: normalizeReferencePlatform(apiResponse.referenceMedia?.platform).includes('youtube') ? 'youtube' : 'unknown',
      creator_handle: apiResponse.referenceMedia?.creatorHandle ?? null,
      title: apiResponse.referenceMedia?.title ?? apiResponse.recipe?.title ?? null,
      duration_seconds: apiResponse.referenceMedia?.durationSeconds ?? null,
      language: apiResponse.referenceMedia?.language ?? '',
      thumbnail_description: '',
    },
    summary: {
      one_liner: compactText(apiResponse.recipe?.oneLineDescription, 'A reference-led shooting recipe.'),
      audience: '',
      promise: '',
      why_viewers_keep_watching: '',
    },
    transcript: {
      clean: transcriptClean,
      notable_lines: [],
      raw: transcriptClean ? [transcriptClean] : [],
    },
    idea_analysis: {
      common_belief_to_challenge: '',
      contrarian_reality: '',
      idea_seed: '',
      supporting_evidence: [],
      topic: '',
      unique_angle: '',
      user_application: '',
    },
    hook: {
      adaptation_rule: '',
      category: 'other',
      formula: '',
      spoken_hook: sourceProjection.items[0]?.lineToSay ?? '',
      visual_hook: '',
      why_it_works: '',
    },
    storytelling_format: {
      beat_order: sourceProjection.items.map((item) => item.executionTitle),
      category: 'other',
      description: '',
      reuse_when: '',
      why_it_works: '',
    },
    visual_layout: {
      camera_motion: '',
      caption_strategy: '',
      category: 'other',
      framing: '',
      sub_category: '',
      subject_product_relationship: '',
      user_application: '',
    },
    proof_structure: {
      proof_points: [],
      trust_signals: [],
      risk_or_gap: '',
    },
    cuts: sourceProjection.items.map((item) => ({
      id: item.projectionCutId,
      time_range: `${Math.floor(item.sourceTimeRangeMs.startMs / 1000)}-${Math.floor(item.sourceTimeRangeMs.endMs / 1000)}s`,
      execution_title: item.executionTitle,
      reference_observation: item.referenceObservation,
      line_to_say: item.lineToSay ?? '',
      shooting_guide: item.shotGuide ?? '',
      why_this_beat_exists: item.referenceUsage,
      my_take_success_criteria: item.successCriteria,
    })),
    shooting_projection: {
      board_title: sourceProjection.boardTitle,
      video_level_breakdown: [],
      cut_rows: sourceProjection.items.map((item) => ({
        cut_id: item.projectionCutId,
        execution_title: item.executionTitle,
        line_to_say: item.lineToSay ?? '',
        shot_guide: item.shotGuide ?? '',
        reference_usage: item.referenceUsage,
        my_take_relationship: item.myTakeRelationship,
      })),
    },
    vault_candidates: {
      idea: { title: sourceProjection.boardTitle, tags: [] },
      hook: { formula: '', category: 'other' },
      story_format: { name: '', tags: [] },
      visual_layout: { name: '', tags: [] },
      channel: { creator_handle: apiResponse.referenceMedia?.creatorHandle ?? null, why_follow: '' },
    },
    confidence: {
      overall: sourceProjection.confidence.overall,
      transcript: sourceProjection.confidence.overall,
      visual: 0,
      cut_segmentation: sourceProjection.confidence.overall,
      notes: [],
    },
  };
}
```

- [x] **Step 3: Attach mapped breakdown to generated results**

In `mapReferenceAnalysisResponseToRecipeGenerationResult`, add `referenceBreakdown: mapApiResponseToReferenceBreakdown({ apiResponse, referenceUrl })` to the returned object.

Extend `CreateRecipeDraftInput` in `mock-workspace-provider.tsx`:

```ts
  referenceBreakdown?: ReferenceBreakdown;
```

Import `ReferenceBreakdown` there and assign it into the recipe:

```ts
      referenceBreakdown,
      analysisMetadata: referenceBreakdown
        ? { reference_breakdown: referenceBreakdown }
        : undefined,
```

In `recipe-create-screen.tsx`, pass:

```ts
            referenceBreakdown: referenceResult.referenceBreakdown,
```

- [x] **Step 4: Add focused generation mapping assertions**

In `parrotkit-app/src/features/recipes/lib/reference-recipe-generation.test.ts`, after `mappedReadyResult`, add:

```ts
const mappedProjection = mappedReadyResult.referenceBreakdown?.shooting_board_projection;
if (!mappedProjection || mappedProjection.items.length !== 2) {
  throw new Error('Ready API responses should preserve cutBoard as a shooting board projection.');
}

if (
  mappedProjection.items[1]?.sourceTimeRangeMs.startMs !== 6000 ||
  mappedProjection.items[1]?.sourceTimeRangeMs.endMs !== 20000
) {
  throw new Error('Generated projection should preserve API cutBoard timestamp spans.');
}
```

- [x] **Step 5: Run the focused generation test**

Run:

```bash
cd parrotkit-app && NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/reference-recipe-generation.test.ts
```

Expected: PASS.

### Task 4: Expose Selected-Cut Playback Open Data and Wire the Preview Action

**Files:**
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-detail/recipe-detail-board-state.ts`
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-detail/recipe-detail-board-state.test.ts`
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`

- [x] **Step 1: Add selected-cut playback open data helper**

In `recipe-detail-board-state.ts`, add:

```ts
export type CutReferencePlaybackOpenData = {
  cutId: string;
  url: string;
};

export function getCutReferencePlaybackOpenData(
  cut: ShootBoardCut | null,
): CutReferencePlaybackOpenData | null {
  const source = cut?.referenceVideoUrl;
  if (typeof source !== "string") {
    return null;
  }

  const trimmed = source.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return null;
  }

  return {
    cutId: cut.id,
    url: trimmed,
  };
}
```

Also update `hydrateShootBoardReferenceMedia` to copy `sourceTimeRangeMs` from `sourceCut` when the current cut is missing it:

```ts
      sourceTimeRangeMs: cut.sourceTimeRangeMs ?? sourceCut.sourceTimeRangeMs,
```

Include this field in the changed comparison.

- [x] **Step 2: Add focused board-state playback assertions**

In `recipe-detail-board-state.test.ts`, include `getCutReferencePlaybackOpenData` in the require destructuring. Add a small board fixture after the variant projection assertions:

```ts
const playbackProjection = createProjection({
  boardTitle: "Timestamp board",
  lineToSay: "20 then 40 then 80.",
  projectionId: "projection-playback",
  startMs: 23000,
});
const playbackRecipe = {
  id: "recipe-playback",
  creator: "@source",
  goal: "Reference study",
  niche: "Fitness",
  notes: "",
  platform: "YouTube Shorts",
  savedAt: "2026-05-20T00:00:00.000Z",
  scenes: [],
  sourceUrl: "https://youtube.com/shorts/ySDpL4wUX7Y?si=abc",
  summary: "Timestamp playback fixture.",
  thumbnail: "mock://thumb",
  title: "Timestamp playback fixture",
  referenceBreakdown: {
    shooting_board_projection: playbackProjection,
  },
};
const { createShootBoardRecipe } = require("@/features/recipes/lib/shoot-board-model") as {
  createShootBoardRecipe: typeof import("@/features/recipes/lib/shoot-board-model").createShootBoardRecipe;
};
const playbackBoard = createShootBoardRecipe(
  playbackRecipe as unknown as Parameters<typeof createShootBoardRecipe>[0],
);
const playbackOpenData = getCutReferencePlaybackOpenData(
  playbackBoard.cuts[0] ?? null,
);

if (playbackOpenData?.cutId !== "projection-playback-cut-1") {
  throw new Error(`Selected cut playback data should preserve cut id. Found: ${playbackOpenData?.cutId}`);
}

if (playbackOpenData.url !== "https://youtube.com/shorts/ySDpL4wUX7Y?si=abc&t=23") {
  throw new Error(`Selected cut playback data should expose YouTube t= link. Found: ${playbackOpenData.url}`);
}
```

Update `createProjection` to accept an optional `startMs = 0` and use it for `referenceMediaRef.startMs` and `sourceTimeRangeMs.startMs`.

- [x] **Step 3: Wire recipe detail preview to external open data**

In `recipe-detail-screen.tsx`, import `Linking` from `react-native` and `getCutReferencePlaybackOpenData` from `recipe-detail-board-state`.

Replace `openReferenceViewer` with:

```ts
  const openReferenceViewer = (cut: ShootBoardCut | null) => {
    if (!cut) return;

    const playbackOpenData = getCutReferencePlaybackOpenData(cut);
    if (playbackOpenData) {
      void Linking.openURL(playbackOpenData.url);
      return;
    }

    setReferenceViewerCutId(cut.id);
  };
```

- [x] **Step 4: Run the focused board-state test**

Run:

```bash
cd parrotkit-app && NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-board-state.test.ts
```

Expected: PASS.

### Task 5: Full Focused Verification and Documentation

**Files:**
- Create/update: `context/context_20260520_issue_31_source_timestamp_mapping_playback_links.md`
- Update: `plans/20260520_issue_31_source_timestamp_mapping_playback_links_superpowers.md`

- [x] **Step 1: Run required verification commands**

Run:

```bash
cd services/reference-api && go test ./...
cd parrotkit-app && NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/domain/shoot-board/shoot-board-projection.test.ts
cd parrotkit-app && NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/reference-recipe-generation.test.ts
cd parrotkit-app && NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-board-state.test.ts
npx --prefix parrotkit-app tsc --noEmit -p parrotkit-app/tsconfig.json
git diff --check
```

Expected: PASS unless `go test ./...` hits the known sandbox loopback bind blocker. If blocked, also run and record:

```bash
cd services/reference-api && go test ./internal/analysis ./internal/contracts ./internal/httpapi ./internal/config
```

- [x] **Step 2: Create context summary**

Create `context/context_20260520_issue_31_source_timestamp_mapping_playback_links.md` with:

```md
# 2026-05-20 Issue 31 Source Timestamp Mapping and Playback Links

## Scope

- GitHub issue #31 only.
- No sibling issue work, no live smoke, no commit, no push.

## Result

- Backend source timestamp resolution keeps transcript timestamp spans as primary whenever valid transcript timestamps exist.
- SourceFaithful cuts retain transcript beat text, source-specific template/signal fields, transcript ids, and concrete source spans.
- App shooting board projections preserve sourceTimeRangeMs and generate original YouTube `t=` links per selected cut.
- Generated API cutBoard items are preserved as referenceBreakdown shooting board projections for the recipe detail board.
- Recipe detail preview opens external timestamp links for web references and keeps the local modal path for local playable media.

## Acceptance Checklist

- PASS/PARTIAL/FAIL: CutBoard items include source time ranges derived from transcript timestamps when available.
- PASS/PARTIAL/FAIL: v1 UI/domain can open the original YouTube link at the selected cut timestamp.
- PASS/PARTIAL/FAIL: Generated duration accumulation is not used as the primary timestamp source when transcript timestamps exist.
- PASS/PARTIAL/FAIL: Every sourceFaithful cut preserves original transcript rhetorical structure.
- PASS/PARTIAL/FAIL: Every sourceFaithful cut retains a source-specific phrase/number/repetition/contrast as template or mapped phrase.
- PASS/PARTIAL/FAIL: Every sourceFaithful cut links to a concrete source timestamp/transcript span.

## Verification

- PASS/BLOCKED: command and result.

## Notes

- Existing unrelated untracked QA outputs were preserved.
- No staging, commit, push, GitHub comment, or issue close was performed.
```

Replace each checklist marker with the actual outcome after verification.

- [x] **Step 3: Update this plan with completion results**

Mark all completed checkboxes as `[x]` and add:

```md
## 결과

- Context: `context/context_20260520_issue_31_source_timestamp_mapping_playback_links.md`
- Verification: see context file.
- Commit/push: skipped per user instruction.
```

- [x] **Step 4: Check final git status**

Run:

```bash
git status -sb
```

Expected: only issue #31 files plus pre-existing unrelated untracked outputs; no staged changes.

## 결과

- Context: `context/context_20260520_issue_31_source_timestamp_mapping_playback_links.md`
- Verification: see context file.
- Commit/push: skipped per user instruction.
