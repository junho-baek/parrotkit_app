# E2E Validation Report 생성 플랜 (2026-03-07)

## 배경
- Supabase 전환 이후 핵심 MVP 플로우의 실제 사용자 여정을 다시 검증해야 한다.
- 사용자 요청은 브라우저 기반 검증, 스크린샷 수집, Markdown 결과 문서, 그리고 PDF 산출물까지 포함한다.

## 목표
- 가입 -> 온보딩 -> 레퍼런스 입력 -> Recipe 생성 -> 저장 -> 재접속 재사용 -> 이벤트 로깅을 실제로 검증한다.
- 각 핵심 단계의 스크린샷을 수집한다.
- 읽기 좋은 Markdown 테스트 결과 문서와 PDF 보고서를 생성한다.

## 범위
- 포함: Playwright 기반 E2E, Supabase 데이터 확인, 이벤트 로그 확인, Markdown/PDF 보고서 생성
- 제외: 모바일 실기기 QA, 결제 실결제 검증

## 변경 파일
- `plans/20260307_e2e_validation_report.md`
- `context/context_*.md`
- `output/playwright/*`
- `output/reports/*`
- `output/pdf/*`

## 테스트
- 브라우저 기반 E2E 플로우 실행
- Supabase `profiles/references/recipes/event_logs` 데이터 확인
- PDF 렌더링 검증

## 롤백
- 코드 변경이 필요할 경우 커밋 단위로 되돌린다.
- 산출물은 `output/` 아래에만 생성한다.

## 리스크
- 외부 비디오 분석 경로의 네트워크/플랫폼 의존성
- Supabase Auth 설정이나 rate limit 변동
- PDF 이미지/레이아웃 깨짐

## 결과
- 브라우저 기반 E2E를 수행해 `가입 -> 온보딩 -> 레퍼런스 입력 -> Recipe 생성 -> 저장 -> 재로그인 -> 저장 레시피 재오픈 -> direct route 재수화 -> 이벤트 로깅`까지 전부 검증했다.
- Playwright 스크린샷 8장을 `output/playwright/20260307_e2e/`에 저장했다.
- Markdown 보고서 `output/reports/20260307_parrotkit_e2e_validation_report.md`와 PDF 보고서 `output/pdf/20260307_parrotkit_e2e_validation_report.pdf`를 생성했다.
- Supabase `profiles`, `references`, `recipes`, `event_logs`에서 데이터 저장 여부를 직접 확인했다.
- 이번 샘플 YouTube Shorts URL은 `Failed to find any playable formats`로 FFmpeg 다운로드가 실패했고, analyze API는 fallback segmentation으로 정상 응답했다.

## 연결 Context
- `context/context_20260307_191400_e2e_validation_report.md`
