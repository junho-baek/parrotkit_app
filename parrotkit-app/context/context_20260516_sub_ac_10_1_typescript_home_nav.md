# Context 2026-05-16 Sub-AC 10.1 TypeScript Home/Nav

## 작업
Issue 6 Sub-AC 10.1: Home 및 bottom navigation 변경 영향 범위의 TypeScript check를 실행하고 오류가 있으면 수정한다.

## DESIGN.md 확인
- `DESIGN.md`를 먼저 읽고 Typography, Simplicity Guardrails, Layout 기준을 확인했다.
- 특히 concise recipe language, redundant CTA 제거, `workflow` user-facing copy 금지, bottom inset/safe-area padding 지침을 기준으로 이번 검증 범위를 해석했다.

## 변경
- TypeScript 오류가 없어 Home/navigation 코드 수정은 하지 않았다.
- `plans/20260516_sub_ac_10_1_typescript_home_nav.md`를 작성하고 결과를 기록했다.

## 검증
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-recipe-create-entry-check.json`
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- GREEN: `rg -n 'Use bottom inset|Typography should reduce UI complexity|Do not add redundant CTA buttons|Avoid the word \`workflow\`|Home should answer' DESIGN.md`

## 제한
- `npx --no-install @google/design.md lint DESIGN.md`는 sandbox network 제한으로 `registry.npmjs.org` DNS 조회가 실패했다 (`ENOTFOUND`).
- repo-local `package.json`에는 DESIGN.md lint, TypeScript, test script가 노출되어 있지 않다.
- QA screenshots 또는 local QA artifact는 추가하지 않았다.
