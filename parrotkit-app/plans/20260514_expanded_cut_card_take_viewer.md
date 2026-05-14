# 배경

Sub-AC 12.3.2는 확장 컷 카드 안에 Take viewer 섹션을 추가해 촬영 전, 로딩 중, 저장된 테이크가 있는 상태를 모두 보여줘야 한다. 현재 확장 컷 카드는 media slot과 Takes 버튼만 제공해 저장된 테이크의 상세 상태가 카드 내부에서 바로 드러나지 않는다.

# 목표

- 확장 컷 카드에 Take viewer 섹션을 추가한다.
- empty, loading, populated 상태를 명확히 분리한다.
- 저장된 테이크가 있으면 대표 테이크, final 여부, 개수, 썸네일을 보여준다.
- 기존 Take modal 진입과 Shoot/Retake 흐름은 유지한다.

# 범위

- Take viewer 섹션 표시용 helper 추가
- helper smoke test 추가
- `ShootBoardSceneCard` 확장 레이아웃에 Take viewer UI 추가
- 작업 결과 context 문서 추가

# 변경 파일

- 예정: `src/features/recipes/lib/cut-card-take-viewer-section.ts`
- 예정: `src/features/recipes/lib/cut-card-take-viewer-section.test.ts`
- 예정: `src/features/recipes/components/shoot-board-scene-card.tsx`
- 예정: `context/context_20260514_expanded_cut_card_take_viewer.md`

# 테스트

- Red: helper import/test가 구현 전 실패하는지 확인
- Green: targeted TypeScript check 및 가능하면 전체 `npm exec --offline -- tsc --noEmit`

# 롤백

- helper/test와 `ShootBoardSceneCard`의 Take viewer 렌더링을 제거하면 기존 확장 카드 레이아웃으로 복귀한다.

# 리스크

- 공유 worktree에 sibling AC 변경이 많으므로 이 subtask 단독 커밋/푸시는 수행하지 않는다.
- 실제 video playback은 기존 Take modal에 남기고, 카드 내부는 lightweight preview/metadata 중심으로 유지한다.

# 결과

- `getCutCardTakeViewerSection` helper로 empty/loading/populated/final 상태 copy와 대표 take metadata를 분리했다.
- `ShootBoardSceneCard` 확장 레이아웃에 Take viewer 섹션을 추가해 저장된 테이크 썸네일, 상태, 개수, 대표 take metadata, Shoot/Review CTA를 노출했다.
- `takeViewerLoading` optional prop을 추가해 기존 호출자는 유지하면서 expanded card layout이 loading 상태도 렌더링할 수 있게 했다.
- 연결 context: `context/context_20260514_expanded_cut_card_take_viewer.md`
