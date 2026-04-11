# chart 데이터 파생과 Victory Native 현대화 | Historical Price Chart Data and Victory Native Modernization

## 범위

- `nomadcoders/social-coin`의 2021-09-28 커밋 `266bf1d` (`5.9 Victory Charts`)를 현재 chart/data pipeline 관점으로 다시 읽는다.
- 특히:
  - history query 결과를 chart data로 바꾸는 위치
  - `victory-native`의 현재 위치
를 정리한다.

## 레거시 커밋이 실제로 한 것

- `history` API의 interval을 `30m`에서 `2h`로 바꿨다.
- `Detail` screen에서 `historyData`를 `x/y` point array로 바꿔 `victoryData` local state에 넣는다.
- `VictoryChart`, `VictoryLine`, `VictoryScatter`로 line chart를 그린다.
- line과 scatter에 같은 데이터를 재사용한다.

즉 이 커밋은 "detail raw data"가 "실제 차트 시각화 데이터"로 번역되는 첫 단계다.

## 현재 대응 개념

- 현재 대응 개념은 "chart-ready derived data from query results"다.
- chart 라이브러리 이름보다 중요한 건:
  - timestamp
  - numeric value
  - granularity
  - empty/loading/error
를 chart-friendly shape로 변환하는 데이터 파이프라인이다.

## 지금 기준으로 읽을 핵심

### 1. point array 파생 자체는 지금도 핵심이다

- query 결과를 바로 chart에 밀어넣기보다
  `[{ x, y }]` 같은 point model로 바꾸는 사고방식은 지금도 중요하다.

### 2. effect + state copy는 현재식으론 한 단계 더 줄일 수 있다

- 레거시 코드는 `historyData -> useEffect -> setVictoryData`로 한 번 더 복사한다.
- 현재식으론 보통:
  - query `select`
  - `useMemo`
로 파생한다.

### 3. 이 커밋의 `victory-native`는 현재 그대로 복사할 대상은 아니다

- 현재 npm의 `victory-native` 패키지는 active 상태로 안내되고,
  D3, Skia, Reanimated 기반이라고 설명한다.
- 동시에 `victory` npm 페이지는 React Native에서는 `victory-native`를 보라고 하고,
  예전 Victory를 RN에 쓰려면 `legacy` tag를 보라고 적는다.

즉 2021 강의의 `victory-native@35` 예시는 현재 패키지 생태계와는 그대로 같지 않다.
하지만 "query data를 chart point로 바꾸는 구조" 자체는 여전히 유효하다.

## 현재 기준 베스트 프랙티스

### 1. chart point 파생은 query layer나 memo에서 한다

```ts
const { data: chartPoints } = useQuery({
  queryKey: ["coin", "history", id],
  queryFn: fetchCoinHistory,
  select: (rows) => rows.map(toChartPoint),
});
```

### 2. granularity와 time window를 화면 요구사항으로 명시한다

- `2h`처럼 하드코딩하기보다
  "하루 / 일주일 / 한 달"
같은 product intent로 관리하는 편이 좋다.

### 3. loading, empty, error, no-data를 차트와 분리한다

- 차트 라이브러리로 다 해결하려 하지 말고
  wrapper 화면이 상태를 먼저 정리한다.

### 4. chart library는 current package status를 확인하고 고른다

- 2021 예제를 그대로 복사하지 말고
  현재 패키지의 active line과 peer dependency를 먼저 확인한다.

## 스킬 추출 후보

- 트리거:
  - query 결과를 모바일 차트로 시각화할 때
- 권장 기본값:
  - chart data는 query/memo에서 파생하고, 화면은 렌더만 맡긴다
- 레거시 안티패턴:
  - raw API payload를 effect에서 여러 번 복사해 chart state를 만들기
- 예외:
  - 아주 무거운 전처리는 worker/server pre-aggregation이 필요할 수 있다
- 현재식 코드 스케치:

```ts
const points = useMemo(
  () => historyData?.map((row) => ({ x: Date.parse(row.timestamp), y: row.price })) ?? [],
  [historyData]
);
```

- 스킬 규칙 초안:
  - `chart-data-is-derived-from-query-not-copied-in-effect`

## 관련 페이지

- [coin detail 병렬 query와 header identity seed](coin-detail-query-branch-and-header-identity.md)
- [query 기반 코인 목록 fetch와 도메인 필터링](query-driven-coin-list-fetch-and-filtering.md)
