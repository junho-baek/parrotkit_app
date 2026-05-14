# 2026-05-14 Prompter Per-Mode State Persistence

## 배경

Prompter currently supports Current cut / Full script display modes, manual scrolling, and text size controls, but mode changes reset the scroll state. Sub-AC 16.3.1 requires per-mode state for playback status, scroll position, and speed/settings to survive mode changes within the local/mock v1 app scope.

## 목표

- Define a typed per-mode prompter state model for `card` and `full-script` modes.
- Persist each mode's playback status, scroll offset, and speed/settings in local/mock workspace state.
- Restore the target mode's saved scroll/settings when switching display modes.

## 범위

- Local/mock state only; no server, auth, native storage, or cloud sync.
- Keep automatic prompter speed control deferred; store speed/settings contract without adding autoplay behavior.
- Preserve existing manual scroll and text size controls.

## 변경 파일

- `src/features/recipes/lib/prompter-mode-state.ts`
- `src/features/recipes/lib/prompter-mode-state.test.ts`
- `src/core/providers/mock-workspace-provider.tsx`
- `src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- `plans/20260514_prompter_mode_state_persistence.md`
- `context/context_20260514_prompter_mode_state_persistence.md`

## 테스트

- Add focused sucrase-node checks for mode-state helper behavior.
- Run existing prompter display/scroll/text-size checks if available.
- Run targeted TypeScript check using an existing relevant tsconfig where possible.

## 롤백

- Remove the mode-state helper/test.
- Remove provider mode-state fields and setters.
- Restore screen-local scroll reset behavior on display mode changes.

## 리스크

- `recipe-prompter-camera-screen.tsx` is a high-overlap file with sibling AC changes; edits must be minimal and preserve take-save/text-size/manual-scroll behavior.
- Playback/speed are currently deferred UI features, so this change must define/persist their state without implying auto speed control is shipped.

## 결과

- `prompter-mode-state.ts`에 `card` / `full-script`별 playback status, scroll offset, speed setting, text size setting contract를 추가했다.
- mock workspace state에 `prompterModeStateByMode`와 scroll/playback/settings setter를 추가해 앱 세션 내 local/mock 상태로 유지한다.
- Prompter 화면에서 수동 스크롤, 텍스트 크기 조정, 모드 전환 시 활성 모드의 저장 상태를 갱신/복원하도록 연결했다.
- 녹화 시작/종료 시 현재 prompter mode의 playback status를 `playing` / `idle`로 반영한다.
- 연결 context: `context/context_20260514_prompter_mode_state_persistence.md`

## 결과 업데이트: Sub-AC 16.3.2

- `resolvePrompterModeSwitchState`를 추가해 모드 전환 시 outgoing mode의 현재 scroll offset을 먼저 보존하고, selected mode의 저장된 scroll/settings를 즉시 복원하도록 했다.
- Prompter 화면에서 `card` / `full-script`별 measured max scroll offset을 별도 관리하도록 변경했다.
- Full script로 전환할 때 이전 card prompt의 짧은 높이로 full-script saved offset이 잘못 clamp되는 문제를 막았다.
- 하나의 prompter `ScrollView`와 persistent control dock을 유지하므로 모드 전환은 route/remount가 아니라 in-flow content/state 전환으로 동작한다.
