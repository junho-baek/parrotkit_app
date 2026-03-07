# ParrotKit E2E Validation Report

## 1. Overview

- Purpose: Supabase 전환 이후 핵심 MVP 플로우를 실제 사용자 여정 기준으로 재검증하고, 결과를 출시 전 공유 가능한 문서로 정리하기 위함.
- Execution Window: 2026-03-07 19:04:38 KST - 2026-03-07 19:05:09 KST (31.1s)
- Environment: local Next.js dev server (`npx next dev --webpack`), branch `dev`, commit `04378e9`, hosted Supabase project ref `qvnszjcrpzcnnkrqsdlv`
- Browser Automation: Chromium via Playwright
- Test Account: `parrotkitflow202603071004@mailinator.com` (one-time validation account)
- Reference URL: `https://www.youtube.com/shorts/8qUUuVkhtYQ`

## 2. Executive Summary

- Result: core flow passed end-to-end.
- Validated Flow: signup -> onboarding -> reference input -> recipe generation -> recipe save -> reconnect login -> saved recipe reopen -> direct rehydrate -> event logging.
- Evidence Count: 8 browser screenshots, 9 event log entries, 1 profile row, 1 reference row, 1 recipe row.
- Key Observation: analyze API returned success with `analyzedWithFFmpeg = False`. For this sample YouTube Shorts URL, FFmpeg scene detection fell back to default segmentation because the downloader could not resolve a playable format.

## 3. Flow Result Matrix

| Step | Result | Evidence |
| --- | --- | --- |
| 회원가입 | Pass | 201 응답, /interests 이동, localStorage token 저장 확인 |
| 온보딩 저장 | Pass | profiles.interests = Education, Food, onboarding_completed = true |
| 레퍼런스 입력 | Pass | references 1건 저장, source_url = https://www.youtube.com/shorts/8qUUuVkhtYQ |
| Recipe 생성 | Pass | recipes 1건 저장, total_scenes = 6 |
| 저장 후 진입 | Pass | /home?view=recipe&recipeId=d897f379-cdad-4105-8225-4dc3082d775b 진입 성공 |
| 재로그인 | Pass | 새 브라우저 컨텍스트에서 /signin -> /home 성공 |
| 재접속 재사용 | Pass | /recipes 목록 조회 후 레시피 재오픈 성공 |
| 서버 재수화 | Pass | sessionStorage 비운 후 direct route로 /api/recipes/:id 재조회 성공 |
| 이벤트 로깅 | Pass | event_logs 9건 저장 확인 |

## 4. Data Verification

- Auth User ID: `f7f6ed0a-8d73-4eb0-b4b4-3bc4db082b08`
- Email Confirmed At: `2026-03-07T10:04:46.477308Z`
- Profile Interests: `Education, Food `
- Reference ID: `2087679a-ef3d-46dd-a621-5df0ac887d20`
- Recipe ID: `d897f379-cdad-4105-8225-4dc3082d775b`
- Recipe Total Scenes: `6`
- Recipe Captured Count: `0`

### Event Log Snapshot

| Event | Page | Created At (UTC) |
| --- | --- | --- |
| signup_success | /signup | 2026-03-07T10:04:47.072552+00:00 |
| select_interest | /interests | 2026-03-07T10:04:47.930021+00:00 |
| select_interest | /interests | 2026-03-07T10:04:48.057324+00:00 |
| onboarding_complete | /interests | 2026-03-07T10:04:48.421952+00:00 |
| reference_submitted | /paste | 2026-03-07T10:04:50.533244+00:00 |
| recipe_generated | /paste | 2026-03-07T10:04:55.173911+00:00 |
| recipe_saved | /paste | 2026-03-07T10:04:56.026197+00:00 |
| login | /signin | 2026-03-07T10:05:01.540027+00:00 |
| recipe_reopened | /recipes | 2026-03-07T10:05:05.178811+00:00 |

## 5. Screenshot Evidence

### 01-signup-success.png

![01-signup-success.png](../playwright/20260307_e2e/01-signup-success.png)

- 회원가입 직후 /interests 진입. 즉시 세션 발급과 토큰 저장이 확인된 시점.

### 02-interests-selected.png

![02-interests-selected.png](../playwright/20260307_e2e/02-interests-selected.png)

- 온보딩 관심사 선택 화면. Education, Food 2개 선택 상태.

### 03-paste-form.png

![03-paste-form.png](../playwright/20260307_e2e/03-paste-form.png)

- 레퍼런스 입력 화면. YouTube Shorts URL 입력 직전 상태.

### 04-recipe-created.png

![04-recipe-created.png](../playwright/20260307_e2e/04-recipe-created.png)

- 레시피 생성 및 저장 완료 후 /home?view=recipe&recipeId=... 화면.

### 05-reconnect-home.png

![05-reconnect-home.png](../playwright/20260307_e2e/05-reconnect-home.png)

- 새 브라우저 컨텍스트에서 재로그인 후 /home 복귀 화면.

### 06-recipes-list.png

![06-recipes-list.png](../playwright/20260307_e2e/06-recipes-list.png)

- 서버 저장 레시피를 /recipes 목록에서 다시 조회한 화면.

### 07-reopened-recipe.png

![07-reopened-recipe.png](../playwright/20260307_e2e/07-reopened-recipe.png)

- 저장된 레시피를 목록에서 다시 열어본 화면.

### 08-rehydrated-recipe-direct.png

![08-rehydrated-recipe-direct.png](../playwright/20260307_e2e/08-rehydrated-recipe-direct.png)

- sessionStorage를 비운 뒤 direct route로 다시 진입해 서버 재수화까지 확인한 화면.

## 6. Findings

- 핵심 사용자 여정은 Supabase 기준으로 끝까지 연결됐다. 가입, 프로필 저장, references 저장, recipes 저장, 재로그인, 재오픈이 모두 정상 동작했다.
- 이번 샘플 URL에서는 FFmpeg 기반 YouTube 다운로드가 `Failed to find any playable formats`로 실패했고, 분석 API는 fallback scene segmentation으로 정상 응답했다.
- 즉 사용자 여정은 성공했지만, 실제 YouTube scene detection 정확도는 별도 안정화가 필요하다.

## 7. Next Plan

1. YouTube 다운로드/장면 감지 경로를 보강한다. ytdl 포맷 선택, 쿠키/헤더 전략, 실패 시 graceful fallback 기준을 정리한다.
2. 모바일 QA를 진행한다. iOS Safari와 Android Chrome에서 가입, 온보딩, 레시피 뷰 레이아웃을 확인한다.
3. 캡처 업로드와 ZIP export를 별도 E2E로 검증한다. 이번 리포트는 생성/저장/재오픈까지를 우선 닫았다.
4. 배포 환경에서 Vercel env와 Supabase Auth URL Configuration을 다시 확인하고 release readiness 체크리스트로 넘긴다.

## 8. Artifact Paths

- Playwright Evidence: `/Volumes/T7/플젝/deundeunApp/Parrotkit/output/playwright/20260307_e2e/`
- Markdown Report: `/Volumes/T7/플젝/deundeunApp/Parrotkit/output/reports/20260307_parrotkit_e2e_validation_report.md`
- PDF Report: `/Volumes/T7/플젝/deundeunApp/Parrotkit/output/pdf/20260307_parrotkit_e2e_validation_report.pdf`