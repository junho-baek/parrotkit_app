# RN 저장소 선택 지도 | RN Storage Decision Map

## 왜 이 문서가 필요한가

- React Native에서 저장소 이야기는 자주 한 덩어리처럼 섞이지만, 실제로는 `로컬 저장`, `서버 저장`, `캐시`, `동기화`가 다른 문제다.
- 특히 `Realm`, `SQLite`, `Supabase`, `jsonb`, `AsyncStorage`를 같은 층위에서 비교하면 오해가 생기기 쉽다.
- 이 문서는 앞으로 저장소 관련 판단을 할 때 현재 baseline을 빠르게 고르기 위한 개념 지도다.

## 현재 baseline

- 비교 기준은 [`vercel-react-native-skills`](/Users/junho/.agents/skills/vercel-react-native-skills/SKILL.md)로 둔다.
- 그 baseline 위에 개인 선택은 [`oh-my-rn`](/Users/junho/.codex/skills/oh-my-rn/SKILL.md)으로 덧씌운다.
- 현재 우리가 기본값으로 보는 방향은:
  - 작은 설정값은 `AsyncStorage`
  - 로컬 앱 데이터는 `expo-sqlite`
  - 서버 truth는 `Supabase/Postgres`
  - 유연한 서버 필드는 필요할 때만 `jsonb`
  - `Realm`은 학습 가치가 크지만, 새 Expo 앱의 첫 기본값으로는 예외적으로만 검토

## 가장 쉬운 한 줄 구분

- `AsyncStorage`: 로컬 key-value 저장
- `SQLite`: 로컬 관계형 DB
- `Realm`: 로컬 객체 DB
- `Postgres`: 서버 관계형 DB
- `jsonb`: 서버 Postgres 안의 유연한 JSON 컬럼
- `Supabase`: Postgres를 auth, storage, realtime과 묶어 쓰는 서버 플랫폼

## 층을 먼저 나눈다

### 1. 로컬 저장 층

- 앱이 오프라인이어도 바로 읽고 써야 하는가?
- 폰 안에서 빠르게 반응해야 하는가?
- 이 층의 대표 선택지는 `AsyncStorage`, `SQLite`, `Realm`이다.

### 2. 서버 저장 층

- 여러 기기에서 같은 데이터를 보아야 하는가?
- 로그인/권한/백업/동기화가 필요한가?
- 이 층의 대표 선택지는 `Postgres`, `Supabase`, 필요 시 `jsonb`다.

### 3. 캐시와 동기화 층

- 서버 데이터를 앱 안에서 얼마나 오래 보관할지
- 오프라인 수정분을 언제 서버로 보낼지
- 이 층은 보통 TanStack Query cache, local DB, sync queue로 따로 설계한다.

## 도구별 빠른 설명

### `AsyncStorage`

- 가장 작은 로컬 저장소다.
- 앱 설정, 마지막 탭, onboarding 여부, auth token처럼 작은 값에 맞는다.
- 문서상 string 기반 저장이므로 구조화된 큰 앱 데이터 저장소로 쓰기엔 금방 한계가 온다.

### `expo-sqlite`

- 현재 Expo 앱에서 가장 차분한 로컬 DB 기본값이다.
- 테이블, row, query shape가 분명한 데이터에 잘 맞는다.
- migration, index, filter/sort, paging 같은 문제를 점진적으로 다루기 좋다.
- 현재 방향에서는 local-first 앱의 첫 선택지로 가장 안정적이다.

### `Realm`

- 로컬 객체 DB라는 개념을 배우기엔 좋다.
- 화면에서 객체를 직접 읽는 감각, reactive local query, write transaction 사고방식을 배우는 데 강하다.
- 다만 2026 기준 새 Expo 앱의 첫 기본값으로는 보수적으로 본다.
- 즉 "이제 절대 못 쓴다"가 아니라, "기본 추천 기술이라기보다 예외 선택지"에 가깝다.

### `Supabase / Postgres`

- 서버 쪽 source of truth가 필요할 때 선택한다.
- auth, RLS, storage, realtime, edge function 같은 운영 문제를 같이 푼다.
- 여러 기기 동기화, 백업, 사용자별 데이터 분리가 필요하면 로컬 DB만으로는 부족하고 서버 계층이 필요하다.

### `jsonb`

- `jsonb`는 로컬 객체 DB 대체재가 아니라, 서버 Postgres 안에서 유연한 필드를 담는 방법이다.
- 자주 바뀌는 metadata, optional field bundle, 느슨한 schema 부분에 유용하다.
- 하지만 필터링/정렬/조인/무결성이 중요한 핵심 도메인 데이터까지 전부 `jsonb`로 미는 건 보통 좋지 않다.

## 무엇을 고를까

| 상황 | 우선 선택 | 이유 |
| --- | --- | --- |
| 앱 설정, 최근 검색어, 플래그 | `AsyncStorage` | 가장 단순하고 충분하다 |
| 오프라인에서도 바로 쓰는 로컬 노트/일기/임시 초안 | `expo-sqlite` | 로컬 DB 기본값으로 안정적이다 |
| 객체 감각이 강한 기존 앱 유지보수 | `Realm` 검토 | 기존 투자와 모델이 있다면 예외적으로 의미가 있다 |
| 사용자 데이터가 서버와 동기화되어야 함 | `Supabase/Postgres` | 서버 truth와 권한 모델이 필요하다 |
| 서버 데이터 중 일부 필드만 유연해야 함 | `Postgres + jsonb` | 전체 schema를 무너뜨리지 않고 확장 가능하다 |
| 서버 데이터 화면 캐시 | TanStack Query cache | 저장소가 아니라 cache 계층 문제다 |

## 자주 생기는 오해

### 오해 1. `jsonb`면 `Realm`을 대체한다

- 아니다.
- `jsonb`는 서버 저장 방식이다.
- `Realm`은 로컬 저장 방식이다.
- 둘은 같은 층을 비교하는 도구가 아니다.

### 오해 2. `Supabase`를 쓰면 로컬 DB가 필요 없다

- 경우에 따라 다르다.
- 온라인 전용 CRUD 앱이면 그럴 수 있다.
- 하지만 오프라인 작성, 빠른 초기 렌더, 임시 초안, sync queue가 중요하면 로컬 계층이 여전히 필요하다.

### 오해 3. 로컬 DB를 쓰면 서버가 필요 없다

- 단일 기기 개인 앱이면 가능하다.
- 하지만 백업, 여러 기기 동기화, 권한, 공유가 들어오면 서버 계층이 필요해진다.

## 현재 워크스페이스에서의 선택

### 레거시 소스가 실제로 하는 방식

- `nomad-diary`는 `Realm`을 통해 `AsyncStorage` 한계를 넘는 로컬 객체 DB 감각을 보여준다.

### 현재 baseline

- 현재 baseline은 `vercel-react-native-skills`를 기준으로 local-first Expo 앱의 첫 로컬 DB로 `expo-sqlite`를 더 차분한 선택으로 본다.

### 우리가 실제로 택할 방향

- 학습 문맥에서는 `Realm`을 개념 학습 대상으로 읽는다.
- 실제 새 앱 기본값은 `expo-sqlite` 쪽으로 기운다.
- 서버가 필요하면 `Supabase/Postgres`를 별도 계층으로 붙인다.
- `jsonb`는 서버에서 유연한 metadata가 필요할 때만 제한적으로 쓴다.

## 추천 조합

### 조합 1. 가장 기본적인 local-first Expo 앱

- 로컬 DB: `expo-sqlite`
- 서버: 없음
- 메모:
  - 개인 앱
  - 오프라인 우선
  - 가장 낮은 복잡도

### 조합 2. 로컬 우선 + 서버 백업

- 로컬 DB: `expo-sqlite`
- 서버: `Supabase/Postgres`
- 메모:
  - 로컬에서 먼저 저장
  - 이후 sync queue나 mutation으로 서버 반영

### 조합 3. 서버 truth + 로컬 캐시

- 로컬: TanStack Query cache, 필요 시 작은 `AsyncStorage`
- 서버: `Supabase/Postgres`
- 메모:
  - 오프라인 편집보다 서버 consistency가 더 중요할 때

## 스킬로 옮길 때 남길 한 줄

- 로컬 저장과 서버 저장을 같은 문제처럼 다루지 않는다.
- `jsonb`는 로컬 객체 DB 대체재가 아니라 서버 schema 유연화 도구다.
- 새 Expo 앱의 로컬 DB 기본값은 `expo-sqlite` 쪽으로 먼저 검토한다.
- `Realm`은 학습 가치와 기존 코드베이스 유지 맥락에서 읽고, 기본 채택은 신중하게 본다.

## 관련 문서

- [기기 로컬 객체 DB 부트스트랩](../analyses/device-local-object-db-bootstrap-with-realm.md)
- [Realm 컨텍스트 주입과 쓰기 트랜잭션](../analyses/realm-context-injection-and-write-transactions.md)
- [Supabase Expo 업로드와 storage 패턴](../analyses/supabase-expo-upload-and-storage-patterns.md)
- [RN 학습 워크플로우](rn-study-workflow.md)
