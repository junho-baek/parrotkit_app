# Context 2026-05-14 Prompter Text Size Controls

## 작업

ParrotKit v1 prompter camera의 `LINE TO SAY` 영역에 텍스트 크기 조절 컨트롤을 추가했다.

## 변경

- `src/features/recipes/lib/prompter-text-size.ts`
  - `sm`, `md`, `lg`, `xl` 4단계 텍스트 크기 모델 추가
  - 기본 `md`는 기존 prompter typography와 동일한 30/39, 24/32 크기 유지
  - 단계 증감과 최소/최대 disabled 판정을 helper로 분리
  - 선택된 크기 단계를 primary/secondary script text rendering style로 변환하는 `getPrompterScriptTextStyle` 추가
- `src/features/recipes/lib/prompter-text-size.test.ts`
  - 기본 크기, 증감, clamp, disabled 판정의 throw 기반 smoke test 추가
  - selected level이 primary/secondary script text font size와 line height에 반영되는지 검증 추가
- `src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
  - prompter session local state로 text size level 추가
  - `LINE TO SAY` header에 A-/A+ icon controls와 현재 크기 label 추가
  - primary/secondary prompter line font size와 line height를 선택 단계 helper 결과로 렌더링

## 검증

- `npm run`으로 사용 가능한 스크립트를 확인했다. 현재 `lint`, `test`, `typecheck`, `build` 스크립트는 없다.
- `getPrompterScriptTextStyle` test를 먼저 추가한 뒤 `npx tsc --noEmit`에서 missing export 실패를 확인했다.
- 구현 후 `npx tsc --noEmit` 통과.
- 로컬 native camera runtime QA는 수행하지 않았다.

## 참고

- 자동 속도 조절, pinch zoom, 서버 저장 없이 현재 prompter session에서만 동작한다.
- 기존 manual scroll controls는 유지했고 같은 prompter header 안에 정리했다.
