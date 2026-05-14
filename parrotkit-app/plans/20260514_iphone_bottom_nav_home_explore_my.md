# iPhone Bottom Nav Home Explore My

## 배경
ParrotKit v1 내비게이션은 광범위한 5-tab prototype이 아니라 creator workflow 중심의 단순 하단 탭 모델로 맞춘다.

## 목표
- iPhone simulator 하단 내비게이션에 Home, Explore, My만 노출되는지 확인한다.
- Source와 Recipes를 bottom tab으로 복원하지 않는다.

## 범위
- `src/core/navigation/root-native-tabs.tsx`의 현재 bottom tab trigger 구성을 검증한다.
- 필요한 경우에만 최소 수정한다.
- 웹 QA와 유료/API/upload 플로우 변경은 제외한다.

## 변경 파일
- `plans/20260514_iphone_bottom_nav_home_explore_my.md`
- `context/context_20260514_iphone_bottom_nav_home_explore_my.md`
- 필요 시 `src/core/navigation/root-native-tabs.tsx`

## 테스트
- 정적 확인으로 `NativeTabs.Trigger` name이 `index`, `explore`, `my`뿐인지 검증한다.
- 가능한 경우 iPhone simulator에서 앱 하단 탭 표시를 확인한다.

## 롤백
- 문서 변경은 해당 plan/context 파일을 제거하면 된다.
- 코드 변경이 발생하면 `root-native-tabs.tsx`의 해당 변경만 되돌린다.

## 리스크
- Expo Router native tabs가 trigger 없는 route를 자동 노출하는 동작이 있다면 simulator에서 추가 확인이 필요하다.
- 현재 worktree에는 sibling/session 변경이 많으므로 unrelated 변경을 건드리지 않는다.

## 결과
- `src/core/navigation/root-native-tabs.tsx`의 `NativeTabs.Trigger`가 `index`, `explore`, `my`뿐임을 확인했다.
- `Source`와 `Recipes`는 bottom tab trigger로 복원하지 않았다.
- `src/core/navigation/root-tab-config.test.ts`의 negative include assertion을 `readonly string[]` view로 넓혀 focused TypeScript contract가 컴파일되게 보정했다.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json` 통과.
- `xcrun simctl`은 CoreSimulatorService 연결 실패로 실행할 수 없었고, Computer Use Simulator 접근도 승인 거부되어 live simulator UI 확인은 수행하지 못했다.
- 연결 context: `context/context_20260514_iphone_bottom_nav_home_explore_my.md`
