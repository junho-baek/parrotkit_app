# AC 6 Bottom Navigation Preservation

## 배경
ParrotKit v1 navigation follow-up에서 Home Continue card work만 남아 있으며, 이미 통과한 bottom navigation은 Home / Explore / My 상태를 유지해야 한다.

## 목표
- Bottom navigation이 정확히 Home, Explore, My만 노출하는지 재확인한다.
- Source와 Recipes가 bottom tab으로 복원되지 않았는지 확인한다.
- sibling task의 Home Continue 작업을 방해하지 않도록 코드 변경 없이 보존 가능 여부를 판단한다.

## 범위
- `src/core/navigation/root-tab-config.ts`
- `src/core/navigation/root-native-tabs.tsx`
- `src/core/navigation/root-tab-config.test.ts`
- `tsconfig.root-tabs-check.json`
- web QA, Home Continue UI 구현, floating creation CTA 변경은 제외한다.

## 변경 파일
- `plans/20260514_ac6_bottom_navigation_preservation.md`
- `context/context_20260514_ac6_bottom_navigation_preservation.md`

## 테스트
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- 가능한 경우 `xcrun simctl list devices booted`로 simulator 접근 확인

## 롤백
- 문서 변경만 있으므로 이 plan/context 파일을 제거하면 된다.
- production code 변경은 수행하지 않는다.

## 리스크
- CoreSimulatorService 접근이 차단되면 iPhone simulator screenshot 기반 QA evidence는 남기지 못한다.

## 결과
- `rootTabNames`는 `['index', 'explore', 'my']`로 유지되어 visible bottom tab contract가 Home / Explore / My로 제한됨을 확인했다.
- `root-native-tabs.tsx`는 `rootTabNames.map(...)`으로만 `NativeTabs.Trigger`를 렌더링하므로 Source와 Recipes bottom trigger는 없다.
- focused sucrase contract check와 `tsconfig.root-tabs-check.json` TypeScript check가 통과했다.
- `xcrun simctl list devices booted`는 CoreSimulatorService connection invalid/refused로 실패해 live iPhone simulator 확인은 수행하지 못했다.
- production code 변경 없음.
- 연결 context: `context/context_20260514_ac6_bottom_navigation_preservation.md`
