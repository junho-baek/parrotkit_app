# 2026-05-16 Five Slot Paste Nav

## 배경
Issue 6 Seed는 기존 three-tab-only 제약을 폐기하고 Home, Explore, Paste, Recipes, My 5개 하단 슬롯 복원을 요구한다. `DESIGN.md`도 중심 Paste CTA를 포함한 custom/app-style bottom navigation을 v1 선호 모델로 명시한다.

## 목표
AC 1 범위에서 iPhone/Android 하단 네비게이션이 Home, Explore, Paste, Recipes, My 순서의 5개 사용자-facing 슬롯을 갖도록 루트 탭 계약을 갱신한다.

## 범위
- 루트 탭 표시 목록을 5개 슬롯으로 갱신한다.
- Paste/Recipes 라벨과 아이콘 계약을 추가한다.
- 기존 three-tab-only 검증을 five-slot 계약 검증으로 바꾼다.

## 변경 파일
- `src/core/navigation/root-tab-config.ts`
- `src/core/navigation/root-tab-config.test.ts`
- `src/core/navigation/root-tab-icons.ts`
- `src/core/i18n/app-language.tsx`

## 테스트
- RED: `tsc -p tsconfig.root-tabs-check.json`가 five-slot 계약 미충족으로 실패하는지 확인한다.
- GREEN: 같은 타입 체크를 통과시킨다.
- DESIGN.md lint 대체 확인: 관련 bottom navigation/Paste 문구 존재와 금지 copy 검색을 수행한다.

## 롤백
위 변경 파일의 탭 목록, 테스트 기대값, 아이콘/라벨 추가를 이전 three-tab-only 상태로 되돌린다.

## 리스크
- sibling 작업이 같은 navigation/i18n 파일을 수정 중이므로 기존 변경을 덮지 않고 최소 패치로 적용해야 한다.
- AC 1은 visible slot 노출이 핵심이며 Paste drawer 동작과 deep-link 전체 수정은 후속 AC에서 확장될 수 있다.

## 결과
- 루트 visible tab 목록을 `index`, `explore`, `source`, `recipes`, `my` 순서로 갱신했다.
- `source` 탭은 사용자-facing 라벨을 `Paste`로 노출하고, `recipes` 탭은 `Recipes`로 노출한다.
- 기존 hidden tab 목록에서 `source`/`recipes`를 제거해 5개 슬롯이 모두 하단 네비게이션에 표시되도록 했다.
- Paste가 중심 생성 진입점이 되므로 root tab shell에서 이전 floating create CTA 렌더링을 제거해 redundant CTA cluster를 피했다.

## 검증 결과
- RED 확인: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`가 기존 three-tab production contract 때문에 실패했다.
- GREEN 확인: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json` 통과.
- 전체 확인: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` 통과.
- DESIGN.md 확인: bottom navigation/Paste source text와 box-in-box/redundant CTA guardrail 존재를 확인했다.
- 연결 context: `context/context_20260516_five_slot_paste_nav.md`
