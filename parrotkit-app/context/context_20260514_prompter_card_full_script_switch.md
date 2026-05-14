# 2026-05-14 Prompter Card/Full Script Switch

## 작업

Sub-AC 15.2 범위로 프롬프터 UI에서 카드 중심 프롬프팅과 전체 스크립트 보기를 명확히 전환할 수 있도록 정리했다.

## 변경

- `src/features/recipes/lib/prompter-display.ts`
  - `PrompterDisplayModeOption` 타입과 `getPrompterDisplayModeOptions` helper 추가
  - Card / Full switch option을 안정적인 순서로 반환
  - 전체 스크립트가 비어 있으면 Full option을 disabled 처리
- `src/features/recipes/lib/prompter-display.test.ts`
  - full script가 있을 때 Card / Full option이 모두 활성화되는지 검증
  - full script가 없을 때 Full option이 disabled 되는지 검증
- `src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
  - prompter display mode state 추가
  - 프롬프터 헤더에 Card / Full segmented switch 추가
  - mode 변경 시 수동 스크롤 위치 초기화
  - 기존 manual scroll 및 text-size controls 유지
- `src/features/recipes/lib/saved-take-storage.ts`
  - 전체 TypeScript 검증 중 sibling saved-take test가 full shoot board object를 넘기는 타입 mismatch를 발견해, completion input의 `board` 타입이 full `ShootBoardRecipe`도 받을 수 있도록 확장

## 검증

- Red: `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts`가 missing export로 실패
- Green: `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts` 통과
- TypeScript: `npm exec --offline -- tsc --noEmit` 통과
- 참고: `./node_modules/.bin/sucrase-node src/features/recipes/lib/saved-take-storage.test.ts`는 `@/` path alias를 직접 해석하지 못해 실행 불가였고, 해당 경로는 TypeScript 검증으로 확인

## 참고

- 기본 진입은 카드 중심 프롬프팅으로 유지했다.
- 전체 스크립트 보기에는 기존 cut-card 기반 full script 생성 결과를 사용한다.
- 서버 저장, 로그인, 자동 속도 조절, pinch zoom은 추가하지 않았다.
