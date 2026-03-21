# Fix Recipes Reference Embed Ambiguity

## 작업 개요
- 배포 환경 `/api/recipes`가 `PGRST201` 에러로 실패하던 문제를 수정했다.
- 원인은 `recipes -> references` 관계가 PostgREST 기준으로 2개 인식되어 embed 대상이 모호해진 것이었다.

## 주요 변경
- `src/app/api/recipes/route.ts`
  - `listRecipesWithReferenceFallback()` helper 추가
  - 아래 relation select를 순차적으로 시도하도록 변경
    - `references!recipes_reference_id_references_id_fk`
    - `references!recipes_reference_id_fkey`
    - 마지막으로 legacy plain `references`
  - ambiguous relation이 아닌 다른 에러는 즉시 반환
  - relation fallback으로 인해 깨진 타입 추론은 `Record<string, unknown>` 기반으로 정리

## 검증
- `PATH=/opt/homebrew/bin:$PATH npx tsc --noEmit` 통과
- `PATH=/opt/homebrew/bin:$PATH npx eslint src/app/api/recipes/route.ts` 통과

## 메모
- 이번 수정은 조회 경로 보완이므로 별도 DB migration은 필요 없다.
- 배포 DB에 중복 FK 이름이 남아 있어도 API는 더 이상 500으로 죽지 않도록 하는 방어 코드다.
