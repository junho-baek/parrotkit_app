# Firebase auth SDK 선택과 네이티브 빌드 경계 | Firebase Auth SDK Selection and Native Build Boundary

## 범위

- `nomadcoders/social-coin`의 2021-09-27 커밋 `93e8f38` (`5.3 Testing Setup`)을 계기로,
  React Native / Expo 앱에서:
  - Firebase JS SDK와 React Native Firebase를 어떻게 고를지
  - Supabase Auth는 어디에 놓고 비교할지
를 현재 기준으로 다시 정리한다.

## 레거시 커밋이 실제로 한 것

- `@react-native-firebase/app`과 `@react-native-firebase/auth`를 설치했다.
- Android `google-services.json`, iOS `GoogleService-Info.plist`를 추가했다.
- native build 설정을 바꿨다.
- `App.js`에서 `auth().currentUser`를 콘솔에 찍어 auth 연결 상태를 확인했다.

즉 이 커밋은 "앱에 Firebase auth native SDK를 꽂는 단계"다.

## 현재 대응 개념

- 현재 대응 개념은 "auth SDK choice by runtime boundary"다.
- 같은 Firebase auth라도 지금은 보통 세 가지 선택지가 생긴다.
  - Firebase JS SDK
  - React Native Firebase
  - Supabase Auth

핵심은 브랜드 취향보다
  - Expo Go가 필요한지
  - custom native code가 필요한지
  - auth만 필요한지, backend 전체가 필요한지
로 고르는 것이다.

## 지금 기준으로 읽을 핵심

### 1. 이 커밋은 Firebase 자체보다 native boundary를 보여준다

- Expo 공식 Firebase 가이드는
  Firebase를:
  - JS SDK
  - React Native Firebase
두 방식으로 쓸 수 있다고 설명한다.
- 같은 문서는 Firebase JS SDK는 Expo Go에서 빠르게 시작하기 좋고,
  React Native Firebase는 native SDK를 감싸며 custom native code가 필요하다고 설명한다.

즉 이 커밋의 진짜 핵심은
"Firebase auth를 쓴다"보다
"이 앱은 native build boundary를 받아들였다"에 있다.

### 2. 지금 Expo 앱의 첫 기본값은 무조건 RNFirebase가 아니다

- Expo 문서는 Firebase JS SDK를:
  - Authentication
  - Firestore
  - Realtime Database
  - Storage
같은 서비스에 대해 Expo Go에서도 빠르게 시작하는 선택지로 둔다.
- 반면 React Native Firebase는:
  - Analytics
  - Crashlytics
  - Dynamic Links
같이 JS SDK가 다루지 못하는 native 서비스가 필요할 때 더 적합하다고 적는다.

### 3. Supabase는 같은 auth 문제를 다른 층에서 푼다

- Expo auth 문서는 Supabase가 Expo 앱과 잘 통합되고
  email, magic link 등을 제공한다고 설명한다.
- Supabase React Native quickstart는 `@supabase/supabase-js`와 `AsyncStorage` adapter, auto-refresh 구성을 기본으로 둔다.

즉 user management가 필요하고
Postgres/RLS/storage까지 같이 가고 싶다면
Firebase native auth 대신 Supabase를 택하는 흐름도 아주 자연스럽다.

## Supabase 기준으로 옮겨 읽으면

- 이 커밋의 현재 Supabase 대응 개념은
  "auth provider bootstrap without native Firebase lock-in"이다.
- 지금 사용자 성향을 반영하면:
  - auth만 붙이고
  - later에 user data, favorites, portfolio도 붙일 예정이면
  Firebase native module보다 Supabase client bootstrap이 더 자연스럽다.
- 특히 이 프로젝트처럼 코인 가격은 public API에서 가져오므로,
  backend가 맡아야 할 일은 auth + user-owned data 쪽이다.

즉 지금 다시 만들면:
  - 공개 시세 데이터는 public query
  - 사용자 계정과 개인 데이터는 Supabase
로 나누는 설계가 더 잘 맞는다.

## 현재 기준 베스트 프랙티스

### 1. Firebase는 JS SDK와 RNFirebase를 구분해서 고른다

- Expo Go / universal quick start / auth+db+storage 위주면:
  - Firebase JS SDK
- native services, analytics, crashlytics, dynamic links가 중요하면:
  - React Native Firebase

### 2. React Native Firebase는 native build boundary로 읽는다

- Expo 문서 기준 RNFirebase는 custom native code가 필요하고 Expo Go에서 못 쓴다.
- 따라서 dev client, config plugin, prebuild, native config 비용까지 포함해 평가해야 한다.

### 3. Supabase는 auth만이 아니라 backend choice로 본다

- Supabase는 auth + Postgres + storage + RLS를 함께 제공한다.
- user-generated data가 붙는 모바일 앱이라면
  Firebase auth만 단독으로 붙이는 것보다 product backend로 더 자연스러울 수 있다.

### 4. auth bootstrap은 연결 확인보다 session owner 설계가 더 중요하다

- `currentUser`를 콘솔에 찍는 것보다
  누가 session state를 소유하고
  navigation tree를 누가 gate할지를 빨리 정하는 편이 더 중요하다.

## 스킬 추출 후보

- 트리거:
  - Expo 앱에 auth를 붙이려는데 Firebase / RNFirebase / Supabase 중 무엇을 고를지 헷갈릴 때
- 권장 기본값:
  - 먼저 runtime boundary와 backend scope를 본다
- 레거시 안티패턴:
  - "Firebase니까 무조건 RNFirebase"처럼 브랜드 기준으로 SDK를 고르기
- 예외:
  - 이미 RNFirebase가 깊게 들어간 기존 앱은 migration 비용을 함께 봐야 한다
- 현재식 코드 스케치:

```ts
// Supabase 쪽이면 native Firebase 설정 없이 JS client로 시작 가능
export const supabase = createClient(url, key, {
  auth: { storage: AsyncStorage, persistSession: true }
});
```

- 스킬 규칙 초안:
  - `choose-firebase-js-rnfirebase-or-supabase-by-runtime-boundary`

## 관련 페이지

- [auth state 기반 navigator gating과 엔트리 셸](auth-state-gated-navigation-and-entry-shell.md)
- [email/password 회원가입 폼과 submit guard](email-password-signup-flow-with-submit-guard.md)
- [RN 저장소 선택 지도](../concepts/rn-storage-decision-map.md)
