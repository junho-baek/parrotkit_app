# 2026-03-07 Parrotkit 배포환경 E2E 검증 보고서

## 1. 개요
- 테스트 대상: `https://parrotkit-deploy.vercel.app/`
- 테스트 일시: `2026-03-07 21:54:47 KST` ~ `2026-03-07 21:55:39 KST`
- 테스트 브랜치: `dev`
- 로컬 기준 커밋: `d1f5df6`
- 검증 목적: 배포환경에서 `회원가입 -> 관심사 저장 -> 레시피 생성 -> 카메라 녹화 -> 캡처 업로드 -> ZIP 다운로드`까지 실제 사용자 여정이 끊기지 않는지 확인

## 2. 결론
- 이번 배포환경 E2E는 **성공**했다.
- 신규 계정 회원가입이 정상적으로 완료되었고, 관심사 저장 이후 레퍼런스 분석 및 레시피 생성이 정상 동작했다.
- 촬영 탭에서 카메라 녹화가 가능했고, 녹화된 장면 1개가 서버로 업로드되었다.
- 이후 `Download (1)` 버튼을 통해 ZIP 파일 다운로드까지 정상 완료되었다.

## 3. 검증 범위
1. 신규 계정 가입
2. 온보딩 관심사 저장
3. 레퍼런스 URL 분석
4. 레시피 생성 및 저장
5. 촬영 탭 진입 및 카메라 녹화
6. 캡처 업로드
7. ZIP 다운로드
8. 다운로드 산출물 내부 파일 존재 여부 확인

## 4. 테스트 환경
- 브라우저: Headed Chromium (Playwright)
- 카메라/마이크 권한: 허용
- 녹화 입력: Playwright fake media stream 사용
- 참고 URL: `https://www.youtube.com/shorts/8qUUuVkhtYQ`
- 생성된 레시피 ID: `9669676b-fe77-403f-87b0-528ee25ac4e9`

## 5. 단계별 결과

### 5.1 회원가입
- `/signup` 진입 후 이메일, username, 비밀번호 입력
- `POST /api/auth/signup` 응답: `201`
- 가입 직후 `/interests`로 정상 이동

### 5.2 관심사 저장
- `Meme/Trend`, `Beauty`, `Travel` 선택
- `PUT /api/interests` 응답: `200`
- 저장 후 `/paste`로 정상 이동

### 5.3 레퍼런스 분석 및 레시피 생성
- `POST /api/analyze` 응답: `200`
- `POST /api/recipes` 응답: `201`
- `/home?view=recipe&recipeId=9669676b-fe77-403f-87b0-528ee25ac4e9` 진입 확인

### 5.4 카메라 녹화 및 업로드
- 첫 번째 scene 진입 후 `Shooting` 탭 전환
- 카메라 preview 존재 확인: `hasVideo = true`
- 녹화 완료 후 `POST /api/recipes/{id}/captures` 응답: `200`
- 이어서 progress 업데이트 응답: `200`
- alert: `Perfect match! Scene completed.`
- 레시피 화면에서 `Download (1)` 상태 확인

### 5.5 ZIP 다운로드
- `GET /api/recipes/{id}/export-zip` 응답: `200`
- 다운로드 파일명: `recipe-9669676b-fe77-403f-87b0-528ee25ac4e9.zip`
- 다운로드 파일 크기: `166,981 bytes`
- ZIP 내부 확인 결과: `scene-1.webm` 1개 포함

## 6. 핵심 API 응답 요약
- `POST /api/auth/signup` -> `201`
- `PUT /api/interests` -> `200`
- `POST /api/analyze` -> `200`
- `POST /api/recipes` -> `201`
- `POST /api/recipes/9669676b-fe77-403f-87b0-528ee25ac4e9/captures` -> `200`
- `PATCH /api/recipes/9669676b-fe77-403f-87b0-528ee25ac4e9/progress` -> `200`
- `GET /api/recipes/9669676b-fe77-403f-87b0-528ee25ac4e9/export-zip` -> `200`

## 7. 주요 증거 캡처
- 회원가입 완료 후 Interests 화면: `output/playwright/20260307_deploy_full_camera_download_v2/03-after-signup.png`
- 촬영 탭 진입 화면: `output/playwright/20260307_deploy_full_camera_download_v2/09-shooting-tab.png`
- 다운로드 가능 상태: `output/playwright/20260307_deploy_full_camera_download_v2/11-download-ready.png`
- 다운로드 후 상태: `output/playwright/20260307_deploy_full_camera_download_v2/12-after-download.png`

## 8. 해석
- 이전에 문제가 되었던 배포환경 signup 경로는 현재 정상화되었다.
- 최소 1개 scene 기준으로는 레시피 생성 이후 실제 촬영 플로우와 다운로드 플로우가 모두 연결되어 있다.
- 따라서 현재 배포본은 `MVP happy path` 기준으로 핵심 사용자 여정을 수행할 수 있다.

## 9. 주의 사항
- 이번 카메라 검증은 **실물 카메라가 아니라 fake media stream** 기반이다.
- 즉, 앱의 브라우저 플로우와 서버 연결은 검증됐지만, 실제 휴대폰 카메라/실장치 권한 이슈까지 완전히 대체하지는 않는다.
- 또한 이번 다운로드 검증은 `scene 1개` 기준이다. 다중 scene 촬영 후 ZIP 다건 포함 여부는 별도 추가 검증 가치가 있다.

## 10. 다음 액션 제안
1. 실제 모바일 기기에서 동일 플로우를 1회 수동 검증
2. scene 2개 이상 촬영 후 ZIP에 복수 파일이 포함되는지 추가 검증
3. 재로그인 후 저장된 recipe 재접속과 다운로드 재실행까지 확인

## 11. 산출물 경로
- JSON 결과: `/Volumes/T7/플젝/deundeunApp/Parrotkit/output/playwright/20260307_deploy_full_camera_download_v2/deploy-full-camera-download-e2e.json`
- 스크린샷 폴더: `/Volumes/T7/플젝/deundeunApp/Parrotkit/output/playwright/20260307_deploy_full_camera_download_v2`
- 다운로드 ZIP: `/Volumes/T7/플젝/deundeunApp/Parrotkit/output/playwright/20260307_deploy_full_camera_download_v2/downloads/recipe-9669676b-fe77-403f-87b0-528ee25ac4e9.zip`
