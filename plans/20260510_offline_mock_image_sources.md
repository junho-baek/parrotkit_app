# Offline Mock Image Sources Plan

## 배경
- 사용자가 서버를 끄면 홈/레시피 데모 이미지가 회색 placeholder로 사라진다고 보고했다.
- 확인 결과 `assets/mock-media` 파일은 앱에 있지만 `ugc-media.ts`가 `Image.resolveAssetSource(...).uri` 문자열로 변환해 mock data에 저장한다.
- Expo/RN 개발 환경에서 이 URI는 Metro/dev server 주소가 될 수 있어 서버가 꺼지면 이미지 로딩이 깨진다.

## 목표
- mock/media seed 이미지는 가능한 direct bundled asset source로 렌더링한다.
- YouTube thumbnail 등 실제 원격 URL은 기존처럼 URL source로 렌더링한다.
- 홈, 레시피 리스트, 레시피 상세/보드의 주요 mock 이미지 경로가 서버 URL에 직접 의존하지 않게 한다.

## 범위
- In scope:
  - local/remote image source helper 추가
  - `ugcMedia` image source를 direct `require()` asset으로 변경
  - mock recipe/reference thumbnail 타입 확장
  - 주요 Image/ImageBackground 렌더링에서 source helper 사용
  - shoot board cut thumbnail에 bundled source 전달
  - 테스트/typecheck/simulator smoke
- Out of scope:
  - 모든 외부 avatar/YouTube thumbnail의 완전 오프라인 캐싱
  - 새 이미지 생성
  - production standalone build 생성

## 변경 파일
- Add: `parrotkit-app/src/core/ui/image-source.ts`
- Modify: `parrotkit-app/src/core/mocks/ugc-media.ts`
- Modify: `parrotkit-app/src/core/mocks/parrotkit-data.ts`
- Modify: relevant image rendering components/screens
- Modify: `parrotkit-app/src/features/recipes/lib/recipe-domain-normalizer.ts`
- Modify: `parrotkit-app/src/features/recipes/lib/shoot-board-model.ts`
- Add/Modify: `context/context_20260510_offline_mock_image_sources.md`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- relevant existing `tsx` tests
- `git diff --check`
- Simulator smoke: server on load, then stop Metro and verify already-rendered mock cards do not fall back to placeholders where bundled assets are used.

## 롤백
- Revert helper and image source type changes.
- Restore `ugc-media.ts` to `Image.resolveAssetSource(...).uri` string output.

## 리스크
- Some deeper domain types currently assume thumbnail strings. Need keep URL fallback strings available for generated/remote images and avoid passing direct asset objects into text normalizers.
- In a dev-client session, newly loaded JS still needs Metro. This fix targets image asset URL dependency and production/offline bundle readiness, not running a dev-client app from cold start without a JS bundle.

## 결과
- `ugcMedia` mock image를 dev-server URI 문자열이 아니라 direct bundled asset source로 유지하도록 변경했다.
- Home/Recipes/Explore/Recipe Detail/Shoot Board 주요 image render 경로에 `toImageSource` helper를 적용했다.
- Native recipe normalization과 shoot board cut model에 `thumbnailSource`를 전달해 seed mock asset이 상세 화면에서도 유지되게 했다.
- Metro를 끈 뒤에도 이미 렌더된 홈 mock 이미지가 placeholder로 바뀌지 않는 것을 iOS Simulator에서 확인했다.
- 연결 context: `context/context_20260510_offline_mock_image_sources.md`
