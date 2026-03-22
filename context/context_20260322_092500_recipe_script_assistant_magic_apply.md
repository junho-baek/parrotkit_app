# Recipe Script Assistant Magic Apply

## 작업 개요
- Script Assistant의 `Apply to Script` 인터랙션을 더 강조된 UX로 변경했다.
- 적용 중 대기 상태를 추가하고, script/chat drawer가 자동으로 자연스럽게 전환되도록 상태를 정리했다.

## 주요 변경
- shadcn 초기화
  - `components.json` 생성
  - `@magicui` registry 추가
- 추가 컴포넌트
  - `src/components/ui/interactive-hover-button.tsx`
  - `src/components/ui/spinner.tsx`
- `src/components/common/RecipeResult.tsx`
  - `Apply to Script`를 `InteractiveHoverButton`으로 교체
  - 적용 중에는 `Spinner`와 `Applying magic...` 표시
  - `applyScript()`를 async 처리해 짧은 적용 대기 UX 추가
  - 적용 후 Script Assistant drawer 자동 닫힘
  - 적용 후 Script drawer 자동 열림
  - `View Script`와 Script Assistant drawer가 서로 닫히고 열리도록 상태 통합
- `src/components/common/RecipeVideoPlayer.tsx`
  - `scriptOpen` 상태를 부모에서 제어할 수 있도록 props 추가

## 검증
- `PATH=/opt/homebrew/bin:$PATH npx tsc --noEmit` 통과
- `PATH=/opt/homebrew/bin:$PATH npx eslint src/components/common/RecipeResult.tsx src/components/common/RecipeVideoPlayer.tsx src/components/ui/interactive-hover-button.tsx src/components/ui/spinner.tsx src/components/ui/button.tsx`
  - 에러 없음
  - 기존 `@next/next/no-img-element` warning만 유지

## 메모
- 작업 중 `globals.css`와 다른 일부 화면 파일에 별도 변경이 감지됐지만 이번 작업 범위에는 포함하지 않았다.
- `Apply to Script`의 대기 UX는 실제 네트워크 적용이 아니라 사용감 개선을 위한 짧은 로컬 적용 애니메이션이다.
