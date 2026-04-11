# coin detail 병렬 query와 header identity seed | Coin Detail Parallel Queries and Header Identity Seed

## 범위

- `nomadcoders/social-coin`의 2021-09-28 커밋 `f1568c0` (`5.8 Coin Detail part One`)를 현재 detail 화면 구조 관점으로 다시 읽는다.
- 특히:
  - route params를 어떻게 detail header에 쓰는지
  - info/history query를 어떻게 여는지
를 정리한다.

## 레거시 커밋이 실제로 한 것

- `Detail` screen을 추가했다.
- 카드에서 넘긴 `symbol`, `id`를 route params로 받는다.
- `navigation.setOptions`로 header title을 coin icon으로 바꾼다.
- `info`와 `history` 두 query를 병렬로 연다.
- `api.js`에 `info()`, `history()` fetcher를 추가했다.

즉 이 커밋의 핵심은 "preview seed를 가진 detail shell과 병렬 query가 만들어졌다"는 점이다.

## 현재 대응 개념

- 현재 대응 개념은 "preview-seeded detail shell with parallel data queries"다.
- 카드에서 가져온 최소 seed가
  header identity를 즉시 채우고,
  authoritative detail data는 query가 나중에 메우는 구조다.

## 지금 기준으로 읽을 핵심

### 1. `symbol`, `id`를 detail seed로 쓰는 발상은 지금도 좋다

- 전체 객체를 넘기지 않고 최소 식별자/표시 seed를 넘기는 방향은 current concept와 잘 맞는다.

### 2. info와 history를 병렬 query로 여는 것도 자연스럽다

- detail 화면에서 서로 독립적인 데이터라면 병렬 query는 좋은 기본값이다.

### 3. header identity는 route seed에서 빨리 채워도 된다

- coin icon처럼 이미 preview에서 알고 있는 정보는
  detail response를 기다리지 않고 헤더에 쓸 수 있다.

## Supabase 기준으로 옮겨 읽으면

- 지금 Supabase를 쓴다고 해도 이 개념은 그대로 유지된다.
- 달라지는 건 queryFn의 source뿐이다.
  - `coinpaprika`
  - Supabase `select`
  - RPC

중 무엇이냐가 바뀔 뿐,
  - minimal route params
  - header seed
  - authoritative detail query
라는 구조는 그대로 남는다.

## 현재 기준 베스트 프랙티스

### 1. query key intent를 더 분명히 둔다

```ts
["coin", "info", id]
["coin", "history", id]
```

같이 key intent를 더 직접적으로 보이게 두는 편이 읽기 쉽다.

### 2. route params는 최소화한다

- `id`는 필수
- `symbol`이나 icon URL은 optional preview seed

정도로 유지하는 편이 좋다.

### 3. header effect는 dependency와 cleanup를 의식한다

- 현재식으로는 `symbol`, `navigation` dependency를 명시하는 편이 좋다.

### 4. detail shell은 loading, error, empty state를 함께 설계한다

- 이 커밋은 아직 detail body를 거의 그리지 않지만,
  지금은 query가 붙는 순간
  error/empty도 바로 같이 설계하는 편이 좋다.

## 스킬 추출 후보

- 트리거:
  - list card에서 detail screen으로 넘어가며 route params를 정할 때
- 권장 기본값:
  - minimal route params + optional preview seed + authoritative detail query
- 레거시 안티패턴:
  - list item full object를 통째로 detail에 넘기기
- 예외:
  - 오프라인 preview-first UX에서 placeholderData가 매우 풍부할 수 있다
- 현재식 코드 스케치:

```ts
router.push({ pathname: "/coin/[id]", params: { id, symbol } });
```

- 스킬 규칙 초안:
  - `detail-shell-uses-preview-seed-and-parallel-queries`

## 관련 페이지

- [애니메이션 코인 그리드 카드와 detail 진입](animated-coin-grid-cards-and-detail-entry.md)
- [chart 데이터 파생과 Victory Native 현대화](historical-price-chart-data-and-victory-migration.md)
