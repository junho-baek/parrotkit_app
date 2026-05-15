# Context 2026-05-16 Home Ordering

## 작업
Issue 6 AC 7: Home에서 `My recipes`가 하단 `Create recipe` 진입점보다 위에 오도록 섹션 순서 계약을 보강했다.

## DESIGN.md 확인
- `DESIGN.md`의 Typography, Simplicity Guardrails, Layout 섹션을 확인했다.
- Home은 continue/create/saved content를 간결하게 보여야 하며, 하단 fixed UI와 겹치지 않도록 safe-area/bottom inset을 유지해야 한다는 지침을 적용했다.

## 변경
- `src/features/home/lib/home-workspace-sections.ts`
  - Home section id에 `myRecipes`, `createRecipe`를 명시했다.
  - 순서를 `continueRecentRecipe`, `welcome`, `myRecipes`, `savedTakes`, `createRecipe`로 고정했다.
- `src/features/home/lib/home-workspace-sections.test.ts`
  - `My recipes`와 하단 `Create recipe` entry가 섹션 순서 계약에 포함되는지 확인한다.
  - `My recipes`가 `Create recipe`보다 먼저 나오는지 확인한다.
  - direct `sucrase-node` 실행을 위해 import를 relative path로 정리했다.
- `plans/20260516_home_ordering.md`
  - 작업 결과와 연결 context를 기록했다.

## 검증
- RED: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-continue-recent-check.json`가 `myRecipes` / `createRecipe`가 `HomeWorkspaceSectionId`에 없어 실패함을 확인했다.
- GREEN: `./node_modules/.bin/sucrase-node src/features/home/lib/home-workspace-sections.test.ts` 통과.
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-continue-recent-check.json` 통과.
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-recipe-create-entry-check.json` 통과.
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false` 통과.
- DESIGN.md source check: `rg -n "Simplicity Guardrails|Home should answer|Creation entry|Saved recipes|Use bottom inset|Typography should reduce UI complexity" DESIGN.md` 통과.

## 제한
- `npx -y @google/design.md lint DESIGN.md`는 sandbox network 제한으로 `registry.npmjs.org` DNS 조회가 실패해 실행 완료하지 못했다 (`ENOTFOUND`).
- native screenshot QA는 이 AC-only 작업 범위에서 수행하지 않았다.
