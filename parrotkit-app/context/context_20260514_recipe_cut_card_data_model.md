# 2026-05-14 Recipe Cut Card Data Model

## 작업 요약

- `ShootBoardCut`에 v1 컷 카드 기본 필드 `hook`, `lineToSay`, `shotAction`, `note`를 추가했다.
- 기존 UI가 사용하는 `instruction`, `speakingLine`, `shootingGuideline`, `notes`와 새 필드가 같이 유지되도록 `updateShootBoardCutText`, `resetShootBoardCut`, 컷 생성 경로를 동기화했다.
- 기존 레시피 기반 컷과 새 blank/custom 컷 모두 네 필드를 저장하도록 했다.
- `shoot-board-model.test.ts`에 필드 존재, 레거시 필드 매핑, blank 추가 컷, 편집/리셋 동기화 검증을 추가했다.

## 검증

- `npm exec --offline -- tsc --noEmit` 통과.
- `npx tsc --noEmit`는 네트워크 제한 환경에서 registry 조회를 시도해 실패했으며, 로컬 `node_modules/.bin/tsc`도 이 clone에는 설치되어 있지 않았다.

## 연결된 plan

- `plans/20260514_recipe_cut_card_data_model.md`
