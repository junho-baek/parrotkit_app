# Context 2026-05-14 Prompter Mode Switch Playback/Scroll QA

## 작업

Sub-AC 16.3.4: mode switching while playing, paused, and manually scrolled에 대한 focused QA coverage를 추가했다.

## 변경

- `src/features/recipes/lib/prompter-mode-state.test.ts`
  - card mode가 `playing` 상태에서 manual scroll 된 뒤 full-script로 전환하면 outgoing playback status와 scroll offset이 보존되는지 확인
  - full-script mode가 `paused` 상태와 saved manual scroll offset을 가진 경우 전환 시 paused status와 scroll offset이 복원되는지 확인
  - paused full-script mode에서 추가 manual scroll 후 card mode로 돌아올 때 full-script의 latest scroll offset과 paused status, card의 playing status와 scroll offset이 각각 유지되는지 확인
- `plans/20260514_prompter_mode_switch_playback_scroll_qa.md`
  - 작업 계획과 결과 기록

## 검증

- `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-mode-state.test.ts` 통과
- `npm exec --offline -- tsc --noEmit -p tsconfig.prompter-mode-state-check.json --pretty false` 통과

## 참고

- 이번 Sub-AC는 QA coverage 추가가 목적이므로 production code는 변경하지 않았다.
- 자동 prompter speed control, pause UI, pinch zoom, 서버 저장, login/cloud sync는 추가하지 않았다.
