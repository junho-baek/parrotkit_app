# Plan - Parrotkit App Top Bar Top Only Behavior

## 배경
- Android에서 탭을 오가며 돌아오면 현재 화면의 실제 스크롤 위치와 top bar 표시 상태가 어긋나 오버레이처럼 보이는 문제가 있다.
- iPhone에서는 top bar 아래에 본문과의 불필요한 여백이 생기고, 스크롤 업 중간에 불투명한 상단바가 다시 보여 네이티브하지 않게 느껴진다.

## 목표
- top bar는 각 탭 화면의 실제 스크롤 위치를 기준으로 동작하게 바꾼다.
- 긴 화면에서는 top bar가 오직 최상단 근처에서만 보이고, 중간 구간에서는 나타나지 않게 만든다.
- iPhone 상단 여백 문제를 없애고 top bar와 본문이 더 자연스럽게 이어지도록 정리한다.

## 범위
- `parrotkit-app/src/core/navigation/app-chrome-provider.tsx`
- `parrotkit-app/src/core/navigation/app-top-bar.tsx`
- `parrotkit-app/src/core/ui/app-screen-scroll-view.tsx`
- 신규 plan/context 기록

## 변경 파일
- `plans/20260412_parrotkit_app_top_bar_top_only_behavior.md`
- `context/context_20260412_parrotkit_app_top_bar_top_only_behavior.md`
- `parrotkit-app/src/core/navigation/app-chrome-provider.tsx`
- `parrotkit-app/src/core/navigation/app-top-bar.tsx`
- `parrotkit-app/src/core/ui/app-screen-scroll-view.tsx`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`

## 롤백
- top bar progress를 현재의 threshold 기반 동작으로 되돌리고, 이전 platform refine 상태로 복원한다.

## 리스크
- custom top bar이기 때문에 native large title 헤더처럼 자동 복원되는 건 아니고, 현재 구조에서는 각 탭 ScrollView가 focus 시 직접 상태를 맞추는 방식으로 유지된다.

## 결과
- top bar progress를 스크롤 방향 기반이 아니라 현재 offset 기반으로 바꿔, 긴 화면에서는 최상단 근처에서만 보이도록 정리했다.
- 탭 전환 후 돌아왔을 때도 각 화면이 기억한 offset 기준으로 top bar 상태를 복원하게 바꿨다.
- iPhone 상단 여백은 ScrollView inset 자동 조정을 끄고 manual top padding만 쓰도록 정리했다.
- `cd parrotkit-app && npx tsc --noEmit` 검증을 통과했다.

## 연결 context
- `context/context_20260412_parrotkit_app_top_bar_top_only_behavior.md`
