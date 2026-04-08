# Prompter / Recipe 인라인 Cue 편집 통합 계획

## 배경
현재 `Recipe` 탭과 `Prompter` 탭이 같은 cue 데이터를 쓰지만, 추가 버튼 형태, 색 표현, 편집 방식, 보조 카피 노출이 서로 달라 사용감이 분리되어 있습니다. 사용자는 두 화면 모두 같은 `+` 추가 경험과 색 체계, 더블클릭 직접 수정 UX를 원합니다.

## 목표
`Recipe`와 `Prompter`에서 cue 추가/색상/수정 경험을 통일하고, 라벨/보조 카피 없이 cue 내용 자체만 보이도록 정리합니다.

## 범위
- `src/components/common/RecipeResult.tsx`에서 recipe cue 편집을 input 박스 대신 동일 카드 안 직접 편집 형태로 전환
- `src/components/common/CameraShooting.tsx`에서 prompter overlay cue 추가 버튼을 `Recipe`와 같은 `+` 형태로 정리
- `src/components/common/CameraShooting.tsx`에서 cue 라벨/보조 카피 제거 및 recipe accent color 반영
- `src/components/common/CameraShooting.tsx`에서 더블클릭 직접 수정 지원

## 변경 파일
- `plans/20260408_prompter_recipe_inline_cue_edit.md`
- `src/components/common/RecipeResult.tsx`
- `src/components/common/CameraShooting.tsx`
- `context/context_20260408_prompter_recipe_inline_cue_edit.md` (작업 후 기록)

## 테스트
- 별도 실행 검증은 사용자 요청 시 진행

## 롤백
- recipe/prompter cue 편집을 각자 분리된 기존 UI로 복원

## 리스크
- prompter overlay에서 직접 수정과 드래그가 같이 존재하므로, 더블클릭과 이동 제스처가 매우 빠르게 섞일 때 체감이 달라질 수 있습니다.

## 결과
- `Prompter` 하단의 `Layout` 버튼을 recipe와 같은 `+` 버튼으로 바꾸고, 누르면 새 cue가 바로 추가되도록 정리했습니다.
- prompter overlay 블록은 라벨 없이 내용만 보이게 했고, recipe에서 지정한 accent color를 그대로 반영하도록 맞췄습니다.
- `Recipe`와 `Prompter` 모두 더블클릭 시 별도 input box 대신 같은 카드 안에서 직접 수정하는 방식으로 통일했습니다.
- 연결 context는 `context/context_20260408_prompter_recipe_inline_cue_edit.md`에 기록했습니다.
