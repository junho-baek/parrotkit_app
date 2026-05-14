# 배경

ParrotKit v1 레시피 편집 화면은 카드 기반 컷 리스트를 기본 촬영 표면으로 사용한다. Sub-AC 11.1은 접힌 컷 카드 헤더에서 컷 번호와 역할이 명확히 보여야 한다.

# 목표

- 접힌 컷 카드 헤더에서 컷 번호와 역할을 분리해 즉시 스캔 가능하게 표시한다.
- 기존 컷 카드 확장/편집/촬영 동작은 유지한다.
- 한국어/영어 표시 모두 컷 번호와 역할 정보를 안정적으로 제공한다.

# 범위

- 컷 카드 헤더 표시 helper 추가
- `ShootBoardSceneCard` 헤더 렌더링 정리
- 단위 smoke test 및 TypeScript 검증
- 작업 결과 context 문서 추가

# 변경 파일

- 예정: `src/features/recipes/lib/cut-card-header.ts`
- 예정: `src/features/recipes/lib/cut-card-header.test.ts`
- 예정: `src/features/recipes/components/shoot-board-scene-card.tsx`
- 예정: `context/context_20260514_collapsed_cut_card_header.md`

# 테스트

- `npm exec --offline -- tsc --noEmit`
- `node -r ts-node/register src/features/recipes/lib/cut-card-header.test.ts`는 현재 devDependency가 없을 수 있어 가능하면 실행하고, 불가하면 TypeScript 검증으로 대체한다.

# 롤백

- 추가 helper/test 파일을 제거하고 `ShootBoardSceneCard` 헤더 렌더링을 이전 `cut.title` 기반 출력으로 되돌린다.

# 리스크

- 별도 test runner가 없는 프로젝트라 실행 가능한 검증은 TypeScript 컴파일 중심일 수 있다.
- 헤더 시각 변경은 카드 밀도에 영향을 줄 수 있어 최소 레이아웃 변경으로 제한한다.

# 결과

- 완료: `getCutCardHeaderParts` helper를 추가해 컷 번호와 역할 라벨을 분리된 데이터로 제공했다.
- 완료: 접힌 컷 카드 헤더가 `Cut #n`/`컷 #n` 배지와 역할 라벨을 별도 텍스트로 렌더링하도록 변경했다.
- 완료: 역할 라벨이 비어 있는 빈/직접 구성 컷은 `Custom`/`직접 구성`으로 표시해 헤더가 비지 않도록 했다.
- 검증: `npm exec --offline -- tsc --noEmit` 통과.
- 참고: 이 worktree에는 `tsx`/`ts-node` 실행기가 없어 개별 `.test.ts` 직접 실행은 생략했다.
- 연결 context: `context/context_20260514_collapsed_cut_card_header.md`
