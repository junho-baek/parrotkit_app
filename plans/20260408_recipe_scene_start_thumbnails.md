# Recipe Scene Start Thumbnails

## 배경
- 현재 recipe 카드 썸네일은 소스 대표 이미지나 기존 fallback 썸네일이 반복되어, 각 scene의 시작 장면을 직관적으로 보여주지 못합니다.
- direct playback video가 저장되기 시작했으므로, 카드 썸네일을 각 scene 시작 시점 기준 프레임으로 맞출 수 있게 되었습니다.

## 목표
- recipe 생성 시 각 scene 카드 썸네일을 해당 scene 시작 시점 프레임으로 설정합니다.
- 가능하면 direct playback video를 한 번 다운로드한 뒤 여러 타임스탬프의 프레임을 추출해 재사용합니다.

## 범위
- `src/lib/video-analyzer.ts`
- `src/app/api/analyze/route.ts`
- `context/context_20260408_recipe_scene_start_thumbnails.md`

## 변경 파일
- `plans/20260408_recipe_scene_start_thumbnails.md` (신규)
- `src/lib/video-analyzer.ts` (수정 예정)
- `src/app/api/analyze/route.ts` (수정 예정)
- `context/context_20260408_recipe_scene_start_thumbnails.md` (작성 예정)

## 테스트
- 로컬 analyze/save 기준으로 새 recipe의 scene 썸네일이 시작 프레임으로 바뀌는지 수동 확인
- 별도 build/test는 사용자 요청 시 진행

## 롤백
- analyze 단계의 scene start thumbnail 보강 로직을 제거하고 기존 thumbnail 결정 로직으로 되돌림

## 리스크
- scene별 프레임 추출이 추가되어 analyze 응답 시간이 다소 늘어날 수 있음
- 원격 direct video가 손상되었거나 프레임 추출에 실패하면 기존 thumbnail을 유지하게 됨

## 결과
- 완료
- direct playback video 기준으로 scene 시작 시점 프레임을 추출해 recipe 카드 썸네일을 보강하도록 변경했습니다.
- 썸네일 추출 실패 시에는 기존 thumbnail을 그대로 유지하도록 fallback을 남겼습니다.

## 연결 context
- `context/context_20260408_recipe_scene_start_thumbnails.md`
