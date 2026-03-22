# Fix Shooting Review Dismissal

## 작업 개요
- Shooting review overlay가 `Close`나 `Use Take` 이후에도 남아 있던 상태 버그를 수정했다.
- UI는 즉시 닫히고 저장/업로드는 뒤에서 계속 진행되도록 흐름을 정리했다.

## 주요 변경
- `src/components/common/CameraShooting.tsx`
  - review overlay 렌더링 조건을 URL 존재 여부가 아니라 `reviewVisible && effectiveReviewUrl`로 변경
  - 새 촬영이 끝나면 `reviewVisible`을 `true`로 켜서 review 진입
  - `Close` / `Retry` / `Use Take`에서 `reviewVisible`을 먼저 `false`로 내려 즉시 overlay dismiss
  - existing capture가 있어도 자동으로 review overlay가 다시 뜨지 않고, `Review` 버튼으로만 열리도록 조정

## 검증
- `PATH=/opt/homebrew/bin:$PATH npx tsc --noEmit`
  - 통과
- `PATH=/opt/homebrew/bin:$PATH npx eslint src/components/common/CameraShooting.tsx`
  - error 없음
  - 기존 `@next/next/no-img-element` warning만 유지

## 메모
- 이번 수정으로 `Use Take` 후 업로드/저장은 비동기로 계속되더라도, 사용자가 보는 review 화면은 즉시 사라진다.
