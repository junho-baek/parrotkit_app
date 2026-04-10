# Context - LLM Wiki Initial Context Ingest

## 작업 요약
- `llm-wiki` 스킬 기준으로 저장소에 `wiki/` 구조를 새로 만들고, 최근 핵심 `context/` 문서를 재사용 가능한 wiki source/concept/entity/analysis 페이지로 정리했다.
- 이번 1차 ingest는 2026-04-01부터 2026-04-08 사이의 고신호 문서에 집중했다.
  - 제품 레이어 전략 (`src/AGENTS.md`, 2026-04-06 context)
  - recipe screen 3레이어 refactor
  - prompter debounce 리뷰와 후속 저장 안정화
  - 2026-04-08 recipe/shooting UI 반복 및 rollback
  - `dev-only / multi-clone` 운영 규칙 보정
- `wiki/index.md`, `wiki/overview.md`, `wiki/log.md`를 프로젝트 문맥에 맞게 채우고, 이후 남은 context를 이어서 ingest할 수 있는 인덱스를 만들었다.

## 변경 파일
- `plans/20260411_llm_wiki_context_ingest.md`
- `wiki/index.md`
- `wiki/overview.md`
- `wiki/log.md`
- `wiki/sources/domain-agents-product-strategy.md`
- `wiki/sources/recipe-screen-refactor-analysis-recipe-shooting.md`
- `wiki/sources/sync-remote-review-59da22e.md`
- `wiki/sources/prompter-persistence-custom-blocks.md`
- `wiki/sources/apr-08-recipe-shooting-ui-iteration-bundle.md`
- `wiki/sources/agents-dev-only-correction.md`
- `wiki/concepts/analysis-recipe-shooting-stack.md`
- `wiki/concepts/brand-context-normalization.md`
- `wiki/concepts/prompter-persistence-and-inline-editing.md`
- `wiki/concepts/recipe-detail-ui-simplification.md`
- `wiki/concepts/dev-only-multi-clone-workflow.md`
- `wiki/entities/parrotkit.md`
- `wiki/entities/recipe-result.md`
- `wiki/entities/camera-shooting.md`
- `wiki/analyses/context-map-april-2026.md`
- `context/context_20260411_llm_wiki_context_ingest.md`

## 검증
- `python3 /Users/junho/.codex/skills/llm-wiki/scripts/init_wiki.py /Volumes/T7/플젝/deundeunApp/Parrotkit`
- `make cl`
- `find wiki -type f | sort`
- placeholder 문구 검색
  - `rg -n 'Add one bullet|Describe what this wiki covers|Summarize the current synthesis|Add unresolved questions|Add concept pages here|Add entity pages here|Add durable query outputs here' wiki`
  - 결과 없음
- 내부 Markdown 링크 확인
  - `python3` 스크립트로 `wiki/**/*.md`의 상대 링크 존재 여부 검사
  - 결과: `OK`

## 남은 리스크
- 3월 context 문서는 아직 wiki concept/entity에 본격 편입하지 않았다.
- 일부 same-day UI 변경은 context끼리도 빠르게 엇갈리므로, 실제 최종 구현은 필요 시 코드 기준 재확인이 필요하다.
- 배포 QA와 Playwright 산출물은 아직 wiki source로 연결하지 않아 "의도 vs 실제 동작" 지식 축이 분리돼 있다.

## 다음 액션 제안
- 다음 ingest 패스에서 3월 context를 scene detection / Supabase / onboarding / dashboard 축으로 확장한다.
- 배포 QA 리포트와 스크린샷 산출물을 `wiki/sources/` 또는 `wiki/analyses/`로 연결해 운영 판단 근거를 보강한다.
