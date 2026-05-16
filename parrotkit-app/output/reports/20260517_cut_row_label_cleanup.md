# Cut Row Label Cleanup QA

## 테스트 시간

2026-05-17 05:19 KST

## 대상

- Local Expo dev client
- Android emulator `emulator-5554`
- Recipe execution board: `Food Promo Shooting Guide`

## 목적

Collapsed cut row가 `DESIGN.md` 기준에 맞게 box-in-box / redundant label 느낌을 줄였는지 확인한다.

## 검증 범위

- Reference thumbnail이 9:16으로 노출되는지.
- Thumbnail 내부에 `Reference` / `레퍼런스` 같은 redundant overlay label이 없는지.
- Cut rows가 full rounded card border 반복이 아니라 list row/divider 중심으로 보이는지.
- Highlighted next cut이 full purple outline 대신 compact label/accent로 표현되는지.
- My Take 상태가 별도 `No take yet` / `0 takes` label 없이 My Take button/count로 표현되는지.

## 결과

- PASS: Reference thumbnail은 influencer/product image를 유지하며 9:16 frame으로 표시됨.
- PASS: Thumbnail 내부 `Reference` label 제거됨.
- PASS: Thumbnail 내부 time overlay 제거됨. 시간은 title 상단 meta row로 이동됨.
- PASS: Cut row는 divider 기반 layout으로 표시되고 full rounded card border/shadow가 제거됨.
- PASS: Next cut은 coral accent + `Next cut` label로 표시됨.
- PASS: My Take state는 `My Take` / `My Take 2` button에 반영됨.

## 스크린샷

- `output/playwright/recipe-execution-reference-20260517/android-cut-row-label-cleanup-home.png`
- `output/playwright/recipe-execution-reference-20260517/android-cut-row-label-cleanup-board.png`

## 리스크 / 다음 액션

- 현재 앱 언어가 English로 렌더되어 `Next cut`이 보인다. Korean mode에서는 `다음 컷`으로 표시된다.
- `Line to Say` / `Shot guide` label은 컷 실행 정보를 구분하는 field label이라 유지했다. 더 줄이고 싶다면 다음 패스에서 두 줄을 icon/typographic hierarchy로 바꾸는 방향이 가능하다.
