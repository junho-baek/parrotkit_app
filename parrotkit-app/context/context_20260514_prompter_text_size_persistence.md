# Context 2026-05-14 Prompter Text Size Persistence

## 작업

Sub-AC 14.3: prompter 텍스트 크기 선택값을 v1 촬영 플로우 안에서 보존하도록 변경했다.

## 변경

- `src/features/recipes/lib/prompter-text-size.ts`
  - 기본값 상수 `DEFAULT_PROMPTER_TEXT_SIZE_LEVEL` 추가
  - local/mock state에서 복원되는 값을 검증하는 `resolvePrompterTextSizeLevel` 추가
- `src/features/recipes/lib/prompter-text-size.test.ts`
  - 저장된 `xl` 값이 그대로 복원되는지 확인
  - stale/invalid local value가 기본 `md`로 fallback 되는지 확인
- `src/core/providers/mock-workspace-provider.tsx`
  - workspace state에 `prompterTextSizeLevel` 추가
  - `useMockWorkspace` context로 현재 값과 setter 노출
  - setter에서 helper를 통해 값 범위를 방어
- `src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
  - 기존 screen-local text size state를 제거
  - text size controls가 workspace preference를 갱신하도록 변경
  - provider가 유지되는 앱 세션 안에서 prompter 화면 이탈/복귀 시 선택값을 보존

## 검증

- TDD red: `resolvePrompterTextSizeLevel` smoke check를 먼저 추가하고 `npx tsc --noEmit`에서 missing export 실패 확인
- Green: 구현 후 `npx tsc --noEmit` 통과

## 참고

- 저장 범위는 v1 요구에 맞춰 local/mock app state이며 서버, 로그인, 클라우드 sync, native persistent storage는 추가하지 않았다.
- 앱 프로세스 재시작 뒤 영구 저장은 이번 Sub-AC 범위 밖으로 보았다.
