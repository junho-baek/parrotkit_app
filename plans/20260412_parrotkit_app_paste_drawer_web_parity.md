# Plan - Parrotkit App Paste Drawer Web Parity

## 배경
- 사용자는 모바일 앱의 목표를 "웹으로 만든 것을 앱에서 똑같이 만든다"로 명확히 정의했다.
- 현재 `parrotkit-app`의 `source-actions` 시트는 white tone과 gradient CTA까지는 일부 맞췄지만, 실제 웹 `PasteDrawer`의 헤더 카피, 입력 필드 구조, `Your Context` 아코디언, PDF 업로드 슬롯까지는 아직 반영되지 않았다.

## 목표
- 웹 `PasteDrawer`와 `URLInputForm`의 drawer variant 구조를 React Native 시트에 최대한 동일하게 반영한다.
- 헤더 카피, 필드 라벨/placeholder, `Your Context` 확장 영역, PDF 업로드 슬롯, CTA까지 같은 위계로 정리한다.
- RN 환경에서 가능한 범위 안에서 gradient 강조어와 업로드 affordance도 맞춘다.

## 범위
- `parrotkit-app/src/features/source/screens/source-action-sheet-screen.tsx`
- 신규 plan/context 기록

## 변경 파일
- `plans/20260412_parrotkit_app_paste_drawer_web_parity.md`
- `context/context_20260412_parrotkit_app_paste_drawer_web_parity.md`
- `parrotkit-app/src/features/source/screens/source-action-sheet-screen.tsx`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- `cd parrotkit-app && npx expo config --type public`

## 롤백
- `source-actions` 시트를 현재 단순 버전으로 되돌리고, 추가한 RN dependency가 불필요하면 제거한다.

## 리스크
- 웹의 gradient text/세부 CSS를 RN에서 1:1로 옮길 수 없어 일부 효과는 근사치로 구현될 수 있다.
- PDF 업로드 슬롯은 현재 시각 구조와 affordance 중심으로 맞췄고, 실제 picker 연결은 추후 native dependency 전략과 함께 붙일 수 있다.

## 결과
- `source-actions` 시트를 웹 `PasteDrawer` 형태에 가깝게 재구성해 헤더 카피, 타이틀/URL 입력, `Your Context` 아코디언, `Niche/Goal/Notes`, PDF 업로드 슬롯, `Analyze Video` CTA를 같은 위계로 반영했다.
- 기존의 generic quick action 카드(`Paste URL`, `Use clipboard`, `Import media`)는 제거하고 웹 기준 폼형 drawer로 정리했다.
- 새 native dependency는 추가하지 않고 기존 Expo/RN 프리미티브만으로 구현해 현재 dev client 흐름을 보존했다.
- `cd parrotkit-app && npx tsc --noEmit`, `cd parrotkit-app && npx expo config --type public` 검증을 통과했다.

## 연결 context
- `context/context_20260412_parrotkit_app_paste_drawer_web_parity.md`
