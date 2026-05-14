# 배경

ParrotKit v1은 Home 중심의 레시피 제작 흐름에서 컷 카드를 핵심 편집 단위로 사용한다. 이번 하위 작업은 컷 카드 데이터 모델에 v1 기본 필드인 Hook, Line to Say, Shot/Action, Note를 명시적으로 담도록 정리한다.

# 목표

- 각 컷 카드가 `hook`, `lineToSay`, `shotAction`, `note` 필드를 저장하도록 모델을 확장한다.
- 기존 화면과 함수가 사용 중인 레거시 필드와 호환성을 유지한다.
- 추가/수정/리셋 흐름에서도 새 필드가 보존되도록 한다.

# 범위

- `src/features/recipes/lib/shoot-board-model.ts`
- `src/features/recipes/lib/shoot-board-model.test.ts`
- 필요 시 컨텍스트 문서 추가

# 변경 파일

- 예정: `src/features/recipes/lib/shoot-board-model.ts`
- 예정: `src/features/recipes/lib/shoot-board-model.test.ts`
- 예정: `context/context_20260514_recipe_cut_card_data_model.md`

# 테스트

- `npx tsc --noEmit`
- 가능한 경우 기존 shoot-board model test 실행 경로 확인

# 롤백

- 새 필드와 테스트 추가분을 되돌리면 기존 레거시 필드 기반 모델로 복귀 가능하다.

# 리스크

- 기존 UI가 `instruction`, `speakingLine`, `shootingGuideline`, `notes`를 직접 사용하므로 새 필드와 레거시 필드 간 동기화가 어긋날 수 있다.
- 현재 package scripts에 test 스크립트가 없어 검증은 TypeScript 컴파일 중심으로 진행될 수 있다.

# 결과

- 완료: `ShootBoardCut` 모델에 `hook`, `lineToSay`, `shotAction`, `note` 필드를 추가했다.
- 완료: 기존 레거시 필드와 새 컷 카드 필드가 생성/편집/리셋 경로에서 동기화되도록 했다.
- 완료: `src/features/recipes/lib/shoot-board-model.test.ts`에 새 필드 검증을 추가했다.
- 검증: `npm exec --offline -- tsc --noEmit` 통과.
- 연결 context: `context/context_20260514_recipe_cut_card_data_model.md`
