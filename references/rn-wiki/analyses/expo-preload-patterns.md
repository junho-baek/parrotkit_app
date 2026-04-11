# Expo preload 패턴 메모

## 범위

- `nomad-diary`에 `useAssets`, `useFonts`, `Image.prefetch`, `expo-splash-screen`을 함께 써서 첫 화면 진입 전 준비 작업을 묶는 예제를 추가했다.

## 사실

- `useAssets([require(...)])`는 로컬 이미지 asset을 미리 로드하고, 준비되면 asset 객체 배열을 돌려준다.
- `useFonts(Ionicons.font)`는 아이콘 폰트가 실제로 렌더링 가능해질 때까지 기다린다.
- `Image.prefetch(url)`는 원격 이미지를 미리 받아 디스크 캐시에 넣는다.
- `preventAutoHideAsync()`는 네이티브 splash를 계속 유지하고, `hideAsync()`는 우리가 준비가 끝났다고 판단한 시점에 직접 닫는다.
- 현재 앱은 세 조건, 로컬 asset 로드, 폰트 로드, 원격 이미지 prefetch, 이 모두 끝났을 때만 splash를 닫고 화면을 보여준다.

## 해석

- 이 패턴은 예전 `expo-app-loading`이 하던 역할을 현대 Expo 방식으로 옮긴 것이다.
- 핵심은 "무엇을 기다릴지"를 분리해서 생각하는 데 있다.
  - 로컬 파일 준비: `useAssets`
  - 폰트 준비: `useFonts`
  - 원격 이미지 선로딩: `Image.prefetch`
  - 화면 전환 제어: `expo-splash-screen`
- `Image.prefetch`는 곧 보여줄 원격 이미지를 미리 받아서 첫 화면 품질을 높이는 용도고, 일반 이미지 렌더링 도구 자체는 아니다.
- 실제 프로덕션에서는 이미지 UI 전반은 `expo-image`가 더 강한 선택지일 수 있지만, preload 개념을 배우는 첫 예제로는 현재 구조가 이해하기 쉽다.

## 현재 앱에 적용한 형태

- Ionicons 책 아이콘을 렌더링해서 폰트 preload가 실제로 쓰이도록 만들었다.
- splash용으로 만든 로컬 노트 이미지를 `useAssets` 예제로 다시 사용했다.
- React Native 공식 문서의 작은 원격 로고 URL을 `prefetch` 예제로 사용했다.
- 준비가 끝난 뒤 화면에는 local asset과 prefetched remote image를 나란히 보여준다.

## 열린 질문

- 원격 이미지 prefetch를 앱 시작 시점에 할지, 다음 화면 진입 직전에 할지는 화면 구조와 네트워크 비용에 따라 달라진다.
- 첫 화면에 꼭 필요 없는 원격 이미지를 너무 많이 prefetch하면 오히려 시작 시간이 늘어질 수 있다.

## 다음 액션

- 이 예제의 remote image를 실제 다이어리 앱 첫 화면에서 바로 필요한 cover나 avatar로 교체한다.
- 이미지 렌더링이 많아지면 `expo-image`로 옮기고 `cachePolicy`와 `transition`을 함께 비교해본다.
