# Expo TypeScript 전환과 내비게이션 타이핑 | Expo TypeScript Migration and Navigation Typing

## 범위

- `nomadcoders/noovies`의 2021-09-16 커밋 `c6ebd2a` (`1.16 Typescript`)를 현재 Expo / React Native / React Navigation 기준으로 다시 해석한다.
- 이 문서는 레거시 TypeScript 도입 패턴을 2026 기준으로 무엇을 유지하고 무엇을 바꿔 읽어야 하는지 정리하는 분석 메모다.

## 레거시 커밋이 실제로 한 것

- `.js` screen 파일들을 `.tsx`로 바꿨다.
- `typescript`, 여러 `@types/*` 패키지, styled-components 관련 타입 패키지를 devDependencies에 추가했다.
- `tsconfig.json`을 새로 만들었다.
- `styled.d.ts`를 추가해서 `styled-components`의 `DefaultTheme`를 확장했다.
- `Movies.tsx`에서 `NativeStackScreenProps<any, "Movies">`로 screen prop 타입을 붙였다.

## 이 커밋이 당시 설명하려던 것

- "기존 JS 프로젝트를 TypeScript로 옮기는 최소한의 발판"을 만드는 단계다.
- 핵심은:
  - 파일 확장자 변경
  - TypeScript 설치
  - 기본 `tsconfig.json` 추가
  - navigation props와 theme props에 타입 붙이기

## 2026 기준으로 유지할 것

- `.tsx` / `.ts`로 파일을 나누는 생각
- `strict`한 타입 체크를 켜는 방향
- navigation params를 타입으로 표현하는 생각
- theme를 쓴다면 타입 선언으로 `DefaultTheme`를 확장하는 패턴

## 2026 기준으로 바꿔 읽어야 할 것

### 1. Expo에서는 `tsconfig.json`을 직접 처음부터 쓰기보다 base config를 상속한다

- Expo 공식 문서는 기존 JS 프로젝트를 TS로 옮길 때:
  - 파일을 `.tsx` / `.ts`로 rename
  - `typescript`와 `@types/react` 설치
  - `tsconfig.json`은 `expo/tsconfig.base`를 extend
  - 필요하면 `strict: true` 추가
  를 안내한다.

즉 현재 Expo 앱이라면 보통 이런 식이 기본값이다:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true
  }
}
```

### 2. `@types/react-native`는 현재 기본값이 아니다

- React Native는 0.71부터 TypeScript를 기본 지원하고, 타입 선언도 `react-native` 패키지 안에 함께 제공한다.
- React Native 공식 블로그는 0.71 이후 `@types/react-native`를 package.json에서 제거하는 것을 권한다.

즉 레거시 커밋의 `@types/react-native` 추가는 당시엔 자연스러웠지만, 지금은 대체로 불필요한 쪽에 가깝다.

### 3. React Navigation 타입은 `any`로 시작하지 않는 편이 좋다

- 레거시 커밋은 `NativeStackScreenProps<any, "Movies">`를 썼다.
- 지금 React Navigation 문서는 `ParamList`를 명시적으로 만들고, 그걸 screen props에 연결하는 방식을 권한다.
- nested navigator라면 `NavigatorScreenParams`를 써서 탭/스택 관계를 타입으로 표현할 수 있다.

즉 지금은 보통 이런 식이 더 낫다:

```ts
export type RootStackParamList = {
  Tabs: NavigatorScreenParams<RootTabParamList>;
  Stack: NavigatorScreenParams<ModalStackParamList>;
};
```

그리고:

```ts
type Props = NativeStackScreenProps<ModalStackParamList, 'Three'>;
```

### 4. React Navigation 타입은 별도 파일로 모으는 편이 좋다

- React Navigation 문서는 navigation 관련 타입을 `navigation/types.ts` 같은 별도 파일에 모으는 것을 추천한다.
- 현재 기준으로는 각 화면 파일에서 `Props<any>`를 즉석으로 만드는 것보다, param list와 helper type을 따로 관리하는 편이 유지보수에 낫다.

### 5. `moduleResolution: "node"`보다 `bundler` 쪽을 본다

- React Navigation TypeScript 문서는 `tsconfig.json`에서:
  - `strict: true` 또는 `strictNullChecks: true`
  - `moduleResolution: "bundler"`
  를 특히 중요하게 적는다.
- 따라서 레거시 `tsconfig.json`의 `moduleResolution: "node"`는 현재 기본 추천과는 다르다.

### 6. `install`, `npm`을 devDependencies로 넣는 건 현재식이 아니다

- 레거시 커밋에는 `install`, `npm` 패키지가 devDependencies에 들어가 있다.
- 현재 Expo / RN TypeScript 설정 흐름에서는 이런 패키지를 devDependencies로 추가하는 이유가 거의 없다.
- 현재식으론 TypeScript 관련 최소 패키지만 두는 편이 맞다.

## 현재 Expo Router 워크스페이스에 대입하면

- 지금 `nomad-diary`는 Expo Router 기반이므로, TypeScript를 붙인다면 Expo 기본 TS 설정을 따르는 편이 자연스럽다.
- 즉:
  - `tsconfig.json`은 `expo/tsconfig.base` 상속
  - route 파일은 `.tsx`
  - path alias는 필요하면 `@/* -> src/*`
  - navigation route 이름은 수동 문자열 타입보다 Expo Router typed routes를 고려

Expo Router 공식 문서는 typed routes를 자동 생성할 수 있다고 설명한다. 이 기능은 beta지만, Expo Router를 계속 쓸 계획이라면 React Navigation식 route name 문자열 타입을 전부 수동 관리하는 부담을 줄여준다.

## styled-components 타입은 어떻게 보나

- `styled.d.ts`로 `DefaultTheme`를 확장하는 패턴 자체는 지금도 유효하다.
- 다만 현재 워크스페이스는 `NativeWind` 쪽도 열어두고 있고, `vercel-react-native-skills`는 styling 기본값을 `StyleSheet.create or Nativewind`로 본다.
- 따라서 현재식으로는:
  - `styled-components`를 계속 쓴다면 `styled.d.ts` 패턴 유지 가능
  - 새로 시작한다면 styling 기본 선택 자체를 다시 결정하는 것이 먼저다

## 현재 best practice 요약

### Expo 앱이라면

- `npx expo install typescript @types/react --dev`
- `npx expo customize tsconfig.json`
- `tsconfig.json`은 `expo/tsconfig.base` 상속
- `strict: true` 켜기

### React Navigation을 쓴다면

- `ParamList`를 별도 파일에 정의
- `NativeStackScreenProps<ParamList, 'ScreenName'>` 같이 구체 타입 사용
- `any`는 가능한 한 피하기
- nested navigator는 `NavigatorScreenParams`로 표현

### Expo Router를 쓴다면

- route typing은 Expo Router typed routes까지 고려
- navigation route 이름을 전부 수동 union으로 유지하려는 습관은 줄여도 된다

## 현재 워크스페이스에 대한 결론

- 이 레거시 커밋의 핵심 의도인 "JS 프로젝트를 TS 프로젝트로 옮긴다"는 방향은 지금도 맞다.
- 하지만 현재 `nomad-diary`에 그대로 복사할 설정은 아니다.
- 지금식으로 바꾸면:
  - Expo base tsconfig 사용
  - `@types/react-native` 제거
  - navigation types는 `any` 없이 별도 파일로 정리
  - Expo Router를 계속 쓸 경우 typed routes도 고려


## 스킬 추출 후보

### 트리거

- Expo / React Navigation / Expo Router 마이그레이션 중 타입 경계를 다시 잡을 때

### 권장 기본값

- route params는 최소 식별자와 display seed만 타입으로 고정한다.
- navigation typing은 layout/navigation boundary에서 먼저 정리한다.
- 화면마다 제네릭을 반복하기보다 route contract를 재사용한다.

### 레거시 안티패턴

- `@ts-ignore`로 navigation typing을 우회하기
- route param에 아무 shape나 통과시키기

### 예외 / 선택 기준

- 초기 migration 단계에선 임시 any/loose typing이 있을 수 있지만 오래 남기지 않는 편이 좋다.

### 현재식 코드 스케치

```ts
type RootStackParamList = {
  detail: { id: number; mediaType: 'movie' | 'tv'; initialTitle?: string };
};
```

### 스킬 규칙 초안

- "TypeScript 전환 시 route param contract와 navigation typing부터 먼저 고정한다."

## 관련 페이지

- [네이티브 스택 vs JS 스택 | Native Stack vs JS Stack](native-stack-vs-js-stack.md)
- [스타일드 컴포넌트와 NativeWind, shadcn-style 비교 | Styled Components vs NativeWind and shadcn-style](styled-components-vs-nativewind-and-shadcn.md)
- [StyleSheet.create와 NativeWind 선택 메모 | StyleSheet.create vs NativeWind](stylesheet-create-vs-nativewind.md)

## 참고 링크

- [Using TypeScript - Expo docs](https://docs.expo.dev/guides/typescript/)
- [Type checking with TypeScript - React Navigation](https://reactnavigation.org/docs/typescript/)
- [React Native 0.71: TypeScript by Default](https://reactnative.dev/blog/2023/01/12/version-071)
- [Expo Router typed routes](https://docs.expo.dev/router/reference/typed-routes/)
