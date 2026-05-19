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
	apiKey       string
	baseURL      string
	httpClient   *http.Client
	pollInterval time.Duration
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
		apiKey:       strings.TrimSpace(cfg.APIKey),
		baseURL:      strings.TrimRight(cfg.BaseURL, "/"),
		httpClient:   http.DefaultClient,
		pollInterval: 1500 * time.Millisecond,
	}
}

func (c *Client) FetchMetadata(ctx context.Context, sourceURL string) (Metadata, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, c.url("/metadata", sourceURL), nil)
	if err != nil {
		return Metadata{}, err
	}
	c.setHeaders(req)
	raw, err := c.doJSON(req)
	if err != nil {
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
		"prompt": prompt,
		"schema": schema,
		"url":    sourceURL,
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
	values.Set("chunkSize", "280")
	values.Set("mode", mode)
	values.Set("text", "false")
	values.Set("url", sourceURL)

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
	return normalizeTranscript(raw["content"]), nil
}

func (c *Client) pollJob(ctx context.Context, path string) (map[string]any, error) {
	interval := c.pollInterval
	if interval <= 0 {
		interval = 1500 * time.Millisecond
	}
	ticker := time.NewTicker(interval)
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
			case "", "completed":
				return raw, nil
			case "queued", "active":
				continue
			case "failed":
				return nil, fmt.Errorf("superdata job failed: %s", jobErrorSummary(raw))
			}
		}
	}
}

func (c *Client) url(path string, sourceURL string) string {
	values := url.Values{}
	values.Set("url", sourceURL)
	return c.baseURL + path + "?" + values.Encode()
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

func (c *Client) setHeaders(req *http.Request) {
	req.Header.Set("Accept", "application/json")
	req.Header.Set("x-api-key", c.apiKey)
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

func normalizeTranscript(content any) []TranscriptSegment {
	if text := strings.TrimSpace(stringValue(content)); text != "" {
		return []TranscriptSegment{{ID: "seg-1", StartMs: 0, EndMs: 1000, Text: text}}
	}

	chunks, ok := content.([]any)
	if !ok {
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
			EndMs:   offset + duration,
			ID:      fmt.Sprintf("seg-%d", index+1),
			StartMs: offset,
			Text:    text,
		})
	}
	return segments
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

func jobErrorSummary(raw map[string]any) string {
	errorValue, ok := raw["error"].(map[string]any)
	if !ok {
		return "unknown"
	}
	code := stringValue(errorValue["code"])
	message := stringValue(errorValue["message"])
	switch {
	case code != "" && message != "":
		return code + ": " + message
	case code != "":
		return code
	case message != "":
		return message
	default:
		return "unknown"
	}
}
