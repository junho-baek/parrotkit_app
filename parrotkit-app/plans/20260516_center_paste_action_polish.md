# 2026-05-16 Center Paste Action Polish

## 배경
Issue 6 Sub-AC 10.2.3는 이미 복원된 five-slot bottom navigation 안에서 centered Paste action의 크기, 위치, 그림자, active/pressed 상태를 더 완성도 있게 다듬는 작업이다.

## 목표
Paste가 Home, Explore, Recipes, My보다 더 prominent한 중심 CTA로 보이되, `DESIGN.md` 기준처럼 bottom bar와 통합된 mobile-native action으로 느껴지게 한다.

## 범위
- `src/core/navigation/root-native-tabs.tsx`의 Paste/source tab visual treatment만 조정한다.
- route mapping, drawer destination, copy, recipe creation flow는 변경하지 않는다.

## 변경 파일
- `src/core/navigation/root-native-tabs.tsx`
- `context/context_20260516_center_paste_action_polish.md`

## 테스트
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `git diff --check`
- `DESIGN.md` bottom navigation/Paste guardrail 확인

## 롤백
Paste tab의 halo/elevation/pressed/focused styling을 이전 circular gradient-only treatment로 되돌린다.

## 리스크
- 공유 worktree에 sibling-agent 변경이 많으므로 visual-only patch로 제한하고 커밋/푸시는 최종 통합 단계로 남긴다.
- React Navigation tab bar 내부 layout은 플랫폼별 차이가 있어 safe-area 관련 상수와 route 동작은 건드리지 않는다.

## 결과
- Paste CTA에 white halo/cradle을 추가해 bottom bar와 더 통합된 중심 action으로 보이게 했다.
- gradient circle은 유지하면서 icon size를 30px로 조정하고, focused 상태에 white inner stroke와 pink-tinted elevation을 적용했다.
- iOS shadow와 Android elevation을 halo에 부여해 플랫폼별 depth가 유지되도록 했다.
- pressed 상태는 opacity + translate/scale로 눌리는 피드백을 명확히 했다.
- route mapping, drawer open handler, safe-area layout 상수는 변경하지 않았다.

## 검증 결과
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json` 통과.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` 통과.
- `git diff --check` 통과.
- `DESIGN.md` guardrail 확인 통과.
- 금지 user-facing copy 검색 결과 신규 UI copy 없음. 기존 내부 식별자 `homeQuickShootChromeHidden`만 검색됐다.
- 연결 context: `context/context_20260516_center_paste_action_polish.md`
