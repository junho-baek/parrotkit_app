# Center Side Segment Arrows

## 작업 개요
- 세그먼트 이동 화살표를 상단에서 제거하고, 레시피/슈팅 화면 공통으로 좌우 중앙 오버레이 위치에 배치했다.
- 슈팅 화면 내부의 별도 화살표는 제거해서 상세 공통 네비게이션 구조로 정리했다.

## 주요 변경
- `src/components/common/RecipeResult.tsx`
  - recipe detail header에서 이전/다음 화살표 제거
  - content 영역 내부에 좌우 중앙 오버레이 화살표 추가
  - 레시피/슈팅 탭 모두 같은 위치와 스타일로 세그먼트 이동 가능
- `src/components/common/CameraShooting.tsx`
  - 우측 상단 세그먼트 이동 화살표 제거
  - 상세 공통 오버레이 네비게이션만 사용하도록 관련 props 정리

## 검증
- `PATH=/opt/homebrew/bin:$PATH npx eslint src/components/common/RecipeResult.tsx src/components/common/CameraShooting.tsx`
  - error 없음
  - 기존 `@next/next/no-img-element` warning만 유지
- `PATH=/opt/homebrew/bin:$PATH npx tsc --noEmit`
  - 이번 변경과 무관한 기존 FAQ 작업 파일 에러로 실패
  - 에러: `src/app/faq/page.tsx(11,25): Argument of type '"view_faq"' is not assignable to parameter of type 'keyof ClientEventPayloadMap'.`

## 메모
- 현재 워킹트리에 FAQ 관련 변경이 별도로 있어 전체 타입체크는 그 파일 때문에 막혔다.
- 이번 커밋에는 레시피/슈팅 좌우 오버레이 위치 조정 파일만 포함한다.
