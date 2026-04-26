# Context - ParrotKit App Source Dual Recipe Actions

## 작업 시간
- 2026-04-26 15:03-15:20 KST

## 요약
- Source inbox의 단일 `Next Action` 카드를 두 개의 액션 카드로 바꿨다.
- `Paste recipe` 카드는 기존 paste drawer를 열어 URL 기반 레시피 생성 흐름으로 진입한다.
- `Blank recipe` 카드는 URL 없이 mock recipe draft를 즉시 만들고 recipe detail로 이동한다.
- Source 탭에서는 전역 paste 플로팅 버튼을 숨겨 새 액션 카드와 겹치지 않게 했다.

## 디자인 결정
- `design-consultation` 관점으로 기존 시스템을 유지했다.
- Source 화면은 작업 선택 화면이므로, 두 액션을 같은 높이의 카드로 나란히 배치했다.
- 카피는 사용자의 의도 기준으로 나눴다.
  - `Paste recipe`: 외부 source를 넣고 구조화된 draft로 바꾸는 흐름
  - `Blank recipe`: 링크 없이 바로 깨끗한 draft를 여는 흐름
- 버튼 pill은 `Paste`, `Start`로 짧게 유지해 작은 iPhone 폭에서도 텍스트가 안정적으로 보이게 했다.

## 변경 파일
- `parrotkit-app/src/features/source/screens/source-screen.tsx`
- `parrotkit-app/src/core/providers/mock-workspace-provider.tsx`
- `parrotkit-app/src/core/navigation/global-source-cta.tsx`
- `plans/20260426_parrotkit_app_source_dual_recipe_actions.md`
- `context/context_20260426_parrotkit_app_source_dual_recipe_actions.md`

## 검증
- `cd parrotkit-app && npx tsc --noEmit`
  - 결과: 통과
  - 경고: 현재 Node.js `v20.15.0`은 npm 11.3.0 권장 범위보다 낮다는 기존 경고가 계속 나온다.
- iOS dev-client 수동 확인
  - Source 화면에서 두 액션 카드가 표시됨.
  - `Paste` 카드 클릭 시 기존 source action sheet가 열림.
  - `Start` 카드 클릭 시 `New Recipe Draft` mock recipe가 생성되고 recipe detail로 이동함.
- 스크린샷
  - `output/playwright/parrotkit-app-source-dual-actions-polished.png`

## 남은 리스크
- `Blank recipe`는 현재 mock workspace에서만 동작한다. 실제 API 연결 시에는 URL 기반 생성과 blank draft 생성을 별도 endpoint/action으로 나눠야 한다.
- dev-client source action sheet의 일부 이모지/특수문자 렌더링은 기존 화면에서 완벽하지 않다. 이번 변경 범위 밖이라 수정하지 않았다.
