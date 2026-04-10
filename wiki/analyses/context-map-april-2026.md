# 2026년 4월 context 맵 | Context Map for April 2026

## Question

최근 context 문서들은 ParrotKit의 현재 상태와 우선순위를 어떻게 설명하고 있는가?

## Answer

4월 초 context는 크게 세 축으로 읽힌다. 첫째, 2026-04-06에 제품 구조가 `Analysis / Recipe / Shooting` 스택과 nested scene 계약으로 재정의됐다. 둘째, 2026-04-08에는 그 구조 위에서 recipe detail과 shooting UI를 더 실행 중심으로 단순화하는 빠른 반복이 이어졌다. 셋째, 운영 측면에서는 `dev-only / multi-clone`과 문서 중심 작업 흐름이 저장소의 사실상 기본 운영 규칙으로 굳어졌다.

## Supporting Evidence

- [분석-레시피-슈팅 스택 | Analysis-Recipe-Shooting Stack](../concepts/analysis-recipe-shooting-stack.md)
- [프롬프터 지속성 및 인라인 편집 | Prompter Persistence And Inline Editing](../concepts/prompter-persistence-and-inline-editing.md)
- [레시피 상세 UI 단순화 | Recipe Detail UI Simplification](../concepts/recipe-detail-ui-simplification.md)
- [dev-only 멀티클론 워크플로 | Dev-Only Multi-Clone Workflow](../concepts/dev-only-multi-clone-workflow.md)
- [레시피 화면 3레이어 리팩터 | Recipe Screen Refactor: Analysis / Recipe / Shooting](../sources/recipe-screen-refactor-analysis-recipe-shooting.md)
- [4월 8일 레시피/슈팅 UI 반복 정리 | April 8 Recipe/Shooting UI Iteration Bundle](../sources/apr-08-recipe-shooting-ui-iteration-bundle.md)

## Implications

- 앞으로 recipe/shooting 기능을 수정할 때는 새 context를 단순히 누적하기보다, 기존 concept/entity 페이지를 갱신하는 쪽이 더 검색성과 유지보수성이 높다.
- `RecipeResult`와 `CameraShooting`은 knowledge hotspot이므로, 관련 변경은 위키에서 이 두 entity를 중심으로 추적하는 것이 효율적이다.
- design rollback이나 drawer 복원처럼 빠른 방향 전환이 있었으므로, 최신 상태를 확인할 때는 개별 context를 시간순으로 읽기보다 concept/source bundle 페이지를 먼저 보는 편이 안전하다.

## Follow-up

- 3월 context를 두 번째 ingest 패스로 편입해 scene detection, Supabase, onboarding, dashboard 관련 축을 넓힌다.
- 배포 QA 결과물과 Playwright 산출물을 별도 source/analysis로 연결해 "문서상 의도"와 "실제 동작"을 함께 비교할 수 있게 만든다.
- inline edit의 최종 code-level 구현과 analysis evidence 최종 배치를 별도 lint pass에서 점검한다.
