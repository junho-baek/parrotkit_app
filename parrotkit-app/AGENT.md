# Parrotkit App Agent Guide

## 목적
- 이 문서는 `parrotkit-app` 모바일 앱 작업 기준을 앱 단위로 고정하기 위한 운영 메모다.

## 구조 원칙
- Expo Router route 파일은 `src/app`에만 둔다.
- `src/app` 파일은 최대한 얇게 유지하고, 실제 UI/로직은 `src/core`와 `src/features`로 이동한다.
- 공용 기반은 `src/core`에 둔다.
  - `ui/`: 공용 컴포넌트
  - `theme/`: 색상, 토큰, 네비게이션 테마
  - `providers/`: 앱 루트 provider
  - `navigation/`: native tabs, modal shell 같은 앱 레벨 내비게이션 구성
- 도메인 기능은 `src/features/<domain>` 아래에 둔다.
  - 도메인 이름은 `profile`, `media-assets`, `diary-entry`처럼 사람이 바로 읽을 수 있게 짓는다.

## 내비게이션 원칙
- 기본 루트는 Expo Router + native tabs를 유지한다.
- `Source`는 incoming draft, import 상태, source history를 모아두는 destination tab으로 유지한다.
- 빠른 입력 액션은 특정 화면 내부 버튼보다 탭 셸 전역의 floating CTA가 소유하고, 실제 흐름은 modal, sheet, drawer 같은 stacked action flow로 연다.
- route 파일에서 복잡한 데이터 조합을 하지 말고, feature screen을 바로 연결한다.

## 스타일링 원칙
- 기본 스타일링 방식은 NativeWind다.
- 반복 스타일은 유틸리티 클래스 기준으로 작성하고, 동적 색상/플랫폼 값처럼 필요한 경우에만 `style` prop을 보조적으로 쓴다.
- `TouchableOpacity` 대신 `Pressable`을 기본으로 사용한다.

## 구현 메모
- `Source`는 현재 가운데 destination tab이며, 앱 전역 `Add Source` CTA가 `source-actions` modal route를 연다.
- 새 native dependency는 반드시 `parrotkit-app` 패키지 안에 직접 추가한다.
- safe area, scroll inset, modal presentation은 iOS/Android 둘 다 실제 기기 감각을 해치지 않게 유지한다.

## 자주 쓰는 명령
- `npm start`
- `npm run ios`
- `npm run android`
- `npm run prebuild`
- `npx tsc --noEmit`
- `npx expo config --type public`
