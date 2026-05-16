# 모바일 네이티브 셸 | Mobile Native Shell

## Summary

ParrotKit의 mobile layer는 `parrotkit-app/`이라는 별도 Expo 프로젝트로 시작됐고, Expo Router/native tabs 기반 셸에서 출발했다. 2026년 5월 이후에는 단순 shell보다 Home/Paste/Explore/Recipes/My navigation, recipe creation drawer, Shoot Board, native prompter, local take projects를 가진 앱 제품 surface로 읽어야 한다.

## Current Understanding

- 모바일 앱은 루트 저장소 안의 nested Expo project로 관리된다.
- navigation 구조는 몇 차례 흔들렸지만, 2026-05-16 correction 이후 최신 제품 방향은 `Home`, `Explore`, centered `Paste`, `Recipes`, `My` 다섯 slot이다.
- 초기 탭 바는 `expo-router/unstable-native-tabs` 기반 네이티브 바를 우선했지만, centered `Paste` action과 drawer behavior를 유지하기 위해 custom/native-feeling bar 선택지도 열려 있다.
- iOS simulator build/install까지 한 번 검증된 상태라, 이제부터는 정보 구조와 실제 기능 이식을 얹는 단계로 볼 수 있다.
- prebuild/pod install 과정에서 AppleDouble `._*` 메타파일이 native build를 깨뜨릴 수 있어 `make cl`이 모바일 개발에서도 중요하게 작동한다.
- 최근 iPhone QA는 CoreSimulator/Xcode wrapper timeout과 dev-client linker 문제로 불안정하다. Android evidence와 iOS evidence의 fresh 여부를 분리해 읽어야 한다.

## Evidence

- [모바일 네이티브 셸 전개 | Parrotkit App Mobile Native Shell on April 11](../sources/parrotkit-app-mobile-native-shell-apr-11.md)
- [Playwright CLI 작업트리 정리 | Playwright CLI Worktree Ignore](../sources/playwright-cli-ignore.md)

## Contradictions

- 웹앱은 브랜드 표현이 강한 custom bottom nav를 사용하지만, mobile shell은 현재 플랫폼 기본 affordance를 우선한다.
- 현재 탭 화면은 placeholder 중심이라 "mobile shell 존재"와 "모바일 제품 기능 완성"을 같은 의미로 읽으면 안 된다.

## Open Questions

- mobile shell 안에서 `Analysis -> Recipe -> Shooting`을 동일한 탭 구조로 유지할지, 네이티브 관점에서 재배치할지 결정이 필요하다.
- auth, data fetching, shared types를 웹과 어떤 형태로 공용화할지 아직 정의되지 않았다.
- 장기적으로 `unstable-native-tabs`를 계속 유지할지, custom tabs나 다른 native navigator로 옮길지 아직 열려 있다.
- root `context/`와 nested `parrotkit-app/context/` 중 어느 쪽이 앱 작업의 canonical history인지 아직 정리되지 않았다.

## Related Pages

- [ParrotKit](../entities/parrotkit.md)
- [ParrotKit App | Parrotkit App](../entities/parrotkit-app.md)
- [분석-레시피-슈팅 스택 | Analysis-Recipe-Shooting Stack](analysis-recipe-shooting-stack.md)
- [dev-only 멀티클론 워크플로 | Dev-Only Multi-Clone Workflow](dev-only-multi-clone-workflow.md)
- [네이티브 촬영 보드 | Native Shooting Board](native-shooting-board.md)
