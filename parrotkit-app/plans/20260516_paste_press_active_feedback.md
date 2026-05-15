# 2026-05-16 Paste Press Active Feedback

## 배경
Issue 6 Sub-AC 10.3.3는 centered Paste action의 press/active feedback을 다른 bottom tab과 구분되게 구현하는 작업이다. Paste routing/drawer behavior는 기존 구현을 유지해야 한다.

## 목표
Paste CTA가 눌릴 때 tactile feedback을 주고, paste drawer가 열려 있는 동안 active 상태로 보이게 한다.

## 범위
- `src/core/navigation/root-native-tabs.tsx`의 Paste visual state wiring만 조정한다.
- route href, drawer open/close, recipe creation destination은 변경하지 않는다.

## 변경 파일
- `src/core/navigation/root-native-tabs.tsx`
- `src/core/navigation/root-tab-config.test.ts`
- `context/context_20260516_paste_press_active_feedback.md`

## 테스트
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `git diff --check`
- `DESIGN.md` guardrail 및 금지 copy 확인

## 롤백
Paste active override와 active styles를 제거해 이전 focused-only visual state로 되돌린다.

## 리스크
- 공유 worktree에 sibling-agent 변경이 많으므로 routing/config 변경 없이 visual state만 패치한다.
- Paste는 실제 tab route로 이동하지 않고 drawer를 여는 버튼이므로 active 상태는 route focus가 아니라 drawer open state에 연결한다.

## 결과
- Paste icon/halo/label active state를 `pasteDrawerState.open`에 연결했다.
- Paste button surface에 explicit active prop을 전달하고, accessibility state에 `expanded: true`를 반영했다.
- Paste pressed state를 standard tab보다 더 강한 opacity/translate/scale 피드백으로 구분했다.
- route href, `openPasteDrawer`, recipe creation drawer destination은 변경하지 않았다.

## 검증 결과
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json` 통과.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` 통과.
- `git diff --check` 통과.
- `DESIGN.md` bottom navigation/Paste guardrail 확인.
- forbidden user-facing copy 검색: 신규 UI copy 없음. 검색 hit는 `DESIGN.md` guardrail 텍스트와 기존 내부 식별자 `homeQuickShootChromeHidden`.
- 연결 context: `context/context_20260516_paste_press_active_feedback.md`
