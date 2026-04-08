# 작업 기록: 레시피 scene start 썸네일

## 작업 요약
- recipe 생성 시 각 scene 카드의 thumbnail을 direct playback video 기준 시작 시점 프레임으로 덮어쓰도록 변경했습니다.
- direct video를 한 번만 내려받고 여러 timestamp 프레임을 추출하는 helper를 추가해 중복 다운로드를 줄였습니다.

## 변경 파일
- `src/lib/video-analyzer.ts`
- `src/app/api/analyze/route.ts`
- `plans/20260408_recipe_scene_start_thumbnails.md`
- `context/context_20260408_recipe_scene_start_thumbnails.md`

## 주요 변경
- `video-analyzer`에 여러 timestamp의 썸네일을 한 번에 추출하는 `extractVideoThumbnailsAtTimestamps` helper를 추가했습니다.
- `analyze` 응답 구성 직전에 각 provisional scene의 `startTime`을 기준으로 thumbnail을 다시 생성해 scene thumbnail에 반영했습니다.
- direct playback video가 없거나 추출 실패 시에는 기존 thumbnail 로직을 그대로 유지합니다.

## 검증
- 별도 build/test는 수행하지 않았습니다.
- 새 recipe 생성 기준으로 direct playback URL 저장 흐름에 이어 scene별 시작 프레임 썸네일이 반영되도록 로컬 코드 수정 완료했습니다.

## 상태
- 로컬 코드 반영 완료
