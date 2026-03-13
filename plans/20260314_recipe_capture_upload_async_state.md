# 레시피 촬영 업로드 상태 개선 (업로드 성공 후 확정 + 씬별 스피너)

## 배경
- PWA 초기 사용자에서 레시피 촬영 후 다운로드 오류 제보가 있음.
- 현재는 업로드 실패여도 촬영 완료(`capturedScenes`)로 먼저 반영되어 UI/서버 상태 불일치가 발생할 수 있음.

## 목표
- 캡처 상태는 업로드 성공 후에만 반영.
- 업로드 중에는 씬 카드에 로딩 스피너를 표시.
- 업로드가 백그라운드로 진행되어 다른 씬 촬영은 계속 가능.

## 범위
- `RecipeResult`의 업로드/캡처 상태 관리 로직 수정.
- 씬 카드 상태 UI(업로드중/실패/완료) 반영.
- 다운로드 시 업로드 진행 중 씬이 있으면 사용자 안내 추가.

## 변경 파일
- `src/components/common/RecipeResult.tsx`
- `plans/20260314_recipe_capture_upload_async_state.md`
- `context/context_20260314_*.md` (작업 후 기록)

## 테스트
- `npm run build`
- 수동 점검:
  - 씬 촬영 직후 업로드 스피너 노출
  - 업로드 완료 후만 Done 반영
  - 업로드 중 다른 씬 진입/촬영 가능
  - 업로드 실패 시 실패 상태 노출

## 롤백
- `RecipeResult.tsx` 변경 revert 시 기존 동작으로 복원 가능.

## 리스크
- 기존 `match_results` 저장 타이밍과 충돌 가능성이 있어 업로드 선/후 순서를 모두 처리하도록 보강 필요.

## 결과
- `src/components/common/RecipeResult.tsx`에 씬별 업로드 상태(`uploadingScenes`)와 업로드 오류(`uploadErrors`)를 추가했다.
- `capturedScenes`는 업로드 성공 시점에만 반영하도록 변경했다.
- 업로드는 백그라운드 비동기로 처리(`void async`)되어 사용자가 업로드 대기 없이 다른 씬 촬영을 계속할 수 있다.
- 업로드 중 씬 카드에 스피너/Uploading 상태를 노출하고, 실패 시 Retry Shoot 상태를 노출한다.
- Export 시 업로드 중인 씬이 있으면 완료된 씬만 다운로드할지 확인하는 안내를 추가했다.
- 빌드 검증: `npm run build` 통과.
- 연결 context: `context/context_20260314_031803_recipe_capture_upload_async_state.md`
