# 2026-05-16 Home My Recipes Simplification

## 요약

Home의 `My recipes` 카드를 `DESIGN.md`의 단순성 원칙에 맞춰 제목 중심 카드로 정리했다. 진행률은 `Continue recipe`에서만 확인하도록 유지하고, 저장된 레시피 목록에서는 의미 없는 보조 라벨과 중복 CTA를 제거했다.

## 배경

사용자 QA에서 `My recipes` 카드의 progress bar, 설명성 metadata, `3 scenes`류 라벨, 설정/카메라 버튼이 불필요하다는 피드백이 있었다. `DESIGN.md`도 카드 제목이 행동을 설명하면 라벨/설명을 줄이고, 카드 전체가 CTA이면 중복 CTA 버튼을 두지 말라고 규정한다.

## 변경 내용

- `src/features/home/components/home-workspace-surface.tsx`
  - `My recipes` 카드를 전체 tappable 카드로 유지하고 이미지 + 레시피 제목만 렌더링하도록 변경.
  - progress bar, shot progress text, scene count, last activity label, status badge, manage/camera icon buttons 제거.
  - `Continue recipe` progress UI는 유지.
- `src/features/home/lib/home-owned-recipe-cards.ts`
  - Home 카드 전용 `managementDestination` 확장을 제거.
- `src/features/home/lib/home-layout.ts`
  - 제거된 카드 action/metadata 레이아웃 계산 유틸 삭제.
- `src/features/home/lib/home-owned-recipe-cards.test.ts`
  - Home 카드가 progress/scene metadata와 manage/camera CTA를 렌더링하지 않도록 source guard 추가.
- `src/features/home/lib/home-layout.test.ts`
  - 카드 title width 검증만 남기고 action/metadata 버튼 폭 검증 제거.

## 검증

- PASS: `node -r sucrase/register -e "... alias hook ...; require('./src/features/home/lib/home-owned-recipe-cards.test.ts');"`
- PASS: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-layout.test.ts`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- PASS: `git diff --check`
- PASS: `EXPO_NO_TELEMETRY=1 CI=1 npm run start -- --port 8090`

## 메모

- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-owned-recipe-cards.test.ts`는 Node가 `@/` alias를 직접 resolve하지 못해 실패했고, 기존 프로젝트 방식대로 alias hook을 붙여 재실행했다.
- Expo CLI는 `--no-interactive` 옵션을 지원하지 않아 해당 옵션 제거 후 Metro 시작 여부를 확인했다.
