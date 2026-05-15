# Context 2026-05-16 Tab Item Visual Polish

## 작업
Issue 6 Sub-AC 10.2.2: five-slot bottom navigation의 개별 tab item visuals를 polish했다.

## DESIGN.md 확인
- `Bottom navigation and creation entry`에서 Home, Explore, Paste, Recipes, My five-slot model과 larger center Paste action을 확인했다.
- selected state는 coral/background를 우선한다는 색상 지침을 확인했다.
- bottom inset/safe-area padding 지침을 유지해야 함을 확인했다.

## 변경
- `src/core/navigation/root-native-tabs.tsx`
  - regular tab icon을 fixed-size frame에 넣어 Home/Explore/Recipes/My의 icon/text 정렬을 안정화했다.
  - active tab tint를 coral `#ff9568`로 바꾸고, active icon frame에 soft coral fill `#fff1ea`를 적용했다.
  - inactive tab은 muted slate `#94a3b8` tint를 유지하고 compact label style을 명시했다.
  - Paste center action은 기존 gradient circle/drawer behavior를 보존하면서 press 상태에서 opacity/scale feedback을 준다.

## 검증
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json` 통과.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` 통과.
- `test -s DESIGN.md && rg -n "Bottom navigation and creation entry|Paste.*larger center action|Use bottom inset|selected states primarily with coral" DESIGN.md` 통과.
- 금지 copy 검색: `rg -n "Shoot|New Shoot|Start Shoot|workflow|console|debug" src/core/navigation/root-native-tabs.tsx src/core/i18n/app-language.tsx`
  - user-facing copy 추가 없음. 기존 내부 변수명 `homeQuickShootChromeHidden`만 hit.
- `git diff --check -- src/core/navigation/root-native-tabs.tsx plans/20260516_tab_item_visual_polish.md` 통과.

## 리스크
- 실제 iPhone/Android screenshot 검증은 수행하지 않았다.
- 공유 worktree에 sibling-agent 변경이 많아 commit/push는 수행하지 않았다.
