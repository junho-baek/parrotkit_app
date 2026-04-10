# Context - Parrotkit App Source Tab Action Sheet

## 작업 요약
- 기존 `Paste` 전역 floating action 구조를 걷어내고, `Source`를 가운데 native tab destination으로 추가했다.
- 빠른 입력 플로우는 더 이상 모든 탭 위의 글로벌 오버레이가 아니라, `Source` 화면 안의 중앙 `+` 버튼이 여는 transparent modal sheet로 이동했다.
- `Paste`는 독립 destination이 아니라 `Source`의 quick intake action으로 재정의했고, 관련 카피와 AGENT 메모도 같은 기준으로 업데이트했다.

## 변경 파일
- `plans/20260411_parrotkit_app_source_tab_action_sheet.md`
- `parrotkit-app/AGENT.md`
- `parrotkit-app/src/app/_layout.tsx`
- `parrotkit-app/src/app/(tabs)/source.tsx`
- `parrotkit-app/src/app/source-actions.tsx`
- `parrotkit-app/src/core/navigation/root-native-tabs.tsx`
- `parrotkit-app/src/core/theme/colors.ts`
- `parrotkit-app/src/features/explore/screens/explore-screen.tsx`
- `parrotkit-app/src/features/home/screens/home-screen.tsx`
- `parrotkit-app/src/features/profile/screens/profile-screen.tsx`
- `parrotkit-app/src/features/recipes/screens/recipes-screen.tsx`
- `parrotkit-app/src/features/source/screens/source-screen.tsx`
- `parrotkit-app/src/features/source/screens/source-action-sheet-screen.tsx`
- 삭제: `parrotkit-app/src/core/ui/floating-paste-button.tsx`
- 삭제: `parrotkit-app/src/app/paste.tsx`
- 삭제: `parrotkit-app/src/features/paste/screens/paste-drawer-screen.tsx`

## 구조 메모
- root stack
  - `(tabs)`: root destination shell
  - `source-actions`: transparent modal sheet
- root tabs
  - `Home`
  - `Explore`
  - `Source`
  - `Recipes`
  - `My`
- `Source`는 persistent destination이고, `+`는 `source-actions` modal을 여는 one-shot action이다.

## 구현 메모
- `RootLayout`에서 전역 floating overlay를 제거했다.
- `SourceScreen`은 자체 scroll surface 위에 절대 배치된 중앙 `+` 버튼을 가진다.
- `SourceActionSheetScreen`은 기존 paste drawer의 역할을 이어받지만, 정보 구조와 카피는 `Source` 중심으로 바꿨다.
- `screenAccents` 토큰도 `paste` 대신 `source` 기준으로 맞췄다.

## 검증
- `cd parrotkit-app && npx tsc --noEmit`
  - 통과
- `cd parrotkit-app && npx expo config --type public`
  - 통과
- `make cl`
  - 새로 생긴 `._*` AppleDouble 파일 정리

## 후속 메모
- 현재 `Source`의 `+` 버튼은 Source 화면 안에서만 보인다. 필요하면 나중에 `Source` 탭이 아닌 다른 화면에서도 진입할 수 있게 헤더 액션이나 context menu를 추가할 수 있다.
- Android native build 자체는 여전히 외장 볼륨의 AppleDouble 오염 문제 영향을 받는다. 이번 작업은 navigation 정보 구조 변경에만 집중했다.
