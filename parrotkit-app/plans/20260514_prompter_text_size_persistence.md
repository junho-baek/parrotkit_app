# Prompter Text Size Persistence

## 배경

Sub-AC 14.3 requires the selected prompter text size to persist or be preserved when navigating within the v1 shooting flow. The current prompter text size state is local to the mounted camera screen.

## 목표

- Preserve the selected prompter text size when leaving and returning to the prompter flow.
- Keep persistence local/mock only with no server, login, or cloud sync.
- Avoid changing the existing text size levels or camera/take workflow.

## 범위

- Add a small helper for resolving and updating a local prompter text size preference.
- Wire the prompter camera screen to initialize from and save to that local preference.
- Extend the existing prompter text size smoke test coverage.

## 변경 파일

- `src/features/recipes/lib/prompter-text-size.ts`
- `src/features/recipes/lib/prompter-text-size.test.ts`
- `src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- `context/context_20260514_prompter_text_size_persistence.md`

## 테스트

- Run the prompter text size helper smoke test.
- Run `npx tsc --noEmit`.

## 롤백

Remove the new helper/persistence wiring and restore the prompter screen to `useState<PrompterTextSizeLevel>('md')`.

## 리스크

- Native camera runtime behavior cannot be fully proven by TypeScript checks alone.
- Existing nearby prompter changes are already in the worktree, so edits must stay narrowly scoped.

## 결과

- `MockWorkspaceProvider`의 local/mock workspace state에 `prompterTextSizeLevel`을 추가했다.
- Prompter camera screen이 local screen state 대신 workspace preference를 읽고 쓰도록 변경해, prompter 화면을 나갔다가 돌아와도 앱 세션 안에서는 선택한 크기를 보존한다.
- 저장된 값 검증 helper `resolvePrompterTextSizeLevel`을 추가해 stale/invalid local value는 기본 `md`로 복구한다.
- 검증: helper smoke test를 먼저 추가했고, `npx tsc --noEmit`에서 missing export 실패를 확인한 뒤 구현 후 `npx tsc --noEmit` 통과.
- 연결 context: `context/context_20260514_prompter_text_size_persistence.md`
