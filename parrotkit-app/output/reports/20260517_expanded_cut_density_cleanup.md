# Expanded Cut Density Cleanup QA

## 테스트 시간

2026-05-17 05:34 KST

## 대상

- Local Expo dev client
- Android emulator `emulator-5554`
- Recipe execution board: `Food Promo Shooting Guide`

## 목적

Expanded cut이 별도 큰 form/slot처럼 보이지 않고, collapsed row의 밀도를 유지하면서 중요한 촬영 정보만 더 읽히는지 확인한다.

## 검증 범위

- `Next cut` / `다음 컷` label 제거.
- Cut timeline에 range와 expected duration 표시.
- Expanded reference가 큰 별도 preview slot이 아니라 같은 9:16 thumbnail anchor로 유지되는지.
- `Line to say` / `Shot guide`가 expanded state에서 전체 내용으로 확인되는지.
- Read-only expanded details가 vertical input slots가 아니라 compact rows로 표시되는지.
- Edit/Reset controls가 large text pills가 아니라 compact icon actions로 표시되는지.

## 결과

- PASS: `Next cut` label 제거됨.
- PASS: Cut row meta가 `0:00-0:05 · 5s`, `0:05-0:13 · 8s`처럼 보임.
- PASS: Expanded state에서도 influencer/product reference thumbnail이 왼쪽 9:16 frame으로 유지됨.
- PASS: `Line to say`, `Shot guide`, `Apply to your case`, `Note` 전체 문장이 expanded state에서 확인됨.
- PASS: Expanded read-only details가 compact rows로 표시됨.
- PASS: Edit/Reset controls가 icon-only actions로 축소됨.

## 스크린샷

- `output/playwright/recipe-execution-reference-20260517/android-expanded-density-board.png`
- `output/playwright/recipe-execution-reference-20260517/android-expanded-density-expanded.png`

## 리스크 / 다음 액션

- Checklist는 expanded cut 안에 남아 있어 컷 완료 기준을 바로 확인할 수 있다. 사용자가 더 compact한 실행 모드를 원하면 checklist도 note/checklist drawer로 이동하는 다음 패스를 고려할 수 있다.
