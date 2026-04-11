# 반응형 Realm 컬렉션 읽기와 리스트 렌더링 | Reactive Realm Collection Reading and List Rendering

## 범위

- `nomadcoders/nomad-diary`의 2021-09-26 커밋 `0ac7dff` (`4.5 Reading Objects`)를 현재 local collection read 관점으로 다시 읽는다.
- 특히:
  - Realm collection을 어떻게 읽고 구독했는지
  - 왜 AsyncStorage 방식보다 리스트 화면이 자연스러워졌는지
  - 현재식 reactive local query는 어떻게 설계하는지
  를 정리한다.

## 레거시 커밋이 실제로 한 것

- `Home.js`에 `useDB()`를 붙였다.
- `realm.objects("Feeling")`로 컬렉션을 읽는다.
- `feelings.addListener(...)`로 변경을 구독하고, 바뀔 때마다 다시 `setFeelings` 한다.
- `FlatList`로 기록들을 렌더링한다.
- 각 row는:
  - emotion
  - message
  로 구성된다.

즉 "write하면 list가 다시 보인다" 수준이 아니라, 로컬 DB의 변경이 홈 리스트에 반응형으로 연결되기 시작한 단계다.

## 현재 대응 개념

- 이 커밋의 현재 대응 개념은 "reactive local query result를 바로 UI에 연결한다"이다.
- AsyncStorage라면 보통:
  - 전체 JSON blob을 읽고
  - parse하고
  - 배열을 다시 써야 했다.
- DB로 넘어오면:
  - 컬렉션 query
  - 정렬
  - 변경 구독
  - 부분 업데이트

가 훨씬 자연스러워진다.

## 현재 기준 베스트 프랙티스

### 1. live collection을 굳이 React state에 다시 복사하지 않는다

- Realm을 쓴다면 지금은 `@realm/react`의 `useQuery`로 바로 읽는 편이 더 자연스럽다.
- 라이브 collection을 local `useState([])`로 한 번 더 감싸면 중복 동기화 지점이 늘어난다.

### 2. 정렬과 필터링은 query layer에서 더 일찍 한다

- 레거시 이 단계는 아직 정렬이 없다.
- 지금은 "최신순", "감정별", "검색어" 같은 기준이 생길 가능성이 높으므로,
  결과 shape를 query layer에서 먼저 정하는 편이 좋다.

### 3. 비어 있는 상태와 긴 리스트 상태를 같이 본다

- `ListEmptyComponent`
- stable `keyExtractor`
- destructive action affordance

를 리스트 첫 버전부터 같이 고려하는 편이 현재식이다.

### 4. local DB read는 네트워크 fetch mindset와 다르게 본다

- local-first 앱에서는 read가 네트워크 대기가 아니므로,
  "loading spinner부터"보다 "즉시 렌더 + empty state"가 더 자연스러운 경우가 많다.

## 스킬 추출 후보

- 트리거:
  - local DB에서 목록을 읽어 홈 화면에 보여줄 때
- 권장 기본값:
  - reactive query result를 리스트에 직접 연결
  - 정렬은 query boundary에서
  - empty state 준비
- 레거시 안티패턴:
  - live collection을 useState에 반복 복사하며 수동 동기화하기
- 예외 / 선택 기준:
  - DB 라이브러리가 reactive hook을 제공하지 않으면,
    최소한 "query -> map -> render" 경계를 일관되게 유지한다
- 현재식 코드 스케치:

```tsx
const entries = useQuery(Entry).sorted('createdAt', true);

<FlatList
  data={entries}
  keyExtractor={(item) => item.id.toHexString()}
  renderItem={({ item }) => <EntryRow entry={item} />}
/>
```

- 스킬 규칙 초안:
  - `reactive-local-query-drives-list-ui`
  - `do-not-mirror-live-db-collections-into-state-without-need`

## 관련 페이지

- [Realm 컨텍스트 주입과 쓰기 트랜잭션](realm-context-injection-and-write-transactions.md)
- [탭 삭제와 LayoutAnimation 리스트 전환](tap-to-delete-with-layout-animation.md)

