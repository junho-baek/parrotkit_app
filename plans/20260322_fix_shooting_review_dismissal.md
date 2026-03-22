# Fix Shooting Review Dismissal

## 배경
- Shooting review overlay가 `Close` 또는 `Use Take` 이후에도 계속 남아 있는 버그가 있다.
- 저장/업로드 지연과 무관하게 UI는 즉시 닫혀야 한다.

## 목표
- review overlay 표시 여부를 명시적 상태로 분리한다.
- `Close`, `Retry`, `Use Take` 모두 즉시 overlay를 닫도록 수정한다.
- 기존 local capture가 있어도 사용자가 `Review`를 눌렀을 때만 다시 열리게 한다.

## 범위
- `src/components/common/CameraShooting.tsx`
- 작업 기록 문서 작성

## 변경 파일
- `plans/20260322_fix_shooting_review_dismissal.md`
- `src/components/common/CameraShooting.tsx`
- `context/context_20260322_*_fix_shooting_review_dismissal.md`

## 테스트
- `npx tsc --noEmit`
- 대상 파일 ESLint

## 롤백
- review overlay를 `effectiveReviewUrl` 존재 여부로 직접 표시하는 이전 구조로 복구

## 리스크
- existing capture 자동 review 진입 여부가 바뀌므로, 사용자가 기대하던 즉시 preview 동작이 달라질 수 있다.

## 결과
- 완료
- 요약:
  - review overlay 표시 여부를 `reviewVisible` 상태로 분리했다.
  - `Close`, `Retry`, `Use Take` 모두 overlay를 먼저 즉시 닫도록 변경했다.
  - 저장된 기존 take는 자동으로 overlay를 띄우지 않고, `Review` 버튼으로만 다시 열리도록 정리했다.

## 연결 Context
- `context/context_20260322_232200_fix_shooting_review_dismissal.md`
