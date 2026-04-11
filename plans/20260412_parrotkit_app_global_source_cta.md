# Plan - Parrotkit App Global Source CTA

## 배경
- 현재 `parrotkit-app`은 `Source` 탭 안에서만 중앙 `+` FAB를 보여 주고, 그 버튼이 `source-actions` modal sheet를 여는 구조다.
- 사용자 피드백 기준으로 quick intake 액션은 특정 탭 내부 버튼보다 앱 전반에서 인지되는 CTA가 더 자연스럽다.
- 동시에 하단 네비게이션은 시스템 감각을 유지하고 싶으므로, 기존 native tabs는 유지하되 액션 버튼은 우측 하단 global CTA로 올리는 방향이 적합하다.

## 목표
- `Source` 화면 내부 FAB를 제거하고, 탭 셸 전역에서 보이는 우측 하단 CTA로 `source-actions` 진입을 제공한다.
- CTA 색상은 웹 버전의 브랜드 action gradient(`#ff9568 -> #de81c1 -> #8c67ff`)를 따라간다.
- 관련 화면 카피와 앱 단위 AGENT 메모를 새 정보구조에 맞게 정리한다.

## 범위
- 탭 셸 레벨 global CTA 컴포넌트 추가
- `SourceScreen` 내부 FAB 제거 및 카피 수정
- preview screen 카피 정리
- 브랜드 gradient 토큰 추가
- 앱 단위 AGENT 메모 및 신규 context 문서 업데이트

## 변경 파일
- `plans/20260412_parrotkit_app_global_source_cta.md`
- `parrotkit-app/package.json`
- `parrotkit-app/package-lock.json`
- `parrotkit-app/AGENT.md`
- `parrotkit-app/src/core/navigation/root-native-tabs.tsx`
- `parrotkit-app/src/core/navigation/global-source-cta.tsx`
- `parrotkit-app/src/core/theme/colors.ts`
- `parrotkit-app/src/core/ui/feature-preview-screen.tsx`
- `parrotkit-app/src/features/source/screens/source-action-sheet-screen.tsx`
- `parrotkit-app/src/features/source/screens/source-screen.tsx`
- `parrotkit-app/src/features/home/screens/home-screen.tsx`
- `parrotkit-app/src/features/explore/screens/explore-screen.tsx`
- `parrotkit-app/src/features/recipes/screens/recipes-screen.tsx`
- `parrotkit-app/src/features/profile/screens/profile-screen.tsx`
- `context/context_20260412_parrotkit_app_global_source_cta.md`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- `cd parrotkit-app && npx expo config --type public`

## 롤백
- global CTA 컴포넌트를 제거하고 `SourceScreen` 내부 FAB 구조로 되돌린다.
- `expo-linear-gradient` 도입이 불필요해지면 의존성을 제거한다.

## 리스크
- global CTA가 native tab bar와 시각적으로 충돌하면 탭 정보 구조가 다시 복잡해 보일 수 있다.
- `expo-linear-gradient` 추가 후 기존 dev client에는 native module이 없을 수 있어, 실제 기기 확인 시 재빌드가 필요할 수 있다.
- 전역 CTA가 앞으로 detail/fullscreen 화면까지 모두 따라다니면 과하게 느껴질 수 있으므로, 현재는 탭 셸 기준으로만 노출한다.

## 결과
- 완료
- `expo-linear-gradient`를 추가해 웹 CTA와 같은 브랜드 gradient를 모바일 CTA에 적용했다.
- `SourceScreen` 내부 FAB를 제거하고, 탭 셸 전역에서 보이는 우측 하단 `Paste` CTA가 `source-actions` modal을 열도록 구조를 바꿨다.
- placeholder 설명 카피를 걷어내고, 화면은 NativeWind 중심의 짧은 라벨/패널 위주로 정리했다.
- `npx tsc --noEmit`, `npx expo config --type public` 검증을 통과했다.

## 연결 context
- `context/context_20260412_parrotkit_app_global_source_cta.md`
