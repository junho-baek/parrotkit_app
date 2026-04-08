# Context - Script Sheet White Surface

## 작업 요약
- 탭별 script overlay 바텀시트가 검정색 계열이라 무겁게 느껴진다는 피드백을 반영해, script sheet를 화이트 톤 surface로 조정했습니다.
- 시트 바깥 dim overlay는 유지하고, 시트 본체와 script line 카드만 밝은 계열로 바꿨습니다.

## 변경 파일
- `src/components/common/RecipeResult.tsx`
- `plans/20260408_script_sheet_white_surface.md`

## 구현 메모
- 시트 루트: `bg-white`, `border-gray-200`, 더 가벼운 shadow로 조정
- 핸들, 부제, 닫기 버튼, line card, empty state를 gray scale로 재정렬
- script CTA 동작과 chat/script 상호 배타 로직은 유지

## 검증
- 별도 실행 검증은 이번 턴에서 수행하지 않았습니다.

## 남은 리스크
- 다크 배경 위의 화이트 sheet가 더 도드라져 보여, 실제 모바일에서 대비감이 강할 수 있습니다.
