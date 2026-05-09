# Shoot Board Title-First Layout Plan

## 배경
- 직전 UGC thumbnail layout은 scene row 왼쪽에 9:16 썸네일을 크게 배치했다.
- 실제 화면에서 썸네일이 title/description의 가로 폭을 잡아먹어 텍스트가 말줄임되고, 펼친 상세 영역도 왼쪽 인덴트 때문에 밀려 보인다.
- 사용자는 scene 제목과 설명이 충분히 보이는 것이 중요하므로, 작은 예시 영상을 카드 제목 위에 두는 방향을 제안했다.

## 목표
- 예시 영상 썸네일을 title 옆이 아니라 title 위의 작은 9:16 preview로 이동한다.
- scene title과 description은 가능한 넓은 폭을 사용하고, title/description line count를 늘린다.
- 펼친 카드 상세 내용은 별도 인덴트 없이 카드 좌측에 붙여 읽히게 한다.
- 기존 preview, take, shoot, checklist, completion 동작은 유지한다.

## 범위
- In scope:
  - `shoot-board-scene-card-layout.ts` layout contract 조정
  - `shoot-board-scene-card-layout.test.ts` title-first layout 회귀 테스트 추가
  - `shoot-board-scene-card.tsx` header/body 레이아웃 조정
- Out of scope:
  - 신규 이미지/영상 생성
  - 실제 recorder/take 저장 로직 변경
  - 전체 Cut Board header/sticky CTA 변경

## 변경 파일
- Modify: `parrotkit-app/src/features/recipes/components/shoot-board-scene-card-layout.ts`
- Modify: `parrotkit-app/src/features/recipes/components/shoot-board-scene-card-layout.test.ts`
- Modify: `parrotkit-app/src/features/recipes/components/shoot-board-scene-card.tsx`
- Add/Modify: `context/context_20260510_shoot_board_title_first_layout.md`

## 테스트
- `cd parrotkit-app && npx tsx src/features/recipes/components/shoot-board-scene-card-layout.test.ts`
- `cd parrotkit-app && npx tsx src/features/recipes/lib/shoot-board-model.test.ts`
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`

## 롤백
- layout constant/test와 `shoot-board-scene-card.tsx`의 title-first header/body 정렬 변경을 이전 UGC thumbnail row 구조로 되돌린다.

## 리스크
- 썸네일이 위로 올라가면서 row 높이가 늘어날 수 있다.
- 텍스트를 모두 보이게 하기 위해 line count를 늘리면 한 화면에 보이는 컷 수가 줄어들 수 있다.

## 결과
- 예시 영상 thumbnail을 scene title 위의 작은 9:16 preview로 이동했다.
- expanded thumbnail은 `42x75`, collapsed thumbnail은 `34x60`으로 줄였다.
- scene title/description의 `numberOfLines` clamp를 제거해 문구가 말줄임되지 않게 했다.
- expanded 상세 body의 left inset을 0으로 조정해 `Line to say`, `Shooting guideline`, checklist, action row가 좌측에 붙게 했다.
- 연결 context: `context/context_20260510_shoot_board_title_first_layout.md`
