# Plan - Parrotkit App Heading Label Removal and CTA Margin

## 배경
- 최신 시뮬레이터 기준으로 global `Paste` CTA는 여전히 화면 우측 끝에 붙어 보이고, 헤딩 위의 작은 라벨(`SOURCE`, `HOME`, `ADD SOURCE` 등)도 불필요하게 남아 있다.
- 사용자 피드백은 이 라벨 패턴이 촌스럽고 복잡하게 느껴진다는 것이다.

## 목표
- floating `Paste` CTA의 우측 여백을 실제 `right` 기준으로 명확히 적용한다.
- 앱과 모달에 남아 있는 heading 위 라벨 패턴을 제거하고 제목만 남긴다.

## 범위
- `parrotkit-app/src/core/navigation/global-source-cta.tsx`
- `parrotkit-app/src/core/ui/feature-preview-screen.tsx`
- `parrotkit-app/src/features/home/screens/home-screen.tsx`
- `parrotkit-app/src/features/explore/screens/explore-screen.tsx`
- `parrotkit-app/src/features/recipes/screens/recipes-screen.tsx`
- `parrotkit-app/src/features/profile/screens/profile-screen.tsx`
- `parrotkit-app/src/features/source/screens/source-screen.tsx`
- `parrotkit-app/src/features/source/screens/source-action-sheet-screen.tsx`
- 신규 plan/context 기록

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

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`

## 롤백
- CTA 위치를 이전 값으로 되돌리고, 필요하면 heading 위 라벨을 다시 추가한다.

## 리스크
- 라벨을 모두 걷어내면 일부 placeholder 화면은 구분감이 약해질 수 있다.
- CTA를 너무 많이 안쪽으로 넣으면 탭바와의 정렬감이 어색해질 수 있다.

## 결과
- global `Paste` CTA의 우측 여백을 `paddingRight` 기반 간접 정렬에서 `right: 28` 직접 오프셋으로 바꿨다.
- 공통 preview 헤더와 `Source inbox`, `Paste` 시트 상단에 남아 있던 eyebrow 라벨을 제거하고 제목만 남겼다.
- `cd parrotkit-app && npx tsc --noEmit` 기준 타입체크를 통과했다.

## 연결 context
- `context/context_20260412_parrotkit_app_heading_label_removal_and_cta_margin.md`
