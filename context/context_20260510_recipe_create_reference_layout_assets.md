# Recipe Create Reference Layout Assets Context

## 배경
- 사용자는 현재 recipe create drawer가 제시한 레퍼런스와 배치가 다르고, 기존 mock-media 번들 이미지의 감도가 맞지 않는다고 피드백했다.
- 현재 셸에는 OpenAI Image API용 `OPENAI_API_KEY`가 없어 실제 이미지 생성 API를 실행할 수 없었다.
- 대신 새 UGC/product/editorial 분위기의 visual을 local bundled asset으로 추가해 오프라인 설치 앱에서도 표시되도록 했다.

## 변경 사항
- `parrotkit-app/assets/recipe-create/`
  - niche thumbnail 5개와 goal card visual 6개를 추가했다.
  - 기존 `assets/mock-media` 반복 사용을 중단하고 recipe create 전용 visual로 분리했다.
- `parrotkit-app/src/features/recipes/lib/recipe-create-visuals.ts`
  - React Native 런타임에서는 local bundled asset URI를 resolve한다.
  - Node/test 런타임에서는 fallback URI를 반환해 `tsx` 테스트가 image asset require에 막히지 않도록 했다.
- `parrotkit-app/src/features/recipes/lib/recipe-create-flow.ts`
  - niche/goal option image source를 `recipeCreateVisuals`로 교체했다.
- `parrotkit-app/src/features/recipes/screens/recipe-create-screen.tsx`
  - sheet max height를 늘렸다.
  - mode tab Pro badge가 label을 덮지 않도록 badge 위치와 tab padding을 조정했다.
  - niche pill을 3-column 레퍼런스에 맞게 작게 조정했다.
  - goal card와 footer spacing을 줄이고 scroll bottom padding을 늘려 CTA와 content 겹침을 줄였다.

## 검증
- `cd parrotkit-app && npx tsx src/features/recipes/lib/recipe-create-flow.test.ts`
- `cd parrotkit-app && npx tsx src/features/recipes/components/shoot-board-scene-card-layout.test.ts`
- `cd parrotkit-app && npx tsx src/features/recipes/lib/shoot-board-model.test.ts`
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`

## 결과
- 모든 검증 명령은 exit code 0으로 통과했다.
- `npx` 실행 시 npm/Node 버전 경고가 출력되지만 테스트/타입체크 실패로 이어지지 않았다.

## 리스크
- 이번 asset은 실제 OpenAI Image API 생성물이 아니라 local bundled curated asset이다.
- 실제 AI-generated asset으로 교체하려면 로컬 환경에 `OPENAI_API_KEY`를 설정한 뒤 imagegen workflow로 재생성해야 한다.
