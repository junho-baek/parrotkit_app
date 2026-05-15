# Tab Item Visual Polish

## 배경
Issue 6 Sub-AC 10.2.2는 이미 복구된 five-slot bottom navigation에서 개별 tab item의 icon/text alignment, inactive styling, active feedback을 다듬는 작업이다.

## 목표
- Home, Explore, Recipes, My의 icon/label 정렬을 안정화한다.
- inactive tab은 DESIGN.md의 muted text 방향에 맞게 덜 강조한다.
- active tab은 coral 기반 selected state로 명확한 피드백을 준다.
- center Paste CTA는 prominent primary action을 유지하면서 press feedback을 가진다.

## 범위
- `src/core/navigation/root-native-tabs.tsx`의 tab item visual style만 수정한다.
- tab route mapping, Paste drawer state, drawer destination은 변경하지 않는다.
- QA screenshots/output 산출물은 커밋 대상으로 만들지 않는다.

## 변경 파일
- `src/core/navigation/root-native-tabs.tsx`
- `plans/20260516_tab_item_visual_polish.md`
- `context/context_20260516_tab_item_visual_polish.md`

## 테스트
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- DESIGN.md 관련 guard text 확인
- 금지 user-facing copy 검색

## 롤백
- `root-native-tabs.tsx`의 tabBarIcon/tab item style 변경을 이전 MaterialCommunityIcons 단독 렌더링으로 되돌린다.

## 리스크
- 실제 iPhone/Android simulator screenshot 검증은 최종 통합 QA 범위일 수 있다.
- 공유 worktree라 같은 navigation file에 sibling-agent 변경이 섞일 수 있어 route 로직은 건드리지 않는다.

## 결과
- regular tab icon frame과 compact label renderer를 추가해 icon/text alignment를 안정화했다.
- active state는 coral tint + soft coral icon fill로 명확하게 보이도록 조정했다.
- inactive state는 muted slate tint를 유지했다.
- Paste center action은 gradient circle과 drawer 동작을 유지하고 press opacity/scale feedback을 추가했다.
- 연결 context: `context/context_20260516_tab_item_visual_polish.md`
