# ParrotKit App | Parrotkit App

## Summary

`parrotkit-app`은 ParrotKit 저장소 안에 생성된 별도 Expo 모바일 앱이다. 현재 상태는 Expo Router native tabs 기반의 mobile shell이며, 실제 제품 기능보다는 네이티브 컨테이너와 정보 구조의 시작점을 제공하는 역할에 가깝다.

## Relevant Facts

- 저장 경로는 루트 저장소 하위 `parrotkit-app/`이다.
- `expo-router/entry`를 진입점으로 사용한다.
- 네이티브 탭은 `Home`, `Explore`, `Paste`, `Recipes`, `My` 다섯 개다.
- iOS simulator build/install과 dev client reopen까지 한 번 성공했다.
- bundle/package identifier는 아직 `com.anonymous.parrotkitapp` 기본값이다.

## Timeline

- 2026-04-11: blank Expo TypeScript 앱으로 최초 scaffold가 생성됐다.
- 2026-04-11: 같은 날 Expo Router native tabs, prebuild, iOS simulator run까지 진행됐다.

## Related Concepts

- [모바일 네이티브 셸 | Mobile Native Shell](../concepts/mobile-native-shell.md)
- [분석-레시피-슈팅 스택 | Analysis-Recipe-Shooting Stack](../concepts/analysis-recipe-shooting-stack.md)

## Sources

- [모바일 네이티브 셸 전개 | Parrotkit App Mobile Native Shell on April 11](../sources/parrotkit-app-mobile-native-shell-apr-11.md)
