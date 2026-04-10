# 로그 | Log

위키 ingest, query, lint, maintenance의 append-only 기록.

## [2026-04-11] scaffold | initial setup

- `raw/`와 `wiki/` 기본 구조를 생성했다.
- 시작용 `index.md`, `overview.md`, `log.md`를 만들었다.

## [2026-04-11] ingest | initial context-to-wiki pass

- 최근 핵심 context와 관련 전략 문서를 읽고 `wiki/sources/` 6개 페이지를 추가했다.
- `wiki/concepts/`에 제품 스택, 브랜드 컨텍스트, 프롬프터 저장/편집, 상세 UI 단순화, 운영 워크플로를 정리했다.
- `wiki/entities/`에 `ParrotKit`, `RecipeResult`, `CameraShooting` 페이지를 만들었다.
- `wiki/analyses/context-map-april-2026.md`를 추가해 4월 초 context 흐름을 요약했다.
- 향후 ingest 우선순위로 3월 context 일괄 편입과 배포 QA 기록 연결을 남겼다.

## [2026-04-11] ingest | mobile shell and ops hygiene pass

- `context/context_20260411_parrotkit_app_expo_scaffold.md`와 `context/context_20260411_parrotkit_app_native_tabs_prebuild.md`를 묶어 mobile shell source 페이지로 정리했다.
- `context/context_20260411_playwright_cli_ignore.md`를 운영 hygiene source 페이지로 추가했다.
- `wiki/concepts/mobile-native-shell.md`와 `wiki/entities/parrotkit-app.md`를 새로 만들고, `ParrotKit`, `dev-only` 관련 기존 페이지를 보강했다.
- `wiki/index.md`와 `wiki/overview.md`를 2026-04-11 범위까지 확장했다.
