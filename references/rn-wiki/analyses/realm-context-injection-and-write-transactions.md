# Realm 컨텍스트 주입과 쓰기 트랜잭션 | Realm Context Injection and Write Transactions

## 범위

- `nomadcoders/nomad-diary`의 2021-09-26 커밋 `c27b427` (`4.4 Writing Objects`)를 현재 local DB write flow 관점으로 다시 읽는다.
- 특히:
  - DB connection을 앱 전체에 어떻게 주입했는지
  - 쓰기 트랜잭션을 화면 코드와 어떻게 연결했는지
  - 현재식으론 어떤 provider / repository 구조가 더 자연스러운지
  를 정리한다.

## 레거시 커밋이 실제로 한 것

- `App.js`에서 open한 realm connection을 state에 넣고,
  `DBContext.Provider`로 앱을 감쌌다.
- `context.js`를 새로 만들어 `useDB()` hook으로 realm instance를 읽게 했다.
- `Write.js`에서는:
  - `const realm = useDB()`
  - `realm.write(() => realm.create("Feeling", ...))`
  - 저장 후 `goBack()`
  흐름을 넣었다.

즉 DB connection을 context로 공유하고, 화면 내부에서 직접 write transaction을 여는 구조다.

## 현재 대응 개념

- 이 커밋의 현재 대응 개념은 "DB client injection + command-style write"다.
- 지금도:
  - 앱 루트에서 DB 준비
  - 하위 화면에서 hook으로 접근

하는 구조 자체는 맞다.
- 다만 현재식으론 보통 두 방향 중 하나를 고른다.
  - Realm 유지:
    `RealmProvider`, `useRealm`, `useQuery`
  - SQLite 계열:
    `SQLiteProvider`, `useSQLiteContext`, repository/action 함수

## 현재 기준 베스트 프랙티스

### 1. DB connection 주입은 맞지만, raw instance 노출을 최소화한다

- 작은 예제는 context로 충분하다.
- 하지만 앱이 커지면 화면이 DB API 세부사항을 너무 많이 알게 된다.

### 2. write는 "폼 제출"과 "DB command"를 살짝 분리한다

- 레거시 코드는 validation과 persistence가 한 함수에 붙어 있다.
- 지금은:
  - validate input
  - command 실행
  - 성공 후 navigation

순서를 의식적으로 나누는 편이 좋다.

### 3. id 전략은 `Date.now()`보다 명시적인 식별자를 선호한다

- 단순 예제에선 괜찮지만,
  충돌 가능성과 타입 일관성을 생각하면 UUID나 database-native id가 더 낫다.

### 4. createdAt / updatedAt를 초기에 같이 넣는 편이 낫다

- journal 데이터는 정렬과 표시 시각이 금방 필요해진다.

## 스킬 추출 후보

- 트리거:
  - local DB write를 첫 화면에 붙일 때
- 권장 기본값:
  - provider에서 connection 소유
  - screen은 command helper나 hook 호출
  - 성공 후에만 navigation side effect
- 레거시 안티패턴:
  - 화면마다 raw DB instance 조작이 흩어지는 구조
- 예외 / 선택 기준:
  - 아주 작은 데모는 inline write도 괜찮지만,
    재사용 가능성이 보이면 repository / action 층으로 올린다
- 현재식 코드 스케치:

```tsx
async function createEntry(input: CreateEntryInput) {
  await db.withExclusiveTransactionAsync(async (txn) => {
    await txn.runAsync(
      'INSERT INTO entries (id, emotion, message) VALUES (?, ?, ?)',
      input.id,
      input.emotion,
      input.message
    );
  });
}
```

- 스킬 규칙 초안:
  - `db-provider-owns-connection-screen-triggers-command`
  - `separate-validation-from-local-write-transaction`

## 관련 페이지

- [Realm으로 여는 기기 로컬 객체 DB 부트스트랩](device-local-object-db-bootstrap-with-realm.md)
- [반응형 Realm 컬렉션 읽기와 리스트 렌더링](reactive-realm-collection-reading-and-list-rendering.md)
