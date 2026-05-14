# AC 7 Home Continue Overview Entry

## 배경
Home Continue는 이어갈 recipe shooting board를 열어야 하며, v1에서는 카메라, 프롬프터, 체크리스트 상세, 내부 복원 상태로 직접 진입하지 않는다. 기존 destination은 `/recipe/{recipeId}` 형태이지만, 이번 AC에서는 이 경로가 shooting board overview entry임을 명시적인 계약으로 고정한다.

## 목표
- Home Continue의 entry screen을 shooting board overview로 정의한다.
- Continue destination이 recipe board overview route이며 prompter/camera/detail deep link가 아님을 테스트로 고정한다.
- 기존 `레시피 생성` 플로우와 bottom tab 구조는 변경하지 않는다.

## 범위
- Home Continue workflow card helper and focused test.
- Context 기록.

## 변경 파일
- `plans/20260514_ac7_home_continue_overview_entry.md`
- `src/features/home/lib/home-continue-workflow-card.ts`
- `src/features/home/lib/home-continue-workflow-card.test.ts`
- `context/context_20260514_ac7_home_continue_overview_entry.md`

## 테스트
- RED: overview entry helper export/contract가 없어 focused test 실패 확인.
- GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-continue-workflow-card.test.ts`
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-continue-workflow-card-check.json`

## 롤백
- 위 helper/test/context/plan 변경을 되돌린다.

## 리스크
- Board selection/completion/highlight 로직은 sibling tasks와 겹칠 수 있어 이번 AC에서는 destination entry 계약만 좁게 다룬다.

## 결과
- `getHomeContinueWorkflowEntry`를 추가해 Continue entry screen을 `shooting-board-overview`로 명시했다.
- Existing selected workflow destination remains `/recipe/{recipeId}`, with no prompter/camera/checklist/cut restore deep-link parameters.
- 연결 context: `context/context_20260514_ac7_home_continue_overview_entry.md`
