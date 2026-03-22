# Shooting Segment Navigation Review

## 작업 개요
- 레시피/슈팅 상세에서 이전/다음 세그먼트로 바로 이동할 수 있게 만들었다.
- Shooting 화면의 상단 헤더를 제거하고, 촬영 후 곧바로 preview/retry/use-take 흐름으로 이어지게 바꿨다.
- MediaRecorder의 mimeType 선택을 브라우저 지원값 우선으로 바꿔 오디오 저장 가능성을 보강했고, 촬영본 preview에서 직접 확인할 수 있게 했다.

## 주요 변경
- `src/components/common/RecipeResult.tsx`
  - 선택된 scene의 index를 계산해 `navigateScene(-1|1)` 추가
  - recipe detail header 우측에 이전/다음 세그먼트 화살표 추가
  - shooting mode에서는 기존 상단 헤더를 숨기고 tab bar만 유지
  - `CameraShooting`에 `onPreviousScene`, `onNextScene`, `hasPreviousScene`, `hasNextScene`, `existingCapture` 전달
  - 촬영 후에는 더 이상 자동으로 리스트로 복귀하지 않고 현재 씬에 머물도록 조정
- `src/components/common/CameraShooting.tsx`
  - 우측 상단에 이전/다음 세그먼트 오버레이 버튼 추가
  - 촬영 후 `recordedBlob`을 바로 저장하지 않고 preview overlay를 띄우도록 변경
  - preview overlay에서 `Retry` / `Use Take` 제공
  - 기존 저장된 local capture가 있으면 즉시 review 가능한 상태로 진입
  - 우측 하단 `Review` 버튼으로 촬영본 재생 가능
  - preview video는 controls를 유지해 마이크 오디오가 실제 들어갔는지 바로 확인 가능
  - `MediaRecorder.isTypeSupported()` 기준으로 `vp9/opus`, `vp8/opus`, `webm`, `mp4` 순 fallback
  - recording 시작 시 mic 상태를 `ready`, `denied`, `missing`으로 노출

## 검증
- `PATH=/opt/homebrew/bin:$PATH npx tsc --noEmit`
  - 통과
- `PATH=/opt/homebrew/bin:$PATH npx eslint src/components/common/RecipeResult.tsx src/components/common/CameraShooting.tsx`
  - error 없음
  - 기존 `@next/next/no-img-element` warning만 유지

## 메모
- 이번 변경으로 사용자는 촬영 직후 preview를 재생해 영상/오디오를 함께 점검할 수 있다.
- 실제 원격 업로드된 capture까지 불러와 preview하는 것은 아직 아니고, 현재 세션에서 가지고 있는 local capture 기준이다.
- 오디오가 계속 비는 경우는 이제 preview controls에서 바로 재현 가능하므로 브라우저 권한/codec 이슈와 앱 로직 이슈를 분리해서 보기 쉬워졌다.
