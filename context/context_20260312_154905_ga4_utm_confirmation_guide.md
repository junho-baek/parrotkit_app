# Context - GA4 UTM 확인 가이드 문서화

## 작업 일시
- 2026-03-12 Asia/Seoul

## 배경
- 사용자가 GA4에서 UTM 유입(`notion / docs`, `pricing_test`)을 어떻게 확인하는지 친절한 한국어 가이드를 원함.
- 기존 대화에서 실제 확인된 값과 화면 흐름을 바탕으로 문서/PDF/Notion 산출물을 생성함.

## 수행 내용
1. `plans/20260312_ga4_utm_confirmation_guide.md` 작성
2. `output/reports/20260312_parrotkit_ga4_utm_confirmation_guide_ko.md` 작성
3. Python 가상환경 `.venv-pdf` 생성 후 `reportlab`, `pypdf`, `pdfplumber` 설치
4. PDF 생성: `output/pdf/20260312_parrotkit_ga4_utm_confirmation_guide_ko.pdf`
5. `pdftoppm`로 렌더 검증 수행
6. Notion 업로드 수행 및 결과 JSON 저장

## 핵심 내용
- GA4 트래픽 획득 화면에서 `세션 소스/매체`, `세션 캠페인`으로 UTM을 읽는 법 정리
- `탐색 -> 자유 형식`에서 `UTM -> Event Conversion` 리포트를 구성하는 법 정리
- Parrotkit에서 바로 할 수 있는 마케팅 예시와 기대효과 정리
- 실제 확인 예시로 `notion / docs`, `pricing_test`, `purchase_success` 반영 사례 포함

## 검증
- PDF 생성 성공
- PDF 렌더 이미지 기준 한글/표/줄바꿈 품질 확인
- Notion 업로드 성공

## 산출물
- Markdown: `/Volumes/T7/플젝/deundeunApp/Parrotkit/output/reports/20260312_parrotkit_ga4_utm_confirmation_guide_ko.md`
- PDF: `/Volumes/T7/플젝/deundeunApp/Parrotkit/output/pdf/20260312_parrotkit_ga4_utm_confirmation_guide_ko.pdf`
- Notion 결과 JSON: `/Volumes/T7/플젝/deundeunApp/Parrotkit/output/reports/20260312_parrotkit_ga4_utm_confirmation_guide_notion_upload_result.json`
- Notion 페이지: `https://www.notion.so/20260312-Parrotkit-GA4-UTM-321fdc54bb728110a2fbe278d3c9e562`

## 메모
- Notion 업로드 첫 시도는 Markdown code block language가 `text`로 해석되어 실패함. `plain text`로 수정 후 재업로드 성공.
- `.venv-pdf`는 로컬 PDF 생성용이며 Git 추적 대상 아님.
