# GA4 UTM 확인 가이드 문서화

## 배경
- GA4와 GTM을 통해 UTM 유입과 핵심 이벤트(`view_pricing`, `begin_checkout`, `purchase_success`)가 정상 수집되는 상태다.
- 사용자는 GA4 화면에서 UTM 유입을 어디서, 어떻게 읽어야 하는지 한국어로 친절하게 설명된 문서와 PDF를 원한다.
- 해당 문서는 Notion 리포트로 업로드되어 이후 마케팅/운영 참고 자료로 재사용될 예정이다.

## 목표
- GA4에서 UTM 유입을 확인하는 방법을 한국어로 정리한 Markdown 문서를 작성한다.
- 문서를 PDF로 렌더링하고 품질을 검증한다.
- 산출물을 Notion에 업로드한다.

## 범위
- GA4 트래픽 획득 리포트에서 `세션 소스/매체`, `세션 캠페인`으로 UTM을 확인하는 방법 설명
- UTM 확인 후 이벤트 전환(`login`, `view_pricing`, `begin_checkout`, `purchase_success`)까지 보는 가장 쉬운 탐색 리포트 가이드 설명
- 마케팅 활용 예시와 기대효과 설명
- Markdown/PDF 산출물 생성 및 Notion 업로드

## 변경 파일
- plans/20260312_ga4_utm_confirmation_guide.md
- output/reports/20260312_parrotkit_ga4_utm_confirmation_guide_ko.md
- output/pdf/20260312_parrotkit_ga4_utm_confirmation_guide_ko.pdf
- context/context_20260312_*_ga4_utm_confirmation_guide.md

## 테스트
- PDF 생성 스크립트 실행 성공
- PDF 렌더 이미지 확인
- Notion 업로드 dry-run 및 실제 업로드 성공 확인

## 롤백
- 생성된 문서/리포트 파일 제거
- Notion 업로드 페이지는 수동 삭제
- Git 커밋 revert

## 리스크
- 사용자가 제공한 캡처 원본 파일 경로가 없어 문서에는 캡처 내용을 텍스트 기반으로 재구성해야 한다.
- PDF 생성용 Python 패키지가 로컬에 없으면 설치가 필요하다.
- Notion API 토큰/데이터소스 설정이 누락되면 업로드가 실패할 수 있다.

## 결과
- 완료
- Markdown 작성: `output/reports/20260312_parrotkit_ga4_utm_confirmation_guide_ko.md`
- PDF 생성: `output/pdf/20260312_parrotkit_ga4_utm_confirmation_guide_ko.pdf`
- Notion 업로드: `https://www.notion.so/20260312-Parrotkit-GA4-UTM-321fdc54bb728110a2fbe278d3c9e562`
- 연결 context: `context/context_20260312_154905_ga4_utm_confirmation_guide.md`
