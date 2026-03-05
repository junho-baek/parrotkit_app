.PHONY: clean-appledouble

clean-appledouble:
	@if command -v dot_clean >/dev/null 2>&1; then dot_clean -m . || true; fi
	@if command -v xattr >/dev/null 2>&1 && [ -d services/edit-toolkit ]; then xattr -cr services/edit-toolkit || true; fi
	find . -name '._*' -exec rm -f {} + || true

cl: clean-appledouble
