# RapidAPI Gemini Video Scene Analysis

## 배경
- 현재 `analyze` 파이프라인은 direct/proxied video URL을 확보해도 frame diff 후보 추출이 불안정하고, 실패 시 transcript 기반 분할로 자주 내려간다.
- 사용자는 RapidAPI social media video downloader로 확보한 실제 영상 URL을 Gemini 비디오 입력으로 직접 분석해, scene별 `motion_description`을 생성하는 흐름을 원한다.
- 출력은 복잡한 구조보다 `scene_number`, `start_time`, `end_time`, `motion_description` 정도의 최소 JSON이 더 안정적이다.

## 목표
- RapidAPI video URL을 우선 Gemini 비디오 입력에 전달하는 새 장면 분석 경로를 추가한다.
- Gemini 출력은 최소 JSON 스키마로 제한하고, `motion_description`은 시간축 변화만 담도록 프롬프트를 고정한다.
- Gemini 비디오 분석이 실패하면 기존 frame diff / transcript fallback은 유지한다.
- 로컬 `npm run dev` 환경에서 paste 흐름을 실제 링크로 QA한다.

## 범위
- Replicate Gemini 비디오 분석 호출 추가
- `analyze` API에서 Gemini 비디오 분석 우선 경로 연결
- motion description 최소 JSON 파싱 및 기존 scene 구조 반영
- 로컬 paste QA 및 결과 기록

## 변경 파일
- `src/lib/replicate.ts`
- `src/app/api/analyze/route.ts`
- 필요 시 관련 helper/type 파일

## 테스트
- `npm run dev`
- analyze/paste 로컬 QA
- 가능하면 TikTok 링크 우선, 실패 시 YouTube Shorts fallback

## 롤백
- Gemini 비디오 분석 호출 및 우선 경로를 제거하고 기존 frame diff / transcript 흐름으로 복원한다.

## 리스크
- Replicate Gemini 비디오 입력 형식이 현재 래퍼와 다를 수 있다.
- RapidAPI proxied URL이 짧게 만료되거나 Gemini 입력에서 바로 읽지 못할 수 있다.
- TikTok 링크는 외부 서비스 정책이나 응답 지연으로 성공률이 낮을 수 있다.

## 결과
- `src/lib/replicate.ts`에 `google/gemini-3.1-pro` 텍스트 생성 래퍼를 추가하고, 비디오 입력을 받을 수 있도록 연결했다.
- `src/app/api/analyze/route.ts`에서 RapidAPI로 확보한 영상 URL이 있으면 Gemini 비디오 분석을 먼저 시도하고, 실패 시 기존 frame diff / transcript fallback으로 내려가도록 구성했다.
- Gemini 비디오 입력은 proxied URL을 직접 넘기는 대신 `data:` URI로 변환해 전달하도록 처리해 mime type 판별 실패를 우회했다.
- 장면 출력 스키마는 `scene_number`, `start_time`, `end_time`, `motion_description` 기반으로 최소화했고, `motion_description`는 시간축 변화 중심 프롬프트를 적용했다.
- `src/components/common/RecipeResult.tsx`에서 카드 설명이 `script`보다 `scene.description`을 먼저 노출하도록 수정했다.
- TikTok 링크 `https://www.tiktok.com/@sarahbanks.ugc/video/7598231360267947277?q=%E3%85%95%E3%85%8E%E3%85%8A&t=1775036833518` 기준 `/api/analyze` 직접 호출 성공을 확인했다.
- 로컬 브라우저 결과 화면에서도 motion description 카드 노출을 확인했다.
- QA 보고서를 아래 경로에 생성했다.
  - `output/reports/20260401_rapidapi_gemini_tiktok_qa_report.md`
  - `output/reports/20260401_rapidapi_gemini_tiktok_qa_report.html`
  - `output/pdf/20260401_rapidapi_gemini_tiktok_qa_report.pdf`
- 브라우저 자동화에서는 `Analyze Video` 버튼 submit 재현이 불안정해, 최종 QA는 `/api/analyze` 진실값과 결과 화면 hydration을 함께 확인하는 방식으로 보완했다.

## 연결 Context
- `context/context_20260401_192525_rapidapi_gemini_tiktok_qa.md`
