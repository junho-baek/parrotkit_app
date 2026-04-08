# 배경

레시피 상세 화면의 analysis/recipe drawer는 헤더 카피가 길고, drawer 내부에서 다음 액션으로 이어지는 흐름이 느렸다. analysis drawer에서 recipe script로 바로 전환하고, recipe script에서 Parrot AI 편집 drawer로 넘어가는 빠른 액션이 필요했다.

# 목표

- analysis drawer 헤더를 더 compact하게 정리한다.
- analysis drawer 안에서 `View Your Script`로 바로 recipe script drawer를 연다.
- recipe script drawer를 50% 높이의 drawer 톤으로 맞춘다.
- recipe script drawer 상단에 `Edit with Parrot AI` 액션을 둬서 agent drawer를 바로 연다.

# 범위

- 레시피 상세 scene drawer UI
- analysis/recipe script drawer 헤더 및 상단 액션
- drawer 높이 및 backdrop 정리

# 변경 파일

- `src/components/common/RecipeResult.tsx`
- `plans/20260408_recipe_drawer_top_toggles.md`
- `context/context_20260408_recipe_drawer_top_toggles.md`

# 테스트

- 로컬 수동 확인 예정
- `build` 미실행

# 롤백

- `RecipeResult.tsx`의 drawer header/action row와 높이 변경을 되돌리면 된다.

# 리스크

- active tab 전환과 drawer open 상태를 같이 바꾸므로 상태 전환이 꼬일 수 있다.
- backdrop을 투명하게 맞춘 만큼 특정 클릭 영역 충돌이 있을 수 있다.

# 결과

- analysis drawer 헤더를 `#scene` 기준으로 축약
- `View Your Script` 액션 추가
- recipe drawer를 50% 높이로 정리
- `Edit with Parrot AI` 액션 추가
- 연결 context: `context/context_20260408_recipe_drawer_top_toggles.md`
