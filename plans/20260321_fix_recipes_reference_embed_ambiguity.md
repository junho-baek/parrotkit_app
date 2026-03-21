# Fix Recipes Reference Embed Ambiguity

## 배경
- 배포 환경 `/api/recipes`가 `PGRST201` 에러로 500을 반환하고 있다.
- `recipes -> references` 관계가 PostgREST 기준으로 2개 잡혀 있어 embed 대상이 모호해졌다.

## 목표
- `/api/recipes` 조회가 관계명 중복 상황에서도 안정적으로 동작하도록 수정한다.

## 범위
- `src/app/api/recipes/route.ts`
- 작업 기록 문서 업데이트

## 변경 파일
- `plans/20260321_fix_recipes_reference_embed_ambiguity.md`
- `src/app/api/recipes/route.ts`
- `context/context_20260321_*_fix_recipes_reference_embed_ambiguity.md`

## 테스트
- `npx tsc --noEmit`
- 대상 파일 ESLint

## 롤백
- 명시적 relation name fallback 로직을 제거하고 기존 단순 embed 쿼리로 복구한다.

## 리스크
- 둘 다 없는 특이한 스키마 상태에서는 여전히 실패할 수 있다.

## 결과
- 완료
- 요약:
  - `/api/recipes` 조회 시 `recipes -> references` embed 관계명을 명시적으로 시도하도록 수정했다.
  - 배포 DB에 FK 이름이 중복 존재하더라도 순차 fallback으로 조회가 가능하도록 보완했다.
  - relation fallback으로 인한 TypeScript 추론 깨짐은 안전한 record 캐스팅으로 정리했다.

## 연결 Context
- `context/context_20260321_202800_fix_recipes_reference_embed_ambiguity.md`
