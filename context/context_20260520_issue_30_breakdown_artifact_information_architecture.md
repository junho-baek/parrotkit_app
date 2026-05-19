# 2026-05-20 Issue 30 Breakdown Artifact Information Architecture

## Scope

- GitHub issue #30 only.
- No sibling issue work, no live smoke, no commit, no push.

## Result

- Breakdown Transcript is built from clean transcript segments and tested against analysis-prose leakage.
- Breakdown now includes Original Analysis, Extracted Structure, Apply to Your Content, Hook, Storytelling Structure, and Visual Layout contract fields.
- Extracted Structure preserves `{placeholder}` templates.
- SourceFaithful and goalAdapted mappings share the same source skeleton id and source timestamp/transcript spans.

## Verification

- PASS: `GOCACHE=/private/tmp/parrotkit-go-build-cache go test ./internal/analysis -run 'TestBuildReferenceAnalysisResponseBreakdown' -count=1`
- PASS: `GOCACHE=/private/tmp/parrotkit-go-build-cache go test ./internal/contracts -run 'TestReadyRequiresBreakdownInformationArchitecture|TestReadyFixtureIncludesTwoRecipeVariants' -count=1`
- BLOCKED IN SANDBOX: `GOCACHE=/private/tmp/parrotkit-go-build-cache go test ./...`
  - Changed packages and non-provider packages passed before provider package failures.
  - `internal/providers/replicate` and `internal/providers/superdata` failed because `httptest.NewServer` could not bind a loopback port: `operation not permitted`.
- PASS: `GOCACHE=/private/tmp/parrotkit-go-build-cache go test ./internal/analysis ./internal/contracts ./internal/httpapi ./internal/config`
- PASS: `git diff --check`

## Notes

- Existing unrelated untracked QA outputs were preserved.
- No staging, commit, push, GitHub comment, or issue close was performed.
