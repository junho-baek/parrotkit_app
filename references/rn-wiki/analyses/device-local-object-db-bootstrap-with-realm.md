# Realm으로 여는 기기 로컬 객체 DB 부트스트랩 | Device-local Object DB Bootstrap with Realm

## 범위

- `nomadcoders/nomad-diary`의 2021-09-26 커밋 `997d09b` (`4.3 Realm SDK`)를 현재 local-first persistence 관점으로 다시 읽는다.
- 특히:
  - 왜 `AsyncStorage`가 아니라 DB 쪽으로 넘어가는지
  - Realm이 당시 해결하려던 문제가 무엇이었는지
  - 2026 기준으로 온디바이스 저장소를 어떻게 고르는지
  를 정리한다.

## 레거시 커밋이 실제로 한 것

- `realm`과 `expo-app-loading`을 설치했다.
- `App.js`에서 앱 렌더 전에 `Realm.open()`을 호출해 DB를 연다.
- `FeelingSchema`를 정의하고:
  - `_id`
  - `emotion`
  - `message`
  속성을 둔다.
- DB가 준비될 때까지 `AppLoading`으로 launch를 막고, 준비되면 navigation을 렌더링한다.

즉 이 커밋은 "로컬에 문자열 blob을 하나 저장하는 수준"을 넘어서, 앱 안에서 query 가능한 네이티브 데이터베이스를 여는 첫 단계다.

## 현재 대응 개념

- 이 커밋의 현재 대응 개념은 "local-first persistence bootstrap"이다.
- 공식 AsyncStorage 문서는
  [`Async Storage can only store string data`](https://react-native-async-storage.github.io/2.0/Usage/)
  라고 설명한다.
- 그래서 현재식 저장소 선택은 보통 세 층으로 나뉜다.
  - 단순 key-value:
    `AsyncStorage`, `MMKV`, 또는 `expo-sqlite/kv-store`
  - 온디바이스 SQL / query / transaction:
    [`expo-sqlite`](https://docs.expo.dev/versions/latest/sdk/sqlite/)
  - object graph + live objects:
    `realm` + `@realm/react`

## 지금 기준으로 읽을 핵심

### 1. 이 커밋은 AsyncStorage의 한계를 넘기려는 단계다

- journal entry를 모으고 읽고 지우려면 key-value string 저장보다
  query 가능한 local DB가 훨씬 자연스럽다.
- 특히:
  - 부분 갱신
  - 정렬
  - 삭제
  - live collection

이 필요해질수록 그렇다.

### 2. 현재 Expo 기본 persistence는 SQLite 쪽이 더 차분한 기본값이다

- Expo 공식 local-first guide는
  [`Expo SQLite`가 local-first persistence에 좋은 선택](https://docs.expo.dev/guides/local-first/)
  이라고 설명한다.
- Expo SQLite 문서도 DB가 앱 재시작 후에도 유지된다고 설명하고,
  `SQLiteProvider`, `useSQLiteContext`, `onInit` 패턴을 제공한다.
- 또한 `expo-sqlite/kv-store`를 AsyncStorage drop-in replacement처럼 쓸 수 있다.

### 3. Realm은 여전히 "객체 DB" 문제를 푸는 선택지다

- Realm JS 문서는 Realm을
  "runs directly inside phones"인 모바일 DB로 설명한다.
- React Native 쪽에선 `@realm/react` hooks 사용을 별도로 권한다.
- 다만 MongoDB 문서/브랜딩은 2026 기준 꽤 움직이고 있으므로,
  새 Expo 앱의 기본 persistence로는 SQLite가 더 낮은 리스크라는 해석이 가능하다.
  이 부분은 공식 문서 흐름을 바탕으로 한 추론이다.

### 4. launch gating 방식은 지금 더 단순해졌다

- 현재 Expo에선 앱 준비 전 대기를
  [`expo-splash-screen`](https://docs.expo.dev/versions/latest/sdk/splash-screen/)
  으로 다루는 편이 기본이다.
- `preventAutoHideAsync()` 후 필요한 준비만 마치고 빨리 숨기는 패턴이 더 current하다.

## 현재 기준 베스트 프랙티스

### 1. 저장소 선택 기준을 먼저 말로 고정한다

- key-value인가
- local relational data인가
- object graph와 live objects가 중요한가

를 먼저 정해야 한다.

### 2. 새 Expo 앱의 기본값은 `expo-sqlite`

- 단순 노트/저널/할 일 앱이면:
  - `expo-sqlite`
  - migrations
  - typed row mapping

이 기본값으로 더 안정적이다.

### 3. key-value만 필요하면 `expo-sqlite/kv-store`도 좋은 중간지점이다

- AsyncStorage API를 유지하면서 backend는 SQLite로 바꿀 수 있다는 점이 실용적이다.

### 4. Realm을 쓴다면 hooks 기반으로 시작한다

- 지금 새 코드라면 직접 `useContext(DBContext)`로 realm instance를 퍼뜨리기보다
  `@realm/react`의 provider / hook 계층을 먼저 본다.

## 스킬 추출 후보

- 트리거:
  - "AsyncStorage 말고 폰 안 DB가 필요하다"는 요구가 나올 때
- 권장 기본값:
  - key-value면 `expo-sqlite/kv-store` 또는 MMKV
  - query/transaction이면 `expo-sqlite`
  - live object graph면 Realm 검토
- 레거시 안티패턴:
  - 구조화된 컬렉션 데이터를 JSON string blob 하나로 끝까지 버티기
- 예외 / 선택 기준:
  - Realm의 reactive object model이 정말 필요하면 Realm이 여전히 후보가 될 수 있다
- 현재식 코드 스케치:

```tsx
<SQLiteProvider databaseName="journal.db" onInit={migrateDbIfNeeded}>
  <AppShell />
</SQLiteProvider>
```

- 스킬 규칙 초안:
  - `choose-local-persistence-by-query-shape-not-habit`
  - `asyncstorage-string-limit-means-db-boundary-rethink`

## 관련 페이지

- [Realm 컨텍스트 주입과 쓰기 트랜잭션](realm-context-injection-and-write-transactions.md)
- [반응형 Realm 컬렉션 읽기와 리스트 렌더링](reactive-realm-collection-reading-and-list-rendering.md)

