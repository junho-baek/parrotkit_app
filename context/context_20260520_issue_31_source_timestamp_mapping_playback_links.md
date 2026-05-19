# 2026-05-20 Issue 31 Source Timestamp Mapping and Playback Links

## Scope

- GitHub issue #31 only.
- No sibling issue work, no live smoke, no commit, no push.

## Result

- Backend source timestamp resolution keeps transcript timestamp spans as primary whenever valid transcript timestamps exist.
- SourceFaithful cuts retain transcript beat text, source-specific template/signal fields, transcript ids, and concrete source spans.
- App shooting board projections preserve `sourceTimeRangeMs` and generate original YouTube `t=` links per selected cut.
- Generated API cutBoard items are preserved as `referenceBreakdown.shooting_board_projection` for the recipe detail board.
- Recipe detail preview opens external timestamp links for web references and keeps the local modal path for local playable media.

## Acceptance Checklist

- PASS: CutBoard items include source time ranges derived from transcript timestamps when available.
- PASS: v1 UI/domain can open the original YouTube link at the selected cut timestamp.
- PASS: Generated duration accumulation is not used as the primary timestamp source when transcript timestamps exist.
- PASS: Every sourceFaithful cut preserves original transcript rhetorical structure.
- PASS: Every sourceFaithful cut retains a source-specific phrase/number/repetition/contrast as template or mapped phrase.
- PASS: Every sourceFaithful cut links to a concrete source timestamp/transcript span.

## Verification

- PASS: `GOCACHE=/private/tmp/parrotkit-go-build-cache go test ./internal/analysis -run 'TestBuildRecipeAndBoardUsesTranscriptTimeRangesBeforeGeneratedDurations|TestBuildRecipeAndBoardReusesTranscriptTimestampWhenSceneHasNoDirectSegment|TestBuildReferenceAnalysisResponseSourceFaithfulCutsKeepTranscriptSignalsAndSpans' -count=1`
- BLOCKED IN SANDBOX: `GOCACHE=/private/tmp/parrotkit-go-build-cache go test ./...`
  - Changed packages passed before provider package failures.
  - `internal/providers/replicate` and `internal/providers/superdata` failed because `httptest.NewServer` could not bind a loopback port: `operation not permitted`.
- PASS: `GOCACHE=/private/tmp/parrotkit-go-build-cache go test ./internal/analysis ./internal/contracts ./internal/httpapi ./internal/config`
- PASS: `cd parrotkit-app && NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/domain/shoot-board/shoot-board-projection.test.ts`
- PASS: `cd parrotkit-app && NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/reference-recipe-generation.test.ts`
- PASS: `cd parrotkit-app && NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-board-state.test.ts`
- PASS: `npx --prefix parrotkit-app tsc --noEmit -p parrotkit-app/tsconfig.json`
- PASS: `git diff --check`

## Notes

- Existing unrelated untracked QA outputs were preserved.
- No staging, commit, push, GitHub comment, or issue close was performed.
