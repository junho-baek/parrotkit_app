# RapidAPI Video Download Provider

## 배경
- 현재 영상 분석 파이프라인은 YouTube에서 `ytdl-core`, 기타 플랫폼에서 페이지 메타 태그 스크래핑에 크게 의존한다.
- 배포환경에서는 YouTube bot check로 원본 비디오 확보가 자주 실패하고, Instagram/TikTok도 direct media URL 확보 성공률이 낮다.
- 사용자가 RapidAPI 기반 social media video downloader API를 붙여 실제 비디오 다운로드 경로를 보강하길 요청했다.

## 목표
- RapidAPI 기반 provider를 추가해 YouTube/Instagram/TikTok/기타 링크에서 direct 또는 proxied video URL을 우선 확보한다.
- 확보한 video URL을 기존 frame diff 분석 파이프라인에 연결해 컷 추출 성공률을 높인다.
- 기존 Supadata transcript 경로는 유지하고, 응답 메타데이터에 어떤 media source를 사용했는지 남긴다.

## 범위
- `analyze` API에 RapidAPI media acquisition fallback/primary 경로 추가
- RapidAPI provider 모듈 추가
- 응답 메타데이터에 media source 관련 정보 추가
- 기존 `ytdl-core` YouTube 분석은 RapidAPI 실패 시 마지막 fallback으로 유지

## 변경 파일
- `src/lib/social-video-downloader.ts`
- `src/app/api/analyze/route.ts`
- 필요 시 관련 타입 또는 헬퍼 파일

## 테스트
- `npx tsc --noEmit`
- `npx eslint` 대상 파일 검증
- 가능한 경우 로컬 analyze 요청 smoke test

## 롤백
- RapidAPI provider import 및 analyze 경로 변경을 되돌리고 기존 `fetchPageMedia + ytdl-core` 흐름으로 복원한다.

## 리스크
- RapidAPI host/env 값이 없으면 새 경로는 자동 비활성화되어야 한다.
- 외부 API 응답 구조가 플랫폼마다 다를 수 있어 보수적으로 파싱해야 한다.
- 내려받은 URL이 단기 만료 링크일 수 있으므로 우선 분석용 transient URL로만 사용한다.

## 결과
- `src/lib/social-video-downloader.ts`를 추가해 RapidAPI social media video downloader provider를 normalize 계층으로 연결했다.
- `src/app/api/analyze/route.ts`에서 RapidAPI direct/proxied video URL을 우선 사용하고, 실패 시 기존 page meta/ytdl fallback으로 내려가도록 재구성했다.
- 응답 metadata에 `mediaSource`, `mediaFallbackReason`를 추가했다.

## 연결 Context
- `context/context_20260325_171353_rapidapi_video_download_provider.md`
