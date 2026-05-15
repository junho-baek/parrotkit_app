# Context 2026-05-16 Sub-AC 10.2 DESIGN.md Lint Home/Nav

## 작업
Issue 6 Sub-AC 10.2: updated Home screen copy, CTA layout, bottom navigation hierarchy에 대해 `DESIGN.md` lint를 실행하고 관련 violation을 수정한다.

## DESIGN.md 확인
- `DESIGN.md`의 Typography, Simplicity Guardrails, Layout, CTA copy 섹션을 확인했다.
- 기준: user-facing `workflow` copy 금지, tappable card 내부 duplicate CTA 금지, Home copy 간결화, `Shoot`/`New Shoot`/`Start Shoot` primary creation CTA 금지, bottom inset/safe-area 유지.

## 변경
- `src/features/home/lib/home-primary-cta.ts`
  - stale primary CTA helper의 user-facing copy를 recipe language로 변경했다.
  - `workflowLabel`을 `recipeLabel`로 바꾸고 English/Korean continuation action을 `Continue recipe` / `레시피 이어가기`로 정리했다.
  - empty state title을 `Create a blank recipe` / `빈 레시피 만들기`로 정리했다.
- `src/features/home/lib/home-primary-cta.test.ts`
  - recipe language expectations로 갱신했다.
- `src/core/i18n/app-language.tsx`
  - Home empty-state copy를 concise recipe copy로 정리했다.
  - `Quick Shoot` / blank prompter 중심 표현을 `Create recipe` / recipe empty-state copy로 바꿨다.
- `plans/20260516_sub_ac_10_2_design_lint_home_nav.md`
  - 작업 plan과 결과를 기록했다.

## 검증
- BLOCKED: `npx --no-install @google/design.md lint DESIGN.md`
  - 실패 사유: sandbox network 제한으로 `https://registry.npmjs.org/@google%2fdesign.md` DNS 조회 실패 (`ENOTFOUND`).
  - repo-local `package.json`/`node_modules`에는 DESIGN.md lint binary/script가 없다.
- GREEN: DESIGN.md guardrail source check
  - `rg -n 'Typography should reduce UI complexity|Do not add redundant CTA buttons|Avoid the word \`workflow\`|Primary creation entry|Do not use \`Shoot\`, \`New Shoot\`, or \`Start Shoot\`|Use bottom inset|Home should answer' DESIGN.md`
- GREEN: Home user-facing copy check
  - `rg -n "workflow|워크플로우|Shoot|New Shoot|Start Shoot|Open shoot board" src/core/i18n/app-language.tsx src/features/home/lib/home-primary-cta.ts src/features/home/lib/home-primary-cta.test.ts` returned no matches.
- GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-primary-cta.test.ts`
- GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-continue-workflow-card.test.ts`
- GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts`
- GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-workspace-sections.test.ts`
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-primary-cta-check.json`
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-continue-workflow-card-check.json`
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-recipe-create-entry-check.json`

## 제한
- Formal DESIGN.md lint는 network-blocked라 완료할 수 없었다.
- worktree에는 sibling AC 변경과 untracked QA artifacts가 이미 있어 이번 Sub-AC 파일만 별도로 추적해야 한다.
- QA screenshots 또는 local QA artifact는 추가하지 않았다.
