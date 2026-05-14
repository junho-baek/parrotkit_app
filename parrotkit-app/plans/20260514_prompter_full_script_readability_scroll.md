# 2026-05-14 Prompter Full Script Readability Scroll

## 배경

Sub-AC 15.3.1은 프롬프터의 Full script view가 긴 스크립트를 읽기 좋은 타이포그래피, 문단 간격, 세로 스크롤로 렌더링해야 한다.

## 목표

- Full script mode에서 긴 스크립트가 하나의 압축된 텍스트 덩어리로 보이지 않도록 문단 단위로 표시한다.
- Card mode의 기존 컷 중심 프롬프팅, 수동 스크롤, 텍스트 크기 컨트롤을 유지한다.
- Full script mode에서 더 넓은 읽기 영역과 충분한 하단 여백을 제공한다.

## 범위

- 프롬프터 display helper에 full-script 문단 렌더링 계약 추가
- 프롬프터 카메라 화면의 full-script ScrollView 스타일 보강
- focused test 및 TypeScript 검증
- 작업 결과 context 기록

## 변경 파일

- `src/features/recipes/lib/prompter-display.ts`
- `src/features/recipes/lib/prompter-display.test.ts`
- `src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- `context/context_20260514_prompter_full_script_readability_scroll.md`

## 테스트

- `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts`
- `npm exec --offline -- tsc --noEmit -p tsconfig.prompter-full-script-display-check.json`
- 가능한 경우 `npm exec --offline -- tsc --noEmit`

## 롤백

- 추가한 full-script 문단 helper/test를 제거하고 ScrollView 스타일을 기존 `sayNowScroll` 단일 스타일로 되돌린다.

## 리스크

- 프롬프터 헤더에는 Card/Full switch, 텍스트 크기, 수동 스크롤 컨트롤이 함께 있어 레이아웃 충돌 가능성이 있다.
- Full script mode의 읽기 영역을 키우면서 하단 녹화 컨트롤을 가리지 않도록 maxHeight만 조정한다.

## 결과

- `getPrompterDisplayModel`의 full-script mode가 `\n\n` 기준 문단을 trim/filter해 반환하도록 변경했다.
- Full script ScrollView에는 더 큰 maxHeight, content bottom padding, 문단 간격을 적용했다.
- Card mode의 secondary line dimming은 유지하고, Full script mode의 모든 문단은 같은 읽기용 primary typography를 유지하도록 했다.
- 연결 context: `context/context_20260514_prompter_full_script_readability_scroll.md`

## 검증 결과

- Red: `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts`가 full-script 문단 분리 기대값으로 실패하는 것을 확인했다.
- Green: `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts` 통과.
- Scoped TypeScript: `npm exec --offline -- tsc --noEmit -p tsconfig.prompter-full-script-display-check.json` 통과.
- Full TypeScript: `npm exec --offline -- tsc --noEmit` 통과.
