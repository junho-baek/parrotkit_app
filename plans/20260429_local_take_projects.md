# 20260429 Local Take Projects

## 배경
- 현재 native shooting flow는 녹화 직후 take를 갤러리에 자동 저장한다.
- UGC 촬영 도구로는 한 컷에 여러 take를 찍고 best만 고르는 흐름이 더 자연스럽다.
- v1은 서버 없이 앱 내부 local take project로 가볍게 구현한다.

## 목표
- Recipe shooting과 Quick Shoot 모두 take를 앱 내부 프로젝트에 먼저 저장한다.
- 각 scene/project에서 여러 take와 best take를 관리한다.
- 사용자가 선택한 take만 갤러리에 저장하거나 `Open in...`으로 외부 앱에 보낸다.

## 범위
- Mock workspace state, take helper, review/tray UI, recipe camera, quick shoot camera.
- 서버 저장, cloud sync, global take library, native rebuild가 필요한 새 모듈 추가는 제외한다.

## 변경 파일
- `parrotkit-app/src/core/mocks/parrotkit-data.ts`
- `parrotkit-app/src/core/providers/mock-workspace-provider.tsx`
- `parrotkit-app/src/features/recipes/lib/take-projects.ts`
- `parrotkit-app/src/features/recipes/lib/take-export.ts`
- `parrotkit-app/src/features/recipes/components/native-take-review.tsx`
- `parrotkit-app/src/features/recipes/components/native-take-tray.tsx`
- `parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- `parrotkit-app/src/features/recipes/screens/quick-shoot-camera-surface.tsx`
- `context/context_20260429_local_take_projects.md`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- Recipe shooting에서 녹화 후 `Keep`이 갤러리 저장 없이 local take를 추가하는지 확인한다.
- Scene별 take count와 best 선택을 확인한다.
- Quick Shoot에서 여러 take keep, best 선택, delete, gallery save, open share sheet를 확인한다.

## 롤백
- 새 take helper/tray/export 파일을 제거한다.
- provider를 단일 `MockRecordedTake` 상태로 되돌린다.
- camera screens를 기존 gallery-first review flow로 되돌린다.

## 리스크
- v1은 metadata를 mock React state에 저장하므로 앱 재시작 후 take 목록 영속성은 제한적이다.
- React Native Share sheet에서 CapCut 노출 여부는 iOS와 설치 앱 상태에 의존한다.
