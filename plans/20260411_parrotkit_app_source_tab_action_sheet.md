# Plan - Parrotkit App Source Tab Action Sheet

## 배경
- 현재 `parrotkit-app`은 4개 native tab 위에 전역 floating `Paste` 버튼을 띄우고, 탭과 액션의 역할을 분리하려고 했다.
- 실제 화면에서는 중앙 액션이 탭처럼도 보이고 오버레이처럼도 보여 하단 네비게이션이 다소 어색해졌다.
- 사용자 피드백 기준으로 `Source`를 진짜 destination tab으로 두고, 그 안에서 `+`로 입력 플로우를 여는 구조가 더 자연스럽다.

## 목표
- `Source`를 root native tabs의 가운데 destination으로 추가한다.
- 전역 floating `Paste` 버튼을 제거하고, `Source` 화면 전용의 중앙 `+` 액션으로 이동한다.
- `+` 액션은 drawer 같은 바텀 시트/transparent modal stack으로 유지해 빠른 입력 흐름을 연다.

## 범위
- Expo Router 탭 구성 조정
- `Source` route 및 feature screen 추가
- 기존 `Paste` drawer를 `Source` action sheet 맥락으로 재정의
- 관련 copy와 앱 단위 AGENT 메모 업데이트

## 변경 파일
- `plans/20260411_parrotkit_app_source_tab_action_sheet.md`
- `parrotkit-app/src/app/_layout.tsx`
- `parrotkit-app/src/app/(tabs)/source.tsx`
- `parrotkit-app/src/app/source-actions.tsx`
- `parrotkit-app/src/core/navigation/root-native-tabs.tsx`
- `parrotkit-app/src/core/theme/colors.ts`
- `parrotkit-app/src/core/ui/floating-paste-button.tsx`
- `parrotkit-app/src/features/home/screens/home-screen.tsx`
- `parrotkit-app/src/features/explore/screens/explore-screen.tsx`
- `parrotkit-app/src/features/recipes/screens/recipes-screen.tsx`
- `parrotkit-app/src/features/profile/screens/profile-screen.tsx`
- `parrotkit-app/src/features/source/screens/source-screen.tsx`
- `parrotkit-app/src/features/source/screens/source-action-sheet-screen.tsx`
- `parrotkit-app/src/features/paste/screens/paste-drawer-screen.tsx`
- `parrotkit-app/src/app/paste.tsx`
- `parrotkit-app/AGENT.md`
- `context/context_20260411_parrotkit_app_source_tab_action_sheet.md`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- `cd parrotkit-app && npx expo config --type public`

## 롤백
- `Source` 탭과 Source action sheet를 제거하고, 기존 전역 floating paste button + `paste` modal route 구조로 되돌린다.

## 리스크
- 가운데 destination tab과 그 위의 `+` 버튼이 시각적으로 겹치면 오히려 구조가 더 복잡해 보일 수 있다.
- iOS와 Android에서 native tab bar 여백과 safe area가 다르기 때문에 Source 화면의 하단 레이아웃을 신중히 잡아야 한다.

## 결과
- `Source`를 native tabs의 가운데 destination으로 추가했다.
- 전역 floating `Paste` 버튼과 `paste` modal route를 제거하고, `Source` 화면 내부의 중앙 `+` 버튼이 `source-actions` transparent modal sheet를 열도록 바꿨다.
- `Paste` feature는 독립 destination이 아니라 `Source` 안의 intake action으로 재정의했다.
- Home, Explore, Recipes, My 탭 카피도 `Source` 중심 정보 구조에 맞게 정리했다.
- `make cl`로 새로 생긴 AppleDouble `._*` 파일을 정리했다.
- 연결 context: `context/context_20260411_parrotkit_app_source_tab_action_sheet.md`
