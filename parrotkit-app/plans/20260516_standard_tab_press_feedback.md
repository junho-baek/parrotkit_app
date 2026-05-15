# Standard Tab Press Feedback

## 배경
Issue 6 Sub-AC 10.3.2는 five-slot bottom navigation 중 Home, Explore, Recipes, My 표준 탭에 mobile-native press/active visual feedback을 요구한다.

## 목표
- Home, Explore, Recipes, My 탭은 눌림 상태가 즉시 보이도록 한다.
- 선택된 표준 탭은 coral 기반 active surface로 현재 위치를 명확히 보여준다.
- Paste center CTA의 prominent drawer action은 유지한다.

## 범위
- `src/core/navigation/root-native-tabs.tsx`의 표준 tab-role button feedback만 수정한다.
- route mapping, Paste drawer flow, visible tab order는 변경하지 않는다.
- QA screenshot/output 산출물은 만들지 않는다.

## 변경 파일
- `src/core/navigation/root-native-tabs.tsx`
- `plans/20260516_standard_tab_press_feedback.md`
- `context/context_20260516_standard_tab_press_feedback.md`

## 테스트
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- DESIGN.md guard text 확인
- 금지 user-facing copy 검색

## 롤백
- `RootTabButton`의 standard tab active/pressed style과 `android_ripple` 설정을 제거해 이전 shared pressed opacity/scale 상태로 되돌린다.

## 리스크
- 실제 iPhone/Android screenshot 검증은 최종 통합 QA에서 수행될 수 있다.
- 공유 worktree에서 같은 navigation file에 sibling-agent 변경이 있으므로 route와 drawer 로직은 건드리지 않는다.

## 결과
- `src/core/navigation/root-native-tabs.tsx`의 `RootTabButton`에서 표준 tab-role item과 Paste button feedback을 분리했다.
- Home, Explore, Recipes, My는 Android ripple, selected coral surface, pressed coral fill/scale feedback을 가진다.
- Paste center CTA의 prominent drawer action과 별도 press feedback은 유지했다.
- 연결 context: `context/context_20260516_standard_tab_press_feedback.md`
