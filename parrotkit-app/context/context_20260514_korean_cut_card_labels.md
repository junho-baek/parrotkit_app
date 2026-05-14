# Context 2026-05-14 Korean Cut Card Labels

## 작업

AC 10 범위로 컷 카드 편집 필드의 한국어 라벨을 `훅`, `말할 문장`, `촬영 동작`, `메모`로 표시하도록 변경했다.

## 변경

- `src/features/recipes/lib/cut-card-editor-fields.ts`
  - `getCutCardEditorFieldDefinitions("ko")`가 반환하는 라벨을 한국어 사용자-facing 문구로 변경
  - 기존 필드 순서(`hook`, `lineToSay`, `shotAction`, `note`), placeholder, patch 동작은 유지
- `src/features/recipes/lib/cut-card-editor-fields.test.ts`
  - 한국어 라벨 계약을 검증하는 assertion 추가

## 검증

- Red 시도: `npm exec --offline -- tsx src/features/recipes/lib/cut-card-editor-fields.test.ts`
  - 현재 환경의 npm offline cache에 `tsx`가 없어 실행 불가(`ENOTCACHED`)
- `npm exec --offline -- tsc --noEmit`
  - 첫 실행은 병렬 작업 중 생성 중이던 `cut-card-header` import로 일시 실패
  - 파일 존재 확인 후 동일 명령 재실행 통과
- `rg`로 네 한국어 라벨 문자열이 중앙 field copy에 반영된 것을 확인

## 연결된 plan

- `plans/20260514_korean_cut_card_labels.md`
