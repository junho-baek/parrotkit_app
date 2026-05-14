# Home Recent Workflow Resolution

## 배경
ParrotKit v1 Home은 넓은 5-tab 프로토타입이 아니라 creator workflow 중심의 첫 화면이어야 한다. Home의 첫 카드가 어떤 레시피/보드를 이어갈지 기존 로컬 앱 상태에서 일관되게 결정하는 계약이 필요하다.

## 목표
- Home이 가장 최근 또는 진행 중인 workflow를 어떻게 고르는지 명시한다.
- 진행 중인 owned recipe를 우선하고, 진행 중인 항목이 없으면 최근 owned/다운로드 recipe를 사용한다.
- broad catalog 인기순이나 Source/Recipes tab 복원 없이 기존 Home surface만 최소 수정한다.

## 범위
- Home 전용 workflow 선택 helper 추가 또는 보강.
- Mock workspace provider와 Home surface가 같은 선택 계약을 사용하도록 연결.
- focused TypeScript 검증 추가.

## 변경 파일
- `plans/20260514_home_recent_workflow_resolution.md`
- `src/features/home/lib/home-workflow-resolution.ts`
- `src/features/home/lib/home-workflow-resolution.test.ts`
- `src/core/providers/mock-workspace-provider.tsx`
- `src/features/home/components/home-workspace-surface.tsx`
- `tsconfig.home-workflow-resolution-check.json`
- `context/context_20260514_home_recent_workflow_resolution.md`

## 테스트
- RED: 새 focused tsconfig로 Home workflow resolver 테스트가 helper 부재/계약 미구현으로 실패하는지 확인한다.
- GREEN: 같은 focused tsconfig 통과.
- 필요 시 전체 `tsc --noEmit --pretty false -p tsconfig.json`로 기존 타입 회귀를 확인한다.

## 롤백
- 추가 helper/test/tsconfig/context/plan 파일을 제거하고, provider/Home surface import 및 selector 호출을 이전 상태로 되돌린다.

## 리스크
- mock timestamp가 사람이 읽는 문자열이라 절대 시간 정렬은 제한적이다. 이 작업은 현재 로컬 state array 순서와 명시적 in-progress status를 기준으로 최소 정의한다.
- simulator QA gate 자체는 후속 AC에서 수행될 수 있으며, 이번 sub-AC는 선택 계약과 타입 검증에 집중한다.

## 결과
- `src/features/home/lib/home-workflow-resolution.ts`를 추가해 Home workflow 선택 계약을 분리했다.
- Home workflow 대상은 `owned`, `downloaded`, `remixed` recipe 중 `draft`가 아닌 항목으로 제한한다.
- primary workflow는 현재 배열 순서 기준 첫 `continue` 항목을 우선하고, 없으면 첫 최근 local creator workflow로 fallback한다.
- community catalog recipe와 Source draft는 Home primary/recent workflow 대상에서 제외한다.
- `MockWorkspaceProvider`의 `getContinueShootRecipe` / `getLatestShootableRecipe`가 Home resolver를 사용하도록 연결했다.

## 연결 context
- `context/context_20260514_home_recent_workflow_resolution.md`
