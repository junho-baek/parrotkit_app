.PHONY: clean-appledouble supabase-link db-push db-generate db-schema dev

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

dev:
	@npm run dev

cl: clean-appledouble
