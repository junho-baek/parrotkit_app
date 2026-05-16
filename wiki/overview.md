# 개요 | Overview

## Scope

이 위키는 ParrotKit 저장소의 `context/` 문서와 관련 운영/도메인 규칙을 재사용 가능한 지식 구조로 바꾸기 위한 시작점이다. 현재 범위는 2026-04-01부터 2026-04-08 사이의 웹 제품 구조 개편, 2026-04-11의 Expo mobile shell 전개, agent 작업트리 hygiene 정리, 2026년 4월 말~5월 중순 `parrotkit-app` 중심의 seed/plan/context/superpower plan 정리까지 포함한다.

## Current Thesis

- ParrotKit의 제품 진실값은 `원본 분석 -> 실행 레시피 -> 촬영 실행`의 연속된 흐름이다.
- 2026-04-06 리팩터는 이 흐름을 `scene.analysis`, `scene.recipe`, `scene.prompter` nested 구조와 3탭 UI로 고정하려는 시도였다.
- 2026-04-08의 다수 context는 그 구조 위에서 무엇을 더 보이고 무엇을 drawer로 숨길지, 그리고 cue를 얼마나 직접적이고 가볍게 편집하게 할지 조정하는 과정이었다.
- 운영 측면에서는 `dev-only / multi-clone`이 문서와 실제 작업 기준선으로 확정되었다.
- 2026-04-11부터는 `parrotkit-app/` Expo 프로젝트가 생기며 mobile shell이 실제 코드 레이어로 추가됐고, 모바일 하단 네비게이션은 웹의 custom bar보다 native tabs를 우선하는 방향으로 출발했다.
- 2026년 4월 말 이후 `parrotkit-app/`는 단순 mobile shell이 아니라 web recipe parity, native prompter parity, local take project, Home/Explore/Recipes, recipe create drawer, Shoot Board를 가진 앱 제품 surface로 빠르게 성장했다.
- 2026년 5월 중순의 최신 앱 문맥은 `Recipe Analysis Contract`를 저장 계약으로 삼고, UI에서는 `Board / Breakdown` 경계를 통해 분석 taxonomy와 촬영 실행 surface를 분리하는 쪽으로 수렴했다.
- 최근 사용자의 반복 피드백은 "더 적은 라벨, 더 적은 중첩 카드, 더 명확한 Reference/My Take, 더 session-like한 촬영 보드"로 압축된다.

## Open Questions

- `Prompter`와 `Shooting` 명칭 중 어떤 표현이 최종 사용자-facing 용어로 굳어질지 아직 완전히 닫히지 않았다.
- analysis 탭의 근거 정보는 어디까지 본문에 두고 어디까지 script drawer로 밀어넣을지가 계속 흔들렸다.
- context는 빠르게 축적되고 있지만, 아직 3월의 오래된 문서 다수는 위키 concept/entity와 연결되지 않았다.
- 배포 QA/실사용 피드백 문서가 별도 knowledge layer로 정리되지는 않아, UI 판단의 장기적 근거 추적은 더 보강할 수 있다.
- mobile shell과 웹앱의 타입/디자인/API 공유 전략은 일부 native recipe domain으로 진전됐지만, 실제 API/schema/source of truth 경계는 아직 정리되지 않았다.
- root `context/`와 nested `parrotkit-app/context/`가 함께 쓰이면서 5월 앱 문맥이 흩어져 있다. 최신 상태를 확인할 때는 두 축을 함께 봐야 한다.
- iPhone fresh QA는 CoreSimulator/Xcode/dev-client 문제로 자주 막혔기 때문에 Android evidence, Expo Go iOS evidence, stale/copied iOS evidence를 구분해서 읽어야 한다.

## Key Pages

- [분석-레시피-슈팅 스택 | Analysis-Recipe-Shooting Stack](concepts/analysis-recipe-shooting-stack.md)
- [프롬프터 지속성 및 인라인 편집 | Prompter Persistence And Inline Editing](concepts/prompter-persistence-and-inline-editing.md)
- [레시피 상세 UI 단순화 | Recipe Detail UI Simplification](concepts/recipe-detail-ui-simplification.md)
- [dev-only 멀티클론 워크플로 | Dev-Only Multi-Clone Workflow](concepts/dev-only-multi-clone-workflow.md)
- [모바일 네이티브 셸 | Mobile Native Shell](concepts/mobile-native-shell.md)
- [네이티브 촬영 보드 | Native Shooting Board](concepts/native-shooting-board.md)
- [레시피 분석 계약 | Recipe Analysis Contract](concepts/recipe-analysis-contract.md)
- [2026년 4월 context 맵 | Context Map for April 2026](analyses/context-map-april-2026.md)
- [2026년 5월 앱 context 맵 | Context Map for May 2026 App Work](analyses/context-map-may-2026-app.md)
