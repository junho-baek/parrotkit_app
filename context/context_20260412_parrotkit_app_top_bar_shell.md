# Context - Parrotkit App Top Bar Shell

## 작업 요약
- RN 탭 앱에 공통 상단바가 없어 화면들이 각각 따로 노는 느낌이 있었고, 웹 탭 셸의 `ParrotKit` 헤더 패턴을 RN에도 가져오기로 했다.
- `root-native-tabs` 위에 safe-area를 포함한 공통 top bar를 추가하고, `NativeTabs`는 그 아래에서 그대로 동작하도록 셸 구조를 정리했다.
- 상단바는 과한 기능 버튼 없이 좌측 브랜드 배지와 중앙 `ParrotKit` 타이틀만 두어 앱 크롬 감각을 만들고, 기존 화면별 큰 헤딩은 그대로 유지했다.

## 변경 파일
- `plans/20260412_parrotkit_app_top_bar_shell.md`
- `context/context_20260412_parrotkit_app_top_bar_shell.md`
- `parrotkit-app/src/core/navigation/app-top-bar.tsx`
- `parrotkit-app/src/core/navigation/root-native-tabs.tsx`

## 검증
- `cd parrotkit-app && npx tsc --noEmit`
  - 결과: 통과

## 남은 리스크
- 현재는 공통 top bar와 각 화면의 대형 타이틀이 같이 존재하므로, 실제 기기에서 첫 화면 세로 밀도가 무겁게 느껴지면 일부 화면의 첫 섹션 패딩이나 타이틀 스케일을 한 번 더 줄일 수 있다.
- 상단바는 현재 탭 루트에만 적용되므로, 추후 recipe detail이나 prompter에도 공통 앱 크롬이 필요하면 stack 화면 정책을 따로 잡아야 한다.
