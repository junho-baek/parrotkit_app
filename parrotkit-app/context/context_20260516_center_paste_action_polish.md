# Context 2026-05-16 Center Paste Action Polish

## 작업
Issue 6 Sub-AC 10.2.3: centered Paste action의 size, prominence, positioning, shadow/elevation, pressed/active visual states를 polish했다.

## DESIGN.md 확인
- Preferred v1 bottom navigation은 `Home`, `Explore`, larger center `Paste`, `Recipes`, `My`이다.
- `Paste`는 generic plus/debug action이 아니라 reference link를 붙여 recipe creation drawer/flow로 이어지는 action이다.
- Center action은 circular/larger일 수 있지만 bottom bar와 통합되어 보여야 한다.
- Box-in-box/redundant CTA를 피하고 primary CTA는 gradient/weight 중심으로 다룬다.

## 변경
- `src/core/navigation/root-native-tabs.tsx`
  - Paste gradient circle을 white halo/cradle 안에 배치해 bottom bar 위에 안정적으로 자리 잡게 했다.
  - halo에 iOS shadow와 Android elevation을 추가했다.
  - focused 상태는 white inner stroke, slightly lifted halo, pink-tinted shadow로 구분했다.
  - pressed 상태는 opacity + translate/scale로 tactile feedback을 강화했다.
  - hitSlop을 추가해 large center action의 touch target을 안정화했다.
  - route href, drawer interception, `RecipeCreateScreen initialMode="reference"` 흐름은 유지했다.

## 검증
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json` 통과.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` 통과.
- `git diff --check` 통과.
- `DESIGN.md` guardrail check 통과.
- forbidden user-facing copy check: 신규 copy 없음. hit는 기존 내부 식별자 `homeQuickShootChromeHidden`뿐이다.

## 리스크
- 실제 iPhone/Android screenshot QA는 이 sub-AC 범위에서 수행하지 않았다.
- 공유 worktree에 sibling-agent 변경이 많아 커밋/푸시는 하지 않았다.
