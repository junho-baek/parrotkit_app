# RapidAPI Gemini TikTok QA

## 작업 요약
- RapidAPI social media video downloader로 확보한 direct/proxied video URL을 Gemini 비디오 분석 입력으로 우선 사용하는 경로를 구현했다.
- Replicate `google/gemini-3.1-pro` 호출 래퍼를 추가했다.
- TikTok 링크 분석 결과를 `scene_number`, `start_time`, `end_time`, `motion_description` 중심으로 파싱해 기존 scene 구조에 반영했다.
- 결과 카드 UI가 `script`가 아니라 `scene.description`을 우선 보여주도록 조정했다.

## 변경 파일
- `src/lib/replicate.ts`
- `src/app/api/analyze/route.ts`
- `src/components/common/RecipeResult.tsx`
- `plans/20260401_rapidapi_gemini_video_scene_analysis.md`

## 검증
- `npx tsc --noEmit`
  - 통과
- `npx eslint src/app/api/analyze/route.ts src/lib/replicate.ts src/components/common/RecipeResult.tsx`
  - 에러 없음
  - 기존 `<img>` 관련 warning만 출력
- `npm run dev`
  - 로컬 dev 서버에서 검증
- TikTok 링크 `/api/analyze` 직접 호출
  - 성공
  - `sceneDetectionMethod = gemini_video_motion`
  - `sceneDetectionFallbackReason = null`
  - `mediaSource = rapidapi_smvd`
- 브라우저 QA
  - 붙여넣기 입력 화면 캡처 확보
  - 결과 화면에서 motion description 카드 노출 확인

## QA 대상 링크
- `https://www.tiktok.com/@sarahbanks.ugc/video/7598231360267947277?q=%E3%85%95%E3%85%8E%E3%85%8A&t=1775036833518`

## 산출물
- `output/playwright/tiktok-paste-filled.png`
- `output/playwright/tiktok-recipe-result-hydrated.png`
- `output/reports/20260401_rapidapi_gemini_tiktok_qa_report.md`
- `output/reports/20260401_rapidapi_gemini_tiktok_qa_report.html`
- `output/pdf/20260401_rapidapi_gemini_tiktok_qa_report.pdf`

## 메모
- RapidAPI proxied URL을 Replicate에 직접 전달하면 mime type 판별 실패가 발생했다.
- 비디오를 `data:` URI로 변환해 `videos` 입력에 전달하면 Gemini 비디오 분석이 성공했다.
- 브라우저 자동화 도구에서는 `Analyze Video` 버튼 submit 이벤트가 안정적으로 재현되지 않았다.
- 그래서 최종 QA는 `/api/analyze` 직접 성공과 결과 화면 hydration을 함께 확인하는 방식으로 정리했다.
