# Native Shoot Board v2 Cut Board Context

## 시점
- 2026-05-05 21:24 KST

## 배경
- 사용자는 Shoot Board v1이 시각적으로 산만하고 이미지/상세 분석/진행 섹션이 오히려 촬영 흐름을 흐린다고 피드백했다.
- 새 지시서는 “컷 보드 UI 지시서 (v2)”이며, 기존 코드보다 이 지시서를 우선해 컷 보드만 제공하는 실용 화면으로 다시 구성하는 것이 목표였다.

## 변경 요약
- `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
  - `/recipe/:id` overview를 v2 Cut Board로 재작성했다.
  - Next Up card, Progress row, 큰 썸네일, bulk action bar, local bottom nav를 제거했다.
  - 상단은 뒤로가기, 레시피 제목, `4 cuts · 40s · 0 / 4 shot`, 더보기만 남겼다.
  - 본문은 `CUTS BOARD`와 접힘/펼침 컷 카드 리스트 중심으로 구성했다.
  - 첫/다음 미촬영 컷은 기본 펼침 상태로 보여준다.
  - 컷 카드에는 말할 문장, 촬영 지시, 필수 체크, 예시 보기, 촬영하기, 더보기 액션을 제공한다.
  - 오른쪽 하단 floating `장면 추가` 버튼으로 custom cut을 추가하고 자동 펼침 처리한다.
  - `useAppLanguage` 기반으로 한국어/영어 UI 카피를 분기했다.
- `parrotkit-app/src/features/recipes/lib/shoot-board-model.ts`
  - v2 cut fields를 추가했다: `instructionKo`, `speakingLine`, `speakingLineKo`, `shootingDirections`, `shootingDirectionsKo`, `requiredChecks`, `requiredChecksKo`.
  - role에 `scene`을 추가하고 `Hook / Proof / Scene / CTA` 4컷 구조를 지원한다.
  - `recipe-korean-diet-hook`은 지시서 기준 `Korean Diet Viral Recipe`, `4 cuts`, `40s` 보드로 변환한다.
- `parrotkit-app/src/features/recipes/lib/shoot-board-model.test.ts`
  - v2 모델 계약을 검증하도록 갱신했다.
  - 4컷, 40초, 역할 매핑, 한국어/영어 지시문, 완료 토글, 장면 추가, prompter route를 확인한다.
- `plans/20260505_native_shoot_board_v2_cut_board.md`
  - 작업 계획과 결과를 기록했다.

## 검증
- `cd parrotkit-app && npx tsc --noEmit` 통과.
- `git diff --check` 통과.
- 8081 Expo dev server 실행:
  - `cd parrotkit-app && npm run start -- --port 8081`
- 모바일 웹 QA:
  - URL: `http://localhost:8081/recipe/recipe-korean-diet-hook`
  - viewport: `393x852`
  - 확인 내용:
    - `CUTS BOARD`가 첫 화면에서 바로 보임.
    - `NEXT UP`, `PROGRESS`, 큰 이미지, 하단 로컬 탭바가 보이지 않음.
    - 첫 컷이 펼쳐져 있고 나머지 컷은 접혀 있음.
    - `장면 추가` floating button이 하단 오른쪽에 고정됨.
- QA 스크린샷:
  - `output/playwright/native_shoot_board_v2_cut_board_web_wait.png`

## 남은 리스크
- 실제 drag-and-drop reorder persistence는 아직 없다. 현재는 `순서 변경` 모드 UI만 제공한다.
- `예시 보기`는 사용자가 명시적으로 누를 때 기존 cut workspace로 이동한다. 보드 안에는 상세 분석 미리보기를 렌더링하지 않는다.
- `recipe-korean-diet-hook`은 지시서 시안에 맞추기 위해 3개 mock scene을 4개 cut으로 확장 매핑한다.
