# Recipe Create Blank No Scenes Plan

## 배경
- 사용자가 recipe create drawer의 niche 사진이 어색하다고 피드백했다.
- Blank 모드로 recipe를 생성해도 현재는 기본 scene들이 자동 생성된다.
- 사용자는 Blank 생성 후 shoot board에서 직접 scene을 추가하는 흐름을 원한다.

## 목표
- Niche 선택 UI에서 사진 썸네일을 제거하고 텍스트 중심 chip으로 정리한다.
- Blank 모드 생성 시 초기 scene이 없는 recipe를 만든다.
- 기존 Link/Brand 생성 흐름의 scene 자동 생성은 유지한다.

## 범위
- In scope:
  - recipe create niche chip UI 수정
  - unused niche asset 참조 제거
  - Blank 모드 recipe 생성 입력 수정
  - mock workspace draft 생성 로직의 empty scene 지원
  - 관련 테스트/타입체크 및 context 기록
- Out of scope:
  - Link/Brand 실제 Pro 권한 처리
  - 이미지 재생성
  - recipe detail empty state 대규모 디자인 변경

## 변경 파일
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-create-screen.tsx`
- Modify: `parrotkit-app/src/features/recipes/lib/recipe-create-flow.ts`
- Modify: `parrotkit-app/src/features/recipes/lib/recipe-create-visuals.ts`
- Modify: `parrotkit-app/src/core/providers/mock-workspace-provider.tsx`
- Delete: unused niche image assets under `parrotkit-app/assets/recipe-create/`
- Add/Modify: `context/context_20260510_recipe_create_blank_no_scenes.md`

## 테스트
- `cd parrotkit-app && npx tsx src/features/recipes/lib/recipe-create-flow.test.ts`
- `cd parrotkit-app && npx tsx src/features/recipes/lib/shoot-board-model.test.ts`
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`
- Simulator refresh/reinstall smoke check if local runtime needs it.

## 롤백
- Niche chip UI를 이전 thumbnail 포함 layout으로 되돌린다.
- Blank 생성 시 scene override를 제거해 기존 default scene 생성으로 되돌린다.
- 삭제한 niche asset 참조와 파일을 복원한다.

## 리스크
- Blank recipe가 scene 0개를 갖는 경우 detail/shoot board empty-state가 기존보다 더 자주 노출된다.
- 삭제한 niche assets가 다른 화면에서 참조되고 있으면 asset resolution 오류가 발생할 수 있으므로 `rg`로 참조를 확인한다.

## 결과
- Niche 선택 chip에서 모든 사진/thumbnail을 제거하고 text-only chip으로 정리했다.
- Goal card는 기존처럼 local bundled generated photo asset을 유지한다.
- Goal image source resolution은 local `require()`를 먼저 시도하고 Node/test 환경에서만 fallback URI를 쓰도록 바꿨다.
- Blank 모드 생성 시 `scenes: []`를 넘겨 shoot board가 0 cuts 상태로 열린다.
- Link/Brand 모드는 기존 scene seeding을 유지한다.
- Context 기록: `context/context_20260510_recipe_create_blank_no_scenes.md`
