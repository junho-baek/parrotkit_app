# Native Recipe Execution Cockpit Context

## 작업 시간
- 2026-05-03 00:21 KST

## 배경
- 사용자는 레시피 실행 화면이 ParrotKit의 핵심 경험이며, 현재 UI가 “AI가 정리한 문서”처럼 느껴진다고 피드백했다.
- 목표는 촬영자가 레퍼런스를 보고, 구조를 이해하고, 내 상황에 맞게 준비하고, 바로 촬영하는 실행형 cockpit으로 만드는 것이다.

## 변경 요약
- `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
  - Recipe detail overview에 `Ready-to-shoot brief`를 추가했다.
  - 준비 정보는 예상 촬영 시간, 장소, 얼굴 노출 여부, 제품 등장 타이밍, 브랜드 노트를 보여준다.
  - 기존 scene list를 shooting timeline card로 교체했다.
  - 각 scene card는 썸네일, 시간, 역할(Hook/Proof/CTA), 행동 지시, 말할 문장, workspace CTA, scene shooting CTA를 노출한다.
  - Scene workspace 탭을 `Analysis / Recipe / Shoot`에서 `Watch / Plan / Shoot`로 바꿨다. 한국어 설정에서는 `예시 / 준비 / 촬영`이다.
  - Watch tab은 reference clip mock player, why this works, copy this, avoid this로 구성했다.
  - Plan tab은 scene goal, creator direction, prompter lines, on-screen text, brand notes, tone variants로 구성했다.
  - Shoot tab은 shot guide, before-recording checklist, show/avoid, Start Shooting CTA로 구성했다.
  - `sceneId`와 `tab` query를 읽어 scene workspace direct QA가 가능하도록 했다.
- `parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
  - 기존 draggable cue 중심 overlay를 촬영 코치형 prompter로 재구성했다.
  - 화면 위계는 Action cue, SAY NOW, Next line, scene progress, Prev/Next cut, Record 중심이다.
  - 기존 scene take tray와 record/review/export 흐름은 유지했다.

## 검증
- `cd parrotkit-app && npx tsc --noEmit` 통과
- `git diff --check` 통과
- Metro status: `packager-status:running`
- Simulator screenshots:
  - `output/playwright/native_recipe_execution_overview_after_reload.png`
  - `output/playwright/native_recipe_execution_watch.png`
  - `output/playwright/native_recipe_execution_plan.png`
  - `output/playwright/native_recipe_execution_shoot.png`
  - `output/playwright/native_recipe_execution_camera_prompter.png`

## 리스크 / 후속
- Brand notes, product timing, face exposure 등은 현재 mock data와 recipe metadata에서 파생한다. 실제 브랜드 요청형 레시피에는 별도 brief data model이 필요하다.
- Camera coach overlay는 촬영 중 인지 부담을 줄이기 위해 draggable cue 편집 UI를 전면에서 내렸다. 추후 `Customize prompter`나 `Edit prompts` 진입점을 별도로 두는 편이 좋다.
- Reference clip은 현재 실제 비디오 플레이어가 아니라 이미지 기반 mock player다. 실제 reference video asset이 연결되면 marker overlay와 playback control을 붙이면 된다.
