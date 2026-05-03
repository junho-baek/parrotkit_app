# Recipe Prompter Controls

## 배경
- 사용자는 레시피 촬영 화면에서도 퀵슛처럼 프롬프터를 촬영 중 수정하고, 크기를 줄이거나 추가할 수 있기를 원한다.
- 추가로 프롬프터 불투명도 조절과 보기/안보기를 요청했다.
- 현재 레시피 촬영 화면은 `Action / SAY NOW / NEXT` 코치형 오버레이만 보여주며, 퀵슛의 draggable/editable cue block과 toolbar를 쓰지 않는다.

## Frontend Thesis
- Visual thesis: 촬영 화면의 핵심 문장은 유지하되, 퀵슛과 같은 작은 floating toolbar로 편집 기능을 제공해 촬영 중 인지 부담을 낮춘다.
- Content plan: 레시피 씬의 기존 prompter blocks를 editable overlay로 띄우고, 하단 촬영 컨트롤 옆에 추가/수정/크기/불투명도/숨김/복구를 제공한다.
- Interaction thesis: cue를 탭하면 선택, 더블탭/연필로 수정, +/-로 크기, opacity 버튼으로 투명도, 눈 아이콘으로 숨김/복구가 가능하게 한다.

## 목표
- 레시피 촬영 화면에 퀵슛의 editable prompter block overlay를 적용한다.
- 레시피 씬별 prompter block state를 관리하고 씬 전환 시 해당 씬의 block을 보여준다.
- cue 추가, 수정, 크기 조절, 숨김/복구를 지원한다.
- cue 불투명도 조절을 추가한다.
- 기존 촬영/리뷰/take tray/scene switcher 흐름은 유지한다.

## 범위
- `parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- `parrotkit-app/src/features/recipes/components/native-prompter-toolbar.tsx`
- `parrotkit-app/src/features/recipes/components/native-prompter-block-overlay.tsx`
- `parrotkit-app/src/features/recipes/lib/prompter-layout.ts`
- `parrotkit-app/src/features/recipes/types/recipe-domain.ts`
- 타입 기반 검증 파일

## 변경 파일
- `plans/20260503_recipe_prompter_controls.md`
- `parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- `parrotkit-app/src/features/recipes/components/native-prompter-toolbar.tsx`
- `parrotkit-app/src/features/recipes/components/native-prompter-block-overlay.tsx`
- `parrotkit-app/src/features/recipes/lib/prompter-layout.ts`
- `parrotkit-app/src/features/recipes/lib/prompter-layout.test.ts`
- `parrotkit-app/src/features/recipes/types/recipe-domain.ts`
- `context/context_20260503_recipe_prompter_controls.md`

## 테스트
- RED: `cd parrotkit-app && npx tsc --noEmit`로 새 prompter helper import 실패 확인
- GREEN: `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`
- Metro/simulator에서 `/recipe/recipe-airfryer-stack/prompter` 또는 `/recipe/recipe-korean-diet-hook/prompter` 확인

## 롤백
- Recipe camera screen에서 editable block overlay와 toolbar 연결을 제거하고 `CameraCoachOverlay`만 렌더링하도록 되돌린다.
- `opacity` 타입/헬퍼/toolbar 변경을 제거한다.

## 리스크
- 현재 변경은 로컬 화면 state 기반이며 실제 레시피 데이터 저장까지는 하지 않는다.
- 촬영 중 UI가 너무 많아질 수 있으므로 기본은 현재 씬의 prompter blocks만 보여주고, 코치 overlay는 숨김 상태일 때 fallback으로 남긴다.

## 결과
- 레시피 촬영 화면에 퀵슛과 같은 editable prompter block overlay를 연결했다.
- 씬별 prompter block 상태를 로컬로 관리하고, 씬 전환 시 해당 씬의 cue만 보여주도록 했다.
- cue 추가, 문장 수정 요청, 크기 조절, 색상 변경, 숨김/복구, 불투명도 조절을 지원했다.
- Quick Shoot toolbar에도 같은 불투명도 조절 버튼을 추가해 UX를 맞췄다.
- 검증: `cd parrotkit-app && npx tsc --noEmit`, `git diff --check`.
- 로컬 QA: Metro 8081을 다시 띄우고 iPhone 17 Pro에서 `/recipe/recipe-korean-diet-hook/prompter` 화면 확인.
- 연결 context: `context/context_20260503_recipe_prompter_controls.md`
