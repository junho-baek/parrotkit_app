# Shooting Segment Navigation Review

## 배경
- 레시피/슈팅 상세에서 이전/다음 세그먼트로 빠르게 이동하는 수단이 없다.
- Shooting 화면의 상단 바가 중복되어 화면을 차지한다.
- 촬영 후 결과를 바로 확인하거나 리트라이할 수 없어 사용성이 떨어진다.
- 녹음 품질 확인 수단이 없어 오디오가 실제 저장되는지 검증이 어렵다.

## 목표
- 상세 화면에 좌우 세그먼트 이동 화살표를 추가한다.
- Shooting 화면에서는 상단 헤더를 제거하고 더 몰입감 있게 정리한다.
- 촬영 후 즉시 preview/retry/use-take 흐름을 제공한다.
- MediaRecorder 설정을 보강해 오디오 저장 가능성을 높이고, preview에서 바로 확인할 수 있게 한다.

## 범위
- `src/components/common/RecipeResult.tsx`
- `src/components/common/CameraShooting.tsx`
- 작업 기록 문서 작성

## 변경 파일
- `plans/20260322_shooting_segment_navigation_review.md`
- `src/components/common/RecipeResult.tsx`
- `src/components/common/CameraShooting.tsx`
- `context/context_20260322_*_shooting_segment_navigation_review.md`

## 테스트
- `npx tsc --noEmit`
- 대상 파일 ESLint
- 좌우 이동 / preview / retry 플로우 수동 검토

## 롤백
- 촬영 후 즉시 리스트 복귀 구조로 복구
- 세그먼트 좌우 이동 오버레이 제거
- 기존 MediaRecorder mimeType 고정값으로 복귀

## 리스크
- 브라우저별 MediaRecorder codec 지원 차이로 일부 환경에서 audio track 품질이 달라질 수 있다.
- 촬영 후 preview 상태를 추가하면서 CameraShooting 내부 상태가 늘어나므로 cleanup을 꼼꼼히 처리해야 한다.

## 결과
- 완료
- 요약:
  - 레시피 상세에는 이전/다음 세그먼트 이동 화살표를 추가했고, Shooting 화면에도 동일한 이동 버튼을 오버레이로 배치했다.
  - Shooting에서는 상단 헤더를 제거하고, 촬영 후 즉시 preview/retry/use-take 흐름을 제공하도록 변경했다.
  - 기존 촬영본이 있으면 Shooting에서 바로 review할 수 있게 했고, 오디오 확인을 위해 preview video에 controls를 유지했다.
  - MediaRecorder mimeType을 브라우저 지원값 우선으로 선택하도록 바꿔 오디오 포함 저장 가능성을 높였다.

## 연결 Context
- `context/context_20260322_223900_shooting_segment_navigation_review.md`
