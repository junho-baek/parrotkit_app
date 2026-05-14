# 2026-05-14 Prompter Card/Full Script Switch

## 배경

Sub-AC 15.2는 프롬프터 UI에서 카드 중심 프롬프팅과 전체 스크립트 보기를 명확히 전환할 수 있어야 한다.

## 목표

- 활성 컷 카드 기준 문구와 레시피 전체 스크립트 보기를 프롬프터 안에서 전환한다.
- 기존 manual scroll 및 text-size controls와 충돌하지 않는 헤더 컨트롤로 배치한다.
- 전체 스크립트가 없을 때는 카드 중심 보기로 안전하게 fallback한다.

## 범위

- 프롬프터 표시 모델에 view mode 선택 추가
- 프롬프터 화면에 Card/Full Script 전환 UI 추가
- focused test 및 TypeScript 검증
- 작업 결과 context 기록

## 변경 파일

- `src/features/recipes/lib/prompter-display.ts`
- `src/features/recipes/lib/prompter-display.test.ts`
- `src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- `context/context_20260514_prompter_card_full_script_switch.md`

## 테스트

- `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts`
- 가능한 경우 `npm exec --offline -- tsc --noEmit`

## 롤백

- prompter display mode helper/test를 제거하고 프롬프터 화면을 기존 fullScript 우선 표시로 되돌린다.

## 리스크

- 프롬프터 헤더에는 manual scroll과 text-size controls가 이미 함께 있어 컨트롤 배치가 좁아질 수 있다.
- 전체 스크립트 표시 AC와 충돌하지 않도록 full script 버튼은 항상 명확히 노출되어야 한다.

## 결과

- 프롬프터 본문 표시 모드를 `card` / `full-script`로 명시하고, 전체 스크립트가 없으면 full switch를 disabled 처리하는 helper를 추가했다.
- 카메라 프롬프터 헤더에 Card / Full segmented switch를 추가했다.
- 모드 전환 시 수동 스크롤 위치를 초기화해 현재 보기의 첫 줄부터 다시 읽히도록 했다.
- 기존 manual scroll controls와 text-size controls는 같은 헤더 영역에 유지했다.
- 전체 TypeScript 검증 중 sibling saved-take storage 타입 mismatch를 발견해 full shoot board object도 허용하도록 입력 타입을 확장했다.

## 검증 결과

- Red: `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts`가 누락된 `getPrompterDisplayModeOptions` export로 실패하는 것을 확인했다.
- Green: `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts` 통과.
- TypeScript: `npm exec --offline -- tsc --noEmit` 통과.
- 참고: `./node_modules/.bin/sucrase-node src/features/recipes/lib/saved-take-storage.test.ts`는 `@/` path alias를 직접 해석하지 못해 실행 불가였고, TypeScript 검증으로 확인했다.

## 연결된 context

- `context/context_20260514_prompter_card_full_script_switch.md`
