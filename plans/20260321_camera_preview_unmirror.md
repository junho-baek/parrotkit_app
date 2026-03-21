# Camera Preview Unmirror

## 배경
- 레시피 추출 후 슈팅 화면에서 전면 카메라 프리뷰가 좌우반전되어 보여 사용성이 떨어진다는 피드백이 있었다.

## 목표
- 슈팅 화면의 카메라 프리뷰를 좌우반전 없이 자연스러운 방향으로 표시한다.

## 범위
- `CameraShooting` 프리뷰 표시 로직 확인
- 프리뷰 미러 보정 적용
- `dev` 기준 실행 확인

## 변경 파일
- `src/components/common/CameraShooting.tsx`
- `plans/20260321_camera_preview_unmirror.md`
- `context/context_20260321_*.md`

## 테스트
- `npm run dev`

## 롤백
- 프리뷰 `transform: scaleX(-1)` 보정 제거

## 리스크
- 브라우저/기기별 전면 카메라 기본 미러 정책이 다를 수 있어, 특정 환경에서는 기존과 체감 차이가 없거나 반대로 느껴질 수 있다.

## 결과
- 완료
- 슈팅 프리뷰에 `transform: scaleX(-1)` 보정 적용
- `PATH=/opt/homebrew/bin:/usr/local/bin:$PATH npm run dev`로 dev server 기동 확인
- 연결 context: `context/context_20260321_204947_camera_preview_unmirror.md`
