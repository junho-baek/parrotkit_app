# Recipe Video Unmute Default

## 작업 개요
- 레시피 영상 플레이어가 기본 음소거로 시작하던 동작을 수정했다.

## 주요 변경
- `src/components/common/RecipeVideoPlayer.tsx`
  - YouTube player `onReady`에서 `event.target.mute()` 제거
  - `event.target.unMute?.()` 호출로 기본 사운드 재생 시도

## 검증
- `PATH=/opt/homebrew/bin:$PATH npx tsc --noEmit` 통과
- `PATH=/opt/homebrew/bin:$PATH npx eslint src/components/common/RecipeVideoPlayer.tsx`
  - 에러 없음
  - 기존 `@next/next/no-img-element` warning 3건만 유지

## 메모
- 모바일 브라우저 정책에 따라 일부 환경에서는 소리 있는 autoplay가 제한될 수 있다.
- 그래도 코드 레벨에서 강제 mute를 거는 동작은 제거되었다.
