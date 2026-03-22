# Center Side Segment Arrows

## 배경
- 세그먼트 이동 화살표가 상단에 있어 접근성과 시인성이 떨어진다.
- 사용자는 레시피/슈팅 화면 모두에서 좌우 중앙 오버레이 형태를 원한다.

## 목표
- 이전/다음 세그먼트 이동 화살표를 화면 좌우 중앙 오버레이로 이동한다.
- 레시피/슈팅 화면에서 동일한 위치와 사용감을 유지한다.

## 범위
- `src/components/common/RecipeResult.tsx`
- `src/components/common/CameraShooting.tsx`
- 작업 기록 문서 작성

## 변경 파일
- `plans/20260322_center_side_segment_arrows.md`
- `src/components/common/RecipeResult.tsx`
- `src/components/common/CameraShooting.tsx`
- `context/context_20260322_*_center_side_segment_arrows.md`

## 테스트
- `npx tsc --noEmit`
- 대상 파일 ESLint

## 롤백
- 상단 버튼 위치로 복구

## 리스크
- 중앙 오버레이 버튼이 기존 CTA나 프롬프터와 겹치지 않도록 배치 조정이 필요하다.

## 결과
- 완료
- 요약:
  - 세그먼트 이동 화살표를 상단에서 제거하고 레시피/슈팅 공통으로 화면 좌우 중앙 오버레이 위치로 이동했다.
  - 레시피 화면 상단은 다시 Back + 제목 + slow mode만 남기고 단순화했다.
  - 슈팅 화면은 내부 화살표를 제거하고 상세 공통 오버레이 화살표만 사용하도록 정리했다.

## 연결 Context
- `context/context_20260322_224900_center_side_segment_arrows.md`
