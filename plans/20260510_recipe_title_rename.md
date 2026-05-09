# Recipe Title Rename Plan

## 배경
- Blank recipe는 사용자가 직접 scene을 추가하는 흐름으로 바뀌었다.
- 이 경우 초기 title이 자동 조합된 값이므로 사용자가 shoot board에서 바로 이름을 바꿀 수 있어야 한다.
- 사용자는 상단 바 title 클릭 편집 방식을 제안했다.

## 목표
- Shoot board 상단 title을 눌러 recipe 이름을 수정할 수 있게 한다.
- 수정된 title은 현재 board뿐 아니라 mock workspace recipe 상태와 recent reference에도 반영한다.

## 범위
- In scope:
  - mock workspace title update API 추가
  - recipe detail header title press interaction 추가
  - title rename modal 추가
  - 관련 테스트/타입체크 및 context 기록
- Out of scope:
  - 서버 저장/동기화
  - title 중복 검증
  - recipe create drawer에서 title 직접 입력 UI 추가

## 변경 파일
- Modify: `parrotkit-app/src/core/providers/mock-workspace-provider.tsx`
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
- Add/Modify: `context/context_20260510_recipe_title_rename.md`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`
- iOS Simulator에서 title tap → rename → header title 변경 확인

## 롤백
- Header rename modal과 provider `updateRecipeTitle` API를 제거한다.
- Header title을 기존 read-only layout으로 되돌린다.

## 리스크
- 현재 구현은 mock workspace state 전용이므로 앱 재시작 후에는 유지되지 않는다.

## 결과
- Shoot board header title을 pressable로 바꾸고 pencil affordance를 추가했다.
- Title tap 시 rename modal을 열고, 저장 시 board title과 mock workspace recipe title을 함께 업데이트한다.
- Recent reference title도 같은 `recipeId` 기준으로 업데이트한다.
- Context 기록: `context/context_20260510_recipe_title_rename.md`
