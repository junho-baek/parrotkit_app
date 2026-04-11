# 애니메이션 코인 그리드 카드와 detail 진입 | Animated Coin Grid Cards and Detail Entry

## 범위

- `nomadcoders/social-coin`의 2021-09-28 커밋 `8c161f3` (`5.7 Coins Screen part Two`)를 현재 list/card/navigation 관점으로 다시 읽는다.
- 특히:
  - list item을 reusable card로 추출하는 방식
  - grid card 애니메이션
  - card press에서 detail route로 진입하는 구조
를 정리한다.

## 레거시 커밋이 실제로 한 것

- `Coin` 컴포넌트를 분리했다.
- 코인 symbol마다 icon 이미지를 보여준다.
- `Animated.Value`와 `spring`으로 staggered opacity/scale 진입 애니메이션을 넣었다.
- grid는 3열로 바꾸고 spacing을 조정했다.
- 카드 press 시 `Detail` screen으로 이동하며 `symbol`, `id`를 넘긴다.

즉 이 커밋은 "텍스트 목록"이 "pressable visual entry card grid"로 진화한 단계다.

## 현재 대응 개념

- 현재 대응 개념은 "reusable grid entry card with lightweight motion"이다.
- 하나의 리스트 item이:
  - visual identity
  - press target
  - route seed
를 동시에 가지게 된다.

## 지금 기준으로 읽을 핵심

### 1. item 추출 자체는 좋은 방향이다

- `Coin`을 따로 뺀 것은 지금도 맞는 방향이다.
- 리스트 화면이 data ownership에 집중하고,
  item이 presentational+interaction 역할을 갖는다.

### 2. animation 선택도 개념상은 괜찮다

- opacity와 scale을 애니메이션하는 것은 GPU-friendly 속성 중심이라는 점에서 지금도 괜찮다.
- 다만 새 구현이면 Reanimated 쪽이 더 current하다.

### 3. route payload 최소화 방향도 이미 보인다

- 카드가 `symbol`, `id`만 넘기는 것은 현재식 minimal route params와 꽤 잘 맞는다.

## 현재 기준 베스트 프랙티스

### 1. 카드 입력은 `Pressable`이 기본값이다

- 현재 기준 action card는 `TouchableOpacity`보다 `Pressable`이 더 자연스럽다.

### 2. 이미지는 `expo-image`가 더 current하다

- `vercel-react-native-skills` 기준 이미지 기본값은 `expo-image`에 가깝다.

### 3. 리스트 item은 stable prop contract를 유지한다

- `id`, `symbol`, optional preview metadata처럼
  primitive prop 위주로 유지하는 편이 memo와 virtualization에 좋다.

### 4. animation은 transform/opacity만 유지하고 item 밖 책임을 늘리지 않는다

- stagger index 계산
- route action
- heavy mapping

을 item 안에 과도하게 넣지 않는 편이 좋다.

## 스킬 추출 후보

- 트리거:
  - remote list item이 visual card + detail entry point가 될 때
- 권장 기본값:
  - item을 reusable component로 빼고, minimal route seed만 넘긴다
- 레거시 안티패턴:
  - screen render 안에 복잡한 card markup과 press logic을 계속 남기기
- 예외:
  - 완전 단순한 두세 개 카드 row는 inline도 가능하다
- 현재식 코드 스케치:

```tsx
<Pressable onPress={() => router.push({ pathname: "/coin/[id]", params: { id, symbol } })}>
  <AnimatedCard />
</Pressable>
```

- 스킬 규칙 초안:
  - `grid-entry-cards-pass-minimal-detail-seed`

## 관련 페이지

- [query 기반 코인 목록 fetch와 도메인 필터링](query-driven-coin-list-fetch-and-filtering.md)
- [coin detail 병렬 query와 header identity seed](coin-detail-query-branch-and-header-identity.md)
