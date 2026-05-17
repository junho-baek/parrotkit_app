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
			"id":     "pred_1",
			"output": []string{"{\"ok\":true}"},
			"status": "succeeded",
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

func TestRunModelPollsPrediction(t *testing.T) {
	var getCalls int
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			_ = json.NewEncoder(w).Encode(map[string]any{
				"id":     "pred_1",
				"status": "processing",
				"urls":   map[string]string{"get": "http://" + r.Host + "/predictions/pred_1"},
			})
		case http.MethodGet:
			getCalls++
			_ = json.NewEncoder(w).Encode(map[string]any{
				"id":     "pred_1",
				"output": "done",
				"status": "succeeded",
			})
		default:
			t.Fatalf("unexpected method %s", r.Method)
		}
	}))
	defer server.Close()

	client := NewClient(Config{BaseURL: server.URL, APIToken: "rep-token"})
	text, err := client.RunModel(context.Background(), "google/gemini-2.5-flash", map[string]any{"prompt": "hello"})
	if err != nil {
		t.Fatalf("RunModel() error = %v", err)
	}
	if text != "done" || getCalls != 1 {
		t.Fatalf("text=%q getCalls=%d", text, getCalls)
	}
}
