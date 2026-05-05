# Reference Video And Explore Guide Media Plan

## 배경
- Take/Reference fullscreen viewer에서 상단 뒤로가기 버튼이 Dynamic Island 근처에서 눌리지 않는 문제가 있다.
- Reference viewer는 `referenceVideoUrl`이 있어도 실제 video player가 아니라 image placeholder 위에 play icon만 보여주고 있다.
- Explore 탭의 UGC 사진과 레시피 제목이 아직 개별 콘텐츠/레시피처럼 보여, 사용자가 "촬영 가이드"로 이해하기 어렵다.
- 사용자는 제공한 UGC 톤의 이미지처럼 뷰티, 음식, 앱/제품 데모 중심의 가이드 카드로 바꾸길 원했다.

## 목표
- Reference/Take viewer header가 status bar/dynamic island와 겹치지 않게 하고 back/close button hit target을 안정화한다.
- Reference viewer에서 direct MP4 source가 있으면 `expo-video`로 실제 재생되게 한다.
- Explore/recipe mock cards를 "어떤 영상을 기획할 때 쓰는 가이드"로 보이게 제목/설명/chip을 바꾼다.
- Explore UGC 이미지를 뷰티 제품, 음식 홍보, 앱 데모/제품 문제제기 톤으로 교체한다.
- Shoot Board의 reference/take modal도 같은 가이드형 media를 사용하게 한다.
- Shoot Board 작은 9:16 Reference/My Take 슬롯에 실제 썸네일을 보여주고, 저장된 take는 reference와 다른 이미지로 구분한다.
- Recipe prompter recording 화면은 씬의 `Line to say`와 `Shooting guideline`만 크게 보여주고, 레코드 버튼을 중앙 하단으로 정리한다.
- Shoot Board expanded card에서 스크롤이 drag gesture에 씹히는 문제를 줄인다.

## 범위
- In scope:
  - `reference-viewer-modal.tsx`
  - `take-review-viewer-modal.tsx`
  - mock recipe/reference seed data
  - guide-oriented title/description/chip mapping in Explore
  - local media constants if useful
- Out of scope:
  - Real uploaded video ingestion.
  - Exact user-provided image byte import when no local file handle is available.
  - Server persistence.

## 변경 파일
- Modify: `parrotkit-app/src/features/recipes/components/reference-viewer-modal.tsx`
- Modify: `parrotkit-app/src/features/recipes/components/take-review-viewer-modal.tsx`
- Modify: `parrotkit-app/src/features/recipes/lib/shoot-board-model.ts`
- Modify: `parrotkit-app/src/core/mocks/parrotkit-data.ts`
- Modify: `parrotkit-app/src/features/explore/screens/explore-screen.tsx`
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- Modify: `parrotkit-app/src/features/recipes/components/shoot-board-media-slot.tsx`
- Modify: `parrotkit-app/src/features/recipes/components/shoot-board-scene-card.tsx`
- Modify: `parrotkit-app/src/features/recipes/components/shoot-board-draggable-list.tsx`
- Add/Modify: context file for this task

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- `cd parrotkit-app && npx tsx src/features/recipes/lib/shoot-board-model.test.ts`
- `git diff --check`
- iPhone 17 Pro manual QA:
  - Open `/recipe/recipe-korean-diet-hook`
  - Open Reference modal and verify close/back works.
  - Verify reference media plays or shows clear video state.
  - Open Take modal and verify close/back works.
  - Open Explore tab and verify cards read as guide recipes, not confusing specific scripts.
  - Verify expanded Shoot Board slots render 9:16 thumbnails.
  - Open `/recipe/recipe-korean-diet-hook/prompter?sceneId=scene-2` and verify scene-linked line/guideline plus central red record button.

## 롤백
- If video playback causes runtime issues, keep safe-area/header fix and fallback Reference viewer to image with explicit "video placeholder" state.
- If Explore copy feels too generic, revert title mappings only while keeping media replacement.

## 리스크
- Direct social links like Instagram/TikTok are not playable by `expo-video`; only direct MP4 URLs can be rendered as video.
- Exact attached prompt images are visible in the conversation but not exposed as filesystem files. If exact assets are required later, they should be added as local files and mapped through the same data fields.

## 결과
- 사용자 제공 이미지 파일(`/Users/junho/Downloads/ugc1.png` ~ `ugc4.png`)을 앱 mock media asset으로 복사하고, 같은 이미지 기반 짧은 mp4 mock reference clips를 생성했다.
- Explore/recipe mock copy를 "guide" 중심으로 바꿔, 레시피 탐색이 특정 완성 스크립트가 아니라 촬영 기획 가이드로 읽히게 조정했다.
- Reference viewer는 direct local/mp4 source를 `expo-video`로 재생하고, header safe area/hit target을 보강했다.
- Take viewer도 safe area/hit target을 보강하고 saved take preview에는 `takeThumbnailUrl`을 우선 사용하게 했다.
- Shoot Board의 작은 9:16 Reference/My Take 슬롯은 실제 썸네일을 렌더링하며, saved take가 있는 컷은 reference와 다른 사용자 제공 이미지를 보여준다.
- Recipe prompter camera는 씬에서 전달된 `Line to say`와 `Shooting guideline`만 노출하고, 중앙 하단 빨간 record button과 review overlay의 `Back`/`Use take` 액션을 제공한다.
- Drag handle은 `onPressIn` 즉시 drag를 제거하고 long press 기반으로 바꿨으며, list activation distance를 늘려 expanded card scroll과의 충돌을 줄였다.
- 연결 context: `context/context_20260506_reference_video_explore_guides.md`
