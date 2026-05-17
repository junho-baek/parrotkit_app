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
	if cfg.ReplicateAPIToken != "rep-token" {
		t.Fatalf("ReplicateAPIToken = %q", cfg.ReplicateAPIToken)
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
