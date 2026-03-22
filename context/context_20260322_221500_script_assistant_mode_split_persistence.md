# Script Assistant Mode Split Persistence

## 작업 개요
- Script Assistant를 하나의 UI 안에서 `Global` / `Scene` 모드로 분리했다.
- Scene별 스크립트 수정이 다른 컷의 대화와 섞이지 않도록 독립 thread 상태를 분리했고, `Apply to Script` 시 서버 저장과 session cache 갱신을 추가했다.
- Shooting 화면에는 현재 씬 스크립트를 읽을 수 있는 연한 회색 오버레이 프롬프터를 추가했다.

## 주요 변경
- `src/components/common/RecipeResult.tsx`
  - `recipeScenes`를 로컬 source of truth로 도입해 저장된 `scene.script`를 우선 사용
  - `assistantMode: 'global' | 'scene'` 추가
  - `globalChatHistory`와 `sceneChatHistory[sceneId]`로 대화 상태 분리
  - scene 진입 시 기본 모드를 `scene`으로, 레시피 그리드에서는 `global`로 열리게 정리
  - Assistant header에 `Global` / `Scene #N` 모드 전환 UI 추가
  - `Apply to Script`는 scene mode에서만 현재 씬에 적용되도록 제한
  - 적용 시 optimistic update 후 `/api/recipes/[id]` PATCH로 `recipes.scenes` 저장
  - 저장 성공 시 `sessionStorage.recipeData`도 함께 갱신해 재진입 시 수정 스크립트 유지
  - 저장 실패 시 로컬 수정은 유지하고 lightweight error message 노출
- `src/components/common/CameraShooting.tsx`
  - 현재 씬 스크립트 1~3줄을 바닥 컨트롤 위에 연한 회색 오버레이로 노출
  - 기존 `Script` 버튼/바텀시트는 유지
- `src/app/api/chat/route.ts`
  - request contract를 `mode`, `allScenes`, `targetScene` 기준으로 변경
  - global mode는 전체 레시피 흐름, scene mode는 target scene 중심 + 이전/다음 씬 continuity를 강조하도록 프롬프트 재구성
- `src/app/api/recipes/[id]/route.ts`
  - 기존 title patch에 더해 `scenes` 업데이트도 허용
  - `title`과 `scenes` 중 하나 이상 있으면 PATCH 가능하도록 확장

## 검증
- `PATH=/opt/homebrew/bin:$PATH npx tsc --noEmit`
  - 통과
- `PATH=/opt/homebrew/bin:$PATH npx eslint src/components/common/RecipeResult.tsx src/components/common/CameraShooting.tsx src/app/api/chat/route.ts 'src/app/api/recipes/[id]/route.ts'`
  - error 없음
  - 기존 `@next/next/no-img-element` warning만 유지
- `PATH=/opt/homebrew/bin:$PATH npm run dev -- --hostname 127.0.0.1 --port 3000`
  - Next.js 부팅 직후 persistence directory 오류로 실패
  - 메시지: `Failed to open database ... Loading persistence directory failed ... invalid digit found in string`

## 메모
- 이번 작업 범위에서는 chat history 자체를 DB에 저장하지 않고, `scene.script`만 영구 저장했다.
- 재진입 시 스크립트 원복 체감은 session cache + server PATCH 동기화로 줄였고, 실제 장기 진실값은 `recipes.scenes[].script`다.
