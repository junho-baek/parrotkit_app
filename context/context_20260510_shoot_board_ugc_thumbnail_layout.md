# Shoot Board UGC Thumbnail Layout Context

## 시점
- 2026-05-10 KST

## 배경
- 사용자가 Recipe Cut Board 화면을 첨부 이미지처럼 바꾸길 요청했다.
- 핵심은 작은 9:16 UGC 사진/영상 썸네일이 각 scene row의 주 시각 신호가 되는 것이다.
- 기존 카드는 텍스트 중심 헤더와 펼친 영역 하단의 Reference/My Take 슬롯으로 구성되어 있어, 첨부 이미지의 컷 보드 밀도와 달랐다.

## 변경 요약
- `parrotkit-app/src/features/recipes/components/shoot-board-scene-card-layout.ts`
  - 펼친/접힌 scene card 썸네일 크기를 순수 constant로 추가했다.
  - 펼친 상태는 `64x114`, 접힌 상태는 `48x86`으로 9:16 비율을 유지한다.
- `parrotkit-app/src/features/recipes/components/shoot-board-scene-card-layout.test.ts`
  - 두 썸네일 크기가 9:16 비율인지, 펼친 썸네일이 접힌 썸네일보다 큰지 검증한다.
- `parrotkit-app/src/features/recipes/components/shoot-board-scene-card.tsx`
  - scene card 헤더를 `drag handle + expand chevron + 9:16 thumbnail + title/summary + completion circle` 구조로 바꿨다.
  - 썸네일은 `cut.thumbnailUrl`을 사용하고 중앙 play overlay를 표시한다.
  - 펼친 영역은 title row 아래에 `Line to say`, `Shooting guideline`, `Required checklist`, `My Take`, `Takes`, `Shoot` 버튼 순서로 정리했다.
  - 기존 `onPreview`, `onTake`, `onShoot`, checklist toggle, scene completion 동작은 유지했다.
- `parrotkit-app/src/features/recipes/components/shoot-board-draggable-list.tsx`
  - 새 카드 디자인에서 사라진 reset action prop 전달을 제거했다.
- `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
  - reset action prop 제거에 맞춰 사용하지 않는 reset handler/import를 정리했다.

## 검증
- `cd parrotkit-app && npx tsx src/features/recipes/components/shoot-board-scene-card-layout.test.ts`
- `cd parrotkit-app && npx tsx src/features/recipes/lib/shoot-board-model.test.ts`
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`

## 메모
- 기존 bundled UGC mock media를 그대로 사용했다. 별도 이미지 생성은 필요하지 않았다.
- `npm` 실행 시 현재 로컬 조합에서 `npm v11.3.0`과 `Node.js v20.15.0` 지원 범위 경고가 출력되지만, 모든 검증 명령은 exit 0으로 완료됐다.
- 기존 dirty 파일인 `package.json`, `parrotkit-app/package-lock.json`, `.superpowers/`는 이번 변경에 포함하지 않는다.
