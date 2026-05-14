# 2026-05-15 Sub-AC 2 Resolve Required Saved My Takes

## 배경
Home Continue로 열린 board overview는 현재 사용자의 saved My Take 상태를 기준으로 다음 required cut을 안내해야 한다. 기존 선택/하이라이트 로직은 saved take records를 직접 받지만, required cut별 saved 여부를 명시적으로 해석하는 계약이 필요하다.

## 목표
- 현재 workspace 사용자 saved take records에서 required cut별 saved My Take 여부를 계산한다.
- 다른 recipe의 saved take와 optional cut은 required completion/highlight 판단에서 제외한다.
- 기존 Continue overview route와 camera user-initiated entry를 변경하지 않는다.

## 범위
- Home workflow resolution pure helper/test.
- Existing completion/next-cut helper reuse.
- Context 기록.

## 변경 파일
- `plans/20260515_sub_ac_2_resolve_required_saved_mytakes.md`
- `src/features/home/lib/home-workflow-resolution.ts`
- `src/features/home/lib/home-workflow-resolution.test.ts`
- `context/context_20260515_sub_ac_2_resolve_required_saved_mytakes.md`

## 테스트
- RED: focused workflow resolution test가 required cut saved-state helper 부재로 실패하는지 확인한다.
- GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-workflow-resolution.test.ts`
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-workflow-resolution-check.json`
- GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-continue-workflow-card.test.ts`
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-continue-workflow-card-check.json`

## 롤백
- 위 helper/test/context 변경을 되돌리면 기존 next-cut 계산은 유지되지만 required cut별 saved-state 계약은 사라진다.

## 리스크
- 이 작업은 current user를 별도 auth id로 필터링하지 않는다. 현재 앱의 mock workspace API가 이미 현재 사용자 local saved takes만 반환하는 계약을 사용한다.

## 결과
- `resolveRequiredCutSavedMyTakeState`를 추가해 required cut별 saved My Take 여부를 명시적으로 반환한다.
- 기존 board unfinished 판정과 next missing required cut 계산이 같은 resolver를 사용하도록 정리했다.
- 다른 recipe의 saved take와 optional cut은 required cut saved-state 결과에서 제외된다.
- 연결 context: `context/context_20260515_sub_ac_2_resolve_required_saved_mytakes.md`
