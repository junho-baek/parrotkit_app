# Context 2026-05-16 Standard Tab Press Feedback

## 작업
Issue 6 Sub-AC 10.3.2: Home, Explore, Recipes, My 표준 bottom nav items에 mobile-native press/active visual feedback을 추가했다.

## DESIGN.md 확인
- `DESIGN.md`의 polished creator tool 방향과 "containers support it" 원칙을 확인했다.
- selected state는 coral/background를 우선한다는 색상 지침을 확인했다.
- bottom inset/safe-area padding 지침을 유지해야 함을 확인했다.

## 변경
- `src/core/navigation/root-native-tabs.tsx`
  - `RootTabButton`에서 `role === 'tab'`인 표준 탭과 Paste button을 분리했다.
  - 표준 탭은 Android에서 coral-tinted ripple feedback을 사용한다.
  - 선택된 표준 탭은 subtle coral surface로 active 상태를 보여준다.
  - 눌린 표준 탭은 coral press fill, opacity, scale feedback을 적용한다.
  - Paste CTA는 기존 prominent centered drawer action과 별도 press feedback을 유지한다.

## 검증
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json` 통과.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` 통과.
- `test -s DESIGN.md && rg -n "Simplicity Guardrails|Use bottom inset|selected states primarily with coral|not a workflow console" DESIGN.md` 통과.
- 금지 copy 검색: `rg -n "Shoot|New Shoot|Start Shoot|workflow|console|debug" src/core/navigation/root-native-tabs.tsx src/core/i18n/app-language.tsx`
  - 새 user-facing copy 추가 없음. 기존 내부 변수명 `homeQuickShootChromeHidden`만 hit.
- `rg -n "android_ripple|regularTabButtonSurfaceActive|regularTabButtonSurfacePressed|pasteTabButtonSurfacePressed|accessibilityState\\?\\.selected" src/core/navigation/root-native-tabs.tsx`로 feedback hook/style 존재 확인.
- `git diff --check -- src/core/navigation/root-native-tabs.tsx plans/20260516_standard_tab_press_feedback.md` 통과.

## 리스크
- 실제 iPhone/Android screenshot 검증은 수행하지 않았다.
- 공유 worktree에 sibling-agent 변경이 많아 commit/push는 수행하지 않았다.
