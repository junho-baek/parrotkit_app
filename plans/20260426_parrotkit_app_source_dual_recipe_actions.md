# Plan - ParrotKit Source Dual Recipe Actions

## 배경
- Source 탭은 현재 `Next Action` 단일 카드에서 paste drawer만 열 수 있다.
- 사용자는 Source 버튼 진입 후 `paste로 레시피 만들기`와 `바로 레시피 만들기` 두 흐름을 명확히 선택하길 원한다.

## 목표
- Source inbox 상단 액션 영역을 두 개의 버튼 카드로 바꾼다.
- 첫 번째 카드는 paste/link 기반 레시피 생성 흐름으로 연결한다.
- 두 번째 카드는 URL 입력 없이 즉시 mock 레시피 초안을 만들고 recipe detail로 이동한다.
- 기존 화면 톤과 spacing을 유지하면서 카피를 더 명확하게 만든다.

## 범위
- `parrotkit-app/src/features/source/screens/source-screen.tsx`
- `parrotkit-app/src/core/providers/mock-workspace-provider.tsx`
- 작업 결과 context 기록

## 변경 파일
- `plans/20260426_parrotkit_app_source_dual_recipe_actions.md`
- `context/context_20260426_parrotkit_app_source_dual_recipe_actions.md`
- `parrotkit-app/src/features/source/screens/source-screen.tsx`
- `parrotkit-app/src/core/providers/mock-workspace-provider.tsx`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- 실행 중인 dev-client/Metro에서 Source 화면 수동 확인
- `Start blank` 액션이 recipe detail로 이동하는지 확인

## 롤백
- 위 변경 파일을 이전 상태로 되돌리면 기존 단일 `Next Action` 카드로 복구된다.

## 리스크
- 현재 앱은 mock workspace 기반이라 `바로 레시피 만들기`도 임시 데이터 생성으로 처리된다.
- 실제 백엔드가 연결될 때는 blank draft 생성 API와 URL 기반 분석 API를 분리해야 한다.

## 결과
- Source inbox의 `Next Action` 단일 카드를 `Paste recipe`, `Blank recipe` 두 액션 카드로 교체했다.
- `Paste recipe`는 기존 `/source-actions` paste drawer를 연다.
- `Blank recipe`는 URL 없이 `New Recipe Draft`를 만들고 `/recipe/[recipeId]` 상세로 이동한다.
- Source 탭에서는 전역 paste 플로팅 버튼을 숨겨 새 액션 카드와 겹치지 않게 했다.
- 연결 context: `context/context_20260426_parrotkit_app_source_dual_recipe_actions.md`

## 검증 결과
- `cd parrotkit-app && npx tsc --noEmit`
  - 통과
- iOS dev-client 수동 QA
  - Source 화면 카드 표시 확인
  - `Paste` 카드 클릭 시 action sheet 열림
  - `Start` 카드 클릭 시 blank mock draft 생성 및 상세 이동 확인
  - 스크린샷: `output/playwright/parrotkit-app-source-dual-actions-polished.png`
