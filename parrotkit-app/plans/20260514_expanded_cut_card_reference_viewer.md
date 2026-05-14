# 배경

Sub-AC 12.2는 확장 컷 카드 안에서 attached 또는 linked reference media를 확인할 수 있는 Reference viewer 섹션을 요구한다. 현재 컷 카드에는 접힘/확장 공통 미디어 슬롯이 있지만, 확장 상태에서 reference를 상세하게 보는 전용 섹션은 없다.

# 목표

- 확장 컷 카드에 Reference viewer 섹션을 추가한다.
- attached thumbnail과 linked/playable reference source를 구분해 표시한다.
- reference가 없는 컷도 v1 로컬/mock 범위 안에서 막히지 않도록 빈 상태를 표시한다.
- 기존 reference modal 진입 동작은 유지한다.

# 범위

- Reference viewer 섹션 표시용 helper 추가
- 확장 컷 카드 UI에 viewer preview/metadata/CTA 추가
- helper 계약 smoke test 추가
- 작업 결과 context 문서 추가

# 변경 파일

- 예정: `src/features/recipes/lib/cut-card-reference-viewer-section.ts`
- 예정: `src/features/recipes/lib/cut-card-reference-viewer-section.test.ts`
- 예정: `src/features/recipes/components/shoot-board-scene-card.tsx`
- 예정: `context/context_20260514_expanded_cut_card_reference_viewer.md`

# 테스트

- Red: 새 smoke test가 helper 부재로 실패하는지 확인
- Green: `npm exec --offline -- tsc --noEmit`

# 롤백

- helper/test와 `ShootBoardSceneCard`의 Reference viewer 렌더링을 제거하면 기존 확장 카드 미디어 슬롯 UI로 복귀한다.

# 리스크

- 공유 worktree에 sibling AC 변경이 많으므로 이 subtask 단독 커밋/푸시는 수행하지 않는다.
- Expo video preview는 기존 modal에 남기고, 카드 내부는 thumbnail/metadata 중심으로 유지해 성능 리스크를 줄인다.

# 결과

- 확장 컷 카드에 `Reference viewer` 섹션을 추가했다.
- `linked`, `attached`, `empty` reference 상태를 helper에서 분리해 UI가 동일 계약을 사용하도록 했다.
- linked/attached reference는 썸네일 preview와 `레퍼런스 보기`/`View reference` CTA로 기존 reference modal을 연다.
- 연결 context: `context/context_20260514_expanded_cut_card_reference_viewer.md`
