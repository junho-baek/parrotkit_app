# 2026-05-15 Sub-AC 3 No Camera Jump

## 배경
Home Continue가 board overview를 열 때 다음 required cut highlight metadata를 전달하지만, camera/prompter 진입은 사용자가 cut을 탭했을 때만 발생해야 한다.

## 목표
Continue-opened board overview가 camera/prompter deep link나 자동 camera open 상태로 전환되지 않도록 회귀 검증을 추가한다.

## 범위
- Home Continue href/route 계약 확인
- Recipe overview `highlightCutId` 처리와 camera entry handler 분리 확인
- 자동 scene/take/camera 상태 전환 방지 확인

## 변경 파일
- `src/features/home/lib/home-continue-workflow-card.test.ts`
- `plans/20260515_sub_ac_3_no_camera_jump.md`
- `context/context_20260515_sub_ac_3_no_camera_jump.md`

## 테스트
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-continue-workflow-card.test.ts`
- 필요 시 focused TypeScript check

## 롤백
추가한 regression guard와 context/plan 기록을 되돌리면 기존 동작으로 복귀한다.

## 리스크
- 소스 문자열 기반 guard는 구현 구조 변경 시 테스트 메시지를 갱신해야 할 수 있다.

## 결과
- `HomeContinueWorkflowEntry.cameraEntryRequiresTap`을 `true` 계약으로 추가했다.
- Continue destination은 `/recipe/{recipeId}` overview route를 유지하고, href는 `highlightCutId`만 query metadata로 전달하도록 회귀 검증했다.
- `prompter`/`camera`/`sceneId`/`retakeTakeId` 기반 camera 또는 restored scene/take 진입은 Continue href에서 금지했다.

## 연결 context
- `context/context_20260515_sub_ac_3_no_camera_jump.md`
