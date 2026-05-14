# Context 2026-05-14 Prompter Mode State Persistence

## 작업

Sub-AC 16.3.1: prompter display mode 변경 중 playback status, scroll position, speed/settings가 mode별로 유지되도록 local/mock 상태 계약을 추가했다.

## 변경

- `src/features/recipes/lib/prompter-mode-state.ts`
  - `card` / `full-script`별 `playbackStatus`, `scrollOffset`, `speedSetting`, `textSizeLevel` 상태 모델 추가
  - mode별 초기 상태 생성, 조회, scroll offset clamp 저장, playback status 저장, settings 저장 helper 추가
- `src/features/recipes/lib/prompter-mode-state.test.ts`
  - mode별 scroll offset 독립성, stale offset clamp, playback status 독립성, speed/text settings 독립성 contract 확인
- `tsconfig.prompter-mode-state-check.json`
  - helper/test 전용 TypeScript 검증 설정 추가
- `src/core/providers/mock-workspace-provider.tsx`
  - workspace state에 `prompterModeStateByMode` 추가
  - `setPrompterModeScrollOffset`, `setPrompterModePlaybackStatus`, `setPrompterModeSettings` 노출
  - settings 변경 시 local/mock provider의 현재 text size preference도 동기화
- `src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
  - display mode 전환 시 해당 mode의 저장 scroll offset/text size를 복원
  - manual scroll과 reset/step scroll 시 현재 mode offset 저장
  - text size 조정 시 현재 mode settings 저장
  - 녹화 시작/종료 시 현재 mode playback status를 `playing` / `idle`로 반영

## 검증

- Red: `npx --no-install sucrase-node src/features/recipes/lib/prompter-mode-state.test.ts`가 missing module로 실패하는 것을 확인했다.
- Green: `npx --no-install tsc -p tsconfig.prompter-mode-state-check.json --pretty false` 통과
- Integration: `npx --no-install tsc -p tsconfig.prompter-full-script-display-check.json --pretty false` 통과
- Broad check: `npx --no-install tsc --noEmit --pretty false`는 unrelated sibling change인 `src/features/recipes/lib/cut-card-take-viewer-section.test.ts`의 missing module import 때문에 실패했다.

## 참고

- 자동 prompter speed control은 deferred 상태로 유지했다. 이번 변경은 speed setting을 저장 가능한 contract로만 둔다.
- 서버, 로그인, cloud sync, native persistent storage는 추가하지 않았다.

## Sub-AC 16.3.2 업데이트

### 작업

Prompter mode switch handling을 보강해 prompter가 같은 화면 흐름 안에 유지되고, 선택한 mode의 저장 state가 올바르게 복원되도록 수정했다.

### 변경

- `src/features/recipes/lib/prompter-mode-state.ts`
  - `resolvePrompterModeSwitchState` 추가
  - 모드 전환 시 outgoing mode의 현재 scroll offset을 저장하고 selected mode의 scroll/text settings를 반환
  - selected mode max offset이 아직 측정되지 않은 경우 outgoing mode 높이로 잘못 clamp하지 않도록 처리
- `src/features/recipes/lib/prompter-mode-state.test.ts`
  - card mode의 짧은 max offset에서 full-script mode로 전환할 때 full-script 저장 scroll offset이 유지되는 contract 추가
  - direct `sucrase-node` 실행을 위해 prompter mode helper/test import를 relative import로 정리
- `src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
  - `prompterScrollMaxOffsetByMode`를 추가해 `card` / `full-script`별 measured scroll range를 분리
  - mode switch handler에서 outgoing offset 저장, selected mode offset/text size 즉시 복원, 같은 `ScrollView`로 scroll 위치 복원
  - restore effect가 selected mode의 measured max offset만 사용하도록 변경

### 검증

- Red: `npx --no-install tsc -p tsconfig.prompter-mode-state-check.json --pretty false`가 missing export `resolvePrompterModeSwitchState`로 실패하는 것을 확인했다.
- Green: `npx --no-install sucrase-node src/features/recipes/lib/prompter-mode-state.test.ts` 통과
- Green: `npx --no-install tsc -p tsconfig.prompter-mode-state-check.json --pretty false` 통과
- Green: `npx --no-install tsc -p tsconfig.prompter-full-script-display-check.json --pretty false` 통과
- Broad: `npx --no-install tsc --noEmit --pretty false`는 sibling task의 `src/features/recipes/lib/cut-card-take-viewer-section.test.ts`가 `takeItems` 필드를 기대하는 기존 불일치로 실패했다.
