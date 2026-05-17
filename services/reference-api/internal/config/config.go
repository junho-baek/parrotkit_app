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
	AllowDevUnauth    bool
	Port              string
	ReplicateAPI      string
	ReplicateAPIToken string
	ReplicateModel    string
	RequestTimeout    time.Duration
	SuperDataAPI      string
	SuperDataAPIKey   string
}

func Load() (Config, error) {
	cfg := Config{
		Port:              getenvDefault("PORT", "8787"),
		ReplicateAPI:      getenvDefault("REPLICATE_API_BASE_URL", "https://api.replicate.com/v1"),
		ReplicateAPIToken: strings.TrimSpace(os.Getenv("REPLICATE_API_TOKEN")),
		ReplicateModel:    getenvDefault("REPLICATE_REFERENCE_MODEL", defaultReplicateModel),
		RequestTimeout:    timeoutFromEnv("REFERENCE_ANALYSIS_TIMEOUT_MS", 90*time.Second),
		SuperDataAPI:      getenvDefault("SUPERDATA_API_BASE_URL", "https://api.supadata.ai/v1"),
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
	if cfg.ReplicateAPIToken == "" {
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
