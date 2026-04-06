# Context - Cut Goal / Prompter Cue Refinement

## 작업 요약
- `Recipe` 탭의 `Appeal Point` 라벨을 `Cut Goal`로 바꿨다.
- `Cut Goal`이 대사와 겹치지 않도록 analyze/chat 프롬프트에 “scene role / persuasion job” 규칙을 추가했다.
- scene assistant는 이제 `appealPoint`까지 수정할 수 있고, `assistant_message`도 변경 내용을 더 자세히 설명하도록 바꿨다.
- 프롬프터 block에 `label`, `scale` 필드를 추가했다.
- 기본 프롬프터 cue를 richer block 세트로 확장했다.
  - `Main Script`
  - `Script Point`
  - `Motion Point`
  - `Product Point`
  - `Problem Point`
  - `Scene Role`
  - `Cut Goal`
  - `Required Cue`
  - `Mood`
  - `Action`
  - `Avoid Cue`
  - `CTA`
- `Recipe` 탭에서 `Prompter Picks` 섹션을 추가해 cue를 체크/해제하면 바로 프롬프터 표시 여부가 바뀌게 했다.
- `Prompter` 화면에 오버레이 pinch zoom, web corner resize, scale slider를 추가했다.
- legacy/reopen scene도 기존 block만 쓰지 않고 새 fallback cue를 merge해서 바로 사용할 수 있게 했다.

## 주요 변경 파일
- `src/types/recipe.ts`
- `src/lib/recipe-scene.ts`
- `src/app/api/analyze/route.ts`
- `src/app/api/chat/route.ts`
- `src/components/common/RecipeResult.tsx`
- `src/components/common/CameraShooting.tsx`
- `plans/20260407_cut_goal_prompter_cues.md`

## 구현 메모
- `PrompterBlock`은 optional `label`, `scale`을 갖게 했고, normalize 시 기본 `scale=1`로 보정한다.
- `createDefaultPrompterBlocks()`는 이제 recipe + analysis + brandBrief + sceneTitle을 받아 richer cue block 세트를 만든다.
- `normalizePrompterBlocks()`는 기존 저장 block 위에 fallback cue block을 merge해서 old scene도 `Prompter Picks`를 바로 쓸 수 있게 했다.
- `RecipeResult`의 `Prompter Picks` 토글은 기존 `handleSceneBlocksChange()`를 재사용해 session 저장과 recipe PATCH를 같이 탄다.
- `CameraShooting`은 drag 외에
  - 터치 2점 pinch scale
  - 웹 리사이즈 핸들
  - layout panel range slider
  를 같이 지원한다.
- `Scene Planner`는 structured update를 유지하되 `assistant_message`를 더 설명형으로 만들도록 prompt를 조정했다.

## 검증
- `npx eslint src/components/common/RecipeResult.tsx src/components/common/CameraShooting.tsx src/app/api/chat/route.ts src/app/api/analyze/route.ts src/lib/recipe-scene.ts src/types/recipe.ts`
  - 기존 `RecipeResult.tsx`의 `<img>` warning만 남고 error 없음
- `npx tsc --noEmit --pretty false`
- `curl -I http://127.0.0.1:3000`
  - `200 OK`
- `npx tsx` smoke
  - `normalizeRecipeScene()` 결과에서 `Main Script`, `Cut Goal`, `Product Point`, `Problem Point`, `Avoid Cue` 등 cue block과 `scale=1` 생성 확인

## 남은 리스크
- 로컬 브라우저 자동화 도구가 레포에 없어 이번 턴은 UI를 headed browser로 직접 자동 검증하지 못했다.
- `Motion Point`나 `Problem Point`는 원본 입력 품질이 약하면 다소 generic하게 나올 수 있다.
- 프롬프터 pinch와 drag가 모바일 브라우저별 pointer/touch 구현 차이에서 미세하게 다르게 느껴질 가능성은 있다.
