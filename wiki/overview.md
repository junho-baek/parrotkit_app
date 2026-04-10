# 개요 | Overview

## Scope

이 위키는 ParrotKit 저장소의 `context/` 문서와 관련 운영/도메인 규칙을 재사용 가능한 지식 구조로 바꾸기 위한 시작점이다. 현재 범위는 주로 2026-04-01부터 2026-04-08 사이의 제품 구조 개편, recipe/shooting UI 반복, Git 운영 규칙 정리다.

## Current Thesis

- ParrotKit의 제품 진실값은 `원본 분석 -> 실행 레시피 -> 촬영 실행`의 연속된 흐름이다.
- 2026-04-06 리팩터는 이 흐름을 `scene.analysis`, `scene.recipe`, `scene.prompter` nested 구조와 3탭 UI로 고정하려는 시도였다.
- 2026-04-08의 다수 context는 그 구조 위에서 무엇을 더 보이고 무엇을 drawer로 숨길지, 그리고 cue를 얼마나 직접적이고 가볍게 편집하게 할지 조정하는 과정이었다.
- 운영 측면에서는 `dev-only / multi-clone`이 문서와 실제 작업 기준선으로 확정되었다.

## Open Questions

- `Prompter`와 `Shooting` 명칭 중 어떤 표현이 최종 사용자-facing 용어로 굳어질지 아직 완전히 닫히지 않았다.
- analysis 탭의 근거 정보는 어디까지 본문에 두고 어디까지 script drawer로 밀어넣을지가 계속 흔들렸다.
- context는 빠르게 축적되고 있지만, 아직 3월의 오래된 문서 다수는 위키 concept/entity와 연결되지 않았다.
- 배포 QA/실사용 피드백 문서가 별도 knowledge layer로 정리되지는 않아, UI 판단의 장기적 근거 추적은 더 보강할 수 있다.

## Key Pages

- [분석-레시피-슈팅 스택 | Analysis-Recipe-Shooting Stack](concepts/analysis-recipe-shooting-stack.md)
- [프롬프터 지속성 및 인라인 편집 | Prompter Persistence And Inline Editing](concepts/prompter-persistence-and-inline-editing.md)
- [레시피 상세 UI 단순화 | Recipe Detail UI Simplification](concepts/recipe-detail-ui-simplification.md)
- [dev-only 멀티클론 워크플로 | Dev-Only Multi-Clone Workflow](concepts/dev-only-multi-clone-workflow.md)
- [2026년 4월 context 맵 | Context Map for April 2026](analyses/context-map-april-2026.md)
