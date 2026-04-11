# auth state 기반 navigator gating과 엔트리 셸 | Auth-state Gated Navigation and Entry Shell

## 범위

- `nomadcoders/social-coin`의 2021-09-27 커밋 `6a38862` (`5.4 Join part One`)를 현재 auth/navigation 관점으로 다시 읽는다.
- 특히:
  - auth state가 앱 루트 navigation을 어떻게 가르는지
  - login/join shell이 어떤 책임을 가지는지
를 정리한다.

## 레거시 커밋이 실제로 한 것

- `App.js`에서 `auth().onAuthStateChanged`를 구독하고 `isLoggedIn` boolean을 둔다.
- 로그인 상태면 `InNav`, 아니면 `OutNav`를 렌더한다.
- `OutNav`에 `Login`, `Join` screen을 만들었다.
- `Join` screen에 email/password 입력 UI를 만들고, 이메일 입력 뒤 password input으로 focus를 넘긴다.
- `Login` screen은 일단 "Join으로 이동하는 셸"에 가깝다.

즉 이 커밋의 핵심은
"세션 상태가 앱의 navigator tree를 나누기 시작했다"는 점이다.

## 현재 대응 개념

- 현재 대응 개념은 "session owner gates app shell"이다.
- 로그인 화면과 앱 본문 화면을 screen 하나의 조건부 렌더로 보지 않고,
  루트 navigation 구조의 경계로 보는 방식이다.

## 지금 기준으로 읽을 핵심

### 1. auth는 화면 하나가 아니라 앱 루트 상태다

- 이 커밋은 로그인 여부를 `Home` screen 안에서 처리하지 않고
  navigator 단에서 분기한다.
- 이 발상은 지금도 맞다.

### 2. boolean 하나보다 session source가 더 중요하다

- 레거시 코드는 `isLoggedIn` boolean만 둔다.
- 현재식으론 보통:
  - `user`
  - `session`
  - `claims`
  - `authReady`
같은 더 명확한 source를 둔다.

즉 "true/false"보다
"누가 session truth를 들고 있는가"가 더 중요하다.

### 3. unsubscribe와 initial loading 경계가 같이 필요하다

- 이 커밋은 auth listener unsubscribe를 반환하지 않는다.
- 또한 첫 렌더에서 auth 상태가 아직 확인되기 전의 loading shell이 없다.
- 현재식으론 이 두 가지를 같이 둔다.

## Supabase 기준으로 옮겨 읽으면

- Supabase quickstart도 `onAuthStateChange`와 session validation을 앱 루트에서 다룬다.
- 따라서 현재 Supabase식 대응은:
  - `supabase.auth.onAuthStateChange`
  - 초기 session / claims 확인
  - 그 결과로 auth group vs app group 분기
에 가깝다.

즉 이 커밋의 개념 자체는 Firebase 전용이 아니라,
모바일 auth provider 전반에 재사용되는 루트 shell 패턴이다.

## 현재 기준 베스트 프랙티스

### 1. auth listener는 provider 또는 root gate가 소유한다

- listener, session hydration, unsubscribe를 한곳에서 관리한다.
- screen이 직접 auth listener를 소유하지 않게 두는 편이 좋다.

### 2. auth loading shell을 따로 둔다

- 세션 확인 전 잠깐 보이는 fallback이나 splash gating이 필요하다.
- 그래야 login screen flash가 줄어든다.

### 3. navigation tree는 auth group와 app group로 나눈다

- Expo Router면 route group
- React Navigation이면 root navigator branch

중 하나로 일관되게 나눈다.

### 4. login/join screen은 session owner가 아니다

- login/join은 입력 UI와 submit action에 집중한다.
- 실제 session truth는 root auth layer가 관리한다.

## 스킬 추출 후보

- 트리거:
  - 로그인 상태에 따라 앱의 루트 화면 구조가 갈려야 할 때
- 권장 기본값:
  - session owner가 navigator tree를 gate한다
- 레거시 안티패턴:
  - screen 내부 local boolean으로 앱 전체 로그인 상태를 흉내내기
- 예외:
  - auth 없는 데모 앱은 여기까지 복잡할 필요가 없다
- 현재식 코드 스케치:

```tsx
if (!authReady) return <SplashGate />;
return session ? <AppStack /> : <AuthStack />;
```

- 스킬 규칙 초안:
  - `auth-session-owner-gates-navigation-tree`

## 관련 페이지

- [email/password 회원가입 폼과 submit guard](email-password-signup-flow-with-submit-guard.md)
- [Firebase auth SDK 선택과 네이티브 빌드 경계](firebase-auth-sdk-selection-and-native-build-boundary.md)
