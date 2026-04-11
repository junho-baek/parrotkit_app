# Expo Router 도메인 중심 파일 구조 메모

## 범위

- Expo Router를 쓰는 React Native 앱에서 `app`, `features`, `core`를 어떻게 나누는 것이 자연스러운지 정리한다.
- 이 문서는 현재 `nomad-diary` 같은 Expo Router 샌드박스를 더 커질 때를 대비한 구조 메모다.

## 공식 문서 기준 사실

- Expo Router 문서는 `app` 또는 `src/app` 디렉터리를 route 전용으로 본다.
- 문서에는 `src/app` 밖에 `src/components`, `src/hooks`, `src/constants` 같은 비라우트 디렉터리를 두는 예시가 나온다.
- 즉 Expo Router에서는 비내비게이션 코드를 `app` 안에 섞기보다 바깥으로 두는 편이 공식 구조와 더 잘 맞는다.
- 또한 문서는 top-level `src` 디렉터리를 공식 지원하지만, `src/routes` 같은 custom route root는 강하게 비권장한다.

## `vercel-react-native-skills` 기준 해석

- 이 스킬은 navigation 항목에서 native stack / native tabs를 우선하라고 본다.
- 그래서 Expo Router를 쓴다면 route 파일은 `app` 계층에서, 실제 기능 코드는 feature/core 계층에서 관리하는 식의 책임 분리가 잘 맞는다.
- 스킬이 `core`, `features` 같은 정확한 폴더 이름까지 강제하지는 않지만, navigator 책임과 일반 UI/상태/유틸 책임을 섞지 않는 방향과는 잘 맞는다.

## 현재 선택 방향

- Expo Router + native navigation을 계속 쓸 계획이면 "전자의 구조"가 맞다.
- 다만 Expo Router에서는 `app/core`, `app/features`보다 `src/app + src/core + src/features` 또는 `app + core + features`가 더 자연스럽다.
- 핵심은 "`app`은 route-only"라는 점이지, `core`와 `features`라는 이름 자체가 문제인 것은 아니다.

## 추천 구조

### 작게 시작할 때

```text
app/
  _layout.tsx
  (tabs)/
    _layout.tsx
    index.tsx
    study.tsx
  entry/
    [slug].tsx

core/
  ui/
  theme/
  lib/
  providers/

features/
  diary-entry/
    components/
    hooks/
    screens/
    model/
  study-notes/
    components/
    screens/
```

### 앱이 커질 때

```text
src/
  app/
    _layout.tsx
    (tabs)/
      _layout.tsx
      index.tsx
      study.tsx
    entry/
      [slug].tsx

  core/
    ui/
    theme/
    lib/
    providers/

  features/
    diary-entry/
      components/
      hooks/
      screens/
      model/
    study-notes/
      components/
      screens/
```

## 라우트 파일 역할

- route 파일은 얇게 두는 편이 좋다.
- Expo Router의 `app` 파일은 URL과 navigator 관계를 설명하는 역할에 가깝게 둔다.
- 실제 화면 로직, domain hook, API 호출, 복잡한 뷰 조합은 `features/...` 쪽으로 밀어두는 편이 유지보수에 유리하다.

예시:

```tsx
// src/app/entry/[slug].tsx
import { DiaryEntryDetailScreen } from '@/features/diary-entry/screens/DiaryEntryDetailScreen';

export default DiaryEntryDetailScreen;
```

## 도메인 이름 규칙

- 도메인 이름은 LLM이 한 번에 뜻을 짐작할 수 있게 짓는다.
- 약어보다 풀네임을 우선한다.
- `misc`, `common`, `utils2`, `temp`, `etc` 같은 쓰레기통 이름은 피한다.
- 한 폴더가 무엇을 책임지는지 이름만 보고 떠올릴 수 있어야 한다.
- route segment와 feature 이름이 너무 멀어지지 않게 맞춘다.
- 파일명과 폴더명은 안정적인 kebab-case를 우선한다.

## 이름 예시

### 좋은 예

- `diary-entry`
- `calendar`
- `search`
- `settings`
- `study-notes`
- `auth`

### 아쉬운 예

- `data`
- `common`
- `utils`
- `misc`
- `screen2`
- `dn`

## 현재 워크스페이스에 적용하면

- route는 [`nomad-diary/app/_layout.js`](/Users/junho/project/RN_practice/nomad-diary/app/_layout.js), [`nomad-diary/app/(tabs)/_layout.js`](/Users/junho/project/RN_practice/nomad-diary/app/(tabs)/_layout.js), [`nomad-diary/app/entry/[slug].js`](/Users/junho/project/RN_practice/nomad-diary/app/entry/[slug].js)처럼 `app/`에서 유지한다.
- 이후 실제 기능이 커지면 `features/diary-entry`, `features/study-notes`, `core/ui`, `core/theme` 식으로 바깥으로 꺼내는 편이 좋다.
- 즉 현재 결론은 "`app`은 라우트, 도메인 기능은 `features`, 공용 기반은 `core`"다.

## 열린 질문

- 실제 `nomad-diary`가 다이어리 앱으로 구체화될 때 첫 번째 feature 이름을 `diary-entry`로 할지 `journal-entry`로 할지 결정이 필요하다.
- 한국어 개념을 코드 이름에 반영할 때, 영어 도메인 이름을 어느 정도까지 직관적으로 가져갈지 기준을 더 다듬을 수 있다.


## 스킬 추출 후보

### 트리거

- Expo Router에서 route 파일과 실제 앱 로직의 경계를 다시 정리할 때

### 권장 기본값

- `app/`은 route-only, `core/`와 `features/`는 실제 앱 로직과 UI owner로 분리한다.
- route file은 얇게 유지하고, 학습 콘텐츠/비즈니스 로직은 route 밖에 둔다.
- 폴더 이름만 보고 navigator boundary와 도메인 경계를 읽을 수 있게 만든다.

### 레거시 안티패턴

- route 폴더 안에 화면 로직, query, UI primitive를 모두 섞어 넣기
- 파일 구조가 navigator 구조와 도메인 구조를 동시에 숨기게 만들기

### 예외 / 선택 기준

- 아주 작은 데모 앱이라면 route-only 분리가 과할 수 있다.

### 현재식 코드 스케치

```text
app/
  _layout.tsx
  (tabs)/
core/
features/
  movies/
  search/
```

### 스킬 규칙 초안

- "`app/`은 route-only로, 도메인 로직은 `core/`와 `features/`로 밖으로 뺀다."

## 관련 페이지

- [expo-router-stack-native-tabs](expo-router-stack-native-tabs.md)
- [네이티브 내비게이션의 공통 탭/헤더 옵션](shared-tab-and-header-options-in-native-navigation.md)

## 참고 링크

- [Expo Router core concepts](https://docs.expo.dev/router/basics/core-concepts/)
- [Expo Router src directory](https://docs.expo.dev/router/reference/src-directory/)
- [vercel-react-native-skills navigation-native-navigators](/Users/junho/.agents/skills/vercel-react-native-skills/rules/navigation-native-navigators.md)
