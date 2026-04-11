# 모달 저널 내비게이션과 작성 진입점 | Modal Journal Navigation and Compose Entry

## 범위

- `nomadcoders/nomad-diary`의 2021-09-26 커밋 `beded7e` (`4.1 Home Screen`)를 현재 RN navigation 기준으로 다시 읽는다.
- 특히:
  - 홈 화면과 작성 화면을 어떻게 나눴는지
  - modal presentation을 왜 썼는지
  - floating add button을 현재식으로 어떻게 번역할지
  를 정리한다.

## 레거시 커밋이 실제로 한 것

- `App.js`를 기본 텍스트 화면에서 `NavigationContainer + Navigator` 구조로 바꿨다.
- `navigator.js`에서 native stack을 만들고:
  - `Home`
  - `Write`
  두 화면을 등록했다.
- `screenOptions={{ headerShown: false, presentation: "modal" }}`로 전체 stack을 modal 감각으로 잡았다.
- `Home.js`에는:
  - `My journal` 타이틀
  - 우하단 원형 add 버튼
  - `navigate("Write")`
  흐름이 들어갔다.
- `colors.js`를 따로 두어 화면 색을 공통 토큰처럼 재사용하기 시작했다.

## 현재 대응 개념

- 이 커밋의 핵심 개념은 "create flow를 modal route로 여는 단순한 journal IA"다.
- 지금 봐도:
  - 홈에서 작성 화면으로 들어가는 흐름을 modal로 두는 판단 자체는 자연스럽다.
- 다만 현재 기준으론:
  - root stack이 owner
  - detail / modal route를 stack에서 소유
  - FAB는 `Pressable`
  - safe area와 theme token을 함께 고려

하는 편이 더 명확하다.

## 현재 기준 베스트 프랙티스

### 1. modal owner는 루트 stack이 소유한다

- 작성 화면처럼 일시적 입력 흐름은 modal route가 잘 맞는다.
- 다만 owner는 root stack 쪽에 두는 편이 이후 탭/상세/설정 화면이 생겨도 덜 꼬인다.

### 2. FAB는 `TouchableOpacity`보다 `Pressable`이 기본값이다

- pressed state, hitSlop, android ripple 등 제어가 더 명확하다.

### 3. safe area를 초기에 같이 본다

- 레거시 코드는 `paddingTop: 100px`로 상단 여백을 잡는다.
- 현재식으론 safe area inset을 반영하는 편이 기기 다양성에 강하다.

### 4. 색상 파일은 좋지만 토큰 책임을 더 분리한다

- `colors.js`는 시작점으로 괜찮다.
- 다만 지금은:
  - semantic color token
  - spacing / radius
  - surface / text / accent
  를 조금 더 체계적으로 나누는 편이 자연스럽다.

## 스킬 추출 후보

- 트리거:
  - 홈 화면에서 작성/생성 화면을 띄우는 단순 앱을 설계할 때
- 권장 기본값:
  - root stack owner
  - create route는 modal
  - FAB는 `Pressable`
- 레거시 안티패턴:
  - 모든 화면이 같은 navigator에 무차별적으로 들어가고 owner 경계가 없는 상태
- 예외 / 선택 기준:
  - 입력 흐름이 실제로 full-screen task면 push도 가능하지만,
    일시적 작성/추가는 modal이 더 자연스러운 경우가 많다
- 현재식 코드 스케치:

```tsx
<Stack.Screen
  name="write"
  options={{ presentation: 'modal', title: 'New Entry' }}
/>
```

- 스킬 규칙 초안:
  - `native-navigation-owner-split`
  - `modal-compose-route-for-ephemeral-create-flow`

## 관련 페이지

- [감정 선택기와 검증된 저널 폼](emotion-picker-and-validated-journal-form.md)
- [oh-my-rn v1 규칙집](/Users/junho/.codex/skills/oh-my-rn/references/v1-rules.md)

