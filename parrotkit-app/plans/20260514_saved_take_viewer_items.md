# 배경

Sub-AC 12.3.3은 확장 컷 카드의 Take viewer가 저장된 테이크를 단순 대표 상태가 아니라 리뷰 가능한 항목 목록으로 보여줘야 한다. 현재 섹션은 대표 테이크와 CTA만 제공해 개별 테이크의 preview/playback entry, metadata, 선택/open 동작이 카드 안에서 충분히 드러나지 않는다.

# 목표

- Take viewer helper가 저장된 테이크 항목 목록을 렌더링 가능한 구조로 제공한다.
- 각 항목은 preview/playback 진입 라벨, duration/recorded metadata, selected/final/reshoot 상태를 가진다.
- 확장 컷 카드에서 저장된 테이크 항목을 눌러 기존 take review modal을 열 수 있게 한다.
- empty/loading 상태와 기존 촬영/리뷰 흐름은 유지한다.

# 범위

- `getCutCardTakeViewerSection` 반환 구조 확장
- helper smoke test 보강
- `ShootBoardSceneCard` Take viewer UI에 saved take item list 추가
- 작업 결과 context 문서 추가

# 변경 파일

- 예정: `src/features/recipes/lib/cut-card-take-viewer-section.ts`
- 예정: `src/features/recipes/lib/cut-card-take-viewer-section.test.ts`
- 예정: `src/features/recipes/components/shoot-board-scene-card.tsx`
- 예정: `context/context_20260514_saved_take_viewer_items.md`

# 테스트

- Red: helper test가 `takeItems`/metadata/open label 미구현으로 실패하는지 확인
- Green: targeted TypeScript check 및 가능하면 전체 `npm exec --offline -- tsc --noEmit`

# 롤백

- helper의 `takeItems` 필드와 `ShootBoardSceneCard`의 take item list 렌더링을 제거하면 기존 대표 테이크 중심 UI로 복귀한다.

# 리스크

- 이 worktree에는 sibling AC 변경이 많으므로 단독 커밋/푸시는 피한다.
- 실제 저장 테이크 playback은 기존 modal 경로를 재사용하고, 카드 내부는 lightweight entry/list로 제한한다.

# 결과

- `getCutCardTakeViewerSection`이 `takeItems`를 반환하도록 확장해 각 저장 테이크의 preview/playback 라벨, duration/recorded metadata, final/reshoot/saved 상태, selected 여부를 제공한다.
- 확장 컷 카드 Take viewer에 저장된 테이크 row 목록을 렌더링했다.
- 각 저장 테이크 row를 누르면 기존 Take review modal을 열고 해당 take id를 selected 상태로 전달한다.
- 연결 context: `context/context_20260514_saved_take_viewer_items.md`
