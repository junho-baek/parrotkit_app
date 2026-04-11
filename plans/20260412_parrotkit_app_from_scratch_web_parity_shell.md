# Plan - Parrotkit App From Scratch Web Parity Shell

## 배경
- 사용자는 모바일 앱 목표를 "웹으로 만든 것을 앱으로 똑같이 만든다"로 정의했고, 현재 RN 앱은 대부분이 placeholder screen 상태다.
- 웹 프로젝트에는 이미 `home`, `explore`, `paste drawer`, `recipes`, `my`, `recipe result` 흐름과 `WordRotate` 구현이 존재한다.
- 이번 단계에서는 서버 로직 없이도 제품 구조를 확인할 수 있도록, RN 앱을 local mock source-of-truth 기반 product shell로 재구성해야 한다.

## 목표
- RN 앱에서 웹의 product IA를 따르는 from-scratch 버전을 만든다.
- `home`, `explore`, `source`, `recipes`, `my` 탭과 `recipe detail` screen을 mock data 기반으로 연결한다.
- `Paste` drawer에 웹의 rotating platform word를 RN 방식으로 적용한다.
- 서버/API 호출 없이도 create -> view recipe 흐름이 local state 기준으로 동작하게 만든다.

## 범위
- `parrotkit-app/src/app/_layout.tsx`
- `parrotkit-app/src/app/recipe/[recipeId].tsx`
- `parrotkit-app/src/core/providers/*`
- `parrotkit-app/src/core/mocks/*`
- `parrotkit-app/src/core/ui/*`
- `parrotkit-app/src/features/home/screens/home-screen.tsx`
- `parrotkit-app/src/features/explore/screens/explore-screen.tsx`
- `parrotkit-app/src/features/source/screens/source-screen.tsx`
- `parrotkit-app/src/features/source/screens/source-action-sheet-screen.tsx`
- `parrotkit-app/src/features/recipes/screens/recipes-screen.tsx`
- `parrotkit-app/src/features/profile/screens/profile-screen.tsx`
- `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
- 신규 plan/context 기록

## 변경 파일
- `plans/20260412_parrotkit_app_from_scratch_web_parity_shell.md`
- `context/context_20260412_parrotkit_app_from_scratch_web_parity_shell.md`
- 위 범위에 포함된 RN 앱 파일들

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- `cd parrotkit-app && npx expo config --type public`

## 롤백
- 새 mock shell/provider/recipe detail route를 제거하고 기존 placeholder screen 상태로 되돌린다.

## 리스크
- 한 번에 여러 화면을 바꾸기 때문에 style/token 일관성은 잡히더라도 세부 spacing은 후속 조정이 필요할 수 있다.
- mock local state는 실제 backend contract와 다르므로 이후 서버 연결 단계에서 route/state ownership을 다시 조정해야 할 수 있다.

## 결과
- 앱 전역 mock workspace provider를 추가해 `recent references`, `trending references`, `recipes`, `liked references`를 local source-of-truth로 관리하도록 바꿨다.
- `home`, `explore`, `source`, `recipes`, `my` 탭을 placeholder 대신 웹 product IA 기준 mock 화면으로 교체했다.
- `recipe/[recipeId]` stack route와 recipe detail screen을 추가해 recipes list나 paste drawer에서 상세 화면으로 진입할 수 있게 했다.
- `Paste` drawer는 submit 시 local draft recipe를 만들고 새 detail route로 이동하며, 상단 headline에는 웹의 Magic UI `WordRotate`를 RN `react-native-reanimated` 기반 `RotatingWord`로 근사 적용했다.
- `cd parrotkit-app && npx tsc --noEmit`, `cd parrotkit-app && npx expo config --type public` 검증을 통과했다.

## 연결 context
- `context/context_20260412_parrotkit_app_from_scratch_web_parity_shell.md`
