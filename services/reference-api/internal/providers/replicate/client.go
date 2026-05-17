package replicate

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"
)

type Config struct {
	APIToken string
	BaseURL  string
}

type Client struct {
	apiToken   string
	baseURL    string
	httpClient *http.Client
}

type prediction struct {
	Error  any               `json:"error"`
	ID     string            `json:"id"`
	Output any               `json:"output"`
	Status string            `json:"status"`
	URLs   map[string]string `json:"urls"`
}

func NewClient(cfg Config) *Client {
	return &Client{
		apiToken:   strings.TrimSpace(cfg.APIToken),
		baseURL:    strings.TrimRight(cfg.BaseURL, "/"),
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
	c.setHeaders(req)
	req.Header.Set("Prefer", "wait")
	pred, err := c.doPrediction(req)
	if err != nil {
		return "", err
	}
	if pred.Status != "succeeded" {
		pred, err = c.waitForPrediction(ctx, pred)
		if err != nil {
			return "", err
		}
	}
	return outputToText(pred.Output), nil
}

func (c *Client) waitForPrediction(ctx context.Context, pred prediction) (prediction, error) {
	ticker := time.NewTicker(1500 * time.Millisecond)
	defer ticker.Stop()
	for {
		switch pred.Status {
		case "succeeded":
			return pred, nil
		case "failed", "canceled":
			return prediction{}, fmt.Errorf("replicate prediction %s", pred.Status)
		}
		select {
		case <-ctx.Done():
			return prediction{}, ctx.Err()
		case <-ticker.C:
			getURL := pred.URLs["get"]
			if getURL == "" {
				getURL = c.baseURL + "/predictions/" + pred.ID
			}
			req, err := http.NewRequestWithContext(ctx, http.MethodGet, getURL, nil)
			if err != nil {
				return prediction{}, err
			}
			c.setHeaders(req)
			next, err := c.doPrediction(req)
			if err != nil {
				return prediction{}, err
			}
			pred = next
		}
	}
}

func (c *Client) doPrediction(req *http.Request) (prediction, error) {
	res, err := c.httpClient.Do(req)
	if err != nil {
		return prediction{}, err
	}
	defer res.Body.Close()
	if res.StatusCode < 200 || res.StatusCode >= 300 {
		return prediction{}, fmt.Errorf("replicate status %d", res.StatusCode)
	}
	var pred prediction
	if err := json.NewDecoder(res.Body).Decode(&pred); err != nil {
		return prediction{}, err
	}
	return pred, nil
}

func (c *Client) setHeaders(req *http.Request) {
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Authorization", "Bearer "+c.apiToken)
	req.Header.Set("Content-Type", "application/json")
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
