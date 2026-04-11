# Expo Splash Screen 로딩 메모

## 범위

- `nomad-diary`에서 앱 준비가 끝날 때까지 splash screen을 유지하는 가장 작은 실습.

## 사실

- `expo-splash-screen` 패키지를 설치했다.
- 앱 모듈 로드 시점에 `preventAutoHideAsync()`를 호출해 자동으로 splash가 사라지지 않게 했다.
- 현재 실습에서는 5초 대기로 비동기 준비 작업을 흉내 낸다.
- 준비 완료 뒤 `hideAsync()`를 호출하고, 그 전까지는 `null`을 렌더링한다.
- `app.json`의 `expo-splash-screen` 플러그인 설정으로 라이트/다크 배경색과 splash 이미지를 연결했다.
- `nomad-diary/assets/` 아래에 노트 모양 splash 이미지를 추가했다.
- iOS prebuild 뒤 생성된 `SplashScreen.storyboard`에 로고 뷰가 빠져 있어, 배경색만 보이는 상태를 수동으로 보정했다.

## 해석

- 예전 `expo-app-loading` 대신 현재 Expo 권장 흐름으로 옮기는 첫 단계다.
- 지금 선택은 복잡한 브랜드 작업 대신, 앱 이름과 어울리는 단순한 노트 아이콘과 안정적인 배경색을 먼저 쓰는 쪽이다.
- JS 로딩 제어와 네이티브 splash 자산 연결을 분리해서 이해할 수 있게 했다.
- Expo config가 맞아도 네이티브 생성물이 기대와 다를 수 있으니, iOS storyboard 결과를 직접 확인하는 습관이 유용하다.

## 다음 액션

- 5초 대기 코드를 실제 초기화 작업, 예를 들면 폰트 preload, storage hydrate, auth restore로 바꾼다.
- splash 아이콘이 정해졌다면 앱 아이콘과 첫 화면 컬러도 같은 톤으로 맞춘다.
- development build를 계속 쓸 거면 `expo-dev-client`를 설치하고, native 변경 뒤에는 `run:android` 또는 `run:ios`로 다시 빌드한다.
