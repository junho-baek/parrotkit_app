# 20260411 LLM Wiki Context Ingest

## 배경
- `context/`에 누적된 작업 기록이 많아지면서 최근 제품 구조와 의사결정 흐름을 한 번에 파악하기 어려워졌다.
- 사용자는 `llm-wiki` 스킬 기준으로 context 문서를 읽고, 재사용 가능한 프로젝트 위키 형태로 정리해 달라고 요청했다.
- 현재 저장소에는 `wiki/` 구조가 없어, 반복 질의와 후속 ingest를 위한 기본 뼈대를 먼저 만들어 둘 필요가 있다.

## 목표
- `wiki/` 기본 구조를 만들고, 최근 핵심 context 흐름을 source / concept / entity / overview 형태로 정리한다.
- 최신 제품 문맥에서 중요한 화면 구조 변화와 운영 규칙을 빠르게 찾을 수 있는 index/log를 만든다.
- 이후 남은 context 문서를 점진적으로 ingest할 수 있도록 링크 구조와 확장 방향을 남긴다.

## 범위
- `llm-wiki` 규칙에 맞는 `wiki/` 스캐폴드 생성
- 최근 핵심 context 문서 기반 source 페이지 작성
- 제품 주요 개념과 핵심 엔티티 페이지 작성
- `wiki/index.md`, `wiki/overview.md`, `wiki/log.md` 작성
- 이번 위키 정리 결과를 기록하는 신규 `context` 문서 작성

## 변경 파일
- `plans/20260411_llm_wiki_context_ingest.md`
- `wiki/index.md`
- `wiki/log.md`
- `wiki/overview.md`
- `wiki/sources/*`
- `wiki/concepts/*`
- `wiki/entities/*`
- `wiki/analyses/*` (필요 시)
- `context/context_20260411_llm_wiki_context_ingest.md`

## 테스트
- 생성된 Markdown 파일의 링크 구조와 경로를 육안 점검한다.
- `wiki/index.md`에서 주요 페이지로 이동 가능한지 확인한다.
- `git diff --stat` 및 `rg --files wiki context | sort`로 생성 범위를 확인한다.

## 롤백
- 이번 작업으로 생성된 `wiki/` 하위 파일과 신규 context 문서를 제거하면 작업 전 상태로 되돌릴 수 있다.
- 기존 원본 `context/` 문서는 수정하지 않고 신규 위키 문서만 추가해 롤백 비용을 낮춘다.

## 리스크
- 모든 historical context를 한 번에 완전 요약하지는 못할 수 있다.
- 일부 context는 파일명만으로는 우선순위 판단이 어려워, 현재는 최근 고신호 문서 위주로 ingest한다.
- 문서 간 상충점은 이번 턴에서 모두 해소하기보다 `Contradictions`/`Open Questions`로 남길 수 있다.

## 결과
- 완료
- `llm-wiki` 구조에 맞춰 `wiki/`를 스캐폴드하고 source/concept/entity/analysis 페이지를 작성했다.
- 최근 핵심 context 흐름을 제품 구조, UI 반복, 운영 규칙 축으로 재정리했다.
- `make cl`로 AppleDouble 메타파일을 정리한 뒤, 위키 내부 Markdown 링크가 모두 유효한지 확인했다.

## 연결 context
- `context/context_20260411_llm_wiki_context_ingest.md`
