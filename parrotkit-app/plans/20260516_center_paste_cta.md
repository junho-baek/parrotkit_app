# 2026-05-16 Center Paste CTA

## 배경
Issue 6 AC 2는 복원된 5-slot bottom navigation에서 Paste를 일반 탭이 아닌 중심 primary CTA로 보여야 한다. `DESIGN.md`는 Paste가 link/reference material 기반 recipe creation entry이며 larger center action일 수 있다고 명시한다.

## 목표
Home, Explore, Paste, Recipes, My 탭 중 Paste를 시각적으로 더 큰 중심 CTA로 렌더링하고 link/paste affordance를 명확히 한다.

## 범위
- root bottom tab shell의 Paste/source tab visual treatment만 조정한다.
- route mapping, drawer 동작, 다른 화면 copy는 sibling AC 범위로 남긴다.

## 변경 파일
- `src/core/navigation/root-native-tabs.tsx`
- 필요 시 `src/core/navigation/root-tab-config.test.ts`

## 테스트
- `tsc -p tsconfig.root-tabs-check.json`
- `tsc -p tsconfig.json`
- `DESIGN.md` bottom navigation/Paste guardrail 문구 확인

## 롤백
Paste/source tab의 custom icon/button styling을 제거해 기존 기본 tab item 렌더링으로 되돌린다.

## 리스크
- sibling agents가 route/drawer 작업 중이므로 route semantics를 바꾸지 않고 visual-only patch로 제한해야 한다.
- native bottom tab 내부 layout이 플랫폼마다 다를 수 있어 fixed height보다 React Navigation safe-area behavior를 우선한다.

## 결과
- `source`/Paste tab icon renderer를 64px circular gradient CTA로 바꿨다.
- Paste CTA는 white `link-variant` icon과 compact `Paste` label을 함께 보여 일반 탭보다 크게 보인다.
- regular tabs는 기존 native tab icon/label treatment를 유지한다.
- sibling route 작업의 `tabBarButton`/`rootPasteActionHref` 흐름은 유지했고, visual wrapper만 결합했다.

## 검증 결과
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json` 통과.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` 통과.
- `DESIGN.md`의 bottom navigation/Paste larger center action 및 box-in-box/redundant CTA guardrail 확인.
- 금지 copy 검색 결과 user-facing 추가 문구 없음. 검색 hit는 내부 식별자 `homeQuickShootChromeHidden`뿐이다.
- 연결 context: `context/context_20260516_center_paste_cta.md`
