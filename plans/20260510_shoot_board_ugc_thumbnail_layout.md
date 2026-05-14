# Shoot Board UGC Thumbnail Layout Plan

## 배경
- 사용자가 Recipe Cut Board 화면을 첨부 이미지처럼 바꾸길 요청했다.
- 핵심 요구는 각 컷이 작은 9:16 UGC 사진/영상 썸네일로 보이고, 펼친 첫 컷에는 `Line to say`, `Shooting guideline`, `Required checklist`, `My Take`, `Takes`, `Shoot` 액션이 정리되는 형태다.
- 기존 구현은 카드 헤더가 텍스트 중심이고, Reference/My Take 슬롯이 펼친 영역 하단에 따로 있어 첨부 이미지의 UGC 컷 리스트 느낌과 다르다.

## 목표
- Shoot Board scene row 왼쪽에 항상 작은 9:16 UGC 썸네일을 표시한다.
- 펼친 row는 첨부 이미지처럼 썸네일 + 제목/설명 + 체크 원형, 하단 상세/액션으로 구성한다.
- 접힌 row도 작은 9:16 썸네일과 제목/요약/완료 체크가 한 줄 흐름으로 보이게 한다.
- 기존 drag, expand, checklist, shoot, take review 동작은 유지한다.

## 범위
- In scope:
  - `shoot-board-scene-card.tsx` 레이아웃 재구성
  - 새 카드 구조에 맞춘 draggable list/screen prop 정리
  - 필요한 경우 카드 layout constant와 테스트 추가
  - 기존 bundled UGC thumbnail 사용
- Out of scope:
  - 새 영상 생성/업로드 파이프라인
  - 실제 take thumbnail extraction
  - 전체 앱 네비게이션/마켓 플로우 변경

## 변경 파일
- Modify: `parrotkit-app/src/features/recipes/components/shoot-board-scene-card.tsx`
- Modify: `parrotkit-app/src/features/recipes/components/shoot-board-draggable-list.tsx`
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
- Add/Modify: `parrotkit-app/src/features/recipes/components/shoot-board-scene-card-layout.ts`
- Add/Modify: `parrotkit-app/src/features/recipes/components/shoot-board-scene-card-layout.test.ts`
- Add/Modify: `context/context_20260510_shoot_board_ugc_thumbnail_layout.md`

## 테스트
- `cd parrotkit-app && npx tsx src/features/recipes/components/shoot-board-scene-card-layout.test.ts`
- `cd parrotkit-app && npx tsx src/features/recipes/lib/shoot-board-model.test.ts`
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`

## 롤백
- `shoot-board-scene-card.tsx`, draggable list/screen prop 정리를 이전 카드 레이아웃으로 되돌리고 layout test/context/plan 추가분을 제거한다.

## 리스크
- React Native 시뮬레이터에서 실제 터치/스크롤 밀도는 추가 확인이 필요할 수 있다.
- 화면 폭이 좁은 기기에서는 버튼 3개가 빡빡할 수 있어 고정 크기 대신 flex 기반 버튼으로 유지한다.

## 결과
- Shoot Board scene card를 첨부 이미지처럼 작은 9:16 UGC 썸네일 중심 row로 재구성했다.
- 펼친 row에는 오른쪽 title/summary 아래로 `Line to say`, `Shooting guideline`, `Required checklist`, `My Take`, `Takes`, `Shoot` 액션이 이어지게 했다.
- 접힌 row도 동일하게 9:16 썸네일을 유지해 컷 리스트처럼 보이게 했다.
- 새 디자인에서 제거된 Reset 버튼 관련 props를 카드/리스트/screen 경계에서 정리했다.
- 9:16 썸네일 크기 계약을 순수 layout constant와 테스트로 추가했다.
- 연결 context: `context/context_20260510_shoot_board_ugc_thumbnail_layout.md`
