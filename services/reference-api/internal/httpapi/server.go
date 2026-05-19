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
			analyzer = analysis.NewPipeline(nil)
		}

		timeout := deps.Timeout
		if timeout <= 0 {
			timeout = 90 * time.Second
		}
		ctx, cancel := context.WithTimeout(r.Context(), timeout)
		defer cancel()

		response, err := analyzer.Analyze(ctx, analysis.Request{
			Goal:           strings.TrimSpace(request.Goal),
			IDempotencyKey: strings.TrimSpace(request.IDempotencyKey),
			LanguageHint:   strings.TrimSpace(request.LanguageHint),
			Niche:          strings.TrimSpace(request.Niche),
			ProductContext: request.ProductContext,
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
