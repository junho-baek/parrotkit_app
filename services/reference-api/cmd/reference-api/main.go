package main

import (
	"log"
	"net/http"

	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/analysis"
	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/config"
	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/httpapi"
	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/providers/replicate"
	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/providers/superdata"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("config: %v", err)
	}

	superDataClient := superdata.NewClient(superdata.Config{
		APIKey:  cfg.SuperDataAPIKey,
		BaseURL: cfg.SuperDataAPI,
	})
	replicateClient := replicate.NewClient(replicate.Config{
		APIToken: cfg.ReplicateAPIToken,
		BaseURL:  cfg.ReplicateAPI,
	})
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

	addr := ":" + cfg.Port
	log.Printf("reference-api listening on %s", addr)
	if err := http.ListenAndServe(addr, handler); err != nil {
		log.Fatal(err)
	}
}
