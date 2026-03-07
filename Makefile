.PHONY: clean-appledouble supabase-link db-push db-generate db-schema notion-setup notion-upload notion-upload-dry-run report-and-upload report-template deck-template deck-and-upload dev

ENV_FILE := .env.local

clean-appledouble:
	@if command -v dot_clean >/dev/null 2>&1; then dot_clean -m . || true; fi
	@if command -v xattr >/dev/null 2>&1 && [ -d services/edit-toolkit ]; then xattr -cr services/edit-toolkit || true; fi
	find . -name '._*' -exec rm -f {} + || true

supabase-link:
	@test -f $(ENV_FILE) || (echo "$(ENV_FILE) is required" && exit 1)
	@set -a; . ./$(ENV_FILE); set +a; \
	test -n "$$SUPABASE_PROJECT_REF" || (echo "SUPABASE_PROJECT_REF is required in $(ENV_FILE)" && exit 1); \
	supabase link --project-ref "$$SUPABASE_PROJECT_REF"

db-push: supabase-link
	@supabase db push

db-generate:
	@npm run db:generate

db-schema:
	@npm run db:schema

notion-setup:
	@test -f $(ENV_FILE) || (echo "$(ENV_FILE) is required" && exit 1)
	@node scripts/setup-notion-reports.cjs --write-env $(ENV_FILE)

notion-upload:
	@test -f $(ENV_FILE) || (echo "$(ENV_FILE) is required" && exit 1)
	@test -n "$(REPORT)" || (echo "REPORT=<artifact path> is required" && exit 1)
	@node scripts/upload-report-to-notion.cjs \
		--file "$(REPORT)" \
		$(if $(FILES),--extra-files "$(FILES)",) \
		$(if $(SUMMARY_MD),--summary-md "$(SUMMARY_MD)",) \
		$(if $(TITLE),--title "$(TITLE)",) \
		$(if $(PROJECT),--project "$(PROJECT)",) \
		$(if $(REPORT_TYPE),--report-type "$(REPORT_TYPE)",) \
		$(if $(STATUS),--status "$(STATUS)",) \
		$(if $(SOURCE_URL),--source-url "$(SOURCE_URL)",) \
		$(if $(RECIPE_ID),--recipe-id "$(RECIPE_ID)",) \
		$(if $(NOTES),--notes "$(NOTES)",) \
		$(if $(CREATED_AT),--created-at "$(CREATED_AT)",) \
		$(if $(BRANCH),--branch "$(BRANCH)",) \
		$(if $(COMMIT),--commit "$(COMMIT)",)

notion-upload-dry-run:
	@REPORT_PATH="$(REPORT)"; \
	if [ -z "$$REPORT_PATH" ]; then \
		REPORT_PATH=$$(node scripts/find-latest-report.cjs); \
	fi; \
	test -n "$$REPORT_PATH" || { echo "REPORT=<artifact path> is required and no report was found in output/"; exit 1; }; \
	SUMMARY_PATH="$(SUMMARY_MD)"; \
	if [ -z "$$SUMMARY_PATH" ]; then \
		STEM=$$(basename "$$REPORT_PATH"); STEM=$${STEM%.*}; \
		if [ -f "output/reports/$$STEM.md" ]; then SUMMARY_PATH="output/reports/$$STEM.md"; fi; \
	fi; \
	node scripts/upload-report-to-notion.cjs --dry-run --file "$$REPORT_PATH" $${SUMMARY_PATH:+--summary-md "$$SUMMARY_PATH"}

report-and-upload:
	@REPORT_PATH="$(REPORT)"; \
	if [ -z "$$REPORT_PATH" ]; then \
		REPORT_PATH=$$(node scripts/find-latest-report.cjs); \
	fi; \
	test -n "$$REPORT_PATH" || { echo "REPORT=<artifact path> is required and no report was found in output/"; exit 1; }; \
	SUMMARY_PATH="$(SUMMARY_MD)"; \
	if [ -z "$$SUMMARY_PATH" ]; then \
		STEM=$$(basename "$$REPORT_PATH"); STEM=$${STEM%.*}; \
		if [ -f "output/reports/$$STEM.md" ]; then SUMMARY_PATH="output/reports/$$STEM.md"; fi; \
	fi; \
	$(MAKE) notion-upload REPORT="$$REPORT_PATH" SUMMARY_MD="$$SUMMARY_PATH" FILES="$(FILES)" TITLE="$(TITLE)" PROJECT="$(PROJECT)" REPORT_TYPE="$(REPORT_TYPE)" STATUS="$(STATUS)" SOURCE_URL="$(SOURCE_URL)" RECIPE_ID="$(RECIPE_ID)" NOTES="$(NOTES)" CREATED_AT="$(CREATED_AT)" BRANCH="$(BRANCH)" COMMIT="$(COMMIT)"

report-template:
	@test -n "$(REPORT)" || (echo "REPORT=<artifact path> is required" && exit 1)
	@node scripts/init-report-summary.cjs \
		--file "$(REPORT)" \
		$(if $(REPORT_TYPE),--report-type "$(REPORT_TYPE)",) \
		$(if $(TITLE),--title "$(TITLE)",) \
		$(if $(PROJECT),--project "$(PROJECT)",) \
		$(if $(OUTPUT),--output "$(OUTPUT)",) \
		$(if $(FORCE),--force,)

deck-template:
	@$(MAKE) report-template REPORT="$(REPORT)" REPORT_TYPE=deck TITLE="$(TITLE)" PROJECT="$(PROJECT)" OUTPUT="$(OUTPUT)" FORCE="$(FORCE)"

deck-and-upload:
	@test -n "$(REPORT)" || (echo "REPORT=<ppt/pptx path> is required" && exit 1)
	@SUMMARY_PATH="$(SUMMARY_MD)"; \
	if [ -z "$$SUMMARY_PATH" ]; then \
		STEM=$$(basename "$(REPORT)"); STEM=$${STEM%.*}; \
		if [ -f "output/reports/$$STEM.md" ]; then SUMMARY_PATH="output/reports/$$STEM.md"; fi; \
	fi; \
	$(MAKE) notion-upload REPORT="$(REPORT)" SUMMARY_MD="$$SUMMARY_PATH" REPORT_TYPE=deck TITLE="$(TITLE)" PROJECT="$(PROJECT)" STATUS="$(STATUS)" NOTES="$(NOTES)" CREATED_AT="$(CREATED_AT)" BRANCH="$(BRANCH)" COMMIT="$(COMMIT)"

dev:
	@npm run dev

cl: clean-appledouble
