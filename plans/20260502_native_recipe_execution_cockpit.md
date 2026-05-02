# Native Recipe Execution Cockpit Implementation Plan

## 배경
- 사용자는 ParrotKit의 핵심 가치가 홈/탐색이 아니라 레시피 실행 화면에서 결정된다고 피드백했다.
- 현재 recipe detail과 scene detail은 구조적으로는 동작하지만, 촬영자가 “무엇을 어떤 순서로 어떻게 찍을지”를 바로 확신하기에는 문서형 정보에 가깝다.
- 목표 흐름은 `Recipe Detail → Scene Timeline → Scene Workspace(Watch/Plan/Shoot) → Camera Prompter`다.

## Frontend Thesis
- Visual thesis: 흰 배경 앱 흐름을 유지하되, 실행 화면 안에서는 촬영 조종석처럼 정보 계층이 또렷하고 행동이 바로 보이는 creator cockpit으로 만든다.
- Content plan: recipe overview는 촬영 준비 요약과 scene timeline, scene workspace는 Watch/Plan/Shoot, camera는 Action/Say/Next 중심 prompter로 정리한다.
- Interaction thesis: scene card에서 바로 scene workspace로 들어가고, workspace tabs는 실행형 copy로 바뀌며, camera에서는 여러 cue가 같은 비중으로 떠 있지 않고 현재 말할 문장이 가장 크게 보인다.

## 목표
- Recipe detail의 scene list를 “촬영 타임라인”으로 바꾸고, 각 씬의 시간/역할/행동/말할 문장/바로 촬영 CTA를 노출한다.
- Scene detail tab 이름을 `Watch / Plan / Shoot`로 바꾼다. 한국어는 `예시 / 준비 / 촬영`으로 보여준다.
- Watch tab은 예시 영상 플레이어, timeline marker, why/copy/avoid 정보를 제공한다.
- Plan tab은 Scene Goal, Creator Direction, Prompter Lines, On-screen Text, Brand Notes, Tone Variants를 제공한다.
- Shoot tab은 pre-shoot checklist와 shot guide를 제공하고 camera로 이어진다.
- Camera prompter는 Action cue, SAY NOW, Next line, scene progress가 명확한 촬영 코치형 overlay를 우선 노출한다.

## 범위
- `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
- `parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- 문서 기록

## 변경 파일
- `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
- `parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- `plans/20260502_native_recipe_execution_cockpit.md`
- `context/context_20260502_native_recipe_execution_cockpit.md`

## 구현 단계
1. Recipe detail overview에 filming prep summary와 upgraded scene timeline card를 추가한다.
2. Scene workspace의 tab label을 language-aware `Watch/Plan/Shoot` / `예시/준비/촬영`으로 바꾸고 scene header를 촬영 맥락 중심으로 정리한다.
3. Watch tab을 reference player + insight/timeline/copy/avoid blocks로 교체한다.
4. Plan tab을 shooting brief card로 교체한다.
5. Shoot tab을 pre-shoot checklist + start shooting CTA로 교체한다.
6. Camera screen에 coach prompter overlay를 추가하고 기존 다중 floating cue보다 Action/Say/Next 계층이 우선 보이게 한다.

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`
- Metro reload 후 simulator에서 다음 화면 캡처 확인:
  - recipe detail timeline
  - scene workspace Watch/Plan/Shoot
  - camera prompter

## 롤백
- Recipe detail의 selected scene rendering을 이전 `SceneAnalysisPanel`/`SceneRecipePanel` 중심 구조로 되돌린다.
- Camera screen의 coach overlay를 제거하고 `NativePrompterBlockOverlay` 중심 렌더링을 복구한다.

## 리스크
- 이번 패스는 mock data에서 파생한 brand/prep/caption 정보를 UI에 노출한다. 실제 브랜드 브리프 데이터 모델은 후속으로 Supabase schema에 반영해야 한다.
- Camera의 기존 draggable cue 편집 기능과 새 coach overlay의 역할이 겹칠 수 있어, 이번에는 촬영 중 인지 부담을 줄이는 쪽을 우선한다.

## 결과
- Recipe detail overview에 `Ready-to-shoot brief`와 upgraded `Scene timeline`을 추가했다.
- 씬 카드가 시간, 역할(Hook/Proof/CTA), 행동 지시, 말할 문장, workspace CTA, scene shooting CTA를 함께 보여준다.
- Scene workspace tab을 `Watch / Plan / Shoot`로 변경하고 한국어 설정에서는 `예시 / 준비 / 촬영`으로 표시되게 했다.
- Watch tab은 reference clip, timeline progress, why/copy/avoid 중심으로 재구성했다.
- Plan tab은 Scene Goal, Creator Direction, Prompter Lines, On-screen Text, Brand Notes, Tone Variants가 있는 shooting brief로 바꿨다.
- Shoot tab은 shot guide, before-recording checklist, show/avoid, Start Shooting CTA를 제공한다.
- Camera Prompter는 기존 여러 cue 박스 대신 Action / SAY NOW / NEXT 계층이 명확한 coach overlay로 재구성했다.

## 검증
- 2026-05-03 00:20 KST `cd parrotkit-app && npx tsc --noEmit` 통과
- 2026-05-03 00:20 KST `git diff --check` 통과
- Simulator/Metro 캡처:
  - `output/playwright/native_recipe_execution_overview_after_reload.png`
  - `output/playwright/native_recipe_execution_watch.png`
  - `output/playwright/native_recipe_execution_plan.png`
  - `output/playwright/native_recipe_execution_shoot.png`
  - `output/playwright/native_recipe_execution_camera_prompter.png`

## 연결 context
- `context/context_20260502_native_recipe_execution_cockpit.md`
