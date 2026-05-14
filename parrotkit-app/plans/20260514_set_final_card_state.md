# 배경

Sub-AC 12.4.3은 expanded cut card의 Set as final 액션이 선택된 take를 해당 카드의 final 상태로 반영하고, expanded card UI에서도 즉시 final 상태가 보여야 한다. 기존 12.4.1 작업으로 버튼과 board 업데이트 경로는 연결되어 있으나, local/mock saved-take project의 best/final 상태까지 함께 갱신되는지 별도 보강이 필요하다.

# 목표

- Set as final 액션이 card board state에서 선택된 take를 final로 설정한다.
- 같은 액션이 local/mock saved-take 저장소의 best take 상태도 갱신한다.
- expanded card take viewer helper가 업데이트된 card state를 final UI로 표시하는 회귀 테스트를 남긴다.

# 범위

- saved-take/project final selection helper 또는 기존 helper 확장
- recipe detail Set as final handler 연결 보강
- 관련 targeted TypeScript 검증
- context 문서 기록

# 변경 파일

- 예정: `src/features/recipes/lib/take-projects.ts`
- 예정: `src/features/recipes/lib/saved-take-storage.ts`
- 예정: `src/features/recipes/lib/saved-take-storage.test.ts`
- 예정: `src/features/recipes/screens/recipe-detail-screen.tsx`
- 예정: `plans/20260514_set_final_card_state.md`
- 예정: `context/context_20260514_set_final_card_state.md`

# 테스트

- Red: saved-take storage helper가 selected take를 final record로 반영하지 못하는 실패 확인
- Green: targeted tsconfig 또는 `npm exec --offline -- tsc --noEmit --pretty false` 확인

# 롤백

- 새 final selection helper와 recipe detail 연결을 제거하면 기존 board-only Set as final 동작으로 돌아간다.

# 리스크

- shared worktree에 sibling AC 변경이 많으므로 commit/push는 수행하지 않는다.
- `recipe-detail-screen.tsx`는 여러 AC가 겹친 파일이므로 Set as final handler만 최소 수정한다.

# 결과

- `selectSavedRecipeFinalTake` helper를 추가해 local/mock saved-take project의 `bestTakeId`를 선택한 take로 갱신하도록 했다.
- recipe detail의 expanded card Set as final handler가 board state와 saved-take project final state를 함께 갱신하도록 연결했다.
- cut card take viewer 회귀 테스트에 Set as final 이후 expanded UI가 최종 테이크 상태로 표시되는 검증을 추가했다.
- 연결 context: `context/context_20260514_set_final_card_state.md`
