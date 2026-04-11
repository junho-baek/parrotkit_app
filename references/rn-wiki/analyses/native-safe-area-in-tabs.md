# Native Tabs Safe Area 메모

## 범위

- `nomad-diary`에서 header 없는 탭 화면과 header 있는 화면이 safe area를 어떻게 다르게 처리해야 하는지 정리한다.
- 특히 Android 상단 cutout과 하단 system navigation 영역, 그리고 iOS 하단 tab bar 겹침 문제를 함께 다룬다.

## 문제

- header 없는 탭 화면은 상단 status bar / camera cutout 아래에서 바로 시작해 내용이 가려질 수 있다.
- 탭 화면 하단은 native tab bar 위로 충분한 여백이 없으면 마지막 카드나 버튼이 가려질 수 있다.
- Expo native tabs 문서는 Android에서 bottom inset은 자동 적용되지만, 다른 inset은 직접 처리해야 한다고 설명한다.

## 현재 선택

- header 없는 탭 root 화면은 [`nomad-diary/core/scroll-chrome.js`](/Users/junho/project/RN_practice/nomad-diary/core/scroll-chrome.js) 의 `useHeaderlessTabScrollChrome()`으로 top/bottom inset을 직접 보정한다.
- header 있는 탭 화면은 `useHeaderTabScrollChrome()`으로 native header 동작은 유지하고, 하단 tab bar clearance만 추가로 확보한다.
- 탭 바깥의 상세 화면은 `useStackScrollChrome()`으로 일반 stack screen 기준 bottom inset만 보정한다.

## 구현 위치

- [`nomad-diary/app/(tabs)/index.js`](/Users/junho/project/RN_practice/nomad-diary/app/(tabs)/index.js)
- [`nomad-diary/app/(tabs)/study.js`](/Users/junho/project/RN_practice/nomad-diary/app/(tabs)/study.js)
- [`nomad-diary/app/(tabs)/search/index.js`](/Users/junho/project/RN_practice/nomad-diary/app/(tabs)/search/index.js)
- [`nomad-diary/app/entry/[slug].js`](/Users/junho/project/RN_practice/nomad-diary/app/entry/[slug].js)

## 배운 점

- `contentInsetAdjustmentBehavior="automatic"` 하나로 모든 플랫폼 문제를 해결할 수는 없다.
- header 없는 native tab root 화면은 safe area를 더 직접적으로 잡아주는 편이 예측 가능하다.
- safe area 규칙을 공통 hook으로 빼두면, 위키에서 배운 내용을 계속 앱 코드에 반영하기 쉽다.

## 참고 링크

- [Expo Router native tabs](https://docs.expo.dev/router/advanced/native-tabs/)
- [React Native ScrollView](https://reactnative.dev/docs/scrollview)

## 스킬 추출 후보

### 트리거

- header 없는 탭과 header 있는 stack 화면의 safe area 보정을 따로 다뤄야 할 때

### 권장 기본값

- header 없는 탭 화면과 header 있는 stack 화면의 safe area 규칙을 분리한다.
- 스크롤 화면은 `contentInsetAdjustmentBehavior`와 content padding을 함께 본다.
- safe area 처리를 카드/섹션 단위 ad-hoc padding으로 해결하지 않는다.

### 레거시 안티패턴

- 모든 화면에 같은 top padding을 기계적으로 넣기
- header chrome과 scroll inset을 별개 문제로 보지 않기

### 예외 / 선택 기준

- 완전한 full-bleed 커스텀 화면은 별도 safe area 전략이 필요할 수 있다.

### 현재식 코드 스케치

```tsx
<ScrollView
  contentInsetAdjustmentBehavior="automatic"
  contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
/>
```

### 스킬 규칙 초안

- "safe area는 navigator chrome 유무에 따라 규칙을 분리하고 scroll inset으로 먼저 해결한다."

