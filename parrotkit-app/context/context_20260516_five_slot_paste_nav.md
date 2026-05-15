# Context 2026-05-16 Five Slot Paste Nav

## 작업
Issue 6 AC 1: iPhone/Android 하단 네비게이션이 Home, Explore, Paste, Recipes, My 5개 슬롯을 노출하도록 루트 탭 계약을 복원했다.

## DESIGN.md 확인
- `DESIGN.md`의 "Bottom navigation and creation entry" 섹션을 확인했다.
- Preferred v1 bottom navigation model이 Home, Explore, Paste, Recipes, My이고 Paste가 larger center action임을 확인했다.
- redundant CTA와 box-in-box guardrail을 확인했다.

## 변경
- `src/core/navigation/root-tab-config.ts`
  - visible root tabs를 `index`, `explore`, `source`, `recipes`, `my`로 갱신했다.
  - hidden root tabs를 빈 목록으로 바꿔 `source`와 `recipes`가 하단 네비게이션에 표시되도록 했다.
- `src/core/navigation/root-tab-config.test.ts`
  - three-tab-only 계약을 five-slot Paste navigation 계약으로 갱신했다.
  - 각 visible tab의 MaterialCommunityIcons glyph 존재 검증을 유지했다.
- `src/core/navigation/root-tab-icons.ts`
  - Paste/source와 Recipes 아이콘 매핑을 추가했다.
- `src/core/i18n/app-language.tsx`
  - English/Korean nav copy에 `source: Paste`, `recipes` 라벨을 추가했다.
- `src/core/navigation/root-native-tabs.tsx`
  - Paste가 persistent center tab이 되었으므로 이전 floating create CTA 렌더링을 제거했다.

## 검증
- RED: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`가 기존 three-tab production contract 때문에 실패함을 확인했다.
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json` 통과.
- 전체 타입 체크: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` 통과.
- DESIGN.md guard: `Preferred v1 bottom navigation model`, `Paste as the larger center action`, `Do not create box-in-box`, `Do not add redundant CTA` 문구 존재 확인.
- 금지 copy 검색: navigation/i18n 범위에서 새 user-facing `Shoot`, `New Shoot`, `Start Shoot`, `workflow`, `console`, `debug` copy를 추가하지 않았고, 검색 결과는 내부 식별자/test 문구뿐이었다.

## 리스크
- 실제 iPhone/Android simulator screenshot 검증은 AC 1 범위에서 수행하지 않았다.
- Paste drawer/deep-link route correctness는 후속 AC에서 source screen/source-actions 동작과 함께 검증해야 한다.
