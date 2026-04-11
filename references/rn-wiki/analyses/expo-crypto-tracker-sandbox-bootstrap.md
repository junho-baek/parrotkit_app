# 암호화폐 트래커 샌드박스 부트스트랩 | Expo Crypto Tracker Sandbox Bootstrap

## 범위

- `nomadcoders/social-coin`의 2021-09-27 커밋 `233dbc7` (`5.0 Introduction`)을 현재 Expo / React Native 기준으로 다시 읽는다.
- 특히:
  - 이 프로젝트가 어떤 앱 셸로 시작하는지
  - 아직 비어 있는 앱에서 어떤 경계를 먼저 떠올려야 하는지
를 정리한다.

## 레거시 커밋이 실제로 한 것

- Expo 42 + React Native 0.63 기반 프로젝트를 초기 생성했다.
- Android / iOS native 디렉터리와 splash asset, launcher asset이 함께 들어왔다.
- `App.js`는 기본 템플릿 상태이고 아직 도메인 로직은 없다.

즉 이 커밋의 핵심은 "crypto tracker 프로젝트의 빈 샌드박스를 연다"는 점이다.

## 현재 대응 개념

- 현재 대응 개념은 "product-shaped app bootstrap"이다.
- 즉 첫 커밋에서 아직 기능이 없어도,
  이 앱이 앞으로:
  - auth 앱인지
  - public data 앱인지
  - backend가 붙는지
  - native SDK가 붙는지
를 빠르게 가늠하는 단계다.

## 지금 기준으로 읽을 핵심

### 1. 시작점은 비어 있어도 나중 경계는 이미 보인다

- `social-coin`은 나중에:
  - Firebase auth
  - coin API
  - chart
가 붙는다.
- 그래서 첫 커밋을 지금 다시 읽을 때는
  "이 앱이 단순 템플릿이 아니라 auth + market data + detail UI 앱으로 커질 준비를 하는 셸"로 봐야 한다.

### 2. 현재 baseline은 `create-expo-app`과 최신 Expo 문맥이다

- 지금 새 앱을 열 때 기본 스타터는 2021식 Expo 42보다
  최신 `create-expo-app` 템플릿에 가깝다.
- 그리고 auth나 native SDK가 붙을 가능성이 있으면
  처음부터:
  - TypeScript
  - 환경변수 구조
  - router / navigation 구조
  - dev build 필요성
를 같이 본다.

### 3. 이 프로젝트는 나중에 "Expo Go로 충분한가" 질문이 생긴다

- 다음 커밋에서 RNFirebase가 들어오므로,
  이 앱은 결국 "native build boundary"를 만나는 프로젝트다.
- 따라서 지금 기준으로는 첫 셸 단계에서도
  Expo Go만으로 끝날지, dev build가 필요할지를 생각하게 된다.

## 현재 기준 베스트 프랙티스

### 1. 앱 셸 단계에서 backend/auth/native dependency 가능성을 먼저 적는다

- auth provider
- remote API
- chart
- native SDK

이 네 축을 먼저 적어두면 나중에 구조가 덜 흔들린다.

### 2. 시작점부터 최신 Expo baseline을 쓴다

- 새 앱 기본값은 TypeScript + 최신 Expo 템플릿에 가깝다.
- splash, env, navigation, auth bootstrap은 나중에 우연히 붙이기보다
  early decision으로 보는 편이 좋다.

### 3. Firebase나 Supabase가 붙을 수 있으면 auth shell과 app shell을 분리해 생각한다

- `App.tsx`가 모든 걸 직접 들고 가기보다
  나중에:
  - providers
  - auth gate
  - navigation root
로 분리될 가능성을 염두에 두는 편이 낫다.

## 스킬 추출 후보

- 트리거:
  - 새 Expo 앱이 auth나 backend, native SDK를 곧 붙일 예정일 때
- 권장 기본값:
  - 앱 셸 단계에서 auth / data / native boundary를 먼저 적는다
- 레거시 안티패턴:
  - 템플릿을 오래 방치하다가 later-stage dependency가 붙을 때 구조를 뒤늦게 뒤집기
- 예외:
  - 완전 일회성 UI 샌드박스는 여기까지 엄격하지 않아도 된다
- 현재식 코드 스케치:

```tsx
<AppProviders>
  <RootNavigator />
</AppProviders>
```

- 스킬 규칙 초안:
  - `product-shaped-rn-apps-declare-auth-data-native-boundaries-early`

## 관련 페이지

- [Firebase auth SDK 선택과 네이티브 빌드 경계](firebase-auth-sdk-selection-and-native-build-boundary.md)
- [social-coin Firebase 인증·차트 학습 계획](social-coin-firebase-auth-and-chart-study-plan.md)
