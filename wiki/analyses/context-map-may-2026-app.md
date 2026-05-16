# 2026년 5월 앱 context 맵 | Context Map for May 2026 App Work

## Question

2026년 5월의 seed, plan, context, superpower plan은 어떤 순서로 읽어야 현재 `parrotkit-app` 상태를 빠르게 이해할 수 있는가?

## Answer

먼저 4월 말 superpower 계획을 읽어야 한다. 이 계획들이 웹 recipe model을 네이티브 앱으로 옮기는 바닥을 만들었다. 다음으로 5월 2-10일 root `context/`를 읽으면 Home/Explore/Recipes, recipe create, Shoot Board, mock asset, link generation fallback이 어떻게 앱 제품으로 다듬어졌는지 보인다. 그 다음 5월 14-16일 nested `parrotkit-app/context/`의 seed와 issue burn-down을 읽으면 v1 navigation, Home Continue, My Take completion, Paste CTA, QA evidence의 acceptance criteria가 보인다. 마지막으로 5월 17일 seed와 context를 보면 현재 방향이 `Recipe Analysis Contract`와 `Board / Breakdown`, active shooting session board로 수렴했음을 알 수 있다.

## Reading Order

- 시작점: [2026년 5월 네이티브 앱 시드/플랜/컨텍스트 묶음 | May 2026 Native App Seeds, Plans, And Context](../sources/may-2026-native-app-seeds-plans-context.md)
- 제품 구조: [분석-레시피-슈팅 스택 | Analysis-Recipe-Shooting Stack](../concepts/analysis-recipe-shooting-stack.md)
- 앱 실행 surface: [네이티브 촬영 보드 | Native Shooting Board](../concepts/native-shooting-board.md)
- 분석 저장 계약: [레시피 분석 계약 | Recipe Analysis Contract](../concepts/recipe-analysis-contract.md)
- 앱 entity: [ParrotKit App | Parrotkit App](../entities/parrotkit-app.md)

## Source Topology

- `context/`: 원래 웹 프로젝트 문맥과 4월 말~5월 초 네이티브 앱 context가 함께 있다. 2026-05-10까지의 app UI/flow 작업도 여기에 많이 남아 있다.
- `plans/`: root-level 작업 계획이 많고, 웹과 앱 작업이 함께 섞여 있다.
- `docs/superpowers/plans/`: 4월 말 web parity, native prompter, shoot-first ownership, local take projects 같은 큰 앱 방향 계획이 있다.
- `parrotkit-app/context/`: 2026-05-14 이후 nested Expo 앱 중심의 seed, issue, QA, refactor context가 집중되어 있다.
- `parrotkit-app/plans/`: 같은 기간의 매우 세분화된 작업 plan이 쌓여 있다.
- `parrotkit-app/docs/superpowers/plans/`: GitHub issue burn-down과 UI burn-down 같은 agentic execution 계획이 있다.
- `parrotkit-app/seeds/`: durable product/spec seed가 들어간다. 2026-05-17 기준 가장 중요한 것은 `parrotkit_recipe_analysis_contract_20260517.yaml`이다.

## Timeline Compression

- 2026-04-26~04-29: 웹 parity, native prompter parity, recipe detail parity, shoot-first ownership, local take projects.
- 2026-05-02~05-03: Home/Explore/Recipes redesign, recipe execution cockpit, native Shoot Board.
- 2026-05-05~05-10: reusable shooting board, reference/take viewers, recipe create drawer/assets, link generation fallback, Recipe Asset save/publish mock flow.
- 2026-05-14~05-15: v1 nav realignment, Home Continue, required My Take completion, passive next-cut guidance.
- 2026-05-16: Paste-centered navigation correction, Source removal, Android/iPhone QA package attempts, Explore/Board/Home simplification, DDD architecture cleanup.
- 2026-05-17: Recipe Analysis Contract seed, Board/Breakdown UI boundary, reference anchor restore, active shooting session board redesign, cut row label cleanup.

## Current Product Reading

- ParrotKit은 더 이상 단순 web app + placeholder mobile shell로 읽으면 안 된다.
- nested `parrotkit-app/`는 촬영 실행 중심의 native product surface다.
- 웹 프로젝트 문맥은 여전히 root에 남아 있지만, 최근 product iteration의 중심은 Expo 앱의 Home/Paste/Explore/Recipes/My navigation과 recipe shooting board다.
- `Recipe Analysis Contract`는 future AI/video ingestion을 위한 저장 계약이고, immediate UI는 `Board`와 `Breakdown`의 projection boundary가 진실값이다.

## Residual Risks

- 문서가 root와 nested app 아래에 나뉘어 있어, 최신 상태를 볼 때 root `context/`만 읽으면 5월 14-17일 앱 흐름을 놓친다.
- 반대로 nested `parrotkit-app/context/`만 읽으면 4월 말 web parity와 5월 초 recipe create/Shoot Board 진화의 배경을 놓친다.
- 같은 issue에서도 seed가 supersede된 경우가 있으므로 최신 파일만 볼 것이 아니라 `supersedes`, `update_reason`, user correction을 확인해야 한다.
- QA evidence는 Android/iPhone 여부와 fresh capture 여부를 구분해야 한다.

## Follow-up

- 2026-05-10 recipe create/asset/publish 흐름은 별도 source page로 분리할 가치가 있다.
- `parrotkit-app/docs/reference-analysis/sandcastle-breakdown-schema-and-prompt.md`는 `Recipe Analysis Contract`의 prompt/schema source로 추가 ingest할 수 있다.
- iPhone/CoreSimulator reliability는 QA operations concept로 분리할 수 있다.
