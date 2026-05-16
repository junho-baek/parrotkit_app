# ParrotKit | ParrotKit

## Summary

ParrotKit은 레퍼런스 영상과 브랜드 컨텍스트를 바탕으로 creator가 실제로 촬영 가능한 recipe를 만들고, 이를 shooting surface에서 바로 실행하게 돕는 제품으로 정리된다.

## Relevant Facts

- 제품은 `Analysis`, `Recipe`, `Shooting/Prompter` 세 레이어를 하나의 연속된 흐름으로 본다.
- 브랜드 PDF/브리프는 reference video와 다른 입력이며, structured brief로 정규화하는 방향이 명시돼 있다.
- 웹 중심 제품에서 출발했지만, 2026-04-11부터는 `parrotkit-app/`이라는 별도 Expo mobile shell이 생겼고, 2026년 4월 말~5월 중순에는 실제 앱 제품 surface가 빠르게 누적됐다.
- 최근 context 대부분은 native shooting board, Home/Paste navigation, recipe creation, My Take completion, Recipe Analysis Contract에 집중돼 있다.

## Timeline

- 2026-04-01: Git/작업 운영 규칙이 `dev-only` 기준으로 정리됐다.
- 2026-04-06: 도메인 전략이 문서화됐고 recipe screen이 `Analysis / Recipe / Prompter` 구조로 리팩터됐다.
- 2026-04-08: recipe/shooting UI 반복 정리, 저장 안정화, drawer 복원, design rollback이 연속적으로 진행됐다.
- 2026-04-11: `parrotkit-app` Expo 앱이 추가됐고, 같은 날 native tabs prebuild와 iOS simulator 검증까지 진행됐다.
- 2026-04-26~04-29: 웹 recipe 구조와 prompter 기능이 네이티브 앱으로 이식되고 local take projects가 도입됐다.
- 2026-05-03: 앱의 recipe detail이 Shoot Board 중심으로 전환됐다.
- 2026-05-17: Sandcastle식 insight를 보존하는 Recipe Analysis Contract와 Board/Breakdown UI 경계가 정리됐다.

## Related Concepts

- [분석-레시피-슈팅 스택 | Analysis-Recipe-Shooting Stack](../concepts/analysis-recipe-shooting-stack.md)
- [브랜드 컨텍스트 정규화 | Brand Context Normalization](../concepts/brand-context-normalization.md)
- [dev-only 멀티클론 워크플로 | Dev-Only Multi-Clone Workflow](../concepts/dev-only-multi-clone-workflow.md)
- [모바일 네이티브 셸 | Mobile Native Shell](../concepts/mobile-native-shell.md)
- [네이티브 촬영 보드 | Native Shooting Board](../concepts/native-shooting-board.md)
- [레시피 분석 계약 | Recipe Analysis Contract](../concepts/recipe-analysis-contract.md)

## Sources

- [도메인 제품 전략 | Domain AGENTS Product Strategy](../sources/domain-agents-product-strategy.md)
- [레시피 화면 3레이어 리팩터 | Recipe Screen Refactor: Analysis / Recipe / Shooting](../sources/recipe-screen-refactor-analysis-recipe-shooting.md)
- [4월 8일 레시피/슈팅 UI 반복 정리 | April 8 Recipe/Shooting UI Iteration Bundle](../sources/apr-08-recipe-shooting-ui-iteration-bundle.md)
- [dev-only 운영 규칙 보정 | AGENTS Dev-Only Correction](../sources/agents-dev-only-correction.md)
- [모바일 네이티브 셸 전개 | Parrotkit App Mobile Native Shell on April 11](../sources/parrotkit-app-mobile-native-shell-apr-11.md)
- [2026년 5월 네이티브 앱 시드/플랜/컨텍스트 묶음 | May 2026 Native App Seeds, Plans, And Context](../sources/may-2026-native-app-seeds-plans-context.md)
