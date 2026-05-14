# 배경

ParrotKit v1 컷보드는 접힌 컷 카드에서도 사용자가 바로 촬영으로 들어갈 수 있고 현재 테이크 상태를 확인할 수 있어야 한다. Sub-AC 11.4는 접힌 카드 action/status 영역에 촬영 CTA와 현재 take status를 노출하는 작업이다.

# 목표

- 접힌 컷 카드에서 촬영 CTA를 바로 제공한다.
- 접힌 컷 카드에서 현재 take status를 명확한 짧은 문구로 표시한다.
- 기존 Reference/My Take 미디어 슬롯, 확장 카드 동작, prompter 진입 흐름은 유지한다.

# 범위

- 컷 카드 action/status copy helper 및 smoke test 추가
- `ShootBoardSceneCard` 접힌 상태 렌더링 변경
- TypeScript 검증
- 작업 결과 context 문서 추가

# 변경 파일

- 예정: `src/features/recipes/lib/cut-card-action-status.ts`
- 예정: `src/features/recipes/lib/cut-card-action-status.test.ts`
- 예정: `src/features/recipes/components/shoot-board-scene-card.tsx`
- 예정: `plans/20260514_collapsed_cut_card_action_status.md`
- 예정: `context/context_20260514_collapsed_cut_card_action_status.md`

# 테스트

- Red: `npm exec --offline -- tsc --noEmit`로 helper 미구현 실패 확인
- Green: `npm exec --offline -- tsc --noEmit`

# 롤백

- 추가 helper/test/context 파일을 제거하고 `ShootBoardSceneCard` 접힌 상태 action/status 영역을 제거한다.

# 리스크

- 접힌 카드가 과도하게 커질 수 있다. CTA와 status는 미디어 슬롯 아래 한 줄 영역으로 유지한다.
- 현재 프로젝트에는 별도 test runner가 없어 실행 검증은 TypeScript 컴파일 중심이다.

# 결과

- `getCutCardActionStatus` helper를 추가해 컷의 take 상태에서 촬영 CTA, status label, tone, take count label을 계산하도록 했다.
- 접힌 `ShootBoardSceneCard`에 Reference/My Take 슬롯 옆 action/status 영역을 추가했다.
- 상태 pill은 empty/saved/final/needs-retake별 색상과 아이콘을 표시하고, CTA는 바로 해당 컷 prompter 촬영으로 연결한다.
- 연결 context: `context/context_20260514_collapsed_cut_card_action_status.md`

# 검증 결과

- Red: `npm exec --offline -- tsc --noEmit` 실패 확인
  - 원인: `src/features/recipes/lib/cut-card-action-status` 모듈 없음
- Green: `npm exec --offline -- tsc --noEmit --pretty false` 통과
