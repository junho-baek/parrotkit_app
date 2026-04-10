# Context - LLM Wiki Mobile Ops Ingest

## 작업 요약
- `llm-wiki` 스킬 기준으로 2026-04-11의 최근 작업을 기존 위키에 편입했다.
- 주요 신규 source는 두 축이다.
  - `parrotkit-app` Expo scaffold + native tabs prebuild/iOS simulator 검증
  - `.playwright-cli/` ignore를 통한 작업트리 hygiene 정리
- 위 내용을 연결하는 `모바일 네이티브 셸 | Mobile Native Shell` concept와 `ParrotKit App | Parrotkit App` entity 페이지를 새로 만들었다.
- 기존 `ParrotKit` entity, `dev-only 멀티클론 워크플로` concept, `wiki/index.md`, `wiki/overview.md`, `wiki/log.md`도 최신 범위로 보강했다.

## 변경 파일
- `plans/20260411_llm_wiki_mobile_ops_ingest.md`
- `wiki/index.md`
- `wiki/overview.md`
- `wiki/log.md`
- `wiki/sources/parrotkit-app-mobile-native-shell-apr-11.md`
- `wiki/sources/playwright-cli-ignore.md`
- `wiki/concepts/mobile-native-shell.md`
- `wiki/concepts/dev-only-multi-clone-workflow.md`
- `wiki/entities/parrotkit-app.md`
- `wiki/entities/parrotkit.md`
- `context/context_20260411_llm_wiki_mobile_ops_ingest.md`

## 검증
- `make cl`
  - 위키 편집 중 생성된 `wiki/**/._*` AppleDouble 메타파일 제거
- `find wiki -type f | sort`
  - 신규 페이지 포함 현재 위키 파일 목록 확인
- `python3` one-off 스크립트로 `wiki/**/*.md` 상대 Markdown 링크 존재 여부 검사
  - 결과: `OK`

## 메모
- 이번 pass는 2026-04-11의 최신 문맥만 최소 범위로 ingest 했다.
- mobile shell은 현재 placeholder/native shell 단계이므로 제품 기능 완성처럼 과대해석하지 않도록 표현을 조절했다.
- 운영 hygiene 성격의 `.playwright-cli/` ignore도 위키에 남기되, 제품 지식보다 운영 규칙의 evidence로 위치시켰다.

## 다음 액션 제안
- 3월 context를 `onboarding`, `dashboard`, `Supabase`, `QA/reporting` 축으로 다음 ingest pass에 편입
- mobile shell이 실제 auth/data/API를 붙이기 시작하면 `ParrotKit App` entity를 더 세분화
- 배포 QA 리포트와 모바일 시뮬레이터 캡처가 쌓이면 `wiki/analyses/`에 운영 근거 페이지 추가
