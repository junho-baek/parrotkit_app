# email/password 회원가입 폼과 submit guard | Email-password Signup Flow with Submit Guard

## 범위

- `nomadcoders/social-coin`의 2021-09-28 커밋 `8940f90` (`5.4 Join part Two`)를 현재 auth form 관점으로 다시 읽는다.
- 특히:
  - local state로 시작하는 작은 auth form
  - duplicate submit guard
  - provider별 signup UX 차이
를 정리한다.

## 레거시 커밋이 실제로 한 것

- `Join` screen에 `@react-native-firebase/auth`를 연결했다.
- email/password가 비면 `Alert`를 띄운다.
- `loading` state로 중복 제출을 막는다.
- `createUserWithEmailAndPassword(email, password)`를 호출한다.
- 약한 비밀번호 에러만 별도로 처리한다.
- password input `onSubmitEditing`과 버튼 press 둘 다 같은 submit 함수를 호출한다.

즉 이 커밋은 "회원가입 화면이 실제 auth mutation을 실행하기 시작한 단계"다.

## 현재 대응 개념

- 현재 대응 개념은 "small async auth form with submit guard"다.
- 화면은 작지만 이미 다음 문제를 다룬다.
  - field state
  - focus handoff
  - loading
  - async submit
  - error mapping

## 지금 기준으로 읽을 핵심

### 1. 이 커밋의 핵심은 폼 라이브러리가 아니라 submit discipline이다

- 필드는 두 개뿐이라 local state로 충분하다.
- 중요한 건:
  - 빈 값 guard
  - loading 중 재호출 방지
  - 키보드 submit과 버튼 submit 통합
다.

### 2. 현재식으론 validation과 error mapping이 조금 더 구조화된다

- 레거시 코드는 `Alert`와 switch case가 화면 안에 직접 있다.
- 지금은 보통:
  - zod/yup 혹은 간단한 수동 validation
  - provider error code -> UI message mapper
를 분리하는 편이 좋다.

### 3. auth UX는 요즘 더 다양한 기본값을 가진다

- Expo auth 문서는 email/password만이 아니라
  magic link, one-time passcode, OAuth, biometrics, passkeys를 함께 다룬다.
- 따라서 지금 새 앱이라면
  email/password만 고정 기본값으로 놓기보다
  "정말 비밀번호가 필요한가"도 같이 묻게 된다.

## Supabase 기준으로 옮겨 읽으면

- Supabase Auth quickstart도 거의 같은 화면 구조를 가진다.
- 다만 signup 결과에서 session이 없으면
  이메일 인증을 확인하라는 UX가 자연스럽게 붙는다.
- 즉 지금 Supabase식 대응은:
  - `signInWithPassword`
  - `signUp`
  - 이메일 인증 안내
  - AsyncStorage 기반 session persistence
에 가깝다.

사용자 취향을 고려하면, 지금 새 앱에서 이 단계는 Firebase auth보다 Supabase auth로 더 쉽게 번역될 수 있다.

## 현재 기준 베스트 프랙티스

### 1. 작은 auth form은 local state로 시작한다

- 필드 수가 적고 복잡한 cross-field validation이 없으면 local state가 충분하다.

### 2. submit guard는 필수다

- loading 중 중복 제출 방지
- 버튼 disabled 또는 visual feedback
- keyboard submit과 button submit 단일 함수화

이 세 가지는 거의 기본이다.

### 3. `TouchableOpacity`보다 `Pressable`이 더 current하다

- 현재 RN baseline에선 action button은 `Pressable`이 더 자연스럽다.

### 4. 에러 코드는 화면 문구와 분리한다

- provider 에러를 화면 안 switch로 계속 늘리지 말고
  mapper/helper로 빼는 편이 좋다.

### 5. signup 완료 UX는 verification policy와 같이 설계한다

- 즉시 로그인
- 이메일 확인 후 로그인
- magic link

중 무엇인지 product policy가 먼저 정해져야 한다.

## 스킬 추출 후보

- 트리거:
  - email/password auth form을 모바일 화면에 붙일 때
- 권장 기본값:
  - local state + submit guard + focus handoff
- 레거시 안티패턴:
  - loading 중에도 submit을 계속 허용하기
- 예외:
  - 필드가 많아지면 form library와 schema validation로 승격
- 현재식 코드 스케치:

```tsx
const canSubmit = email !== "" && password !== "" && !loading;
```

- 스킬 규칙 초안:
  - `small-auth-forms-need-submit-guard-and-focus-handoff`

## 관련 페이지

- [auth state 기반 navigator gating과 엔트리 셸](auth-state-gated-navigation-and-entry-shell.md)
- [Firebase auth SDK 선택과 네이티브 빌드 경계](firebase-auth-sdk-selection-and-native-build-boundary.md)
