# Context 2026-05-14 iPhone Bottom Nav Home Explore My

## 작업
AC 1: iPhone simulator bottom nav가 Home, Explore, My만 표시해야 한다.

## 확인
- `src/core/navigation/root-native-tabs.tsx` 현재 구현은 `NativeTabs.Trigger`를 `index`, `explore`, `my` 세 개만 렌더링한다.
- 각 trigger label은 `copy.nav.home`, `copy.nav.explore`, `copy.nav.my`에 연결되어 있다.
- `Source`와 `Recipes` trigger는 없고, route 파일 `src/app/(tabs)/source.tsx`, `src/app/(tabs)/recipes.tsx`는 경로 보존을 위해 남아 있다.

## 변경
- production code 변경 없음. 이전 session의 bottom-tab fix를 보존했다.
- `src/core/navigation/root-tab-config.test.ts`의 negative include assertion이 좁은 literal tuple 타입 때문에 TypeScript 오류를 내던 문제를 `readonly string[]` view로 넓혀 보정했다.

## 검증
- 정적 contract 확인:
  - `root-native-tabs.tsx`에서 추출한 trigger name 결과: `["index","explore","my"]`
- TypeScript:
  - `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json` 통과
- iPhone simulator:
  - `xcrun simctl list devices booted`가 CoreSimulatorService `Connection refused` / `connection became invalid`로 실패했다.
  - live simulator UI 확인은 수행하지 못했다.

## 리스크
- 실제 simulator 접근이 차단되어 스크린샷 기반 acceptance evidence는 남기지 못했다.
- 다만 NativeTabs shell의 visible trigger source는 Home, Explore, My로 제한되어 있어 AC 1 코드 계약은 충족한다.
