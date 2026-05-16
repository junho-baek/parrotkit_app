# 2026-05-17 Recipe Analysis Contract Seed

## 배경

Sandcastle AI screenshots showed a useful reference-video analysis taxonomy: summary, idea analysis, hook formula, storytelling format, visual layout, idea/hook vaults, and channel sources. The user wants ParrotKit recipes to keep the durable parts of that thinking without turning the shooting board into a cluttered analytics console.

Ouroboros MCP tools were not exposed through Codex tool search, but the local `ouroboros` CLI was available. `ouroboros auto --skip-run` created `auto_b0a0703c1c5b` and `interview_ca635fee86514c4b`, then blocked on the internal 120s interview phase before seed generation. The saved interview is treated as input, not as a completed A-grade Ouroboros seed.

## 목표

Create a stable Seed YAML for a ParrotKit Recipe Analysis Contract:

- Center the immediate scope on recipe-level analysis guidance.
- Preserve a future Reference Intelligence Layer for many-video analysis.
- Make the shooting board expose only creator-useful execution guidance.
- Avoid repeated per-cut hooks, meaningless labels, and box-in-box UI.

## 범위

- Add a seed YAML under `parrotkit-app/seeds/`.
- Add a context note recording the CLI attempt and resulting product decision.
- Do not implement code, API, database, or UI changes in this task.

## 변경 파일

- `parrotkit-app/seeds/parrotkit_recipe_analysis_contract_20260517.yaml`
- `parrotkit-app/context/context_20260517_recipe_analysis_contract_seed.md`
- `parrotkit-app/plans/20260517_recipe_analysis_contract_seed.md`

## 테스트

- Markdown/YAML review.
- `git diff --check`.

## 롤백

Remove the added seed, context, and plan files.

## 리스크

- The Ouroboros CLI did not complete seed generation, so the final seed is Codex-authored using the partial interview and user direction.
- Future implementation must still validate actual data model/API/UI impacts before coding.

## 결과

- Added `parrotkit-app/seeds/parrotkit_recipe_analysis_contract_20260517.yaml`.
- Added `parrotkit-app/context/context_20260517_recipe_analysis_contract_seed.md`.
- Verified YAML parses with Ruby `YAML.load_file`.
- Verified `git diff --check` passes.
