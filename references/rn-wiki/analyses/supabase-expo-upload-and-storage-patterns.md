# Supabase와 Expo 업로드/스토리지 패턴 | Supabase and Expo Upload/Storage Patterns

## 범위

- Expo / React Native 앱에 Supabase를 붙일 때 보통 어떤 구조로 나누는지 정리한다.
- 특히:
  - Auth 세션 저장
  - Database query / mutation
  - Storage 업로드
  - 유저 갤러리 / 파일 앱에서 가져온 파일 처리
  - bucket / path / RLS 설계
  를 현재식으로 정리한다.

## 큰 결론

- Supabase를 붙인다는 것은 보통 세 층을 같이 붙이는 것이다.
  - `Auth`: 로그인과 세션
  - `Database`: 표 데이터와 관계
  - `Storage`: 이미지, 문서, 영상 같은 파일
- Expo 앱에서는 보통:
  - 서버 데이터는 TanStack Query
  - 파일은 Supabase Storage
  - 화면 이미지는 `expo-image`
  - 파일 선택은 `expo-image-picker` 또는 `expo-document-picker`
  - 쓰기 작업은 `useMutation`
  흐름으로 묶는 것이 자연스럽다.

## 1. Supabase를 Expo 앱에 붙일 때 기본 구조

### `lib/supabase.ts`

- 보통 클라이언트는 한 파일에서 초기화한다.
- 환경 변수:
  - `EXPO_PUBLIC_SUPABASE_URL`
  - `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` 또는 `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### Auth 세션 저장

- Supabase 공식 Expo quickstart는 `expo-sqlite/localStorage/install`를 사용하는 예시를 제공한다.
- Supabase의 Expo social auth 가이드는 mobile에 `expo-secure-store`, web에 `AsyncStorage` 계열 adapter를 사용하는 예시를 보여준다.

현재식 해석:

- "무조건 한 가지" 공식 정답이 하나로 고정돼 있다기보다, 저장 adapter는 앱 성격에 맞게 고른다.
- 다만 모바일 auth 토큰 보관은 보안상 `SecureStore` 쪽이 더 설득력 있다.
- 이 문장은 두 공식 가이드를 비교한 해석이다.

## 2. 서버 데이터는 어떻게 처리하나

- 일반 표 데이터는:
  - `supabase.from(...).select(...)`
  - `insert`, `update`, `delete`
  로 다룬다.
- 현재 앱 구조에서는:
  - 읽기: `useQuery`
  - 쓰기: `useMutation`
  - 성공 후 invalidate 또는 cache patch
  가 기본값이다.

즉:

- Supabase는 backend/API
- TanStack Query는 client cache / lifecycle

로 역할을 나눠 읽는 편이 좋다.

## 3. 갤러리와 파일 앱에서 업로드할 때

### 사진 / 비디오

- 유저 사진첩에서 가져오려면 `expo-image-picker`
- 프로필 사진, 다이어리 첨부 이미지, 썸네일 생성 전 원본 이미지 같은 흐름에 적합

### 문서 / 일반 파일

- PDF, DOCX, ZIP, 첨부 문서 등은 `expo-document-picker`
- "파일 앱에서 고르기" 개념에 더 가깝다

즉:

- 카메라롤 / 갤러리 -> `expo-image-picker`
- 파일 시스템 / 문서 -> `expo-document-picker`

## 4. Supabase Storage 업로드 현재식

### React Native에서 주의할 점

- Supabase Storage JS 문서는 React Native에서 `Blob`, `File`, `FormData` 업로드가 의도대로 동작하지 않을 수 있으니, RN에선 `ArrayBuffer` 업로드 예시를 따르라고 적는다.
- Supabase의 Expo user management 튜토리얼도:
  - `ImagePicker.launchImageLibraryAsync`
  - `fetch(image.uri).then((res) => res.arrayBuffer())`
  - `supabase.storage.from(...).upload(path, arraybuffer, ...)`
  흐름을 보여준다.

따라서 현재 Expo + Supabase 조합에선:

1. picker로 파일을 고른다
2. 파일 URI를 얻는다
3. `arrayBuffer()`로 변환한다
4. `supabase.storage.from(bucket).upload(path, arrayBuffer, { contentType })`
5. 성공 후 DB metadata나 profile row를 갱신한다
6. query invalidate

이 흐름이 가장 안전하다.

## 5. bucket은 어떻게 나누나

### 기본 원칙

- public media와 private document를 bucket에서 분리한다
- bucket마다 허용 파일 타입과 최대 크기를 다르게 둔다

### 보통 추천 구조

- `avatars`
  - 공개 프로필 사진이면 public bucket 가능
  - 앱이 매우 개인적이면 private도 가능
- `entry-images`
  - 다이어리 본문 첨부 이미지
  - 보통 private가 더 안전
- `documents`
  - PDF, 영수증, 증빙 문서
  - private
- `videos`
  - 용량과 네트워크 정책을 따로 가져가고 싶으면 별도 bucket

Supabase 문서는:

- bucket별 access model
- bucket별 file type / size restriction

을 지원한다고 설명한다.

## 6. 파일 path는 어떻게 잡나

### 추천

- path에는 user scope와 resource scope를 같이 넣는다
- 예:
  - `users/{auth.uid()}/avatars/{uuid}.jpg`
  - `users/{auth.uid()}/entries/{entryId}/{uuid}.jpg`
  - `users/{auth.uid()}/documents/{uuid}.pdf`

### 왜 이렇게 하나

- RLS policy를 path folder 기준으로 걸기 쉽다
- 나중에 정리/삭제/이관이 쉽다
- user 간 충돌을 피하기 쉽다

### overwrite는 피하는 편이 좋다

- Supabase standard upload 문서는 overwrite보다 새 path 업로드를 권장한다.
- 이유는 CDN 전파 지연 때문에 stale content가 남을 수 있기 때문이다.

현재식 해석:

- avatar도 같은 파일명을 덮어쓰기보다
  - 새 파일 path 업로드
  - DB row의 `avatar_path`만 새 값으로 교체
  가 더 안전하다.

## 7. metadata는 Storage만 믿지 말고 DB row도 두는 게 좋나

- 보통은 "그렇다" 쪽이 실무적이다.

예를 들면 `media_assets` 같은 테이블에:

- `id`
- `user_id`
- `bucket`
- `path`
- `mime_type`
- `bytes`
- `width`
- `height`
- `linked_entry_id`
- `created_at`

같은 metadata를 둔다.

이유:

- 목록 조회를 Storage API만으로 풀면 비즈니스 쿼리가 불편해진다
- "어느 다이어리 글에 붙은 이미지인지" 같은 관계를 다루기 어렵다
- DB query, sorting, filtering, ownership 관리가 쉬워진다

즉:

- 실제 파일 = Storage
- 비즈니스 의미 = Postgres row

로 나누는 편이 좋다.

## 8. 권한과 보안은 어떻게 잡나

### Database

- `public` schema 테이블에는 RLS를 켠다
- 기본 패턴:
  - `auth.uid() is not null`
  - `auth.uid() = user_id`

### Storage

- private bucket이면 `storage.objects`에 RLS policy를 건다
- Supabase 문서는:
  - 특정 bucket만 허용
  - 특정 folder만 허용
  - 첫 folder가 `auth.jwt()->>'sub'` 또는 `auth.uid()`와 일치해야 함
  같은 policy 예시를 제공한다

### owner 기반 정책

- Supabase는 object 생성 시 `owner_id`를 기록한다
- select / delete를 `owner_id = auth.uid()`로 제한하는 방식도 가능하다

## 9. 큰 파일은 어떻게 처리하나

- Supabase 문서는 standard upload는 작은 파일에 적합하고, 6MB 초과 업로드는 resumable upload(TUS)를 권장한다.
- 큰 파일 / 불안정한 네트워크 / progress가 필요한 경우:
  - resumable upload
  - direct storage hostname
  - signed upload URL
  를 검토하는 편이 좋다

즉:

- 작은 이미지/문서: standard upload
- 큰 영상/대용량 첨부: resumable upload

## 10. 현재 워크스페이스 기준 추천

`nomad-diary` 같은 앱이면:

1. Auth
   - Supabase Auth
   - 모바일 토큰 저장은 `SecureStore` 우선 검토
2. 데이터
   - Supabase query를 TanStack Query로 감싼다
3. 사진 업로드
   - `expo-image-picker`
   - `ArrayBuffer`로 변환 후 Storage 업로드
4. 문서 업로드
   - `expo-document-picker`
   - `ArrayBuffer` 업로드
5. 저장 구조
   - `entry-images` private bucket
   - `documents` private bucket
   - `avatars`는 공개 범위에 따라 public/private 결정
6. path
   - `users/{uid}/...` 구조
   - overwrite보다 새 path
7. DB
   - `media_assets` 같은 metadata table 유지

## 현재 결론

- Supabase를 붙일 때는 "DB와 파일을 분리해서 생각"하는 게 핵심이다.
- 유저가 사진첩에서 올리는 건 `expo-image-picker`
- 유저가 파일 앱에서 고르는 건 `expo-document-picker`
- 파일은 Supabase Storage
- 비즈니스 metadata는 Postgres 테이블
- 읽기/쓰기 lifecycle은 TanStack Query
- Expo + Supabase Storage 업로드는 RN 특성상 `ArrayBuffer` 흐름을 우선 생각하는 편이 안전하다


## 스킬 추출 후보

### 트리거

- Expo 앱에서 Supabase auth/database/storage/upload 구조를 같이 설계할 때

### 권장 기본값

- 서버 데이터는 TanStack Query, 파일은 Storage, 이미지 렌더링은 `expo-image`로 나눈다.
- 업로드는 mutation으로 감싸고 bucket/path/RLS를 먼저 설계한다.
- 모바일 파일 선택과 auth session 저장 전략을 같이 본다.

### 레거시 안티패턴

- 화면 안에서 storage upload와 DB write를 순서 없이 직접 호출하기
- user-scoped path와 public path를 구분하지 않기

### 예외 / 선택 기준

- 아주 짧은 데모에선 단일 bucket/단일 path도 가능하지만 실제 앱에선 권한 모델을 분리하는 편이 좋다.

### 현재식 코드 스케치

```ts
const uploadMutation = useMutation({
  mutationFn: async (file: UploadAsset) => {
    const path = `${user.id}/${file.name}`;
    await supabase.storage.from('uploads').upload(path, file.blob);
  },
});
```

### 스킬 규칙 초안

- "Supabase는 query, mutation, storage upload, picker, path/RLS 설계를 한 흐름으로 묶어 본다."

## 관련 페이지

- [스크롤, 캐싱, 업로드, 서버 상태 발전 흐름 | Scroll, Caching, Upload, and Server-State Evolution](rn-scroll-cache-upload-query-evolution.md)
- [StyleSheet.create와 NativeWind 선택 메모 | StyleSheet.create vs NativeWind](stylesheet-create-vs-nativewind.md)

## 참고 링크

- [Use Supabase with Expo React Native](https://supabase.com/docs/guides/getting-started/quickstarts/expo-react-native)
- [Build a User Management App with Expo React Native](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
- [Build a Social Auth App with Expo React Native](https://supabase.com/docs/guides/auth/quickstarts/with-expo-react-native-social-auth)
- [JavaScript: Upload a file](https://supabase.com/docs/reference/javascript/storage-from-upload)
- [Storage Access Control](https://supabase.com/docs/guides/storage/security/access-control)
- [Ownership](https://supabase.com/docs/guides/storage/security/ownership)
- [Storage Buckets](https://supabase.com/docs/guides/storage/buckets/fundamentals)
- [Standard Uploads](https://supabase.com/docs/guides/storage/uploads/standard-uploads)
- [Resumable Uploads](https://supabase.com/docs/guides/storage/uploads/resumable-uploads)
- [Limits](https://supabase.com/docs/guides/storage/uploads/file-limits)
