# Reference Video, Guide Media, And Prompter Context

## 시점
- 2026-05-06 KST

## 배경
- 사용자가 Reference/Take viewer의 상단 back hit target 문제와 reference 영상 미노출 문제를 지적했다.
- Explore 탭의 UGC 사진과 레시피 탐색 copy가 "실행 가능한 촬영 가이드"로 읽히길 원했다.
- 추가 피드백으로 Shoot Board의 작은 9:16 Reference/My Take 슬롯에 썸네일을 보여주고, 촬영 화면에는 해당 scene의 `Line to say`와 `Shooting guideline`만 명확히 보여주길 원했다.
- Expanded scene card에서 스크롤 제스처가 드래그와 충돌하는 느낌도 함께 완화해야 했다.

## 변경 요약
- `parrotkit-app/assets/mock-media/`
  - 사용자 제공 `ugc1.png` ~ `ugc4.png`를 앱 mock asset으로 복사했다.
  - 같은 이미지를 기반으로 mock mp4 reference clips를 생성했다.
- `parrotkit-app/src/core/mocks/ugc-media.ts`
  - React Native 런타임에서는 bundled image/video asset을 resolve하고, Node test 환경에서는 remote fallback URI를 반환하는 media registry를 추가했다.
- `parrotkit-app/src/core/mocks/parrotkit-data.ts`
  - Explore/recipe mock 데이터를 guide 중심 제목/설명으로 교체했다.
  - 뷰티 구매 전환 훅, 음식 홍보 촬영, 문제제기형 앱 데모 가이드가 사용자 제공 이미지와 mock video source를 사용한다.
- `parrotkit-app/src/features/explore/screens/explore-screen.tsx`
- `parrotkit-app/src/features/explore/screens/explore-recipe-detail-screen.tsx`
- `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
  - Explore/detail copy를 "recipe marketplace"보다 "shooting guide"로 읽히게 조정했다.
  - Shoot 버튼으로 prompter 진입 시 board cut의 `Line to say`와 `Shooting guideline`을 route param으로 전달한다.
- `parrotkit-app/src/features/recipes/components/reference-viewer-modal.tsx`
  - direct local/mp4 source는 `expo-video`로 재생한다.
  - header safe area와 hit target을 키워 Dynamic Island 근처 back/close 동작을 안정화했다.
- `parrotkit-app/src/features/recipes/components/take-review-viewer-modal.tsx`
  - header safe area/hit target을 보강했다.
  - saved take preview는 `takeThumbnailUrl`을 우선 사용해 Reference와 다른 시각 신호를 준다.
- `parrotkit-app/src/features/recipes/lib/shoot-board-model.ts`
  - `takeThumbnailUrl`을 board cut 모델에 추가했다.
  - saved take가 있는 mock cuts는 Reference thumbnail과 My Take thumbnail이 다르게 보이도록 사용자 제공 이미지를 연결했다.
- `parrotkit-app/src/features/recipes/components/shoot-board-media-slot.tsx`
  - 작은 9:16 slot에 실제 thumbnail image와 play overlay를 렌더링한다.
- `parrotkit-app/src/features/recipes/components/shoot-board-scene-card.tsx`
  - drag handle의 `onPressIn` 즉시 drag 시작을 제거하고 long press 기반으로 변경했다.
- `parrotkit-app/src/features/recipes/components/shoot-board-draggable-list.tsx`
  - drag activation distance를 18로 올려 scroll과 drag 충돌을 줄였다.
- `parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
  - 기존 자유 배치 prompter blocks 대신 recipe board에서 전달된 `Line to say`와 `Shooting guideline` 중심 overlay를 보여준다.
  - 중앙 하단 빨간 record button으로 재배치했다.
  - 녹화 review overlay는 `Back`과 `Use take` 액션 copy를 제공한다.

## 검증
- `cd parrotkit-app && npx tsc --noEmit`
- `cd parrotkit-app && npx tsx src/features/recipes/lib/shoot-board-model.test.ts`
- `git diff --check`
- iPhone 17 Pro simulator:
  - `/recipe/recipe-korean-diet-hook`에서 expanded Scene #2의 Reference/My Take 9:16 slot에 서로 다른 썸네일이 표시됨을 확인했다.
  - `/recipe/recipe-korean-diet-hook/prompter?sceneId=scene-2...`에서 `SHOOTING GUIDELINE`, `LINE TO SAY`, 중앙 하단 red Record button이 표시됨을 확인했다.
  - 증거 스크린샷:
    - `output/playwright/iphone17pro_shoot_board_thumbnails.png`
    - `output/playwright/iphone17pro_prompter_latest.png`

## 리스크 / 메모
- 실제 사용자의 새 녹화 take thumbnail 추출은 아직 mock/local UI 레벨이다. 이번 변경은 mock guide/take 상태에서 서로 다른 thumbnail을 보여주는 방향이다.
- Drag-and-drop은 long press 기반으로 완화했지만, 물리 터치 조작감은 실제 기기에서 추가 확인하는 것이 좋다.
- Board text edits는 현재 로컬 state이며 앱 reload 후 유지되지 않는다.

## 연결 플랜
- `plans/20260506_reference_video_explore_guides.md`
