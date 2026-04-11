# Plan - Parrotkit App Top Bar Shell

## 배경
- 현재 RN 앱은 하단 탭과 플로팅 `Paste` CTA는 있지만, 웹 탭 레이아웃에 있는 상단 앱 셸 바가 빠져 있어 화면들이 조금 흩어져 보인다.
- 사용자는 앱 전체에 상단바가 있었으면 좋겠다고 요청했고, 최근 방향도 웹 디자인 시스템을 RN에 최대한 가깝게 옮기는 쪽이다.

## 목표
- 탭 루트 위에 공통 상단바를 추가해 앱 셸 감각을 만든다.
- 웹의 `ParrotKit` 헤더 톤을 RN에 맞게 단순하고 네이티브스럽게 옮긴다.
- 화면별 콘텐츠 타이틀은 유지하되, 공통 상단 크롬이 들어와도 어색하지 않게 정리한다.

## 범위
- `parrotkit-app/src/core/navigation/root-native-tabs.tsx`
- `parrotkit-app/src/core/navigation/app-top-bar.tsx`
- 신규 plan/context 기록

## 변경 파일
- `plans/20260412_parrotkit_app_top_bar_shell.md`
- `context/context_20260412_parrotkit_app_top_bar_shell.md`
- `parrotkit-app/src/core/navigation/app-top-bar.tsx`
- `parrotkit-app/src/core/navigation/root-native-tabs.tsx`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`

## 롤백
- 공통 상단바 컴포넌트를 제거하고 `root-native-tabs.tsx`를 기존 탭 + CTA 셸 구조로 되돌린다.

## 리스크
- 상단바 높이가 추가되면 일부 화면의 첫 인상 영역이 이전보다 아래로 내려갈 수 있어, 이후 실제 기기에서 vertical density를 한 번 더 조정할 수 있다.

## 결과
- 탭 루트 위에 safe-area 포함 공통 상단바를 추가해 앱 셸 감각을 만들었다.
- 상단바는 좌측 브랜드 배지와 중앙 `ParrotKit` 타이틀만 두는 단순한 구조로 구현했고, `NativeTabs`와 floating `Paste` CTA는 기존처럼 유지했다.
- `cd parrotkit-app && npx tsc --noEmit` 검증을 통과했다.

## 연결 context
- `context/context_20260412_parrotkit_app_top_bar_shell.md`
