# Cut Goal / Prompter Cue Refinement

## 배경
- 레시피 화면에서 `Appeal Point`와 `Recommended Script`가 의미상 겹쳐 보인다.
- 프롬프터는 block visible/size/preset 조정은 가능하지만, 레시피 화면에서 어떤 요소를 띄울지 고르는 흐름이 약하다.
- 촬영용 오버레이는 더 직접적으로 확대/축소되고, 웹에서는 인스타 스토리처럼 손잡이로 크기를 조절하는 감각이 필요하다.
- Scene Planner 응답은 구조화 이후 짧아져서 “무엇을 어떻게 바꿨는지” 설명 밀도가 낮아졌다.

## 목표
- `Appeal Point`를 `Cut Goal`로 재정의하고, 스크립트와 구분되는 역할로 분리한다.
- 레시피 화면에서 짧은 cue 목록을 체크해 프롬프터 표시 여부를 토글할 수 있게 한다.
- 프롬프터 오버레이에 pinch zoom과 웹 corner resize를 추가한다.
- Scene Planner의 assistant message를 다시 더 설명적으로 만든다.

## 범위
- `src/types/recipe.ts`
- `src/lib/recipe-scene.ts`
- `src/app/api/analyze/route.ts`
- `src/app/api/chat/route.ts`
- `src/components/common/RecipeResult.tsx`
- `src/components/common/CameraShooting.tsx`

## 변경 파일
- scene/prompter block 타입 확장 (`label`, `scale`)
- default prompter cue block 풍부화
- analyze/chat prompt와 scene update 요약 개선
- recipe 화면의 `Cut Goal`/`Prompter Picks` UI 추가
- prompter overlay pinch/resize 인터랙션 추가

## 테스트
- `npx eslint src/components/common/RecipeResult.tsx src/components/common/CameraShooting.tsx src/app/api/chat/route.ts src/app/api/analyze/route.ts src/lib/recipe-scene.ts src/types/recipe.ts`
- `npm run dev`
- 로컬 브라우저에서 recipe detail:
  - `Cut Goal` 라벨/카피 확인
  - `Prompter Picks` 토글 시 overlay 반영 확인
  - Prompter에서 drag / pinch / resize handle 동작 확인
  - Scene Planner 응답 문구 확인

## 롤백
- cue block 확장이 불안정하면 `label/scale`을 제거하고 기존 prompter block만 유지한다.
- pinch/resize가 충돌하면 drag-only로 되돌리고 layout panel 조정만 남긴다.

## 리스크
- pointer / touch 이벤트가 드래그와 resize, pinch 사이에서 충돌할 수 있다.
- analyze 결과가 여전히 약하면 `Cut Goal`과 `Script` 중복이 일부 남을 수 있다.
- 새 cue block이 많아지면 recipe 저장 payload가 커질 수 있다.

## 결과
- 완료
- `Appeal Point`를 `Cut Goal` 라벨과 역할로 재정의했다.
- analyze/chat 프롬프트에 cut goal과 script 분리 규칙을 추가했다.
- `Recipe` 탭에 `Prompter Picks` 섹션을 추가해 cue를 체크하면 프롬프터 표시 여부가 바로 반영되게 했다.
- prompter block은 `label`, `scale`을 갖게 했고 richer cue block 세트를 기본 생성하도록 확장했다.
- `Prompter` 화면에 pinch zoom, web corner resize, scale slider를 추가했다.
- Scene Planner는 `appealPoint`까지 수정 가능하고, assistant message가 더 설명형이 되도록 조정했다.

## 연결 context
- `context/context_20260407_074653_cut_goal_prompter_cues.md`
