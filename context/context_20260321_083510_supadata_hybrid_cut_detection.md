# Supadata Hybrid Cut Detection

## 작업 개요
- Supadata transcript helper를 추가하고 `/api/analyze`를 transcript + hybrid cut detection + script generation 파이프라인으로 확장했다.
- transcript/analysis metadata를 `references`, `recipes` 저장 계약까지 연결했다.

## 주요 변경
- `src/lib/supadata.ts`
  - Supadata metadata/transcript fetch wrapper 추가
  - `native` 우선, 실패/빈 결과 시 `generate` 재시도
  - `SUPADATA_API_KEY` 또는 `SUPADATA_API_TOKEN` 미설정 시 graceful fallback
- `src/lib/video-analyzer.ts`
  - generic public/direct video용 frame diff candidate 분석 추가
  - public video URL은 임시 파일 다운로드 후 thumbnail diff 계산
  - YouTube storyboard path 유지
- `src/app/api/analyze/route.ts`
  - transcript fetch + page media resolution + scene detection + AI script generation 순서로 재구성
  - generic frame diff 후보는 Gemini Flash로 confirmation 시도, 실패 시 raw candidates 사용
  - 응답에 `transcript`, `transcriptSource`, `scriptSource`, `sourceMetadata`, `sceneDetectionFallbackReason` 등 추가
- `src/app/api/recipes/route.ts`
  - transcript/source metadata/reference 저장 추가
  - recipe analysis metadata/script source 저장 추가
  - 신규 컬럼이 아직 없는 DB를 위해 legacy insert retry 추가
- `src/app/api/recipes/[id]/route.ts`
  - reference 생성 시 신규 컬럼 legacy retry 추가
- `src/components/auth/URLInputForm.tsx`
  - analyze 응답의 transcript/metadata를 recipe save payload와 sessionStorage에 포함
- DB 계약
  - `src/lib/schema.ts`
  - `src/types/supabase.generated.ts`
  - `src/types/recipe.ts`
  - `supabase/migrations/20260321090000_add_transcript_analysis_metadata.sql`
  - `drizzle/0002_tiresome_gabe_jones.sql`

## 검증
- `npx tsc --noEmit` 통과
- `npx eslint src/lib/supadata.ts src/lib/video-analyzer.ts src/app/api/analyze/route.ts src/app/api/recipes/route.ts src/app/api/recipes/[id]/route.ts src/components/auth/URLInputForm.tsx src/lib/schema.ts src/types/supabase.generated.ts src/types/recipe.ts` 통과
- `npm run db:generate` 통과
  - 생성 파일:
    - `drizzle/0002_tiresome_gabe_jones.sql`
    - `drizzle/meta/0002_snapshot.json`
- `npm run db:schema`
  - 시작 전/종료 후 모두 실패
  - 원인: `EHOSTUNREACH 0.0.0.34:5432`
- local dev API smoke test
  - YouTube:
    - URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
    - 결과: `sceneDetectionMethod: youtube_storyboard_diff`
    - `transcriptSource: none`
    - `transcriptFallbackReason: supadata_api_key_missing`
    - `scriptSource: ai_generated`
  - direct public video:
    - URL: `https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4`
    - 결과: `sceneDetectionMethod: frame_diff_ai_confirmed`
    - `sceneDetectionFallbackReason: ai_cut_confirmation_failed_used_raw_candidates`
    - `sceneCount: 2`

## 메모
- 현재 `.env.local`에는 `SUPADATA_API_KEY`가 없어 transcript는 실제 Supadata 호출 성공 경로까지 검증하지 못했다.
- generic frame diff는 public mp4 샘플 기준 동작하지만, 아주 짧은 영상에서는 후보 scene 수가 2개처럼 적을 수 있다.
- `db:schema` 실패는 코드 문제가 아니라 현재 DB 연결 상태 문제로 보인다.
