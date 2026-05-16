# Issue 10 Shooting Board Hierarchy Cleanup

## 배경

GitHub #10 QA 중 촬영 보드가 여전히 `DESIGN.md` 기준에 미치지 못하는 지점이 확인되었다. 레퍼런스 영상은 각 컷의 실행 기준인데 현재 My Take 옆 또는 보드 헤더에 놓여 컷 위계가 약하고, `No take yet`, `0 takes`, `Take saved` 같은 상태 라벨이 My Take 슬롯과 중복된다. 상단 shooting note CTA도 dashed box 안에 icon/copy를 다시 넣는 box-in-box 패턴이며 실제 입력 도구가 아니다.

## 목표

- 각 컷의 레퍼런스 미디어를 Cut 라벨/타이틀 위에 배치한다.
- My Take 슬롯이 촬영 상태와 take count를 직접 표현하게 하고 별도 상태 라벨을 제거한다.
- `No take yet`, `0 takes`, `Take saved` 같은 중복 상태 copy를 화면/contract에서 제거한다.
- 보드 상단 메모를 박스 CTA가 아닌 실제 checklist-style note 입력으로 전환한다.
- #10 QA 산출물 갱신 전, 촬영 보드 구조가 `DESIGN.md`의 no box-in-box / concise copy 기준에 맞게 정리되었는지 검증한다.

## 범위

- 촬영 보드 컷 카드 컴포넌트와 관련 view-model.
- shooting note 입력 컴포넌트와 recipe detail screen 연결.
- 관련 contract/unit tests.
- TypeScript, architecture, design lint, screenshot QA 산출물 갱신.

## 변경 파일

- `src/features/recipes/components/shoot-board-scene-card.tsx`
- `src/features/recipes/components/shoot-board-media-slot.tsx`
- `src/features/recipes/components/shoot-board-note-cta.tsx`
- `src/features/recipes/lib/cut-card-action-status.ts`
- `src/features/recipes/lib/cut-card-media-slots.ts`
- `src/features/recipes/screens/recipe-detail-screen.tsx`
- 관련 `*.test.ts`
- `context/context_20260516_issue_10_shoot_board_hierarchy_cleanup.md`
- `output/reports/20260516_issue_10_shoot_board_hierarchy_cleanup.md`

## 테스트

- `./node_modules/.bin/sucrase-node src/features/recipes/lib/cut-card-action-status.test.ts`
- `./node_modules/.bin/sucrase-node src/features/recipes/lib/cut-card-media-slots.test.ts`
- `./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `npm run check:architecture`
- `npx -y @google/design.md lint DESIGN.md`
- `git diff --check`
- Android/iPhone shooting board capture 재시도

## 롤백

이 패치가 촬영 보드 동작을 깨면 최종 커밋을 되돌린다. 레퍼런스 상단 배치와 note 입력은 독립적으로 되돌릴 수 있도록 변경 범위를 컴포넌트 단위로 유지한다.

## 리스크

- 레퍼런스 preview를 컷 상단으로 옮기면서 기존 ReferenceViewerModal 진입이 끊길 수 있다.
- My Take 슬롯에 count/preview를 통합할 때 saved/final/needs-reshoot 상태 표시가 약해질 수 있다.
- note 입력을 board state에 연결하지 않으면 화면 전환 후 사라질 수 있으므로 최소한 recipe detail session state와 workspace board persistence를 같이 확인한다.

## 결과

- 각 컷 카드 상단에 레퍼런스 미디어를 배치했다.
- 보드 헤더의 전역 reference preview와 collapsed Reference slot을 제거했다.
- `No take yet`, `0 takes`, `Take saved` collapsed 상태 라벨을 제거했다.
- 별도 오른쪽 completion circle을 제거하고 My Take 슬롯이 count/status를 표현하게 했다.
- shooting note CTA를 inline TextInput + checkbox row로 바꾸고 board state에 연결했다.
- Android/iPhone fresh board overview 캡처와 contact sheet를 생성했다.

## 연결된 context

`context/context_20260516_issue_10_shoot_board_hierarchy_cleanup.md`
