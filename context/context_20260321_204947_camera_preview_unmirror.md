# Context - Camera Preview Unmirror

## 작업 배경
- 사용자 피드백: 레시피 추출 후 슈팅 화면에서 전면 카메라 프리뷰가 좌우반전되어 보여 어색했다.

## 변경 목표
- 슈팅 화면 프리뷰를 좌우반전 없이 자연스러운 방향으로 표시한다.

## 변경 내용
- 파일: `src/components/common/CameraShooting.tsx`
  - 슈팅 프리뷰 `video` 요소에 `transform: scaleX(-1)`를 적용해 전면 카메라 미러 표시를 상쇄했다.

## 검증
- `PATH=/opt/homebrew/bin:/usr/local/bin:$PATH npm run dev`
  - Next.js dev server가 `2026-03-21 20:49:47 KST` 기준 정상 기동되고 `http://localhost:3000` 준비 상태까지 확인했다.

## 메모
- 이번 수정은 프리뷰 표시만 바꾸며, 실제 녹화 스트림 구성이나 저장 포맷에는 영향이 없다.
