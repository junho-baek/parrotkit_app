# Context - Recipe Capture Upload Async State

## 작업 배경
- 배포 환경에서 일부 사용자에게 "촬영 직후 다운로드 실패"가 보고됨.
- 원인 후보: 업로드 실패여도 UI가 먼저 촬영 완료로 표시되어 서버 저장 상태와 불일치.

## 이번 작업 목표
- 업로드 성공 후에만 `capturedScenes` 확정.
- 업로드 중 씬별 스피너 표시.
- 업로드 진행 중에도 다른 씬 촬영 지속 가능.

## 변경 내용
- 파일: `src/components/common/RecipeResult.tsx`
  - 상태 추가:
    - `uploadingScenes`: 씬별 업로드 진행 상태
    - `uploadErrors`: 씬별 업로드 실패 메시지
  - 참조(ref) 추가:
    - `capturedScenesRef`
    - `matchResultsRef`
  - 캡처/업로드 플로우 수정:
    - 촬영 직후에는 업로드 시작만 하고, 업로드 성공 시 `capturedScenes` 반영
    - 업로드 실패 시 해당 씬 완료 상태 제거 + `Retry Shoot` 표시
    - 업로드를 백그라운드 비동기로 처리하여 UI 블로킹 제거
  - 씬 카드 UI 상태 분리:
    - Uploading(amber ring + spinner)
    - Error(red ring + retry 상태)
    - Done(green ring + check)
  - Export UX 개선:
    - 업로드 중 씬이 있으면 "완료된 씬만 다운로드" 확인 prompt 노출

## 검증
- `npm run build` (성공)

## 리스크/메모
- 현재 업로드 실패 시 자동 재시도는 없음(사용자 재촬영/재시도 유도).
- 업로드 대기 상태에서 앱 이탈 시 미완료 씬이 남을 수 있으므로, 추후 재시도 큐/백오프 전략 고려 가능.
