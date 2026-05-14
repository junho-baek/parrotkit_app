# Context 2026-05-15 Sub-AC 2 Resolve Required Saved My Takes

## 작업
Home Continue가 현재 workspace 사용자의 saved My Take records를 기준으로 required cut별 saved 여부를 해석하도록 pure helper 계약을 추가했다.

## 변경
- Updated `src/features/home/lib/home-workflow-resolution.ts`
  - Added `RequiredCutSavedMyTakeState`.
  - Added `resolveRequiredCutSavedMyTakeState`.
  - `isRecipeBoardUnfinishedByRequiredMyTakes`와 `getNextRequiredCutWithoutSavedMyTakeId`가 같은 saved-state resolver를 공유하도록 정리했다.
- Updated `src/features/home/lib/home-workflow-resolution.test.ts`
  - Required cut별 saved My Take coverage를 검증했다.
  - Optional cut saved take는 required result에서 제외되고, 다른 recipe의 saved take는 현재 board cut을 완료 처리하지 않는다는 계약을 추가했다.
- Updated `plans/20260515_sub_ac_2_resolve_required_saved_mytakes.md`
  - 결과와 연결 context를 기록했다.

## 검증
- RED: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-workflow-resolution.test.ts`
  - Expected failure: `resolveRequiredCutSavedMyTakeState` export 없음.
- GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-workflow-resolution.test.ts`
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-workflow-resolution-check.json`
- GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-continue-workflow-card.test.ts`
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-continue-workflow-card-check.json`

## 결과
- Continue 대상 board의 required cuts는 saved My Take가 있는 cut과 없는 cut을 명시적으로 구분할 수 있다.
- 다음 required cut highlight 계산은 이 saved-state contract를 통해 현재 saved takes와 일관된 기준을 사용한다.
- Camera/prompter entry route는 변경하지 않았다.

## 리스크 / 후속
- Current user scoping은 `useMockWorkspace().getSavedRecipeTakes()`가 현재 local user workspace state만 반환한다는 기존 provider 계약을 따른다. 별도 multi-user auth field가 추가되면 resolver 입력 전에 user-scoped filtering을 유지해야 한다.
