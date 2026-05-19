# 2026-05-20 Issue 29 Backend Two-Variant Transcript Generation

## Scope

- Backend-only implementation/audit for GitHub issue #29.
- No sibling issue work, no UI work, no live smoke, no commit, no push.

## Result

- SourceFaithful is the default top-level recipe and cutBoard projection.
- GoalAdapted is available as a same-response variant with the same projection cut IDs and source timestamp spans.
- SourceFaithful fields are transcript-first and preserve `{placeholder}` template guidance.
- Breakdown cut evidence now includes `source_template` and `source_transcript_text` without stripping `{}`.
- Provider trace details remain available internally on the Go response but do not serialize into API JSON.
- Prompt wording keeps the model limited to small goal-adapted draft copy; Go remains responsible for canonical response assembly.

## Verification

- PASS: `GOCACHE=/private/tmp/parrotkit-go-build-cache go test ./internal/analysis -run 'TestBuildReferenceAnalysisResponse(ReturnsTwoVariants|SourceFaithfulCutsKeepTranscriptSignalsAndSpans)' -count=1`
- PASS: `GOCACHE=/private/tmp/parrotkit-go-build-cache go test ./internal/contracts ./internal/analysis -run 'TestProviderTraceIsInternalOnly|TestLiveProviderReturnsPartialReadyWhenExtractFailsButTranscriptAndDraftSucceed' -count=1`
- PASS: `GOCACHE=/private/tmp/parrotkit-go-build-cache go test ./internal/analysis -run TestBuildPromptRequestsSmallDraftAndCarriesContext -count=1`
- PASS: `GOCACHE=/private/tmp/parrotkit-go-build-cache go test ./internal/analysis ./internal/contracts ./internal/httpapi ./internal/config`
- BLOCKED IN SANDBOX: `GOCACHE=/private/tmp/parrotkit-go-build-cache go test ./...`
  - The #29 packages passed.
  - Existing provider client tests failed before assertions because `httptest.NewServer` could not bind a loopback port in this sandbox: `operation not permitted`.
- PASS: `git diff --check`

## Notes

- TypeScript contract files were not touched; TypeScript verification was not required.
- Existing unrelated untracked QA outputs were preserved.
- No staging, commit, push, GitHub comment, or issue close was performed.
