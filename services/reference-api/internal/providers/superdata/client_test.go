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
			"author":   map[string]any{"username": "creator"},
			"media":    map[string]any{"duration": 31, "thumbnailUrl": "https://cdn.example/thumb.jpg"},
			"platform": "tiktok",
			"title":    "Creator reference",
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
	if metadata.AuthorHandle == nil || *metadata.AuthorHandle != "creator" {
		t.Fatalf("author = %#v", metadata.AuthorHandle)
	}
}

func TestFetchTranscriptUsesGeneratedWhenNativeEmpty(t *testing.T) {
	var modes []string
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		modes = append(modes, r.URL.Query().Get("mode"))
		if r.URL.Query().Get("mode") == "native" {
			_ = json.NewEncoder(w).Encode(map[string]any{"content": []any{}})
			return
		}
		_ = json.NewEncoder(w).Encode(map[string]any{
			"content": []any{
				map[string]any{"duration": float64(1200), "offset": float64(300), "text": "Generated line"},
			},
		})
	}))
	defer server.Close()

	client := NewClient(Config{BaseURL: server.URL, APIKey: "super-key"})
	segments, err := client.FetchTranscript(context.Background(), "https://example.com/ref")
	if err != nil {
		t.Fatalf("FetchTranscript() error = %v", err)
	}
	if len(modes) != 2 || modes[0] != "native" || modes[1] != "generate" {
		t.Fatalf("modes = %#v", modes)
	}
	if len(segments) != 1 || segments[0].Text != "Generated line" || segments[0].StartMs != 300 {
		t.Fatalf("segments = %#v", segments)
	}
}

func TestExtractPostsSchemaAndPrompt(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost || r.URL.Path != "/extract" {
			t.Fatalf("%s %s", r.Method, r.URL.Path)
		}
		var body map[string]any
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			t.Fatalf("decode body: %v", err)
		}
		if body["url"] != "https://example.com/ref" || body["prompt"] == "" {
			t.Fatalf("body = %#v", body)
		}
		_ = json.NewEncoder(w).Encode(map[string]any{"cuts": []any{map[string]any{"time_range": "0:00-0:03"}}})
	}))
	defer server.Close()

	client := NewClient(Config{BaseURL: server.URL, APIKey: "super-key"})
	result, err := client.Extract(context.Background(), "https://example.com/ref", map[string]any{"type": "object"}, "prompt")
	if err != nil {
		t.Fatalf("Extract() error = %v", err)
	}
	if len(result.Raw) == 0 {
		t.Fatalf("empty extract")
	}
}
