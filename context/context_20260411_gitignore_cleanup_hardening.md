# Context - Gitignore Cleanup Hardening

## 작업 요약
- 외장 볼륨 환경에서 반복 생성되는 AppleDouble `._*` 파일과 Finder 메타파일 때문에 작업트리가 지저분해지지 않도록 ignore 규칙을 보강했다.
- 루트 `.gitignore`뿐 아니라 `parrotkit-app/.gitignore`에도 같은 메타파일 규칙을 넣어, 앱 디렉토리를 따로 복사해서 써도 self-contained 하게 동작하도록 맞췄다.

## 변경 파일
- `plans/20260411_gitignore_cleanup_hardening.md`
- `.gitignore`
- `parrotkit-app/.gitignore`
- `context/context_20260411_gitignore_cleanup_hardening.md`

## 구현 메모
- 루트 `.gitignore`
  - `.AppleDouble`
  - `.Spotlight-V100`
  - `.Trashes`
  - `.fseventsd`
- `parrotkit-app/.gitignore`
  - `._*`
  - `.AppleDouble`
  - `.Spotlight-V100`
  - `.Trashes`
  - `.fseventsd`
  - `.expo-shared/`

## 검증
- `make cl`
  - 현재 생성된 `._*` 메타파일 정리
- `git check-ignore -v parrotkit-app/.expo/._xcodebuild.log`
  - `parrotkit-app/.gitignore`의 `.expo/` 규칙으로 무시됨
- `git check-ignore -v parrotkit-app/android/app/build/intermediates/packaged_res/debug/packageDebugResources/._drawable`
  - `parrotkit-app/.gitignore`의 `/android` 규칙으로 무시됨
- `git check-ignore -v parrotkit-app/src/app/(tabs)/._source.tsx`
  - `parrotkit-app/.gitignore`의 `._*` 규칙으로 무시됨
- `git status --short --branch --untracked-files=all`
  - 작업 후 새 미추적 파일 없이 변경 대상만 표시됨
