# 모바일 네이티브 셸 전개 | Parrotkit App Mobile Native Shell on April 11

## Summary

2026-04-11 context 묶음은 ParrotKit 저장소 안에 `parrotkit-app`이라는 Expo 모바일 앱을 새로 만들고, 같은 날 Expo Router 기반 native tabs 셸로 바로 전환해 iOS simulator까지 검증한 기록이다. 이 문맥 이후 ParrotKit은 웹 중심 제품이면서도 별도 mobile shell을 가진 코드베이스로 읽어야 한다.

## Key Points

- 루트 저장소 하위에 `parrotkit-app/` Expo 앱이 생성됐고, 초기 상태는 blank TypeScript 템플릿이었다.
- 이후 같은 날 `expo-router/entry` 진입점, `app/` 라우트 구조, `expo-router/unstable-native-tabs` 기반 5개 탭(`Home`, `Explore`, `Paste`, `Recipes`, `My`)이 추가됐다.
- 모바일 하단 네비게이션은 웹의 custom glass bar 복제보다 시스템 네이티브 탭 바를 우선하는 방향으로 결정됐다.
- `npx expo prebuild --clean`, `pod install`, `npx expo run:ios -d "iPhone 17" --no-build-cache`까지 성공해 native project 생성과 iOS simulator 설치/실행이 확인됐다.
- `app.json`의 bundle/package identifier는 아직 `com.anonymous.parrotkitapp` 기본값이라, 현재 단계는 기능 완성보다 mobile shell baseline 확보에 가깝다.

## Entities

- [ParrotKit](../entities/parrotkit.md)
- [ParrotKit App | Parrotkit App](../entities/parrotkit-app.md)

## Concepts

- [모바일 네이티브 셸 | Mobile Native Shell](../concepts/mobile-native-shell.md)
- [dev-only 멀티클론 워크플로 | Dev-Only Multi-Clone Workflow](../concepts/dev-only-multi-clone-workflow.md)

## Contradictions

- 같은 날 초반 scaffold 시점에는 blank Expo 템플릿만 있었지만, 이후 native tabs prebuild 문맥이 그 상태를 supersede한다.
- 웹 하단 네비게이션은 custom brand glass 표현을 적극 사용하지만, 모바일 앱은 현재 시스템 네이티브 탭 바를 우선한다.

## Open Questions

- `parrotkit-app`이 장기적으로 웹앱과 디자인 토큰, 타입, API 계약을 얼마나 공유할지 아직 정해지지 않았다.
- mobile shell 안에 실제 `Analysis -> Recipe -> Shooting` 흐름을 어느 순서로 이식할지 정의가 필요하다.
- bundle identifier/package를 실제 프로젝트 값으로 언제 바꿀지 남아 있다.

## Source Details

- Source files:
  - `context/context_20260411_parrotkit_app_expo_scaffold.md`
  - `context/context_20260411_parrotkit_app_native_tabs_prebuild.md`
- Date: 2026-04-11
