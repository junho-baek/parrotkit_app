# 2026-05-15 Sub-AC 1.3.3 Next Cut Guidance Tests

## 배경
Home Continue로 열린 shooting board overview는 camera를 자동으로 열지 않고 saved My Take가 없는 다음 required cut을 안내해야 한다. 기존 구현을 고정하기 위해 required cut coverage fixture를 보강한다.

## 목표
- Required cuts with saved My Takes와 without saved My Takes를 함께 검증한다.
- 모든 required cut에 saved My Take가 있는 no-missing-cut case에서 highlight가 비는지 검증한다.
- Continue entry가 overview destination과 user-initiated camera entry 계약을 유지하는지 확인한다.

## 범위
- `src/features/recipes/lib/shoot-board-model.test.ts`
- `src/features/home/lib/home-continue-workflow-card.test.ts`
- Focused test/typecheck 실행
- Context 기록

## 변경 파일
- `plans/20260515_sub_ac_1_3_3_next_cut_guidance_tests.md`
- `src/features/recipes/lib/shoot-board-model.test.ts`
- `src/features/home/lib/home-continue-workflow-card.test.ts`
- `context/context_20260515_sub_ac_1_3_3_next_cut_guidance_tests.md`

## 테스트
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-continue-workflow-card.test.ts`
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-workflow-resolution.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-continue-workflow-card-check.json`

## 롤백
- 추가된 fixture/assertion을 되돌리면 런타임 동작은 그대로 유지되고 테스트 커버리지만 이전 상태로 돌아간다.

## 리스크
- `shoot-board-model.test.ts`에는 기존 title-format mismatch가 남아 있어 전체 파일 runtime은 별도 known issue일 수 있다. 이번 작업은 가능한 focused runtime과 타입 체크로 검증한다.

## 결과
- `src/features/home/lib/home-continue-workflow-card.test.ts`에 no-missing-required-cut Continue entry fixture를 추가했다.
- 모든 required cut에 saved My Take가 있는 경우 `highlightCutId`가 `null`이고 href가 board overview URL만 유지되는지 검증했다.
- 같은 fixture에서 `cameraEntryRequiresTap: true`를 확인해 camera entry가 user-initiated 상태로 유지되는 계약을 고정했다.
- 연결 context: `context/context_20260515_sub_ac_1_3_3_next_cut_guidance_tests.md`
