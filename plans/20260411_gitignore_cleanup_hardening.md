# Plan - Gitignore Cleanup Hardening

## 배경
- 현재 작업트리는 clean 상태지만, 외장 볼륨 환경에서 AppleDouble `._*` 파일과 Finder 메타파일이 반복 생성되고 있다.
- 특히 `parrotkit-app`은 별도 복사/로컬 디스크 실행도 자주 하므로, 루트 `.gitignore`뿐 아니라 앱 단위 `.gitignore`도 self-contained 하게 정리할 필요가 있다.

## 목표
- 루트와 `parrotkit-app`의 ignore 규칙을 보강해 macOS/외장 볼륨 메타파일 때문에 미추적 파일이 생기지 않게 한다.
- 현재 생성되어 있는 `._*` 메타파일도 정리해 실제 작업트리가 clean 하게 유지되도록 만든다.

## 범위
- 루트 `.gitignore` 정리
- `parrotkit-app/.gitignore` 정리
- `make cl` 실행 및 ignore 검증
- 작업 결과 기록

## 변경 파일
- `plans/20260411_gitignore_cleanup_hardening.md`
- `.gitignore`
- `parrotkit-app/.gitignore`
- `context/context_20260411_gitignore_cleanup_hardening.md`

## 테스트
- `make cl`
- `git check-ignore -v parrotkit-app/.expo/._xcodebuild.log`
- `git status --short --branch --untracked-files=all`

## 롤백
- `.gitignore`와 `parrotkit-app/.gitignore`를 직전 상태로 되돌린다.

## 리스크
- ignore 범위를 넓힐 때 실제로 추적해야 하는 파일을 실수로 가릴 수 있으므로, 메타파일/로컬 산출물 범위로만 제한한다.

## 결과
- 루트 `.gitignore`에 macOS/외장 볼륨 메타파일 패턴을 명시적으로 정리했다.
- `parrotkit-app/.gitignore`에도 동일한 메타파일 규칙과 `.expo-shared/`를 추가해 앱 단독 복사본에서도 self-contained 하게 ignore가 먹도록 맞췄다.
- `make cl`로 현재 생성된 `._*` 메타파일을 정리했다.
- `git check-ignore -v`로 아래 항목들이 의도한 규칙에 의해 무시되는 것을 확인했다.
  - `parrotkit-app/.expo/._xcodebuild.log`
  - `parrotkit-app/android/app/build/intermediates/packaged_res/debug/packageDebugResources/._drawable`
  - `parrotkit-app/src/app/(tabs)/._source.tsx`
- 연결 context: `context/context_20260411_gitignore_cleanup_hardening.md`
