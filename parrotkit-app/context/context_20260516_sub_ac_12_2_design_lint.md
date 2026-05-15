# Context 2026-05-16 Sub-AC 12.2 DESIGN.md Lint

## 작업
Issue 6 Sub-AC 12.2: `DESIGN.md` lint가 zero errors로 통과하는지 확인했다.

## DESIGN.md 확인
- 변경 전 `DESIGN.md`를 읽었다.
- 관련 기준: five-slot bottom navigation(Home, Explore, Paste, Recipes, My), larger center Paste action, Paste-to-reference-link creation promise, recipe creation drawer, box-in-box/redundant CTA/user-facing Shoot/workflow copy guardrails.

## 변경
- `plans/20260516_sub_ac_12_2_design_lint.md`
  - 작업 계획과 검증 범위를 기록했다.
- `context/context_20260516_sub_ac_12_2_design_lint.md`
  - 이번 결과를 기록했다.
- `DESIGN.md`는 수정하지 않았다. 실제 lint 결과가 errors 0이므로 문서 수정이 필요하지 않았다.

## 검증
- GREEN: `/Users/junho/.npm/_npx/9cb06364208d5c89/node_modules/.bin/design.md lint DESIGN.md`
  - summary: `errors: 0`, `warnings: 14`, `infos: 1`
  - warnings는 unused design token 경고이며 lint error는 아니다.
- PASS: DESIGN.md guardrail source check
  - `Bottom navigation and creation entry`
  - `Paste` larger center action
  - `Recipe creation drawer`
  - box-in-box, workflow, Shoot/New Shoot/Start Shoot guardrails

## 참고
- `npx -y @google/design.md lint DESIGN.md`는 sandbox network 제한으로 `registry.npmjs.org` DNS 조회가 실패했다.
- npm npx cache에 이미 설치된 `@google/design.md` binary를 직접 실행해 동일 linter의 offline 검증을 완료했다.

## 리스크
- shared worktree에는 sibling-agent 변경과 local plan/context/QA 산출물이 다수 남아 있다.
- 이번 subtask는 DESIGN.md lint 검증에 한정했고 앱 코드 변경은 수행하지 않았다.
