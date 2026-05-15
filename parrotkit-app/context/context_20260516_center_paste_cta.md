# Context 2026-05-16 Center Paste CTA

## 작업
Issue 6 AC 2: five-slot bottom navigation의 center Paste를 일반 탭보다 큰 primary CTA로 보이게 조정했다.

## DESIGN.md 확인
- `DESIGN.md`의 "Bottom navigation and creation entry" 섹션을 확인했다.
- Preferred v1 model이 Home, Explore, Paste, Recipes, My이고 `Paste`가 larger center action임을 확인했다.
- primary CTA는 coral -> pink -> violet action gradient를 보존하고, redundant CTA/box-in-box를 피해야 함을 확인했다.

## 변경
- `src/core/navigation/root-native-tabs.tsx`
  - `source` tab의 icon renderer를 custom Paste CTA로 분기했다.
  - Paste CTA는 64px circular `LinearGradient` surface, white `link-variant` icon, compact `Paste` label을 사용한다.
  - source tab item/button overflow를 visible로 두어 center CTA가 bottom bar 위로 자연스럽게 솟도록 했다.
  - regular tabs는 기존 native tab icon/label treatment를 유지한다.

## 검증
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json` 통과.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` 통과.
- DESIGN guard 확인: bottom navigation/Paste larger center action, box-in-box/redundant CTA 문구 존재 확인.
- 금지 copy 검색: `src/core/navigation/root-native-tabs.tsx`, `src/core/i18n/app-language.tsx`에서 user-facing `Shoot`, `New Shoot`, `Start Shoot`, `workflow`, `console`, `debug` copy 추가 없음. 검색 hit는 내부 식별자 `homeQuickShootChromeHidden`뿐이다.

## 리스크
- 실제 iPhone/Android screenshot 검증은 이 AC 범위에서 수행하지 않았다.
- Paste drawer destination과 route correctness는 sibling AC 작업과 함께 최종 QA에서 확인해야 한다.
