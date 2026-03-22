# Recipe Video Unmute Default

## 배경
- 레시피 영상 플레이어가 기본 음소거 상태로 시작해 사용성이 떨어진다는 피드백이 있었다.

## 목표
- 레시피 영상 재생 시 기본 음소거를 제거한다.

## 범위
- `src/components/common/RecipeVideoPlayer.tsx`
- 작업 기록 문서 업데이트

## 변경 파일
- `plans/20260322_recipe_video_unmute_default.md`
- `src/components/common/RecipeVideoPlayer.tsx`
- `context/context_20260322_*_recipe_video_unmute_default.md`

## 테스트
- `npx tsc --noEmit`
- 대상 파일 ESLint

## 롤백
- YouTube player `onReady`에서 음소거 호출을 복구한다.

## 리스크
- 일부 모바일 브라우저에서는 소리 있는 autoplay가 제한될 수 있다.

## 결과
- 완료
- 요약:
  - 레시피 영상 YouTube player `onReady`에서 강제 `mute()` 호출을 제거했다.
  - 가능할 때 `unMute()`를 호출해 기본 재생 시 소리가 나도록 변경했다.

## 연결 Context
- `context/context_20260322_000500_recipe_video_unmute_default.md`
