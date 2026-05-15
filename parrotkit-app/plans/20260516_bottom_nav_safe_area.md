# 2026-05-16 Bottom Nav Safe Area

## 배경
Issue 6 Sub-AC 10.1은 복원된 5-slot bottom navigation이 iOS home indicator와 Android system gesture 영역을 침범하지 않도록 안전 영역 기반 높이/패딩 계산을 요구한다.

## 목표
Root bottom navigation의 height와 bottom padding을 플랫폼별로 명시 계산해 Home, Explore, Paste, Recipes, My bar가 iPhone/Android에서 안정적으로 렌더링되도록 한다.

## 범위
- Root tab bar height/padding 계산 계약 추가
- `RootNativeTabs`에서 safe-area inset 기반 tab bar style 적용
- 기존 Paste drawer/route 동작은 변경하지 않음

## 변경 파일
- `src/core/navigation/root-tab-safe-area.ts`
- `src/core/navigation/root-tab-safe-area.test.ts`
- `src/core/navigation/root-native-tabs.tsx`
- `plans/20260516_bottom_nav_safe_area.md`
- `context/context_20260516_bottom_nav_safe_area.md`

## 테스트
- RED: 새 safe-area contract test가 구현 전 실패하는지 확인
- GREEN: `tsc -p tsconfig.root-tabs-check.json`
- 전체: `tsc -p tsconfig.json`
- DESIGN.md guardrail 및 금지 copy 검색

## 롤백
safe-area helper와 test를 제거하고 `RootNativeTabs`의 tabBarStyle을 이전 정적 스타일로 되돌린다.

## 리스크
- sibling agent 변경이 많은 shared worktree이므로 navigation 파일의 기존 Paste drawer/route 변경을 덮지 않는다.
- Expo Router/React Navigation 기본 safe-area 적용과 중복 padding이 생기지 않도록 custom `tabBarStyle`에서 명시 값만 적용한다.

## 결과
- `root-tab-safe-area` helper를 추가해 root tab bar height를 `content height + max(bottom inset, minimum gesture padding)`으로 계산한다.
- iOS home indicator inset은 bottom padding과 height에 정확히 한 번 반영되도록 했다.
- Android는 bottom inset이 0이어도 8px minimum gesture padding을 유지하고, navigation inset이 보고되면 그 값으로 확장되도록 했다.
- `RootNativeTabs`에서 `useSafeAreaInsets()`를 읽어 Home, Explore, Paste, Recipes, My tab bar에 동일 계산을 적용했다.

## 검증 결과
- RED: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`가 `root-tab-safe-area` helper 부재로 실패.
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json` 통과.
- Runtime contract: `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-safe-area.test.ts` 통과.
- Route contract regression: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts` 통과.
- 전체 타입 체크: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` 통과.
- DESIGN.md guardrail 확인: bottom inset/safe-area, preferred Paste nav, box-in-box, redundant CTA 문구 확인.
- 금지 copy 검색: 새 user-facing 금지 copy 추가 없음. 검색 hit는 기존 내부/test 식별자와 guard assertion 문구뿐이다.
- Whitespace: `git diff --check -- ...` 통과.
- 연결 context: `context/context_20260516_bottom_nav_safe_area.md`
