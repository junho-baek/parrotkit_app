# Shoot Board Title-First Layout Context

## 시점
- 2026-05-10 KST

## 배경
- 직전 컷 보드 UGC thumbnail layout에서 9:16 썸네일이 scene title/description의 가로 공간을 크게 차지했다.
- 사용자는 제목과 설명이 잘리는 것이 문제라고 보고, 작은 예시 영상을 카드 제목 위에 배치하는 방향을 제안했다.
- 펼친 카드 상세 내용도 기존 thumbnail offset 때문에 왼쪽 인덴트가 커 보였고, 본문은 좌측에 붙어 보여야 한다는 요구가 있었다.

## 변경 요약
- `parrotkit-app/src/features/recipes/components/shoot-board-scene-card-layout.ts`
  - expanded thumbnail을 `42x75`, collapsed thumbnail을 `34x60`으로 줄였다.
  - `thumbnailPlacement: "above-title"`와 `expandedBodyLeftInset: 0` layout contract를 추가했다.
  - title/description copy는 line clamp 없이 표시하는 계약을 `copyTextClamped: false`로 기록했다.
- `parrotkit-app/src/features/recipes/components/shoot-board-scene-card-layout.test.ts`
  - 작은 9:16 thumbnail, above-title placement, expanded body no-indent, unclamped copy를 검증한다.
- `parrotkit-app/src/features/recipes/components/shoot-board-scene-card.tsx`
  - thumbnail을 title block 왼쪽이 아니라 title 위 작은 preview로 이동했다.
  - scene title과 duration은 하나의 Text flow로 표시해 폭을 더 넓게 사용한다.
  - scene title과 instruction의 `numberOfLines` clamp를 제거해 전체 문구가 보이게 했다.
  - expanded body의 `marginLeft`를 0으로 바꿔 상세 내용과 action row가 카드 좌측에 붙게 했다.

## 검증
- `cd parrotkit-app && npx tsx src/features/recipes/components/shoot-board-scene-card-layout.test.ts`
- `cd parrotkit-app && npx tsx src/features/recipes/lib/shoot-board-model.test.ts`
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`

## 메모
- 별도 이미지 생성은 필요하지 않았다. 기존 `cut.thumbnailUrl` preview를 더 작게 재배치했다.
- `npm` 실행 시 현재 로컬 조합에서 `npm v11.3.0`과 `Node.js v20.15.0` 지원 범위 경고가 출력될 수 있다.
- 기존 dirty 파일인 `package.json`, `parrotkit-app/package-lock.json`, `.superpowers/`는 이번 변경에 포함하지 않는다.
