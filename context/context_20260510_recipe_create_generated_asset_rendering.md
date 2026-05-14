# Recipe Create Generated Asset Rendering Context

## 배경
- 사용자가 확인한 시뮬레이터 화면에서 generated visual이 회색 placeholder처럼 보였다.
- 코드에는 generated asset 참조가 적용되어 있었지만, local asset을 `Image.resolveAssetSource(...).uri` 문자열로 변환해서 `source={{ uri }}`로 넘기는 구조였다.
- React Native local bundle에서는 direct `require()` asset source를 `Image`/`ImageBackground`에 넘기는 방식이 더 안정적이다.

## 변경 사항
- `parrotkit-app/assets/recipe-create/`
  - 기존 generated PNG 원본에서 UI 표시용 JPG 파생본을 생성했다.
  - goal card: `512x768` JPG
  - niche thumbnail: `256x256` JPG
  - 큰 PNG 원본은 제거했다.
- `parrotkit-app/src/features/recipes/lib/recipe-create-visuals.ts`
  - React Native 런타임에서는 direct `require()` number source를 반환하도록 변경했다.
  - Node/test 런타임에서는 `{ uri: fallback }` source를 반환한다.
- `parrotkit-app/src/features/recipes/lib/recipe-create-flow.ts`
  - visual 필드명을 `imageUrl`에서 `imageSource`로 변경했다.
- `parrotkit-app/src/features/recipes/screens/recipe-create-screen.tsx`
  - `Image`와 `ImageBackground`에 `source={...}`를 직접 전달하도록 수정했다.

## 검증
- `cd parrotkit-app && npx tsx src/features/recipes/lib/recipe-create-flow.test.ts`
- `cd parrotkit-app && npx tsx src/features/recipes/components/shoot-board-scene-card-layout.test.ts`
- `cd parrotkit-app && npx tsx src/features/recipes/lib/shoot-board-model.test.ts`
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`

## 결과
- 모든 검증 명령은 exit code 0으로 통과했다.
- 로컬 번들 asset이 direct source로 전달되므로 installed/offline app에서도 visual 누락 가능성이 줄었다.

## 리스크
- JPG 파생본은 원본 PNG 대비 압축 손실이 있다.
- 이미 설치된 앱에는 새 bundle이 자동 반영되지 않으므로 재빌드/재설치 또는 Metro cache reset reload가 필요하다.
