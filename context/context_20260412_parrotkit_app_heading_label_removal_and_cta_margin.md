# Context - Parrotkit App Heading Label Removal and CTA Margin

## 작업 요약
- global floating `Paste` CTA의 우측 간격이 컨테이너 패딩에 기대는 구조라 체감이 약했던 부분을, `right: 28` 직접 오프셋으로 바꿔 화면 우측 여백이 명확하게 적용되도록 정리했다.
- 공통 preview 화면과 `Source inbox`, `Paste` source-action 시트 상단에 남아 있던 eyebrow 라벨 패턴(`HOME`, `SOURCE`, `ADD SOURCE`)을 제거했다.
- 결과적으로 상단 위계는 제목 하나만 남기고, 플로팅 CTA는 더 단순한 시스템 액션처럼 보이게 맞췄다.

## 변경 파일
- `plans/20260412_parrotkit_app_heading_label_removal_and_cta_margin.md`
- `context/context_20260412_parrotkit_app_heading_label_removal_and_cta_margin.md`
- `parrotkit-app/src/core/navigation/global-source-cta.tsx`
- `parrotkit-app/src/core/ui/feature-preview-screen.tsx`
- `parrotkit-app/src/features/home/screens/home-screen.tsx`
- `parrotkit-app/src/features/explore/screens/explore-screen.tsx`
- `parrotkit-app/src/features/recipes/screens/recipes-screen.tsx`
- `parrotkit-app/src/features/profile/screens/profile-screen.tsx`
- `parrotkit-app/src/features/source/screens/source-screen.tsx`
- `parrotkit-app/src/features/source/screens/source-action-sheet-screen.tsx`

## 검증
- `cd parrotkit-app && npx tsc --noEmit`
  - 결과: 통과

## 남은 리스크
- 실제 시뮬레이터 번들이 이전 스타일을 캐시하고 있으면 우측 여백 차이가 즉시 안 보일 수 있어, 런타임 새로고침 기준 확인이 한 번 더 필요할 수 있다.
- placeholder 화면은 라벨을 걷어내면서 더 미니멀해졌기 때문에, 나중에 실제 데이터가 들어오면 카드/리스트 구조로 위계를 다시 잡아야 한다.
