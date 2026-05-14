# Profile Saved Takes Access

## 배경

- Sub-AC 17.3.2 requires saved takes to be reachable and selectable from the My/Profile saved recipes/takes entry point.
- Home already exposes saved takes and routes them into the recipe cut board with the selected take active.
- My/Profile currently shows settings, language, stats, and liked references, but does not expose saved recipes or saved takes.

## 목표

- Add My/Profile entry points for saved recipes and saved takes.
- Ensure selecting a saved take from My/Profile routes to the same recipe cut board/take selection contract used by Home.
- Keep the v1 scope local/mock-only and focused on settings, language, Pro status, saved recipes, and saved takes.

## 범위

- Profile screen UI and navigation.
- Focused route helper contract for My/Profile saved-take selection.
- App language copy needed by the Profile surface.

## 변경 파일

- `src/features/profile/screens/profile-screen.tsx`
- `src/features/recipes/lib/saved-take-home-access.ts`
- `src/features/recipes/lib/saved-take-home-access.test.ts`
- `src/core/i18n/app-language.tsx`
- `context/context_20260514_profile_saved_takes_access.md`

## 테스트

- Red/green focused TypeScript validation with `tsconfig.saved-take-home-access-check.json`.
- Full TypeScript verification with `tsconfig.json` if feasible.

## 롤백

- Remove the Profile saved recipes/takes sections and helper alias.
- Revert Profile copy additions.
- Remove this context entry.

## 리스크

- The worktree contains sibling AC edits; keep this change scoped and do not revert unrelated files.
- Saved takes remain in-memory local/mock state as required for v1.

## 결과

- `getSavedTakeProfileAccessEntries()`를 추가해 My/Profile의 저장한 레시피/테이크 행이 같은 로컬 mock 상태에서 목적지 href를 만들도록 했다.
- My/Profile 화면에 저장한 레시피, 저장한 테이크, Pro 상태 섹션을 추가했다.
- 저장한 테이크 행 선택 시 `/recipe/:recipeId?sceneId=:cutOrSceneId&takeId=:takeId`로 이동해 기존 컷보드의 선택 테이크 복원 흐름을 재사용한다.
- 복잡한 stats/liked references 중심 영역은 v1 My/Profile 범위에 맞춰 숨기고 settings/language/Pro/saved recipes/saved takes 중심으로 정리했다.
- 연결 context: `context/context_20260514_profile_saved_takes_access.md`
