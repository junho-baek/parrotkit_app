# 2026-05-14 Prompter Mode Switch Playback/Scroll QA

## 배경

Sub-AC 16.3.4 requires focused test or QA coverage for switching prompter modes while playback is playing, paused, and manually scrolled. Existing Sub-AC 16.3.1/16.3.2 work introduced per-mode local/mock prompter state and mode-switch restoration, but the switch cases need explicit regression coverage.

## 목표

- Cover mode switching while the outgoing mode is `playing`.
- Cover mode switching while the target mode is `paused`.
- Cover mode switching after both modes have independent manual scroll offsets.

## 범위

- Focused local/mock state tests only.
- No new UI controls for pause, automatic speed, pinch zoom, server storage, auth, or cloud sync.
- Preserve existing prompter screen integration and sibling AC changes.

## 변경 파일

- `src/features/recipes/lib/prompter-mode-state.test.ts`
- `plans/20260514_prompter_mode_switch_playback_scroll_qa.md`
- `context/context_20260514_prompter_mode_switch_playback_scroll_qa.md`

## 테스트

- Red/green focused helper test with `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-mode-state.test.ts`.
- Targeted TypeScript check with `npm exec --offline -- tsc --noEmit -p tsconfig.prompter-mode-state-check.json --pretty false`.

## 롤백

- Remove the added test cases and this plan/context entry.

## 리스크

- `prompter-mode-state.test.ts` is shared by prior mode-state subtasks; keep additions append-only and avoid changing the helper contract unless a failing test proves a real gap.

## 결과

- `prompter-mode-state.test.ts`에 mode switch 중 `playing` outgoing mode, `paused` target/outgoing mode, 양쪽 mode의 manual scroll offset 저장/복원 회귀 케이스를 추가했다.
- 기존 `resolvePrompterModeSwitchState` 계약이 요청된 QA 시나리오를 이미 만족해 production code 변경은 하지 않았다.
- 연결 context: `context/context_20260514_prompter_mode_switch_playback_scroll_qa.md`
