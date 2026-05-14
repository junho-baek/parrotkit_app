# 2026-05-14 Korean Cut Card Labels

## 배경

AC 10은 컷 카드 편집 필드의 한국어 라벨이 `훅`, `말할 문장`, `촬영 동작`, `메모`로 렌더링되어야 한다.

## 목표

한국어 앱 언어에서 컷 카드 필드 라벨을 v1 레시피 플로우에 맞는 한국어 용어로 표시한다.

## 범위

- `getCutCardEditorFieldDefinitions("ko")`의 라벨 카피
- 해당 라벨 계약을 검증하는 focused test

## 변경 파일

- `src/features/recipes/lib/cut-card-editor-fields.ts`
- `src/features/recipes/lib/cut-card-editor-fields.test.ts`
- `context/context_20260514_korean_cut_card_labels.md`

## 테스트

- Red: 한국어 라벨 테스트가 기존 영어 라벨에서 실패하는지 확인
- Green: `npm exec --offline -- tsc --noEmit`

## 롤백

한국어 라벨 변경과 테스트 추가분을 되돌리면 이전 영문 라벨 상태로 복구된다.

## 리스크

라벨 문자열만 변경하므로 상태/라우팅 영향은 낮다. 단, 앱 내 다른 컴포넌트가 이 라벨을 영문 고정값으로 비교한다면 표시 문구 변경 영향을 받을 수 있다.

## 결과

- 한국어 컷 카드 필드 라벨을 `훅`, `말할 문장`, `촬영 동작`, `메모`로 변경했다.
- 한국어 라벨 assertion을 `cut-card-editor-fields.test.ts`에 추가했다.
- 연결 context: `context/context_20260514_korean_cut_card_labels.md`
