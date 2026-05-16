# ParrotKit App | Parrotkit App

## Summary

`parrotkit-app`은 ParrotKit 저장소 안에 생성된 별도 Expo 모바일 앱이다. 2026-04-11에는 Expo Router 기반 mobile shell이었지만, 2026년 4월 말~5월 중순 작업을 거치며 web recipe parity, native prompter, local take projects, recipe creation drawer, centered Paste action, native shooting board를 가진 앱 제품 surface로 성장했다.

## Relevant Facts

- 저장 경로는 루트 저장소 하위 `parrotkit-app/`이다.
- `expo-router/entry`를 진입점으로 사용한다.
- 네이티브/app navigation은 시기별로 흔들렸지만, 2026-05-16 최신 correction은 `Home`, `Explore`, centered `Paste`, `Recipes`, `My` 다섯 slot 구조다.
- iOS simulator build/install과 dev client reopen까지 한 번 성공했다.
- bundle/package identifier는 아직 `com.anonymous.parrotkitapp` 기본값이다.
- `/recipe/:id`는 2026년 5월 이후 설명형 detail page보다 shooting board 진입점으로 읽는 편이 맞다.
- Home Continue는 required cut별 saved My Take completion을 기준으로 미완료 board overview를 연다.
- `Recipe Analysis Contract`는 저장 계약이고, `Board / Breakdown`은 촬영 UI projection boundary다.

## Timeline

- 2026-04-11: blank Expo TypeScript 앱으로 최초 scaffold가 생성됐다.
- 2026-04-11: 같은 날 Expo Router native tabs, prebuild, iOS simulator run까지 진행됐다.
- 2026-04-26~04-29: web recipe parity, native prompter parity, recipe detail parity, shoot-first recipe ownership, local take projects가 적용됐다.
- 2026-05-03: recipe detail 기본 화면이 native Shoot Board로 바뀌었다.
- 2026-05-14~05-16: v1 navigation, Home Continue, My Take completion, Paste CTA, GitHub issue burn-down이 seed/plan 중심으로 정리됐다.
- 2026-05-17: Recipe Analysis Contract seed, Board/Breakdown UI, active shooting session board redesign, reference anchor/label cleanup이 이어졌다.

## Related Concepts

- [모바일 네이티브 셸 | Mobile Native Shell](../concepts/mobile-native-shell.md)
- [분석-레시피-슈팅 스택 | Analysis-Recipe-Shooting Stack](../concepts/analysis-recipe-shooting-stack.md)
- [네이티브 촬영 보드 | Native Shooting Board](../concepts/native-shooting-board.md)
- [레시피 분석 계약 | Recipe Analysis Contract](../concepts/recipe-analysis-contract.md)

## Sources

- [모바일 네이티브 셸 전개 | Parrotkit App Mobile Native Shell on April 11](../sources/parrotkit-app-mobile-native-shell-apr-11.md)
- [2026년 5월 네이티브 앱 시드/플랜/컨텍스트 묶음 | May 2026 Native App Seeds, Plans, And Context](../sources/may-2026-native-app-seeds-plans-context.md)
