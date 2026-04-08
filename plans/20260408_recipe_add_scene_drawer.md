# 배경

레시피 목록 하단 `+` 버튼으로 새 scene을 만들 때 바로 상세 화면으로 들어가 버려서, 사용자가 현재 보고 있던 리스트 컨텍스트를 잃었다. 새 custom scene 생성은 목록 페이지 안에서 drawer/popup으로 처리하는 편이 더 자연스럽다.

# 목표

- `+` 버튼을 눌렀을 때 리스트 페이지를 벗어나지 않게 한다.
- 하단 create drawer에서 제목을 정하고 새 scene을 만든다.
- 새로 만든 custom scene에는 기본 `New cue` 하나가 포함되게 한다.

# 범위

- 레시피 목록 하단 `+` 버튼 동작
- custom scene 생성 drawer UI
- custom scene 기본 prompter block 초기값

# 변경 파일

- `src/components/common/RecipeResult.tsx`
- `plans/20260408_recipe_add_scene_drawer.md`
- `context/context_20260408_recipe_add_scene_drawer.md`

# 테스트

- 로컬 수동 확인 예정
- `build` 미실행

# 롤백

- `RecipeResult.tsx`의 create scene drawer 상태/오버레이/UI와 custom scene 기본 block 추가를 되돌리면 된다.

# 리스크

- create drawer와 기존 global chat FAB가 같은 화면 하단을 쓰므로 가시성 충돌 가능성이 있다.
- Enter/Escape 입력 흐름이 다른 drawer와 충돌하면 의도치 않게 close/create 될 수 있다.

# 결과

- `+` 클릭 시 create drawer 오픈
- 제목 입력 후 리스트 안에서 새 scene 생성
- custom scene 기본 cue `New cue` 포함
- 연결 context: `context/context_20260408_recipe_add_scene_drawer.md`
