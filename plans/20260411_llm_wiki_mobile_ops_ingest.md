# 20260411 LLM Wiki Mobile Ops Ingest

## 배경
- 사용자는 `llm-wiki` 스킬로 최근 작업 내용을 위키에도 정리해 달라고 요청했다.
- 현재 위키는 2026-04-01부터 2026-04-08 사이의 웹앱 구조/UI/운영 규칙 중심으로만 정리되어 있고, 2026-04-11의 Expo 모바일 앱 전개와 운영 hygiene 변경은 아직 반영되지 않았다.

## 목표
- 2026-04-11의 `parrotkit-app` Expo 스캐폴드 및 native tabs prebuild 흐름을 위키 source/concept/entity에 반영한다.
- `.playwright-cli/` ignore 작업을 운영 지식으로 편입한다.
- `wiki/index.md`, `wiki/overview.md`, `wiki/log.md`를 최신 상태로 갱신한다.

## 범위
- 최근 관련 `context/` 문서 읽기
- `wiki/sources/` 신규 페이지 추가
- `wiki/concepts/` 신규 또는 기존 페이지 보강
- `wiki/entities/` 신규 또는 기존 페이지 보강
- `wiki/index.md`, `wiki/overview.md`, `wiki/log.md` 갱신
- 결과를 기록하는 신규 `context` 문서 작성

## 변경 파일
- `plans/20260411_llm_wiki_mobile_ops_ingest.md`
- `wiki/index.md`
- `wiki/overview.md`
- `wiki/log.md`
- `wiki/sources/*`
- `wiki/concepts/*`
- `wiki/entities/*`
- `context/context_20260411_llm_wiki_mobile_ops_ingest.md`

## 테스트
- 신규/수정된 위키 페이지의 내부 링크를 점검한다.
- `find wiki -type f | sort`로 생성 범위를 확인한다.
- 필요 시 간단한 스크립트로 Markdown 링크 존재 여부를 확인한다.

## 롤백
- 이번 작업으로 추가된 위키 페이지와 context 문서를 제거하고, 수정된 `wiki/index.md`, `wiki/overview.md`, `wiki/log.md`, 관련 concept/entity 페이지를 이전 상태로 되돌리면 된다.

## 리스크
- 같은 날 Expo scaffold와 native tabs prebuild가 연속으로 일어나 source granularity가 애매할 수 있다.
- 운영 hygiene 변경(`.playwright-cli/` ignore)은 위키에 과도하게 자세히 적으면 제품 지식 대비 잡음이 될 수 있다.
- mobile shell은 아직 placeholder 화면 단계라 제품 기능으로 과대해석하지 않도록 표현을 조절해야 한다.

## 결과
- 완료
- 2026-04-11 모바일 앱 전개와 운영 hygiene 변경을 `wiki/sources/` 2개 페이지로 정리했다.
- `wiki/concepts/mobile-native-shell.md`와 `wiki/entities/parrotkit-app.md`를 추가하고, 기존 `ParrotKit`, `dev-only` 관련 페이지를 보강했다.
- `wiki/index.md`, `wiki/overview.md`, `wiki/log.md`를 최신 상태로 갱신했다.
- `make cl`로 위키 내 AppleDouble 메타파일을 정리한 뒤, 간단한 Python 링크 검사로 내부 Markdown 링크가 모두 유효한지 확인했다.

## 연결 context
- `context/context_20260411_llm_wiki_mobile_ops_ingest.md`
