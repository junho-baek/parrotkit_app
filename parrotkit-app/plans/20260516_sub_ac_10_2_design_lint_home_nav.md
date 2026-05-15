# 2026-05-16 Sub-AC 10.2 DESIGN.md Lint Home/Nav

## 배경
Issue 6 native Home/navigation hierarchy 작업의 마무리 단계로, Home copy, CTA layout, bottom navigation hierarchy가 `DESIGN.md` 기준을 위반하지 않는지 확인해야 한다.

## 목표
DESIGN.md lint 또는 repo-local equivalent check를 실행하고, updated Home screen copy, CTA layout, bottom navigation hierarchy 관련 violation이 있으면 최소 수정한다.

## 범위
- `DESIGN.md` 기준 Home/navigation UI guardrail 확인
- Home user-facing copy에서 workflow/Shoot 계열 금지어 확인
- Continue card duplicate CTA 여부 확인
- bottom navigation visible tab contract 확인

## 변경 파일
- `plans/20260516_sub_ac_10_2_design_lint_home_nav.md`
- 필요 시 Home/navigation 관련 source/test 파일
- 완료 후 연결 context 문서

## 테스트
- DESIGN.md lint 또는 사용 가능한 local equivalent
- Home/navigation user-facing copy guardrail grep
- 관련 focused tests/typecheck 필요 시 실행

## 롤백
이번 Sub-AC에서 수정한 Home/navigation 파일과 plan/context 문서만 되돌리고 sibling-agent 변경은 건드리지 않는다.

## 리스크
- worktree에 sibling-agent 변경과 untracked QA artifacts가 이미 존재한다.
- sandbox network 제한으로 npm registry 기반 lint package 실행이 막힐 수 있다.
- Seed 제약상 QA screenshot/local artifact는 commit 대상에 포함하지 않는다.

## 결과
- `npx --no-install @google/design.md lint DESIGN.md`를 실행했지만 sandbox network 제한으로 `registry.npmjs.org` DNS 조회가 실패했다 (`ENOTFOUND`).
- repo-local `package.json`/`node_modules`에는 DESIGN.md lint binary/script가 없어 local equivalent source check로 대체했다.
- Home primary CTA helper의 stale user-facing `workflow` copy를 recipe language로 변경했다.
- Home empty-state copy에서 `Quick Shoot`/blank prompter 중심 표현을 concise recipe copy로 정리했다.
- DESIGN.md guardrail source check, focused Home tests, focused TypeScript checks가 통과했다.
- 연결 context: `context/context_20260516_sub_ac_10_2_design_lint_home_nav.md`
