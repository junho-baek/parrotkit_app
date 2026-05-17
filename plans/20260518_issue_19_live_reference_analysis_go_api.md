# Live Reference Analysis Go API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build issue #19 as a live reference-analysis path where the Expo Paste drawer calls a Go API, the Go API analyzes a public short-form reference link with SuperData/Supadata plus Replicate-hosted models, and the app opens a real Breakdown + recipe + cut board only when the result is usable.

**Architecture:** Add a separate Go service in `services/reference-api/` with a synchronous `POST /v1/reference-analysis` endpoint for the first quality spike. Keep the canonical response contract provider-neutral, keep provider secrets server-side, and add a temporary Expo compatibility adapter so the current Paste flow can consume the new response without depending on the old Next.js route. Production must not silently create fake analyzed recipe boards.

**Tech Stack:** Go 1.23 standard library HTTP server, `httptest` for provider/client tests, Expo React Native TypeScript, existing ParrotKit reference-analysis contracts, SuperData/Supadata HTTP API, Replicate predictions API.

---

## Seed And Scope

**Seed:** `/Users/junho/.ouroboros/seeds/seed_ee7758998b02.yaml`

**Interview:** `interview_20260517_181956`

**In Scope:**
- `services/reference-api/` Go API scaffold and tests.
- Canonical `parrotkit.reference_analysis_response.v1` response contract.
- SuperData/Supadata metadata/transcript/extract client boundary.
- Replicate model client boundary and prompt/schema output normalization.
- Synchronous pipeline with timeout, retry, partial/failure mapping.
- Expo Paste drawer API integration with dev-only fallback gate.

**Out Of Scope:**
- Payment/subscription entitlement.
- Durable Supabase jobs/artifacts.
- Native StoreKit/Google Play/RevenueCat implementation.
- Next.js as the long-term runtime.

## File Structure

### Go service

- Create: `services/reference-api/go.mod`  
  Owns the Go module for the separate deployable service.
- Create: `services/reference-api/cmd/reference-api/main.go`  
  Loads config, creates dependencies, starts the HTTP server.
- Create: `services/reference-api/internal/config/config.go`  
  Parses env vars and enforces server-only secret configuration.
- Create: `services/reference-api/internal/httpapi/server.go`  
  Defines `/healthz` and `POST /v1/reference-analysis`.
- Create: `services/reference-api/internal/httpapi/server_test.go`  
  Tests health, unauth gate, invalid request, ready, partial, fallback, and failed responses.
- Create: `services/reference-api/internal/contracts/reference_analysis.go`  
  Defines request/response structs and state invariant validation.
- Create: `services/reference-api/internal/contracts/reference_analysis_test.go`  
  Tests status-specific required fields and no-fake-analysis invariants.
- Create: `services/reference-api/internal/analysis/pipeline.go`  
  Orchestrates provider calls, timeout handling, model generation, validation, and response mapping.
- Create: `services/reference-api/internal/analysis/pipeline_test.go`  
  Tests ready, partial transcript-missing, extract-missing, provider auth failure, model invalid JSON, and timeout mapping.
- Create: `services/reference-api/internal/analysis/prompt.go`  
  Builds the Replicate prompt and embeds the Sandcastle/ParrotKit JSON schema.
- Create: `services/reference-api/internal/analysis/prompt_test.go`  
  Guards prompt output requirements and forbidden board/debug labels.
- Create: `services/reference-api/internal/providers/superdata/client.go`  
  Fetches metadata, transcript, and extract artifacts with `SUPERDATA_API_KEY` preferred and `SUPADATA_API_KEY` alias support.
- Create: `services/reference-api/internal/providers/superdata/client_test.go`  
  Uses `httptest.Server` to verify endpoints, headers, polling, and graceful transcript/extract partials.
- Create: `services/reference-api/internal/providers/replicate/client.go`  
  Creates Replicate predictions, waits for completion, and returns model text.
- Create: `services/reference-api/internal/providers/replicate/client_test.go`  
  Uses `httptest.Server` to verify auth, model path, wait behavior, and error mapping.
- Create: `services/reference-api/Dockerfile`  
  Builds a small deployable container for Cloud Run/Fly-style runtimes.
- Create: `services/reference-api/README.md`  
  Documents local run commands, env vars, and Expo API URL wiring.

### Expo app

- Modify: `parrotkit-app/.env.local.example`  
  Add `EXPO_PUBLIC_REFERENCE_ANALYSIS_DEV_FALLBACK=""` with warning text.
- Modify: `parrotkit-app/src/features/recipes/lib/reference-recipe-generation.ts`  
  Replace old Next `/api/mobile/reference-recipe` path with `/v1/reference-analysis`, add canonical response types, map usable responses to current recipe scenes, and gate local mock fallback.
- Modify: `parrotkit-app/src/features/recipes/lib/reference-recipe-generation.test.ts`  
  Add ready/partial/failed/fallback/dev-fallback tests.
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-create-screen.tsx`  
  Keep drawer open on failed/fallback, show concise recovery copy, navigate only for usable ready/partial responses.
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-create/recipe-create-copy.ts`  
  Add concise non-debug recovery copy.
- Create: `parrotkit-app/src/features/recipes/screens/recipe-create/reference-analysis-state.test.ts`  
  Source contract for drawer state behavior.

---

## Task 1: Go Service Scaffold And Config

**Files:**
- Create: `services/reference-api/go.mod`
- Create: `services/reference-api/cmd/reference-api/main.go`
- Create: `services/reference-api/internal/config/config.go`
- Create: `services/reference-api/internal/config/config_test.go`
- Create: `services/reference-api/internal/httpapi/server.go`
- Create: `services/reference-api/internal/httpapi/server_test.go`

- [ ] **Step 1: Write config tests**

Create `services/reference-api/internal/config/config_test.go`:

```go
package config

import "testing"

func TestLoadPrefersSuperDataKey(t *testing.T) {
	t.Setenv("PORT", "8787")
	t.Setenv("SUPERDATA_API_KEY", "super-key")
	t.Setenv("SUPADATA_API_KEY", "legacy-key")
	t.Setenv("REPLICATE_API_TOKEN", "rep-token")
	t.Setenv("PARROTKIT_ALLOW_DEV_UNAUTH", "true")

	cfg, err := Load()
	if err != nil {
		t.Fatalf("Load() error = %v", err)
	}
	if cfg.SuperDataAPIKey != "super-key" {
		t.Fatalf("SuperDataAPIKey = %q", cfg.SuperDataAPIKey)
	}
	if cfg.Port != "8787" {
		t.Fatalf("Port = %q", cfg.Port)
	}
	if !cfg.AllowDevUnauth {
		t.Fatalf("AllowDevUnauth should be true")
	}
	if cfg.ReplicateModel == "" {
		t.Fatalf("ReplicateModel should have a default")
	}
}

func TestLoadUsesLegacySupadataAlias(t *testing.T) {
	t.Setenv("SUPADATA_API_KEY", "legacy-key")
	t.Setenv("REPLICATE_API_TOKEN", "rep-token")

	cfg, err := Load()
	if err != nil {
		t.Fatalf("Load() error = %v", err)
	}
	if cfg.SuperDataAPIKey != "legacy-key" {
		t.Fatalf("SuperDataAPIKey = %q", cfg.SuperDataAPIKey)
	}
}

func TestLoadRequiresProviderSecrets(t *testing.T) {
	t.Setenv("SUPERDATA_API_KEY", "")
	t.Setenv("SUPADATA_API_KEY", "")
	t.Setenv("REPLICATE_API_TOKEN", "")

	_, err := Load()
	if err == nil {
		t.Fatalf("Load() expected provider secret error")
	}
}
```

- [ ] **Step 2: Run config tests and verify failure**

Run:

```bash
cd /Users/junho/project/parrotkit-app/services/reference-api
go test ./internal/config
```

Expected: FAIL because `go.mod` and `config.Load` do not exist yet.

- [ ] **Step 3: Add Go module and config implementation**

Create `services/reference-api/go.mod`:

```go
module github.com/junho-baek/parrotkit-app/services/reference-api

go 1.23
```

Create `services/reference-api/internal/config/config.go`:

```go
package config

import (
	"errors"
	"os"
	"strconv"
	"strings"
	"time"
)

const defaultReplicateModel = "google/gemini-2.5-flash"

type Config struct {
	AllowDevUnauth bool
	Port           string
	ReplicateAPI   string
	ReplicateModel string
	RequestTimeout time.Duration
	SuperDataAPI   string
	SuperDataAPIKey string
}

func Load() (Config, error) {
	cfg := Config{
		Port:           getenvDefault("PORT", "8787"),
		ReplicateAPI:   getenvDefault("REPLICATE_API_BASE_URL", "https://api.replicate.com/v1"),
		ReplicateModel: getenvDefault("REPLICATE_REFERENCE_MODEL", defaultReplicateModel),
		RequestTimeout: timeoutFromEnv("REFERENCE_ANALYSIS_TIMEOUT_MS", 90*time.Second),
		SuperDataAPI:   getenvDefault("SUPERDATA_API_BASE_URL", "https://api.supadata.ai/v1"),
		SuperDataAPIKey: firstNonEmpty(
			os.Getenv("SUPERDATA_API_KEY"),
			os.Getenv("SUPADATA_API_KEY"),
			os.Getenv("SUPADATA_API_TOKEN"),
		),
	}
	cfg.AllowDevUnauth = strings.EqualFold(os.Getenv("PARROTKIT_ALLOW_DEV_UNAUTH"), "true")
	if cfg.SuperDataAPIKey == "" {
		return Config{}, errors.New("SUPERDATA_API_KEY or SUPADATA_API_KEY is required")
	}
	if strings.TrimSpace(os.Getenv("REPLICATE_API_TOKEN")) == "" {
		return Config{}, errors.New("REPLICATE_API_TOKEN is required")
	}
	return cfg, nil
}

func getenvDefault(key string, fallback string) string {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}
	return value
}

func timeoutFromEnv(key string, fallback time.Duration) time.Duration {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}
	milliseconds, err := strconv.Atoi(value)
	if err != nil || milliseconds <= 0 {
		return fallback
	}
	return time.Duration(milliseconds) * time.Millisecond
}

func firstNonEmpty(values ...string) string {
	for _, value := range values {
		if trimmed := strings.TrimSpace(value); trimmed != "" {
			return trimmed
		}
	}
	return ""
}
```

- [ ] **Step 4: Add health server test**

Create `services/reference-api/internal/httpapi/server_test.go`:

```go
package httpapi

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func TestHealthz(t *testing.T) {
	server := NewServer(Dependencies{
		AllowDevUnauth: true,
		Timeout:        time.Second,
	})

	req := httptest.NewRequest(http.MethodGet, "/healthz", nil)
	res := httptest.NewRecorder()
	server.ServeHTTP(res, req)

	if res.Code != http.StatusOK {
		t.Fatalf("status = %d", res.Code)
	}
	if got := res.Body.String(); got != `{"ok":true}`+"\n" {
		t.Fatalf("body = %q", got)
	}
}
```

- [ ] **Step 5: Add minimal server implementation**

Create `services/reference-api/internal/httpapi/server.go`:

```go
package httpapi

import (
	"encoding/json"
	"net/http"
	"time"
)

type Dependencies struct {
	AllowDevUnauth bool
	Timeout        time.Duration
}

func NewServer(deps Dependencies) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
	})
	return mux
}

func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}
```

- [ ] **Step 6: Add main entrypoint**

Create `services/reference-api/cmd/reference-api/main.go`:

```go
package main

import (
	"log"
	"net/http"

	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/config"
	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/httpapi"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("config: %v", err)
	}

	handler := httpapi.NewServer(httpapi.Dependencies{
		AllowDevUnauth: cfg.AllowDevUnauth,
		Timeout:        cfg.RequestTimeout,
	})

	addr := ":" + cfg.Port
	log.Printf("reference-api listening on %s", addr)
	if err := http.ListenAndServe(addr, handler); err != nil {
		log.Fatal(err)
	}
}
```

- [ ] **Step 7: Run scaffold tests**

Run:

```bash
cd /Users/junho/project/parrotkit-app/services/reference-api
go test ./...
```

Expected: PASS.

- [ ] **Step 8: Commit scaffold**

```bash
cd /Users/junho/project/parrotkit-app
git add services/reference-api/go.mod services/reference-api/cmd/reference-api/main.go services/reference-api/internal/config services/reference-api/internal/httpapi
git commit -m "feat: scaffold reference analysis go api"
```

---

## Task 2: Canonical Response Contract

**Files:**
- Create: `services/reference-api/internal/contracts/reference_analysis.go`
- Create: `services/reference-api/internal/contracts/reference_analysis_test.go`

- [ ] **Step 1: Write status invariant tests**

Create `services/reference-api/internal/contracts/reference_analysis_test.go`:

```go
package contracts

import "testing"

func TestReadyRequiresUsableArtifacts(t *testing.T) {
	response := ReadyFixture()
	if err := response.Validate(); err != nil {
		t.Fatalf("ready Validate() error = %v", err)
	}
}

func TestPartialRequiresUsableCutBoard(t *testing.T) {
	response := ReadyFixture()
	response.Status = StatusPartialReady
	response.Generation.MissingArtifacts = []string{"transcript"}
	response.CutBoard.Items = nil

	if err := response.Validate(); err == nil {
		t.Fatalf("partial_ready without cutBoard items should fail validation")
	}
}

func TestFallbackCannotContainFakeBreakdown(t *testing.T) {
	response := ReadyFixture()
	response.Status = StatusFallback
	response.Generation.FallbackUsed = true
	response.Error = &AnalysisError{
		Code:           "metadata_only",
		UserMessage:    "This link could not be fully analyzed.",
		Retryable:      true,
		RecoveryAction: RecoveryRetry,
	}

	if err := response.Validate(); err == nil {
		t.Fatalf("fallback with breakdown should fail validation")
	}
}

func TestFailedCannotContainBoard(t *testing.T) {
	response := ReadyFixture()
	response.Status = StatusFailed
	response.Error = &AnalysisError{
		Code:           "provider_auth",
		UserMessage:    "Reference analysis is not available right now.",
		Retryable:      false,
		RecoveryAction: RecoveryTryLater,
	}

	if err := response.Validate(); err == nil {
		t.Fatalf("failed with cutBoard should fail validation")
	}
}
```

- [ ] **Step 2: Run tests and verify failure**

Run:

```bash
cd /Users/junho/project/parrotkit-app/services/reference-api
go test ./internal/contracts
```

Expected: FAIL because the contracts package does not exist yet.

- [ ] **Step 3: Add contract structs and validation**

Create `services/reference-api/internal/contracts/reference_analysis.go` with the canonical types:

```go
package contracts

import (
	"errors"
	"time"
)

const SchemaVersion = "parrotkit.reference_analysis_response.v1"

type Status string

const (
	StatusReady        Status = "ready"
	StatusPartialReady Status = "partial_ready"
	StatusFallback     Status = "fallback"
	StatusFailed       Status = "failed"
)

type RecoveryAction string

const (
	RecoveryRetry      RecoveryAction = "retry"
	RecoveryChangeLink RecoveryAction = "change_link"
	RecoveryTryLater   RecoveryAction = "try_later"
	RecoveryUseManual  RecoveryAction = "use_manual"
)

type ReferenceAnalysisRequest struct {
	ClientSchemaVersion string            `json:"clientSchemaVersion,omitempty"`
	Goal                string            `json:"goal,omitempty"`
	IdempotencyKey      string            `json:"idempotencyKey,omitempty"`
	LanguageHint        string            `json:"languageHint,omitempty"`
	Niche               string            `json:"niche,omitempty"`
	ProductContext      map[string]string `json:"productContext,omitempty"`
	ReferenceURL        string            `json:"referenceUrl"`
}

type ReferenceAnalysisResponse struct {
	Breakdown          *Breakdown          `json:"breakdown"`
	CutBoard           *CutBoard           `json:"cutBoard"`
	Error              *AnalysisError      `json:"error,omitempty"`
	GeneratedAt        string              `json:"generatedAt"`
	Generation         Generation          `json:"generation"`
	LegacyRecipeResult any                 `json:"legacyRecipeResult,omitempty"`
	Recipe             *Recipe             `json:"recipe"`
	ReferenceMedia     *ReferenceMedia     `json:"referenceMedia"`
	ReferenceURL       string              `json:"referenceUrl"`
	RequestID          string              `json:"requestId"`
	SchemaVersion      string              `json:"schemaVersion"`
	Status             Status              `json:"status"`
}

type ReferenceMedia struct {
	CreatorHandle   *string `json:"creatorHandle"`
	DurationSeconds *int    `json:"durationSeconds"`
	Language        *string `json:"language"`
	MediaAssetID    string  `json:"mediaAssetId,omitempty"`
	Platform        string  `json:"platform"`
	SourceURL       string  `json:"sourceUrl"`
	ThumbnailURL    *string `json:"thumbnailUrl"`
	Title           *string `json:"title"`
}

type Generation struct {
	FallbackReason   *string  `json:"fallbackReason,omitempty"`
	FallbackUsed     bool     `json:"fallbackUsed"`
	MissingArtifacts []string `json:"missingArtifacts"`
	Model            *string  `json:"model"`
	ProviderPipeline []string `json:"providerPipeline"`
}

type AnalysisError struct {
	Code           string         `json:"code"`
	RecoveryAction RecoveryAction `json:"recoveryAction"`
	Retryable      bool           `json:"retryable"`
	UserMessage    string         `json:"userMessage"`
}

type Breakdown struct {
	SchemaVersion       string              `json:"schema_version"`
	Reference           map[string]any      `json:"reference"`
	Summary             map[string]any      `json:"summary"`
	Transcript          map[string]any      `json:"transcript"`
	IdeaAnalysis        map[string]any      `json:"idea_analysis"`
	Hook                map[string]any      `json:"hook"`
	StorytellingFormat  map[string]any      `json:"storytelling_format"`
	VisualLayout        map[string]any      `json:"visual_layout"`
	ProofStructure      map[string]any      `json:"proof_structure"`
	Cuts                []map[string]any    `json:"cuts"`
	ShootingProjection  map[string]any      `json:"shooting_projection"`
	VaultCandidates     map[string]any      `json:"vault_candidates"`
	Confidence          map[string]any      `json:"confidence"`
}

type Recipe struct {
	OneLineDescription string        `json:"oneLineDescription"`
	Scenes             []RecipeScene `json:"scenes"`
	Title              string        `json:"title"`
	TotalDurationSec   int           `json:"totalDurationSec"`
}

type RecipeScene struct {
	DurationSec       int      `json:"durationSec"`
	Index             int      `json:"index"`
	LineToSay         string   `json:"lineToSay"`
	ProjectionCutID   string   `json:"projectionCutId"`
	RequiredChecklist []string `json:"requiredChecklist"`
	ShootingGuideline string   `json:"shootingGuideline"`
	Title             string   `json:"title"`
}

type CutBoard struct {
	BoardTitle               string          `json:"boardTitle"`
	EstimatedDurationSeconds int             `json:"estimatedDurationSeconds"`
	Items                    []CutBoardItem  `json:"items"`
}

type CutBoardItem struct {
	DurationSeconds      int               `json:"durationSeconds"`
	ExecutionTitle       string            `json:"executionTitle"`
	LineToSay            *string           `json:"lineToSay"`
	MyTakeRelationship   string            `json:"myTakeRelationship"`
	OrderIndex           int               `json:"orderIndex"`
	ProjectionCutID      string            `json:"projectionCutId"`
	ReferenceMediaRef    ReferenceMediaRef `json:"referenceMediaRef"`
	ReferenceObservation string            `json:"referenceObservation"`
	ReferenceUsage       string            `json:"referenceUsage"`
	ShotGuide            *string           `json:"shotGuide"`
	SourceCutIDs         []string          `json:"sourceCutIds"`
	SuccessCriteria      []string          `json:"successCriteria"`
}

type ReferenceMediaRef struct {
	EndMs       int     `json:"endMs"`
	MediaAssetID string `json:"mediaAssetId"`
	StartMs     int     `json:"startMs"`
	ThumbnailURI *string `json:"thumbnailUri"`
}

func (r ReferenceAnalysisResponse) Validate() error {
	if r.SchemaVersion != SchemaVersion {
		return errors.New("invalid schemaVersion")
	}
	if r.RequestID == "" || r.ReferenceURL == "" || r.GeneratedAt == "" {
		return errors.New("missing base response fields")
	}
	if r.Generation.MissingArtifacts == nil || r.Generation.ProviderPipeline == nil {
		return errors.New("generation arrays must be present")
	}
	switch r.Status {
	case StatusReady:
		if r.Generation.FallbackUsed || r.ReferenceMedia == nil || r.Breakdown == nil || r.Recipe == nil || !hasUsableBoard(r.CutBoard) {
			return errors.New("ready requires real media, breakdown, recipe, and usable cutBoard")
		}
	case StatusPartialReady:
		if r.Generation.FallbackUsed || r.ReferenceMedia == nil || r.Breakdown == nil || r.Recipe == nil || !hasUsableBoard(r.CutBoard) || len(r.Generation.MissingArtifacts) == 0 {
			return errors.New("partial_ready requires real partial artifact, missingArtifacts, and usable cutBoard")
		}
	case StatusFallback:
		if !r.Generation.FallbackUsed || r.Breakdown != nil || r.CutBoard != nil {
			return errors.New("fallback must not contain fake analyzed artifacts")
		}
		if r.Error == nil {
			return errors.New("fallback requires user-safe error")
		}
	case StatusFailed:
		if r.Breakdown != nil || r.Recipe != nil || r.CutBoard != nil || r.Error == nil {
			return errors.New("failed must not contain board artifacts and must include error")
		}
	default:
		return errors.New("unknown status")
	}
	return nil
}

func hasUsableBoard(board *CutBoard) bool {
	return board != nil && len(board.Items) > 0
}

func ReadyFixture() ReferenceAnalysisResponse {
	model := "google/gemini-2.5-flash"
	title := "Reference title"
	line := "Say this"
	now := time.Date(2026, 5, 18, 0, 0, 0, 0, time.UTC).Format(time.RFC3339)
	return ReferenceAnalysisResponse{
		SchemaVersion: SchemaVersion,
		Status:        StatusReady,
		RequestID:     "req_test",
		GeneratedAt:   now,
		ReferenceURL:  "https://example.com/video",
		ReferenceMedia: &ReferenceMedia{
			Platform:  "unknown",
			SourceURL: "https://example.com/video",
			Title:    &title,
		},
		Breakdown: &Breakdown{
			SchemaVersion:      "parrotkit.reference_breakdown.v1",
			Reference:          map[string]any{"source_url": "https://example.com/video"},
			Summary:            map[string]any{"one_liner": "A useful reference."},
			Transcript:         map[string]any{"clean": "Transcript"},
			IdeaAnalysis:       map[string]any{"topic": "Beauty"},
			Hook:               map[string]any{"category": "authority"},
			StorytellingFormat: map[string]any{"category": "review"},
			VisualLayout:       map[string]any{"category": "talking_head"},
			ProofStructure:     map[string]any{"proof_points": []string{"proof"}},
			Cuts:               []map[string]any{{"id": "cut-1"}},
			ShootingProjection: map[string]any{"board_title": "Board"},
			VaultCandidates:    map[string]any{"idea": map[string]any{"title": "Idea"}},
			Confidence:         map[string]any{"overall": 0.8},
		},
		Recipe: &Recipe{
			Title:              "Recipe",
			OneLineDescription: "Shoot this.",
			TotalDurationSec:   5,
			Scenes: []RecipeScene{{
				DurationSec:       5,
				Index:             1,
				LineToSay:         "Say this",
				ProjectionCutID:   "cut-1",
				RequiredChecklist: []string{"Visible result"},
				ShootingGuideline: "Film the result.",
				Title:             "Show the result",
			}},
		},
		CutBoard: &CutBoard{
			BoardTitle:               "Board",
			EstimatedDurationSeconds: 5,
			Items: []CutBoardItem{{
				DurationSeconds:      5,
				ExecutionTitle:       "Show the result",
				LineToSay:            &line,
				MyTakeRelationship:   "Use this as your opening take.",
				OrderIndex:           0,
				ProjectionCutID:      "cut-1",
				ReferenceMediaRef:    ReferenceMediaRef{MediaAssetID: "media-1", StartMs: 0, EndMs: 5000},
				ReferenceObservation: "Reference opens on the finished result.",
				ReferenceUsage:       "Mirror the result-first framing.",
				ShotGuide:            &line,
				SourceCutIDs:         []string{"source-cut-1"},
				SuccessCriteria:      []string{"Result visible immediately"},
			}},
		},
		Generation: Generation{
			FallbackUsed:     false,
			MissingArtifacts: []string{},
			Model:            &model,
			ProviderPipeline: []string{"superdata.metadata", "superdata.transcript", "superdata.extract", "replicate.model"},
		},
	}
}
```

- [ ] **Step 4: Run contract tests**

Run:

```bash
cd /Users/junho/project/parrotkit-app/services/reference-api
go test ./internal/contracts
```

Expected: PASS.

- [ ] **Step 5: Commit contract**

```bash
cd /Users/junho/project/parrotkit-app
git add services/reference-api/internal/contracts
git commit -m "feat: define reference analysis response contract"
```

---

## Task 3: Provider Clients

**Files:**
- Create: `services/reference-api/internal/providers/superdata/client.go`
- Create: `services/reference-api/internal/providers/superdata/client_test.go`
- Create: `services/reference-api/internal/providers/replicate/client.go`
- Create: `services/reference-api/internal/providers/replicate/client_test.go`

- [ ] **Step 1: Write SuperData client test**

Create `services/reference-api/internal/providers/superdata/client_test.go`:

```go
package superdata

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestClientSendsAPIKeyAndFetchesMetadata(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("x-api-key") != "super-key" {
			t.Fatalf("missing x-api-key")
		}
		if r.URL.Path != "/metadata" {
			t.Fatalf("path = %s", r.URL.Path)
		}
		_ = json.NewEncoder(w).Encode(map[string]any{
			"platform": "tiktok",
			"title": "Creator reference",
			"author": map[string]any{"username": "creator"},
			"media": map[string]any{"thumbnailUrl": "https://cdn.example/thumb.jpg", "duration": 31},
		})
	}))
	defer server.Close()

	client := NewClient(Config{BaseURL: server.URL, APIKey: "super-key"})
	metadata, err := client.FetchMetadata(context.Background(), "https://example.com/ref")
	if err != nil {
		t.Fatalf("FetchMetadata() error = %v", err)
	}
	if metadata.Platform != "tiktok" || metadata.Title == nil || *metadata.Title != "Creator reference" {
		t.Fatalf("metadata = %#v", metadata)
	}
}
```

- [ ] **Step 2: Write Replicate client test**

Create `services/reference-api/internal/providers/replicate/client_test.go`:

```go
package replicate

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestRunModelSendsBearerTokenAndReturnsText(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("Authorization") != "Bearer rep-token" {
			t.Fatalf("missing bearer token")
		}
		if r.URL.Path != "/models/google/gemini-2.5-flash/predictions" {
			t.Fatalf("path = %s", r.URL.Path)
		}
		_ = json.NewEncoder(w).Encode(map[string]any{
			"id": "pred_1",
			"status": "succeeded",
			"output": []string{"{\"ok\":true}"},
		})
	}))
	defer server.Close()

	client := NewClient(Config{BaseURL: server.URL, APIToken: "rep-token"})
	text, err := client.RunModel(context.Background(), "google/gemini-2.5-flash", map[string]any{"prompt": "hello"})
	if err != nil {
		t.Fatalf("RunModel() error = %v", err)
	}
	if text != "{\"ok\":true}" {
		t.Fatalf("text = %q", text)
	}
}
```

- [ ] **Step 3: Implement minimal SuperData client**

Create `services/reference-api/internal/providers/superdata/client.go`:

```go
package superdata

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"time"
)

type Config struct {
	APIKey  string
	BaseURL string
}

type Client struct {
	apiKey string
	baseURL string
	httpClient *http.Client
}

type Metadata struct {
	AuthorHandle    *string
	DurationSeconds *int
	Platform        string
	Raw             map[string]any
	ThumbnailURL    *string
	Title           *string
}

type TranscriptSegment struct {
	EndMs   int
	ID      string
	StartMs int
	Text    string
}

type ExtractResult struct {
	Raw map[string]any
}

func NewClient(cfg Config) *Client {
	return &Client{
		apiKey: strings.TrimSpace(cfg.APIKey),
		baseURL: strings.TrimRight(cfg.BaseURL, "/"),
		httpClient: http.DefaultClient,
	}
}

func (c *Client) FetchMetadata(ctx context.Context, sourceURL string) (Metadata, error) {
	endpoint := c.url("/metadata", sourceURL)
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)
	if err != nil {
		return Metadata{}, err
	}
	c.setHeaders(req)
	res, err := c.httpClient.Do(req)
	if err != nil {
		return Metadata{}, err
	}
	defer res.Body.Close()
	if res.StatusCode < 200 || res.StatusCode >= 300 {
		return Metadata{}, fmt.Errorf("superdata metadata status %d", res.StatusCode)
	}
	var raw map[string]any
	if err := json.NewDecoder(res.Body).Decode(&raw); err != nil {
		return Metadata{}, err
	}
	return normalizeMetadata(raw), nil
}

func (c *Client) FetchTranscript(ctx context.Context, sourceURL string) ([]TranscriptSegment, error) {
	nativeSegments, nativeErr := c.fetchTranscriptMode(ctx, sourceURL, "native")
	if nativeErr == nil && len(nativeSegments) > 0 {
		return nativeSegments, nil
	}
	generatedSegments, generatedErr := c.fetchTranscriptMode(ctx, sourceURL, "generate")
	if generatedErr != nil {
		if nativeErr != nil {
			return nil, nativeErr
		}
		return nil, generatedErr
	}
	return generatedSegments, nil
}

func (c *Client) Extract(ctx context.Context, sourceURL string, schema map[string]any, prompt string) (ExtractResult, error) {
	payload, err := json.Marshal(map[string]any{
		"url": sourceURL,
		"prompt": prompt,
		"schema": schema,
	})
	if err != nil {
		return ExtractResult{}, err
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.baseURL+"/extract", bytes.NewReader(payload))
	if err != nil {
		return ExtractResult{}, err
	}
	c.setHeaders(req)
	req.Header.Set("Content-Type", "application/json")
	raw, err := c.doJSON(req)
	if err != nil {
		return ExtractResult{}, err
	}
	if jobID := stringValue(raw["jobId"]); jobID != "" {
		raw, err = c.pollJob(ctx, "/extract/"+url.PathEscape(jobID))
		if err != nil {
			return ExtractResult{}, err
		}
	}
	return ExtractResult{Raw: raw}, nil
}

func (c *Client) fetchTranscriptMode(ctx context.Context, sourceURL string, mode string) ([]TranscriptSegment, error) {
	values := url.Values{}
	values.Set("url", sourceURL)
	values.Set("mode", mode)
	values.Set("text", "false")
	values.Set("chunkSize", "280")
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, c.baseURL+"/transcript?"+values.Encode(), nil)
	if err != nil {
		return nil, err
	}
	c.setHeaders(req)
	raw, err := c.doJSON(req)
	if err != nil {
		return nil, err
	}
	if jobID := stringValue(raw["jobId"]); jobID != "" {
		raw, err = c.pollJob(ctx, "/transcript/"+url.PathEscape(jobID))
		if err != nil {
			return nil, err
		}
	}
	return normalizeTranscript(raw["content"], stringValue(raw["lang"])), nil
}

func (c *Client) pollJob(ctx context.Context, path string) (map[string]any, error) {
	ticker := time.NewTicker(1500 * time.Millisecond)
	defer ticker.Stop()
	for {
		select {
		case <-ctx.Done():
			return nil, ctx.Err()
		case <-ticker.C:
			req, err := http.NewRequestWithContext(ctx, http.MethodGet, c.baseURL+path, nil)
			if err != nil {
				return nil, err
			}
			c.setHeaders(req)
			raw, err := c.doJSON(req)
			if err != nil {
				return nil, err
			}
			switch stringValue(raw["status"]) {
			case "completed", "":
				return raw, nil
			case "failed":
				return nil, fmt.Errorf("superdata job failed")
			}
		}
	}
}

func (c *Client) doJSON(req *http.Request) (map[string]any, error) {
	res, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	if res.StatusCode < 200 || res.StatusCode >= 300 {
		return nil, fmt.Errorf("superdata status %d", res.StatusCode)
	}
	var raw map[string]any
	if err := json.NewDecoder(res.Body).Decode(&raw); err != nil {
		return nil, err
	}
	return raw, nil
}

func normalizeTranscript(content any, lang string) []TranscriptSegment {
	chunks, ok := content.([]any)
	if !ok {
		if text := strings.TrimSpace(stringValue(content)); text != "" {
			return []TranscriptSegment{{ID: "seg-1", StartMs: 0, EndMs: 1000, Text: text}}
		}
		return []TranscriptSegment{}
	}
	segments := make([]TranscriptSegment, 0, len(chunks))
	for index, chunk := range chunks {
		item, ok := chunk.(map[string]any)
		if !ok {
			continue
		}
		text := strings.TrimSpace(stringValue(item["text"]))
		if text == "" {
			continue
		}
		offset := int(numberValue(item["offset"]))
		duration := int(numberValue(item["duration"]))
		segments = append(segments, TranscriptSegment{
			ID: fmt.Sprintf("seg-%d", index+1),
			StartMs: offset,
			EndMs: offset + duration,
			Text: text,
		})
	}
	return segments
}

func (c *Client) url(path string, sourceURL string) string {
	values := url.Values{}
	values.Set("url", sourceURL)
	return c.baseURL + path + "?" + values.Encode()
}

func (c *Client) setHeaders(req *http.Request) {
	req.Header.Set("x-api-key", c.apiKey)
	req.Header.Set("Accept", "application/json")
}

func normalizeMetadata(raw map[string]any) Metadata {
	metadata := Metadata{Platform: stringValue(raw["platform"]), Raw: raw}
	if metadata.Platform == "" {
		metadata.Platform = "unknown"
	}
	metadata.Title = optionalString(raw["title"])
	if author, ok := raw["author"].(map[string]any); ok {
		metadata.AuthorHandle = firstOptionalString(author["username"], author["displayName"])
	}
	if media, ok := raw["media"].(map[string]any); ok {
		metadata.ThumbnailURL = optionalString(media["thumbnailUrl"])
		if duration, ok := media["duration"].(float64); ok {
			value := int(duration)
			metadata.DurationSeconds = &value
		}
	}
	return metadata
}

func firstOptionalString(values ...any) *string {
	for _, value := range values {
		if result := optionalString(value); result != nil {
			return result
		}
	}
	return nil
}

func optionalString(value any) *string {
	text := strings.TrimSpace(stringValue(value))
	if text == "" {
		return nil
	}
	return &text
}

func stringValue(value any) string {
	text, _ := value.(string)
	return text
}

func numberValue(value any) float64 {
	number, _ := value.(float64)
	return number
}
```

- [ ] **Step 4: Implement minimal Replicate client**

Create `services/reference-api/internal/providers/replicate/client.go`:

```go
package replicate

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
)

type Config struct {
	APIToken string
	BaseURL  string
}

type Client struct {
	apiToken string
	baseURL string
	httpClient *http.Client
}

type prediction struct {
	Error  any    `json:"error"`
	ID     string `json:"id"`
	Output any    `json:"output"`
	Status string `json:"status"`
}

func NewClient(cfg Config) *Client {
	return &Client{
		apiToken: strings.TrimSpace(cfg.APIToken),
		baseURL: strings.TrimRight(cfg.BaseURL, "/"),
		httpClient: http.DefaultClient,
	}
}

func (c *Client) RunModel(ctx context.Context, model string, input map[string]any) (string, error) {
	owner, name, err := splitModel(model)
	if err != nil {
		return "", err
	}
	body, err := json.Marshal(map[string]any{"input": input})
	if err != nil {
		return "", err
	}
	endpoint := fmt.Sprintf("%s/models/%s/%s/predictions", c.baseURL, owner, name)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, endpoint, bytes.NewReader(body))
	if err != nil {
		return "", err
	}
	req.Header.Set("Authorization", "Bearer "+c.apiToken)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Prefer", "wait")
	res, err := c.httpClient.Do(req)
	if err != nil {
		return "", err
	}
	defer res.Body.Close()
	if res.StatusCode < 200 || res.StatusCode >= 300 {
		return "", fmt.Errorf("replicate status %d", res.StatusCode)
	}
	var pred prediction
	if err := json.NewDecoder(res.Body).Decode(&pred); err != nil {
		return "", err
	}
	if pred.Status != "succeeded" {
		return "", fmt.Errorf("replicate prediction %s", pred.Status)
	}
	return outputToText(pred.Output), nil
}

func splitModel(model string) (string, string, error) {
	parts := strings.Split(model, "/")
	if len(parts) != 2 || parts[0] == "" || parts[1] == "" {
		return "", "", fmt.Errorf("invalid replicate model %q", model)
	}
	return parts[0], parts[1], nil
}

func outputToText(output any) string {
	switch value := output.(type) {
	case string:
		return value
	case []any:
		var builder strings.Builder
		for _, item := range value {
			if text, ok := item.(string); ok {
				builder.WriteString(text)
			}
		}
		return strings.TrimSpace(builder.String())
	default:
		bytes, _ := json.Marshal(value)
		return string(bytes)
	}
}
```

- [ ] **Step 5: Run provider tests**

Run:

```bash
cd /Users/junho/project/parrotkit-app/services/reference-api
go test ./internal/providers/...
```

Expected: PASS.

- [ ] **Step 6: Commit provider clients**

```bash
cd /Users/junho/project/parrotkit-app
git add services/reference-api/internal/providers
git commit -m "feat: add reference provider clients"
```

---

## Task 4: Prompt And Pipeline

**Files:**
- Create: `services/reference-api/internal/analysis/prompt.go`
- Create: `services/reference-api/internal/analysis/prompt_test.go`
- Create: `services/reference-api/internal/analysis/pipeline.go`
- Create: `services/reference-api/internal/analysis/pipeline_test.go`

- [ ] **Step 1: Write prompt guard test**

Create `services/reference-api/internal/analysis/prompt_test.go`:

```go
package analysis

import (
	"strings"
	"testing"
)

func TestBuildPromptRequiresStrictSchemaAndNoDebugLabels(t *testing.T) {
	prompt := BuildPrompt(PromptInput{
		ReferenceURL: "https://example.com/video",
		Niche:        "beauty",
		Goal:         "conversion",
		MetadataJSON: `{"title":"Reference"}`,
		Transcript:   "A useful line.",
		ExtractJSON:  `{"cuts":[{"time_range":"0:00-0:05"}]}`,
	})

	required := []string{
		"parrotkit.reference_analysis_response.v1",
		"parrotkit.reference_breakdown.v1",
		"Return JSON only",
		"Do not repeat hook analysis on every cut",
		"Do not expose provider, model, prompt, confidence, or debug labels in the cut board",
	}
	for _, text := range required {
		if !strings.Contains(prompt, text) {
			t.Fatalf("prompt missing %q", text)
		}
	}
}
```

- [ ] **Step 2: Add prompt builder**

Create `services/reference-api/internal/analysis/prompt.go`:

```go
package analysis

import "fmt"

type PromptInput struct {
	ExtractJSON  string
	Goal         string
	MetadataJSON string
	Niche        string
	ReferenceURL string
	Transcript   string
}

func BuildPrompt(input PromptInput) string {
	return fmt.Sprintf(`You are ParrotKit's reference-video analyst.

Return JSON only. Return schemaVersion "parrotkit.reference_analysis_response.v1".
The embedded breakdown must use schema_version "parrotkit.reference_breakdown.v1".

Reference URL:
%s

Niche:
%s

Goal:
%s

Metadata JSON:
%s

Transcript:
%s

Visual extract JSON:
%s

Rules:
1. Analyze the whole short-form reference, then create a compact shooting board.
2. Do not repeat hook analysis on every cut. Hook is video-level unless the first cut is specifically the opening hook.
3. Every cutBoard item must be shootable and must include executionTitle, referenceObservation, referenceUsage, myTakeRelationship, lineToSay, shotGuide, and successCriteria.
4. Do not expose provider, model, prompt, confidence, or debug labels in the cut board.
5. If transcript or visual evidence is missing, return partial_ready with missingArtifacts only if at least one usable cutBoard item remains.
6. If no usable board can be created from real evidence, return failed with no breakdown, recipe, or cutBoard.
7. Never invent creator, title, duration, or product facts. Use null for unknown metadata fields.
`, input.ReferenceURL, input.Niche, input.Goal, input.MetadataJSON, input.Transcript, input.ExtractJSON)
}
```

- [ ] **Step 3: Write pipeline state tests**

Create `services/reference-api/internal/analysis/pipeline_test.go`:

```go
package analysis

import (
	"context"
	"testing"
)

func TestAnalyzeReady(t *testing.T) {
	pipeline := NewPipeline(FakeProviders{
		ModelText: `{"schemaVersion":"parrotkit.reference_analysis_response.v1","status":"ready"}`,
	})
	response, err := pipeline.Analyze(context.Background(), Request{
		ReferenceURL: "https://example.com/video",
		Niche: "beauty",
		Goal: "conversion",
	})
	if err != nil {
		t.Fatalf("Analyze() error = %v", err)
	}
	if response.Status != "ready" {
		t.Fatalf("status = %s", response.Status)
	}
}

func TestAnalyzeProviderAuthFailureFailsSafely(t *testing.T) {
	pipeline := NewPipeline(FakeProviders{ProviderError: ErrProviderAuth})
	response, err := pipeline.Analyze(context.Background(), Request{ReferenceURL: "https://example.com/video"})
	if err != nil {
		t.Fatalf("Analyze() error = %v", err)
	}
	if response.Status != "failed" || response.CutBoard != nil {
		t.Fatalf("response should fail without board: %#v", response)
	}
}
```

- [ ] **Step 4: Add pipeline implementation**

Implement `services/reference-api/internal/analysis/pipeline.go` so the tests pass first with fake providers, then wire real provider interfaces in the live provider adapter task:

```go
package analysis

import (
	"context"
	"errors"
	"time"

	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/contracts"
)

var ErrProviderAuth = errors.New("provider_auth")

type Request struct {
	Goal         string
	IdempotencyKey string
	Niche        string
	ReferenceURL string
}

type Providers interface {
	AnalyzeReference(ctx context.Context, req Request) (contracts.ReferenceAnalysisResponse, error)
}

type FakeProviders struct {
	ModelText     string
	ProviderError error
}

func (f FakeProviders) AnalyzeReference(ctx context.Context, req Request) (contracts.ReferenceAnalysisResponse, error) {
	if f.ProviderError != nil {
		return failed(req.ReferenceURL, "provider_auth", "Reference analysis is not available right now.", false), nil
	}
	response := contracts.ReadyFixture()
	response.ReferenceURL = req.ReferenceURL
	response.Status = contracts.StatusReady
	return response, nil
}

type Pipeline struct {
	providers Providers
}

func NewPipeline(providers Providers) Pipeline {
	return Pipeline{providers: providers}
}

func (p Pipeline) Analyze(ctx context.Context, req Request) (contracts.ReferenceAnalysisResponse, error) {
	if req.ReferenceURL == "" {
		return failed(req.ReferenceURL, "invalid_request", "Paste a valid public reference link.", false), nil
	}
	response, err := p.providers.AnalyzeReference(ctx, req)
	if err != nil {
		return failed(req.ReferenceURL, "analysis_failed", "This link could not be analyzed. Try another public short-form link.", true), nil
	}
	if response.GeneratedAt == "" {
		response.GeneratedAt = time.Now().UTC().Format(time.RFC3339)
	}
	if response.SchemaVersion == "" {
		response.SchemaVersion = contracts.SchemaVersion
	}
	if response.RequestID == "" {
		response.RequestID = "req_local"
	}
	return response, nil
}

func failed(referenceURL string, code string, message string, retryable bool) contracts.ReferenceAnalysisResponse {
	return contracts.ReferenceAnalysisResponse{
		SchemaVersion: contracts.SchemaVersion,
		Status:        contracts.StatusFailed,
		RequestID:     "req_local",
		GeneratedAt:   time.Now().UTC().Format(time.RFC3339),
		ReferenceURL:  referenceURL,
		Generation: contracts.Generation{
			FallbackUsed:     false,
			MissingArtifacts: []string{},
			Model:            nil,
			ProviderPipeline: []string{},
		},
		Error: &contracts.AnalysisError{
			Code:           code,
			UserMessage:    message,
			Retryable:      retryable,
			RecoveryAction: contracts.RecoveryRetry,
		},
	}
}
```

- [ ] **Step 5: Run analysis tests**

Run:

```bash
cd /Users/junho/project/parrotkit-app/services/reference-api
go test ./internal/analysis
```

Expected: PASS.

- [ ] **Step 6: Commit prompt and pipeline skeleton**

```bash
cd /Users/junho/project/parrotkit-app
git add services/reference-api/internal/analysis
git commit -m "feat: add reference analysis pipeline skeleton"
```

---

## Task 5: Live Provider Adapter

**Files:**
- Create: `services/reference-api/internal/analysis/live_provider.go`
- Create: `services/reference-api/internal/analysis/live_provider_test.go`
- Modify: `services/reference-api/cmd/reference-api/main.go`

- [ ] **Step 1: Write live provider adapter test**

Create `services/reference-api/internal/analysis/live_provider_test.go`:

```go
package analysis

import (
	"context"
	"testing"

	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/contracts"
	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/providers/superdata"
)

type fakeSuperData struct{}

func (fakeSuperData) FetchMetadata(ctx context.Context, sourceURL string) (superdata.Metadata, error) {
	title := "Creator reference"
	return superdata.Metadata{Platform: "tiktok", Title: &title}, nil
}

func (fakeSuperData) FetchTranscript(ctx context.Context, sourceURL string) ([]superdata.TranscriptSegment, error) {
	return []superdata.TranscriptSegment{{ID: "seg-1", StartMs: 0, EndMs: 3000, Text: "Here is the result."}}, nil
}

func (fakeSuperData) Extract(ctx context.Context, sourceURL string, schema map[string]any, prompt string) (superdata.ExtractResult, error) {
	return superdata.ExtractResult{Raw: map[string]any{"cuts": []any{map[string]any{"time_range": "0:00-0:03"}}}}, nil
}

type fakeReplicate struct{}

func (fakeReplicate) RunModel(ctx context.Context, model string, input map[string]any) (string, error) {
	return `{
		"schemaVersion":"parrotkit.reference_analysis_response.v1",
		"status":"ready",
		"requestId":"req_model",
		"generatedAt":"2026-05-18T00:00:00Z",
		"referenceUrl":"https://example.com/ref",
		"referenceMedia":{"sourceUrl":"https://example.com/ref","platform":"tiktok","title":"Creator reference","creatorHandle":null,"durationSeconds":null,"thumbnailUrl":null,"language":"en"},
		"breakdown":{"schema_version":"parrotkit.reference_breakdown.v1","reference":{"source_url":"https://example.com/ref"},"summary":{"one_liner":"Reference"},"transcript":{"clean":"Here is the result."},"idea_analysis":{"topic":"beauty"},"hook":{"category":"authority"},"storytelling_format":{"category":"review"},"visual_layout":{"category":"talking_head"},"proof_structure":{"proof_points":["result"]},"cuts":[{"id":"cut-1"}],"shooting_projection":{"board_title":"Board"},"vault_candidates":{"idea":{"title":"Idea"}},"confidence":{"overall":0.8}},
		"recipe":{"title":"Creator reference","oneLineDescription":"Shoot this.","totalDurationSec":3,"scenes":[{"index":1,"title":"Show the result","durationSec":3,"lineToSay":"Here is the result.","shootingGuideline":"Open on the finished result.","requiredChecklist":["Result is visible"],"projectionCutId":"cut-1"}]},
		"cutBoard":{"boardTitle":"Board","estimatedDurationSeconds":3,"items":[{"projectionCutId":"cut-1","orderIndex":0,"executionTitle":"Show the result","durationSeconds":3,"referenceMediaRef":{"mediaAssetId":"media-1","startMs":0,"endMs":3000},"referenceObservation":"Opens on the result.","referenceUsage":"Use result-first framing.","myTakeRelationship":"Film your result first.","lineToSay":"Here is the result.","shotGuide":"Open on the finished result.","sourceCutIds":["cut-1"],"successCriteria":["Result is visible"]}]},
		"generation":{"providerPipeline":["superdata.metadata","superdata.transcript","superdata.extract","replicate.model"],"model":"google/gemini-2.5-flash","fallbackUsed":false,"missingArtifacts":[]}
	}`, nil
}

func TestLiveProviderReturnsValidatedReadyResponse(t *testing.T) {
	provider := LiveProvider{
		Model:     "google/gemini-2.5-flash",
		Replicate: fakeReplicate{},
		SuperData: fakeSuperData{},
	}

	response, err := provider.AnalyzeReference(context.Background(), Request{
		ReferenceURL: "https://example.com/ref",
		Niche:        "beauty",
		Goal:         "conversion",
	})
	if err != nil {
		t.Fatalf("AnalyzeReference() error = %v", err)
	}
	if response.Status != contracts.StatusReady {
		t.Fatalf("status = %s", response.Status)
	}
	if err := response.Validate(); err != nil {
		t.Fatalf("Validate() error = %v", err)
	}
}
```

- [ ] **Step 2: Run live adapter test and verify failure**

Run:

```bash
cd /Users/junho/project/parrotkit-app/services/reference-api
go test ./internal/analysis -run TestLiveProviderReturnsValidatedReadyResponse
```

Expected: FAIL because `LiveProvider` does not exist.

- [ ] **Step 3: Implement live provider adapter**

Create `services/reference-api/internal/analysis/live_provider.go`:

```go
package analysis

import (
	"context"
	"encoding/json"

	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/contracts"
	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/providers/superdata"
)

type SuperDataClient interface {
	Extract(ctx context.Context, sourceURL string, schema map[string]any, prompt string) (superdata.ExtractResult, error)
	FetchMetadata(ctx context.Context, sourceURL string) (superdata.Metadata, error)
	FetchTranscript(ctx context.Context, sourceURL string) ([]superdata.TranscriptSegment, error)
}

type ReplicateClient interface {
	RunModel(ctx context.Context, model string, input map[string]any) (string, error)
}

type LiveProvider struct {
	Model     string
	Replicate ReplicateClient
	SuperData SuperDataClient
}

func (p LiveProvider) AnalyzeReference(ctx context.Context, req Request) (contracts.ReferenceAnalysisResponse, error) {
	metadata, metadataErr := p.SuperData.FetchMetadata(ctx, req.ReferenceURL)
	transcript, transcriptErr := p.SuperData.FetchTranscript(ctx, req.ReferenceURL)
	extract, extractErr := p.SuperData.Extract(ctx, req.ReferenceURL, referenceAnalysisSchema(), "Extract ParrotKit cut evidence.")

	metadataJSON := mustJSON(metadata)
	transcriptJSON := mustJSON(transcript)
	extractJSON := mustJSON(extract.Raw)
	prompt := BuildPrompt(PromptInput{
		ReferenceURL: req.ReferenceURL,
		Niche:        req.Niche,
		Goal:         req.Goal,
		MetadataJSON: metadataJSON,
		Transcript:   transcriptJSON,
		ExtractJSON:  extractJSON,
	})

	modelText, err := p.Replicate.RunModel(ctx, p.Model, map[string]any{
		"prompt": prompt,
		"temperature": 0.2,
		"max_output_tokens": 5000,
	})
	if err != nil {
		return failed(req.ReferenceURL, "model_failed", "This link could not be analyzed. Try another public short-form link.", true), nil
	}

	var response contracts.ReferenceAnalysisResponse
	if err := json.Unmarshal([]byte(modelText), &response); err != nil {
		return failed(req.ReferenceURL, "model_invalid_output", "This link could not be analyzed. Try another public short-form link.", true), nil
	}
	if response.ReferenceURL == "" {
		response.ReferenceURL = req.ReferenceURL
	}
	if response.Generation.ProviderPipeline == nil {
		response.Generation.ProviderPipeline = []string{}
	}
	if metadataErr != nil {
		response.Generation.MissingArtifacts = appendMissing(response.Generation.MissingArtifacts, "metadata")
	}
	if transcriptErr != nil || len(transcript) == 0 {
		response.Generation.MissingArtifacts = appendMissing(response.Generation.MissingArtifacts, "transcript")
	}
	if extractErr != nil || len(extract.Raw) == 0 {
		response.Generation.MissingArtifacts = appendMissing(response.Generation.MissingArtifacts, "visual_extract")
	}
	if err := response.Validate(); err != nil {
		return failed(req.ReferenceURL, "model_invalid_output", "This link could not be analyzed. Try another public short-form link.", true), nil
	}
	return response, nil
}

func appendMissing(values []string, value string) []string {
	for _, existing := range values {
		if existing == value {
			return values
		}
	}
	return append(values, value)
}

func mustJSON(value any) string {
	bytes, err := json.Marshal(value)
	if err != nil {
		return "{}"
	}
	return string(bytes)
}

func referenceAnalysisSchema() map[string]any {
	return map[string]any{
		"type": "object",
		"required": []string{"schemaVersion", "status", "referenceMedia", "breakdown", "recipe", "cutBoard", "generation"},
		"properties": map[string]any{
			"schemaVersion": map[string]any{"const": contracts.SchemaVersion},
		},
	}
}
```

- [ ] **Step 4: Wire real provider into main**

Modify `services/reference-api/cmd/reference-api/main.go` imports and server construction:

```go
import (
	"log"
	"net/http"
	"os"

	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/analysis"
	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/config"
	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/httpapi"
	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/providers/replicate"
	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/providers/superdata"
)
```

Use:

```go
superDataClient := superdata.NewClient(superdata.Config{BaseURL: cfg.SuperDataAPI, APIKey: cfg.SuperDataAPIKey})
replicateClient := replicate.NewClient(replicate.Config{BaseURL: cfg.ReplicateAPI, APIToken: os.Getenv("REPLICATE_API_TOKEN")})
pipeline := analysis.NewPipeline(analysis.LiveProvider{
	Model:     cfg.ReplicateModel,
	Replicate: replicateClient,
	SuperData: superDataClient,
})

handler := httpapi.NewServer(httpapi.Dependencies{
	AllowDevUnauth: cfg.AllowDevUnauth,
	Analyzer:       pipeline,
	Timeout:        cfg.RequestTimeout,
})
```

- [ ] **Step 5: Run live provider tests**

Run:

```bash
cd /Users/junho/project/parrotkit-app/services/reference-api
go test ./internal/analysis
go test ./...
```

Expected: PASS.

- [ ] **Step 6: Commit live provider wiring**

```bash
cd /Users/junho/project/parrotkit-app
git add services/reference-api/internal/analysis/live_provider.go services/reference-api/internal/analysis/live_provider_test.go services/reference-api/cmd/reference-api/main.go
git commit -m "feat: wire live reference analysis providers"
```

---

## Task 6: HTTP Endpoint

**Files:**
- Modify: `services/reference-api/internal/httpapi/server.go`
- Modify: `services/reference-api/internal/httpapi/server_test.go`
- Modify: `services/reference-api/cmd/reference-api/main.go`

- [ ] **Step 1: Add endpoint tests for auth gate and failure path**

Append to `services/reference-api/internal/httpapi/server_test.go`:

```go
func TestPostReferenceAnalysisRequiresAuthUnlessDevUnauth(t *testing.T) {
	server := NewServer(Dependencies{AllowDevUnauth: false, Timeout: time.Second})
	req := httptest.NewRequest(http.MethodPost, "/v1/reference-analysis", strings.NewReader(`{"referenceUrl":"https://example.com/video"}`))
	res := httptest.NewRecorder()

	server.ServeHTTP(res, req)

	if res.Code != http.StatusUnauthorized {
		t.Fatalf("status = %d", res.Code)
	}
}

func TestPostReferenceAnalysisReturnsFailedForInvalidBody(t *testing.T) {
	server := NewServer(Dependencies{AllowDevUnauth: true, Timeout: time.Second})
	req := httptest.NewRequest(http.MethodPost, "/v1/reference-analysis", strings.NewReader(`{}`))
	res := httptest.NewRecorder()

	server.ServeHTTP(res, req)

	if res.Code != http.StatusOK {
		t.Fatalf("status = %d", res.Code)
	}
	if !strings.Contains(res.Body.String(), `"status":"failed"`) {
		t.Fatalf("body = %s", res.Body.String())
	}
}
```

Also add imports:

```go
import "strings"
```

- [ ] **Step 2: Update server dependencies and route**

Modify `services/reference-api/internal/httpapi/server.go`:

```go
package httpapi

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/analysis"
	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/contracts"
)

type Analyzer interface {
	Analyze(ctx context.Context, req analysis.Request) (contracts.ReferenceAnalysisResponse, error)
}

type Dependencies struct {
	AllowDevUnauth bool
	Analyzer       Analyzer
	Timeout        time.Duration
}

func NewServer(deps Dependencies) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
	})
	mux.HandleFunc("POST /v1/reference-analysis", func(w http.ResponseWriter, r *http.Request) {
		if !deps.AllowDevUnauth && !hasBearer(r) {
			writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "unauthorized"})
			return
		}
		var request contracts.ReferenceAnalysisRequest
		if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid_json"})
			return
		}
		analyzer := deps.Analyzer
		if analyzer == nil {
			analyzer = analysis.NewPipeline(analysis.FakeProviders{})
		}
		ctx, cancel := context.WithTimeout(r.Context(), deps.Timeout)
		defer cancel()
		response, err := analyzer.Analyze(ctx, analysis.Request{
			Goal:           request.Goal,
			IdempotencyKey: request.IdempotencyKey,
			Niche:          request.Niche,
			ReferenceURL:   strings.TrimSpace(request.ReferenceURL),
		})
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "analysis_failed"})
			return
		}
		writeJSON(w, http.StatusOK, response)
	})
	return mux
}

func hasBearer(r *http.Request) bool {
	return strings.HasPrefix(r.Header.Get("Authorization"), "Bearer ")
}

func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}
```

- [ ] **Step 3: Run HTTP tests**

Run:

```bash
cd /Users/junho/project/parrotkit-app/services/reference-api
go test ./internal/httpapi
```

Expected: PASS.

- [ ] **Step 4: Run full Go tests**

Run:

```bash
cd /Users/junho/project/parrotkit-app/services/reference-api
go test ./...
```

Expected: PASS.

- [ ] **Step 5: Commit HTTP endpoint**

```bash
cd /Users/junho/project/parrotkit-app
git add services/reference-api/internal/httpapi services/reference-api/cmd/reference-api/main.go
git commit -m "feat: expose reference analysis endpoint"
```

---

## Task 7: Expo API Contract Adapter

**Files:**
- Modify: `parrotkit-app/.env.local.example`
- Modify: `parrotkit-app/src/features/recipes/lib/reference-recipe-generation.ts`
- Modify: `parrotkit-app/src/features/recipes/lib/reference-recipe-generation.test.ts`

- [ ] **Step 1: Add TypeScript tests for ready and failed responses**

Append to `parrotkit-app/src/features/recipes/lib/reference-recipe-generation.test.ts`:

```ts
const readyApiResponse = {
  schemaVersion: 'parrotkit.reference_analysis_response.v1',
  status: 'ready',
  requestId: 'req_test',
  generatedAt: '2026-05-18T00:00:00.000Z',
  referenceUrl: 'https://example.com/video',
  referenceMedia: {
    sourceUrl: 'https://example.com/video',
    platform: 'tiktok',
    title: 'Creator reference',
    creatorHandle: '@creator',
    durationSeconds: 12,
    thumbnailUrl: 'https://example.com/thumb.jpg',
    language: 'en',
  },
  breakdown: { schema_version: 'parrotkit.reference_breakdown.v1' },
  cutBoard: {
    boardTitle: 'Creator reference',
    estimatedDurationSeconds: 5,
    items: [
      {
        projectionCutId: 'cut-1',
        orderIndex: 0,
        executionTitle: 'Show the result',
        durationSeconds: 5,
        referenceMediaRef: { mediaAssetId: 'media-1', startMs: 0, endMs: 5000, thumbnailUri: 'https://example.com/thumb.jpg' },
        referenceObservation: 'The reference opens on a clear result.',
        referenceUsage: 'Use the same result-first framing.',
        myTakeRelationship: 'This becomes your first take.',
        lineToSay: 'Here is the result I wanted.',
        shotGuide: 'Frame the result vertically.',
        sourceCutIds: ['source-cut-1'],
        successCriteria: ['Result is visible immediately'],
      },
    ],
  },
  recipe: {
    title: 'Creator reference',
    oneLineDescription: 'A shootable reference recipe.',
    totalDurationSec: 5,
    scenes: [
      {
        index: 1,
        title: 'Show the result',
        durationSec: 5,
        lineToSay: 'Here is the result I wanted.',
        shootingGuideline: 'Frame the result vertically.',
        requiredChecklist: ['Result is visible immediately'],
        projectionCutId: 'cut-1',
      },
    ],
  },
  generation: {
    providerPipeline: ['superdata.metadata', 'replicate.model'],
    model: 'google/gemini-2.5-flash',
    fallbackUsed: false,
    missingArtifacts: [],
  },
};

const mappedReady = mapReferenceAnalysisResponseToLegacyResult(readyApiResponse);
if (mappedReady.generation.fallbackUsed) {
  throw new Error('Ready API response must not map to fallback.');
}
if (mappedReady.recipe.scenes[0]?.title !== 'Show the result') {
  throw new Error('Ready API response should map cutBoard/recipe scenes into the legacy shape.');
}

const failedApiResponse = {
  schemaVersion: 'parrotkit.reference_analysis_response.v1',
  status: 'failed',
  requestId: 'req_failed',
  generatedAt: '2026-05-18T00:00:00.000Z',
  referenceUrl: 'https://example.com/private',
  referenceMedia: null,
  breakdown: null,
  cutBoard: null,
  recipe: null,
  generation: {
    providerPipeline: [],
    model: null,
    fallbackUsed: false,
    missingArtifacts: [],
  },
  error: {
    code: 'unsupported_url',
    userMessage: 'This link could not be analyzed. Try another public short-form link.',
    retryable: true,
    recoveryAction: 'change_link',
  },
};

if (isUsableReferenceAnalysisResponse(failedApiResponse)) {
  throw new Error('Failed API response must not be treated as usable.');
}
```

- [ ] **Step 2: Run TS test and verify failure**

Run:

```bash
cd /Users/junho/project/parrotkit-app/parrotkit-app
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/reference-recipe-generation.test.ts
```

Expected: FAIL because new mapping functions do not exist.

- [ ] **Step 3: Add env example dev fallback flag**

Modify `parrotkit-app/.env.local.example`:

```env
# Dev-only escape hatch for local tests without the Go API.
# Leave blank/false for production builds so fake analyzed boards are not created.
EXPO_PUBLIC_REFERENCE_ANALYSIS_DEV_FALLBACK=""
```

- [ ] **Step 4: Implement response types and mapping**

Modify `parrotkit-app/src/features/recipes/lib/reference-recipe-generation.ts`:

```ts
export type ReferenceAnalysisAPIStatus = 'ready' | 'partial_ready' | 'fallback' | 'failed';

export type ReferenceAnalysisAPIResponse = {
  breakdown: Record<string, unknown> | null;
  cutBoard: {
    boardTitle: string;
    estimatedDurationSeconds: number;
    items: Array<{
      durationSeconds: number;
      executionTitle: string;
      lineToSay: string | null;
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
      myTakeRelationship: string;
      shotGuide: string | null;
      sourceCutIds: string[];
      successCriteria: string[];
    }>;
  } | null;
  error?: {
    code: string;
    recoveryAction: 'retry' | 'change_link' | 'try_later' | 'use_manual';
    retryable: boolean;
    userMessage: string;
  };
  generatedAt: string;
  generation: {
    fallbackReason?: string | null;
    fallbackUsed: boolean;
    missingArtifacts: string[];
    model: string | null;
    providerPipeline: string[];
  };
  recipe: GeneratedReferenceRecipe | null;
  referenceMedia: {
    creatorHandle?: string | null;
    durationSeconds?: number | null;
    language?: string | null;
    platform: string;
    sourceUrl: string;
    thumbnailUrl?: string | null;
    title?: string | null;
  } | null;
  referenceUrl: string;
  requestId: string;
  schemaVersion: 'parrotkit.reference_analysis_response.v1';
  status: ReferenceAnalysisAPIStatus;
};

export function isUsableReferenceAnalysisResponse(
  value: unknown,
): value is ReferenceAnalysisAPIResponse {
  const response = value as ReferenceAnalysisAPIResponse;
  return (
    response?.schemaVersion === 'parrotkit.reference_analysis_response.v1' &&
    (response.status === 'ready' || response.status === 'partial_ready') &&
    Boolean(response.recipe?.scenes?.length) &&
    Boolean(response.cutBoard?.items?.length) &&
    !response.generation?.fallbackUsed
  );
}

export function mapReferenceAnalysisResponseToLegacyResult(
  response: ReferenceAnalysisAPIResponse,
): ReferenceRecipeGenerationResult {
  const thumbnailUrl =
    response.referenceMedia?.thumbnailUrl ||
    response.cutBoard?.items?.[0]?.referenceMediaRef.thumbnailUri ||
    getYouTubeThumbnailUrl(response.referenceUrl) ||
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1200';

  return {
    recipe: response.recipe ?? buildLocalFallbackRecipe({ goalId: 'ad', nicheId: 'other' }),
    reference: {
      platform: 'youtube-shorts',
      thumbnailUrl,
      title: response.referenceMedia?.title || response.recipe?.title || 'Reference',
      transcriptLanguage: response.referenceMedia?.language ?? null,
      transcriptPreview: '',
      transcriptSource: response.generation.missingArtifacts.includes('transcript') ? 'none' : 'provider',
      url: response.referenceUrl,
      videoId: getYouTubeVideoId(response.referenceUrl) || response.requestId,
    },
    generation: {
      fallbackReason: response.generation.fallbackReason,
      fallbackUsed: false,
      generatedAt: response.generatedAt,
      model: response.generation.model,
      status: response.status === 'ready' ? 'generated' : 'generated',
    },
  };
}
```

- [ ] **Step 5: Switch API path and gate fallback**

Modify `generateRecipeFromYouTubeReference()` in `reference-recipe-generation.ts`:

```ts
const devFallbackEnabled =
  process.env.EXPO_PUBLIC_REFERENCE_ANALYSIS_DEV_FALLBACK?.trim() === 'true';
const fallback = buildLocalFallbackResult({ goalId, nicheId, referenceUrl });

if (!/^https?:\/\//i.test(referenceUrl.trim())) {
  return fallback;
}
```

Change fetch URL:

```ts
const response = await fetch(`${getApiBaseUrl()}/v1/reference-analysis`, {
```

After parsing JSON:

```ts
const data = (await response.json()) as ReferenceAnalysisAPIResponse;
if (!isUsableReferenceAnalysisResponse(data)) {
  if (devFallbackEnabled) return fallback;
  throw new Error(data.error?.userMessage || 'Reference analysis failed');
}
return mapReferenceAnalysisResponseToLegacyResult(data);
```

In the catch block:

```ts
if (devFallbackEnabled) {
  return fallback;
}
throw error;
```

- [ ] **Step 6: Run reference generation tests**

Run:

```bash
cd /Users/junho/project/parrotkit-app/parrotkit-app
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/reference-recipe-generation.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit Expo adapter**

```bash
cd /Users/junho/project/parrotkit-app
git add parrotkit-app/.env.local.example parrotkit-app/src/features/recipes/lib/reference-recipe-generation.ts parrotkit-app/src/features/recipes/lib/reference-recipe-generation.test.ts
git commit -m "feat: wire mobile reference analysis contract"
```

---

## Task 8: Drawer Recovery UX

**Files:**
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-create-screen.tsx`
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-create/recipe-create-copy.ts`
- Create: `parrotkit-app/src/features/recipes/screens/recipe-create/reference-analysis-state.test.ts`

- [ ] **Step 1: Add state contract test**

Create `parrotkit-app/src/features/recipes/screens/recipe-create/reference-analysis-state.test.ts`:

```ts
import { readFileSync } from 'fs';
import { resolve } from 'path';

const screenSource = readFileSync(
  resolve(__dirname, '../recipe-create-screen.tsx'),
  'utf8',
);
const copySource = readFileSync(
  resolve(__dirname, 'recipe-create-copy.ts'),
  'utf8',
);

if (!screenSource.includes('referenceAnalysisError')) {
  throw new Error('RecipeCreateScreen should keep a referenceAnalysisError state for failed analysis.');
}

if (!screenSource.includes('catch (error)')) {
  throw new Error('Paste analysis failures should be caught so the drawer stays recoverable.');
}

if (!screenSource.includes('setReferenceAnalysisError')) {
  throw new Error('Paste analysis failures should update concise drawer recovery copy.');
}

if (!copySource.includes('analysisFailed')) {
  throw new Error('Recipe create copy should include concise analysis failure copy.');
}
```

- [ ] **Step 2: Run state contract test and verify failure**

Run:

```bash
cd /Users/junho/project/parrotkit-app/parrotkit-app
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-create/reference-analysis-state.test.ts
```

Expected: FAIL until screen state and copy are added.

- [ ] **Step 3: Add concise copy**

Modify both language objects in `parrotkit-app/src/features/recipes/screens/recipe-create/recipe-create-copy.ts`:

```ts
analysisFailed: 'This link could not be analyzed. Try another public short-form link.',
```

For Korean:

```ts
analysisFailed: '이 링크를 분석하지 못했어요. 공개 숏폼 링크로 다시 시도해 주세요.',
```

- [ ] **Step 4: Add error state and catch analysis failures**

Modify `RecipeCreateScreen`:

```tsx
const [referenceAnalysisError, setReferenceAnalysisError] = useState<string | null>(null);
```

In the submit handler before generation:

```tsx
setReferenceAnalysisError(null);
```

Wrap reference generation:

```tsx
try {
  const generatedReference =
    selectedMode === 'reference'
      ? await generateRecipeFromYouTubeReference({
          goalId: selectedGoalId,
          nicheId: selectedNicheId,
          referenceUrl,
        })
      : buildLocalFallbackResult({
          goalId: selectedGoalId,
          nicheId: selectedNicheId,
          referenceUrl,
        });
  // existing recipe creation/navigation code remains here
} catch (error) {
  setReferenceAnalysisError(
    error instanceof Error && error.message
      ? error.message
      : copy.analysisFailed,
  );
  return;
}
```

Under the link input error rendering:

```tsx
{referenceAnalysisError ? (
  <Text style={styles.inputErrorText} testID="recipe-create-reference-analysis-error">
    {referenceAnalysisError}
  </Text>
) : null}
```

- [ ] **Step 5: Run drawer state tests**

Run:

```bash
cd /Users/junho/project/parrotkit-app/parrotkit-app
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-create/reference-analysis-state.test.ts
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/reference-recipe-generation.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit drawer recovery**

```bash
cd /Users/junho/project/parrotkit-app
git add parrotkit-app/src/features/recipes/screens/recipe-create-screen.tsx parrotkit-app/src/features/recipes/screens/recipe-create/recipe-create-copy.ts parrotkit-app/src/features/recipes/screens/recipe-create/reference-analysis-state.test.ts
git commit -m "fix: keep paste drawer recoverable on analysis failure"
```

---

## Task 9: Local QA And Documentation

**Files:**
- Create: `services/reference-api/Dockerfile`
- Create: `services/reference-api/README.md`
- Modify: `context/context_20260517_reference_analysis_pipeline_contract.md`
- Create: `context/context_20260518_issue_19_live_reference_analysis_go_api.md`

- [ ] **Step 1: Add Dockerfile**

Create `services/reference-api/Dockerfile`:

```dockerfile
FROM golang:1.23-alpine AS build
WORKDIR /src
COPY go.mod ./
COPY cmd ./cmd
COPY internal ./internal
RUN go build -o /out/reference-api ./cmd/reference-api

FROM alpine:3.20
RUN adduser -D -H appuser
USER appuser
COPY --from=build /out/reference-api /reference-api
EXPOSE 8787
ENTRYPOINT ["/reference-api"]
```

- [ ] **Step 2: Add service README**

Create `services/reference-api/README.md`:

````md
# ParrotKit Reference API

Go runtime for live reference-link analysis.

## Local Run

```bash
cd services/reference-api
PORT=8787 \
PARROTKIT_ALLOW_DEV_UNAUTH=true \
SUPERDATA_API_KEY="$SUPERDATA_API_KEY" \
REPLICATE_API_TOKEN="$REPLICATE_API_TOKEN" \
go run ./cmd/reference-api
```

Point Expo at the Go API:

```env
EXPO_PUBLIC_PARROTKIT_API_URL="http://127.0.0.1:8787"
EXPO_PUBLIC_REFERENCE_ANALYSIS_DEV_FALLBACK=""
```

## Endpoint

```bash
curl -X POST http://localhost:8787/v1/reference-analysis \
  -H 'Content-Type: application/json' \
  -d '{"referenceUrl":"https://example.com/video","niche":"beauty","goal":"conversion"}'
```

## Secret Boundary

Do not put `SUPERDATA_API_KEY`, `SUPADATA_API_KEY`, `REPLICATE_API_TOKEN`, `SUPABASE_SECRET_KEY`, or `DATABASE_URL` in Expo env.
````

- [ ] **Step 3: Run verification**

Run:

```bash
cd /Users/junho/project/parrotkit-app/services/reference-api
go test ./...
```

Expected: PASS.

Run:

```bash
cd /Users/junho/project/parrotkit-app/parrotkit-app
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/reference-recipe-generation.test.ts
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-create/reference-analysis-state.test.ts
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
npm run check:architecture
```

Expected: PASS.

Run:

```bash
cd /Users/junho/project/parrotkit-app
git diff --check
```

Expected: no output.

- [ ] **Step 4: Real provider smoke test**

With real env set locally:

```bash
cd /Users/junho/project/parrotkit-app/services/reference-api
PORT=8787 PARROTKIT_ALLOW_DEV_UNAUTH=true SUPERDATA_API_KEY="$SUPERDATA_API_KEY" REPLICATE_API_TOKEN="$REPLICATE_API_TOKEN" go run ./cmd/reference-api
```

In another terminal:

```bash
curl -sS -X POST http://localhost:8787/v1/reference-analysis \
  -H 'Content-Type: application/json' \
  -d '{"referenceUrl":"https://www.youtube.com/shorts/dtnIqkMmbs0","niche":"beauty","goal":"conversion","idempotencyKey":"manual-smoke-20260518"}' \
  | tee /tmp/parrotkit-reference-analysis-smoke.json
```

Expected:
- JSON `schemaVersion` equals `parrotkit.reference_analysis_response.v1`.
- `status` is `ready` or `partial_ready` for at least one public reference link.
- If `failed`, the error is user-safe and no `cutBoard` exists.

- [ ] **Step 5: Add context summary**

Create `context/context_20260518_issue_19_live_reference_analysis_go_api.md`:

```md
# 2026-05-18 Issue 19 Live Reference Analysis Go API

## Request

Implement issue #19 from the Ouroboros seed `seed_ee7758998b02`: Expo Paste drawer -> Go API -> SuperData/Supadata + Replicate -> canonical Breakdown, recipe, and cut board.

## Key Decisions

- Go service lives in `services/reference-api/`.
- Endpoint is synchronous `POST /v1/reference-analysis` for the first quality spike.
- Expo sends no provider secrets.
- Production mock/fake analyzed fallback is disabled unless explicit dev fallback env is enabled.
- Payment, entitlement, and durable Supabase persistence are deferred.

## Verification

- `go test ./...` in `services/reference-api`
- `reference-recipe-generation.test.ts`
- `reference-analysis-state.test.ts`
- `tsc --noEmit`
- `npm run check:architecture`
- `git diff --check`
```

- [ ] **Step 6: Commit docs and QA**

```bash
cd /Users/junho/project/parrotkit-app
git add services/reference-api/Dockerfile services/reference-api/README.md context/context_20260518_issue_19_live_reference_analysis_go_api.md
git commit -m "docs: document reference api runtime"
```

---

## Final Verification Before Push

- [ ] **Step 1: Check worktree**

```bash
cd /Users/junho/project/parrotkit-app
git status --short --branch
```

Expected: only intentional files staged/committed; unrelated `parrotkit-app/output/playwright/release-media-qa-20260517/` remains untracked unless explicitly handled.

- [ ] **Step 2: Rebase/fetch main**

```bash
git fetch origin main
git status --short --branch
```

Expected: branch is current or local conflict is resolved before push.

- [ ] **Step 3: Push**

```bash
git push origin main
```

Expected: push succeeds.

---

## Self-Review

**Spec coverage:**  
The plan covers Go runtime, `/v1/reference-analysis`, SuperData/Supadata + Replicate provider boundaries, status-specific response invariants, Expo Paste integration, dev-only fallback gating, user-safe failure recovery, and deferred payment/persistence.

**Known correction from generated Seed:**  
The Seed marked `breakdown`, `recipe`, `cutBoard`, `error`, and `legacyRecipeResult` as always required. The implementation must use the status-specific invariant from the interview: `ready` and usable `partial_ready` require board artifacts; `failed` must not contain them; `fallback` must not contain fake Breakdown.

**Placeholder scan:**  
This plan contains exact file paths, commands, and code snippets for each implementation step. The only runtime value intentionally supplied by the user is the real public short-form URL and provider API keys for the final smoke test.

**Type consistency:**  
The Go response contract uses `schemaVersion`, `status`, `referenceMedia`, `breakdown`, `recipe`, `cutBoard`, `generation`, `error`, and optional `legacyRecipeResult`. The Expo adapter uses the same field names and maps only ready/usable partial responses into the existing `ReferenceRecipeGenerationResult`.
