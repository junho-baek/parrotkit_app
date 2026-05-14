# Recipe Create Niche Goal Drawer Context

## 배경
- 사용자는 recipe create drawer에서 불필요한 설명, 중첩 박스, "What this mode prepares" 같은 보조 정보를 제거하길 요청했다.
- 새 생성 흐름은 첨부 이미지처럼 `New recipe` 하단에 `Blank / Link / Brand` 탭, 링크 입력, niche 선택, goal 선택, `Open shoot board` CTA를 중심으로 구성한다.
- Link와 Brand는 Pro 기능으로 보이되, 생성 UI를 별도 상세 화면으로 보내지 않고 바로 recipe 실행 보드로 진입하는 데모 흐름을 유지한다.

## 변경 사항
- `parrotkit-app/src/features/recipes/lib/recipe-create-flow.ts`
  - 생성 모드별 primary action을 모두 `open-shoot-board`로 통일했다.
  - `Beauty`, `Food`, `Fitness`, `Home`, `Tech`, `Other` niche option을 추가했다.
  - `Ad`, `Sell`, `UGC Recipe 판매`, `Personal`, `Viral`, `Conversion` goal option을 추가했다.
  - 선택한 niche/goal/link를 draft recipe context로 변환하는 `getRecipeCreateDraftContext`를 추가했다.
- `parrotkit-app/src/features/recipes/screens/recipe-create-screen.tsx`
  - 기존 상세 설명 카드, 포함 항목 chips, board 안내 박스를 제거했다.
  - bottom sheet를 open layout으로 재구성했다.
  - 상단 mode tabs를 아이콘형 pill UI로 정리하고 Link/Brand에 Pro badge를 유지했다.
  - Link mode에는 underline URL input을 배치했다.
  - niche pill grid와 goal image card grid를 추가했다.
  - CTA는 선택한 context로 draft recipe를 만든 뒤 shoot board로 이동한다.
- `parrotkit-app/src/features/recipes/lib/recipe-create-flow.test.ts`
  - reference/brand도 shoot board로 진입하는 계약을 검증했다.
  - niche/goal option 순서와 draft context 생성 결과를 검증했다.

## 이미지
- 별도 생성 이미지 파일은 추가하지 않았다.
- 데모용 goal/niche visual은 기존 `assets/mock-media`의 번들 UGC 이미지로 연결했다.
- React Native 런타임에서는 local bundled asset URI를 사용하므로 Expo 서버 없이 설치한 앱에서도 drawer visual이 유지된다.

## 검증
- `cd parrotkit-app && npx tsx src/features/recipes/lib/recipe-create-flow.test.ts`
- `cd parrotkit-app && npx tsx src/features/recipes/components/shoot-board-scene-card-layout.test.ts`
- `cd parrotkit-app && npx tsx src/features/recipes/lib/shoot-board-model.test.ts`
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`

## 결과
- 모든 검증 명령은 exit code 0으로 통과했다.
- `npx` 실행 시 npm/Node 버전 경고가 출력되지만 테스트와 타입체크 실패로 이어지지는 않았다.

## 리스크
- Brand mode의 실제 파일 업로드/분석 기능은 이번 범위에 포함하지 않았다.
