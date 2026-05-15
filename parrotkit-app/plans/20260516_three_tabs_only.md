# Three Tabs Only

## 배경
Seed issue 6의 AC 1은 iPhone과 Android 하단 내비게이션이 사용자에게 Home, Explore, My 세 탭만 보여야 한다. 기존 Source와 Recipes route 파일은 유지하되 visible bottom tab contract에는 포함하지 않는다.

## 목표
- visible root tab contract를 Home, Explore, My 세 항목으로 고정한다.
- Source와 Recipes가 visible bottom tab contract에 들어오면 검증에서 실패하게 한다.
- Expo native tab 렌더링에 연결되는 설정만 최소 범위로 확인한다.

## 범위
- `src/core/navigation/root-tab-config.ts`
- `src/core/navigation/root-tab-config.test.ts`
- `tsconfig.root-tabs-check.json`
- Home copy, native tab styling, hidden legacy tab 세부 동작은 sibling AC 범위이므로 건드리지 않는다.

## 변경 파일
- `plans/20260516_three_tabs_only.md`
- `src/core/navigation/root-tab-config.test.ts`
- `context/context_20260516_three_tabs_only.md`

## 테스트
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts`

## 롤백
- `src/core/navigation/root-tab-config.test.ts`의 추가 assertion을 제거하고 이 plan/context 문서를 삭제한다.

## 리스크
- 실제 iOS/Android 시뮬레이터 캡처는 전체 Issue 6 통합 QA 범위이며, 이 AC에서는 code contract와 focused validation으로 제한한다.

## 결과
- `src/core/navigation/root-tab-config.test.ts`에 visible tab count/order/user-facing label contract를 추가했다.
- 현재 visible root tab list는 `index`, `explore`, `my`이며, user-facing English labels는 Home, Explore, My로 고정 검증된다.
- focused TypeScript와 executable contract check는 통과했다.
- `npx -y @google/design.md lint DESIGN.md`는 npm registry DNS 차단으로 실행 완료하지 못했다.
- 연결 context: `context/context_20260516_three_tabs_only.md`
