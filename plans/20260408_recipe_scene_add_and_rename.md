# 배경

레시피 장면 카드가 현재는 분석 결과를 보는 구조에 가까워서 사용자가 직접 새 장면을 추가하고, 제목을 바꾸고, 실행용 shot plan으로 재구성하기에 불편했다. 특히 사용자 추가 scene은 reference 없이 `Recipe / Shooting`만 가지는 편이 더 자연스럽다.

# 목표

- 레시피 목록 하단 중앙에 새 장면 추가 `+` 플로팅 버튼을 둔다.
- 새로 추가한 scene은 reference analysis 없이 `Recipe / Shooting`만 사용하게 한다.
- 기존 scene과 새 scene 모두 제목을 수정할 수 있게 한다.
- 카드 헤딩은 전략 라벨보다 사용자 제목을 우선으로 보여준다.

# 범위

- 레시피 목록 카드 UI
- scene 추가 로직
- scene 제목 편집 로직
- detail 탭에서 custom scene의 tab 노출 제어

# 변경 파일

- `src/components/common/RecipeResult.tsx`
- `plans/20260408_recipe_scene_add_and_rename.md`
- `context/context_20260408_recipe_scene_add_and_rename.md`

# 테스트

- 로컬 수동 확인 예정
- `build` 미실행

# 롤백

- `RecipeResult.tsx`의 scene 생성, 제목 편집, custom scene tab 분기, 중앙 `+` 버튼 변경을 되돌리면 된다.

# 리스크

- custom scene을 빈 analysis로 저장하므로 legacy UI가 analysis 존재를 가정하는 부분이 있으면 어긋날 수 있다.
- 제목 입력과 카드 클릭이 같은 영역에 있어 이벤트 전파 누락 시 상세 진입이 함께 일어날 수 있다.

# 결과

- 하단 중앙 `+` 버튼 추가
- 새 custom scene 생성 및 즉시 recipe 모드 진입
- 카드/상세 헤더에서 scene 제목 수정 가능
- custom scene은 `Recipe / Shooting`만 노출
- 연결 context: `context/context_20260408_recipe_scene_add_and_rename.md`
