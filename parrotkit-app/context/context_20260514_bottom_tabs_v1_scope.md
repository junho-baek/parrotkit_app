# Context 2026-05-14 Bottom Tabs V1 Scope

## 작업
ParrotKit v1 하단 탭 범위를 Home, Explore, My/Profile로 제한했다.

## 변경
- `src/core/navigation/root-native-tabs.tsx`
  - Source 탭 trigger 제거
  - Recipes 탭 trigger 제거
  - Home, Explore, My/Profile trigger 유지

## 검증
- `npm run`으로 사용 가능한 스크립트를 확인했다. 현재 `lint`, `test`, `typecheck`, `build` 스크립트는 없다.
- 이 worktree에는 `node_modules`가 없어 TypeScript/Expo 실행 검증은 수행하지 못했다.
- 정적 확인으로 `root-native-tabs.tsx`에 남은 `NativeTabs.Trigger`가 `index`, `explore`, `my`뿐임을 확인했다.
- `src/app/(tabs)/source.tsx`, `src/app/(tabs)/recipes.tsx` 파일은 유지되어 route 파일 삭제로 인한 경로 단절은 만들지 않았다.

## 참고
- Expo Router native tabs 문서 기준으로 tab bar에서 제거하려는 route는 `NativeTabs.Trigger`를 제거하는 방식이 지원된다.
