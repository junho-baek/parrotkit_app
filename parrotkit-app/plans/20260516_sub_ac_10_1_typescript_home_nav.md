# 2026-05-16 Sub-AC 10.1 TypeScript Home/Nav

## 배경
Issue 6 native Home/navigation hierarchy 작업의 마무리 단계로, Home 및 bottom navigation 변경 파일에 TypeScript 오류가 없는지 확인해야 한다.

## 목표
프로젝트 TypeScript check를 실행하고 Home/navigation 변경으로 발생한 TypeScript 오류를 수정한다.

## 범위
- `tsconfig.json` 기준 TypeScript check
- 필요 시 Home/navigation 관련 focused tsconfig check
- 오류가 있을 경우 Home 및 bottom navigation 변경 영향 파일만 최소 수정

## 변경 파일
- `plans/20260516_sub_ac_10_1_typescript_home_nav.md`
- 필요 시 TypeScript 오류가 발생한 Home/navigation 관련 파일
- 완료 후 연결 context 문서

## 테스트
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-recipe-create-entry-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- DESIGN.md 필수 문구 확인

## 롤백
오류 수정이 잘못되면 이번 Sub-AC에서 수정한 파일만 되돌리고 기존 sibling 변경은 건드리지 않는다.

## 리스크
- worktree에 sibling-agent 변경과 untracked QA artifacts가 이미 존재한다.
- Seed 제약상 QA screenshot/local artifact는 commit 대상에 포함하지 않는다.

## 결과
- `tsconfig.root-tabs-check.json`, `tsconfig.home-recipe-create-entry-check.json`, `tsconfig.json` TypeScript check가 모두 통과했다.
- Home/bottom navigation 변경 파일에서 추가 TypeScript 수정은 필요하지 않았다.
- DESIGN.md 관련 source check는 통과했다.
- `npx --no-install @google/design.md lint DESIGN.md`는 sandbox network DNS 제한으로 `registry.npmjs.org` 조회가 실패했다.
- 연결 context: `context/context_20260516_sub_ac_10_1_typescript_home_nav.md`
