package httpapi

import (
	"context"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/analysis"
	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/contracts"
)

type fakeAnalyzer struct {
	response contracts.ReferenceAnalysisResponse
}

func (f fakeAnalyzer) Analyze(ctx context.Context, req analysis.Request) (contracts.ReferenceAnalysisResponse, error) {
	if f.response.SchemaVersion != "" {
		return f.response, nil
	}
	return contracts.ReadyFixture(), nil
}

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

func TestPostReferenceAnalysisReturnsReady(t *testing.T) {
	server := NewServer(Dependencies{AllowDevUnauth: true, Analyzer: fakeAnalyzer{}, Timeout: time.Second})
	req := httptest.NewRequest(http.MethodPost, "/v1/reference-analysis", strings.NewReader(`{"referenceUrl":"https://example.com/video"}`))
	res := httptest.NewRecorder()

	server.ServeHTTP(res, req)

	if res.Code != http.StatusOK {
		t.Fatalf("status = %d", res.Code)
	}
	if !strings.Contains(res.Body.String(), `"schemaVersion":"parrotkit.reference_analysis_response.v1"`) {
		t.Fatalf("body = %s", res.Body.String())
	}
}
