# 2026-05-16 Sub-AC 12.2 DESIGN.md Lint

## 배경
Issue 6 Paste navigation integration requires the design source-of-truth lint to pass after the five-slot bottom navigation and Paste creation flow work.

## 목표
`DESIGN.md` lint가 zero errors로 통과하도록 확인하거나, lint violation이 있으면 `DESIGN.md`만 최소 수정한다.

## 범위
- `DESIGN.md` 확인
- repo-local/offline 가능한 DESIGN.md lint 실행
- lint violation이 있으면 문서 문법/가드레일 수준에서 최소 수정
- 결과를 context 문서에 기록

## 변경 파일
- `plans/20260516_sub_ac_12_2_design_lint.md`
- `context/context_20260516_sub_ac_12_2_design_lint.md`
- 필요 시 `DESIGN.md`

## 테스트
- `npx --no-install @google/design.md lint DESIGN.md`
- 필요 시 `npx -y @google/design.md lint DESIGN.md`
- DESIGN.md source/guardrail sanity check

## 롤백
이번 subtask에서 수정한 `DESIGN.md` 변경과 기록 문서를 되돌리면 이전 통합 상태로 복원된다.

## 리스크
- sandbox network가 restricted라 registry 기반 `npx -y` 실행이 DNS에서 막힐 수 있다.
- shared worktree에 sibling-agent 변경이 많으므로 앱 코드 수정은 범위에서 제외한다.

## 결과
- `DESIGN.md`는 실제 `@google/design.md` linter에서 errors 0으로 통과했다.
- lint warnings 14건은 unused token 경고이며 error가 아니므로 문서 수정은 하지 않았다.
- plain `npx -y @google/design.md lint DESIGN.md`는 restricted network DNS 문제로 실패했지만, npm npx cache에 있는 동일 binary를 직접 실행해 offline 검증했다.

## 검증 결과
- GREEN: `/Users/junho/.npm/_npx/9cb06364208d5c89/node_modules/.bin/design.md lint DESIGN.md`
  - summary: `errors: 0`, `warnings: 14`, `infos: 1`
- PASS: DESIGN.md guardrail source check
- 연결 context: `context/context_20260516_sub_ac_12_2_design_lint.md`
