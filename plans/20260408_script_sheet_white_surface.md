# 스크립트 시트 화이트 톤 조정 계획

## 배경
탭별 script overlay를 복원한 뒤 실제 화면에서 바텀시트가 검정색 계열로 보여 무겁게 느껴진다는 피드백이 있었습니다.

## 목표
`Analysis` / `Recipe` 탭의 script sheet를 화이트 계열 surface로 바꿔 더 가볍고 읽기 쉬운 시각 톤으로 조정합니다.

## 범위
- `src/components/common/RecipeResult.tsx`의 script sheet 색상만 조정
- 기존 동작, 라벨, 열고 닫기 흐름은 유지

## 변경 파일
- `plans/20260408_script_sheet_white_surface.md`
- `src/components/common/RecipeResult.tsx`
- `context/context_20260408_script_sheet_white_surface.md` (작업 후 기록)

## 테스트
- 별도 실행 검증은 사용자 요청 시 진행

## 롤백
- script sheet 컨테이너/본문 카드의 색상 클래스를 이전 dark palette로 되돌림

## 리스크
- 주변 상세 화면이 다크 기반이라 화이트 sheet 대비가 예상보다 강하게 느껴질 수 있습니다.

## 결과
- script sheet 본체와 내부 line card를 화이트/라이트 그레이 palette로 조정했습니다.
- script CTA 동작은 유지했고, 연결 context는 `context/context_20260408_script_sheet_white_surface.md`에 기록했습니다.
