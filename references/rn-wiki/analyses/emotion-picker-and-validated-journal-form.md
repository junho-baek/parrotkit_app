# 감정 선택기와 검증된 저널 폼 | Emotion Picker and Validated Journal Form

## 범위

- `nomadcoders/nomad-diary`의 2021-09-26 커밋 `5c5cb26` (`4.2 Write Screen`)를 현재 RN form 관점으로 다시 읽는다.
- 특히:
  - 감정 선택기와 텍스트 입력을 어떻게 조합했는지
  - 작은 로컬 폼의 상태를 어디까지 local state로 두는지
  - 현재식 폼 UX 기본값이 무엇인지
  를 정리한다.

## 레거시 커밋이 실제로 한 것

- `Write.js`를 더미 화면에서 실제 작성 폼으로 바꿨다.
- 폼은:
  - 감정 이모지 목록
  - 선택 상태
  - feelings 텍스트 입력
  - Save 버튼
  으로 구성된다.
- `selectedEmotion`과 `feelings`를 local state로 둔다.
- 제출 시:
  - 감정 미선택
  - 텍스트 비어 있음

이면 `Alert.alert("Please complete form.")`로 막는다.
- `colors.js`도 이 단계에서 더 차분한 톤으로 바뀌며 앱 미감이 한 번 정리된다.

## 현재 대응 개념

- 이 커밋의 핵심은 "작은 생성 폼 + discrete selection + 기본 검증"이다.
- 지금 기준으로도 이 정도 크기의 폼은 local state로 충분한 경우가 많다.
- 다만 현재식 대응은:
  - 선택 가능한 discrete state와 free-form text를 구분
  - validation 실패를 alert만이 아니라 UI affordance로도 드러냄
  - keyboard / submit / disabled state를 함께 설계

쪽에 더 가깝다.

## 현재 기준 베스트 프랙티스

### 1. 작은 폼은 local state로 시작해도 된다

- 필드가 몇 개 안 되고 submit 한 번이면 local state로 충분하다.
- `react-hook-form`은 필드 수, validation, dirty state가 커질 때 검토해도 늦지 않다.

### 2. 제출 불가 상태를 버튼에도 반영한다

- 레거시 코드는 submit 시점에만 alert를 띄운다.
- 지금은:
  - 버튼 disabled
  - placeholder / helper text
  - field error

같은 신호를 미리 주는 편이 더 좋다.

### 3. 감정 선택은 `Pressable` + semantic selected style로 읽는다

- 선택 상태가 있는 버튼은 pressed / selected / disabled 상태를 분리해두면 스킬로 재사용하기 쉽다.

### 4. keyboard handling을 같이 본다

- 작은 작성 폼이라도 iOS/Android keyboard overlap은 금방 생긴다.
- 현재식으론 `KeyboardAvoidingView`, `ScrollView keyboardShouldPersistTaps`, submit return key 등을 함께 본다.

## 스킬 추출 후보

- 트리거:
  - 이모지 선택 + 텍스트 입력처럼 작은 작성 폼을 만들 때
- 권장 기본값:
  - local state
  - selected state는 명시적 스타일
  - submit disabled state 제공
- 레거시 안티패턴:
  - submit 시점의 alert 하나로만 validation을 처리하기
- 예외 / 선택 기준:
  - 필드가 많아지거나 schema validation이 필요하면 form 라이브러리로 승격
- 현재식 코드 스케치:

```tsx
const canSubmit = selectedEmotion !== null && feelings.trim().length > 0;

<Pressable disabled={!canSubmit} onPress={onSubmit}>
  <Text>Save</Text>
</Pressable>
```

- 스킬 규칙 초안:
  - `small-compose-forms-start-with-local-state`
  - `discrete-selection-plus-text-validation`

## 관련 페이지

- [모달 저널 내비게이션과 작성 진입점](modal-journal-navigation-and-compose-entry.md)
- [Realm 컨텍스트 주입과 쓰기 트랜잭션](realm-context-injection-and-write-transactions.md)

