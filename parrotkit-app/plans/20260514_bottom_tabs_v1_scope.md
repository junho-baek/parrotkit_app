# Bottom Tabs V1 Scope

## 배경
ParrotKit v1은 Home 중심 레시피 제작 흐름으로 재정렬한다. 하단 탭은 Home, Explore, My/Profile만 노출하고 Source와 Recipes는 최상위 탭에서 제거해야 한다.

## 목표
- 하단 탭에서 Source와 Recipes를 제거한다.
- 기존 `/source`, `/recipes` 경로 파일은 유지해 route integrity를 보존한다.
- Home, Explore, My/Profile 탭은 기존 동작을 유지한다.

## 범위
- Expo Router native tabs 구성만 수정한다.
- Source/Recipes 화면 구현, 데이터 모델, 상세 플로우는 변경하지 않는다.

## 변경 파일
- `src/core/navigation/root-native-tabs.tsx`

## 테스트
- `npm run lint` 또는 사용 가능한 TypeScript 검증 명령을 확인해 실행한다.
- 라우트 파일이 유지되는지 파일 목록과 타입 검증으로 확인한다.

## 롤백
- `root-native-tabs.tsx`에 Source/Recipes `NativeTabs.Trigger` 블록을 되돌리면 된다.

## 리스크
- NativeTabs가 route 파일을 자동 탭으로 노출하는 경우 별도 hide 옵션이 필요할 수 있다.
- Source/Recipes 경로에 의존하는 Home CTA는 이번 AC 범위에서는 보존한다.

## 결과
- `src/core/navigation/root-native-tabs.tsx`에서 Source와 Recipes `NativeTabs.Trigger`를 제거했다.
- 하단 탭의 visible trigger는 Home(`index`), Explore(`explore`), My/Profile(`my`)만 남았다.
- `/source`, `/recipes` route 파일은 삭제하지 않아 기존 경로 보존 여지를 유지했다.
- 연결 context: `context/context_20260514_bottom_tabs_v1_scope.md`
