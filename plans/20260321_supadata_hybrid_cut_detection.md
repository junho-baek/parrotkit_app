# Supadata Transcript + Hybrid Cut Detection

## 배경
- 현재 `/api/analyze`는 YouTube storyboard diff와 제한적인 FFmpeg path에 의존하고 있으며 transcript는 수집하지 않는다.
- 사용자는 Supadata 기반 transcript 수집과 AI가 후보 컷을 정리하는 hybrid cut detection을 원한다.
- 이번 작업은 transcript/scene metadata를 저장 계약까지 확장하는 범위다.

## 목표
- Supadata `native-first` transcript 파이프라인을 추가한다.
- 기존 analyze 흐름에 transcript/metadata를 결합한다.
- non-YouTube/direct video 경로에 frame diff 후보 추출 + AI confirmation을 추가한다.
- recipe/reference 저장 시 transcript/analysis metadata를 유지한다.

## 범위
- `src/app/api/analyze/route.ts`
- `src/lib/video-analyzer.ts`
- `src/lib/replicate.ts`
- `src/lib/schema.ts`
- `src/types/supabase.generated.ts`
- recipe 저장/조회 관련 API와 입력 폼
- Supadata helper 및 Supabase migration

## 변경 파일
- `plans/20260321_supadata_hybrid_cut_detection.md`
- `src/lib/supadata.ts`
- `src/lib/video-analyzer.ts`
- `src/app/api/analyze/route.ts`
- `src/app/api/recipes/route.ts`
- `src/components/auth/URLInputForm.tsx`
- `src/lib/schema.ts`
- `src/types/supabase.generated.ts`
- `supabase/migrations/*`
- `context/context_20260321_*_supadata_hybrid_cut_detection.md`

## 테스트
- `npm run db:schema` 시작/종료 시도
- `npx tsc --noEmit`
- `npx eslint` on changed files
- analyze smoke test for:
  - YouTube storyboard path
  - direct/public video frame diff path
  - transcript unavailable fallback

## 롤백
- Supadata helper, transcript metadata contract, hybrid generic frame detection path, 신규 DB 컬럼을 제거하고 기존 analyze/save 흐름으로 되돌린다.

## 리스크
- `SUPADATA_API_KEY`가 없으면 transcript는 graceful fallback만 검증 가능하다.
- non-YouTube social URL은 direct media URL을 항상 제공하지 않아 generic frame extraction coverage가 제한될 수 있다.
- DB 연결 불가 상태가 지속되면 `db:schema` snapshot 갱신을 실제로 완료하지 못할 수 있다.

## 결과
- 완료
- 요약:
  - Supadata transcript helper와 analyze metadata contract를 추가했다.
  - YouTube storyboard path는 유지하고, generic public/direct video용 frame diff + AI confirmation path를 추가했다.
  - recipe/reference 저장 시 transcript/source/analysis metadata를 보존하도록 확장했고, unmigrated DB를 위한 legacy retry도 추가했다.
  - `db:schema`는 현재 DB 연결 실패로 갱신하지 못했다.
- 연결 context: `context/context_20260321_083510_supadata_hybrid_cut_detection.md`
