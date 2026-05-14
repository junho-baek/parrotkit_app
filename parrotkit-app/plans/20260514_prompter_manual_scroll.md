# Prompter Manual Scroll

## 배경

ParrotKit v1 prompter must support manual scrolling while keeping automatic speed control and pinch zoom deferred.

## 목표

Enable users to manually scroll prompter copy during shooting from the existing recipe prompter camera screen.

## 범위

- Add local/manual scroll state for the camera prompter.
- Render the line-to-say content inside a manually scrollable area.
- Add focused controls for small manual scroll steps and reset.

## 변경 파일

- `src/features/recipes/lib/prompter-scroll.ts`
- `src/features/recipes/lib/prompter-scroll.test.ts`
- `src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- `context/context_20260514_prompter_manual_scroll.md`

## 테스트

- Red/green compile check for the prompter scroll helper.
- TypeScript no-emit verification.

## 롤백

Remove the scroll helper/test and restore the prompter camera screen to static `LINE TO SAY` rendering.

## 리스크

- Native camera preview cannot be fully exercised from TypeScript checks.
- Other agents may edit nearby prompter controls, so changes should stay in the camera screen and a small helper.

## 결과

- `LINE TO SAY` prompter copy now renders in a bounded native `ScrollView`.
- Users can manually drag-scroll the prompter copy and use up/down/reset controls for step scrolling.
- Scroll position resets when switching cuts/scenes so users return to the top of the next prompt.
- Linked context: `context/context_20260514_prompter_manual_scroll.md`
