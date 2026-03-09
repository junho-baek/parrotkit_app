# Context - 2026-03-09 18:21 KST - Vercel env 변수 단계별 슬라이드 가이드

## Summary
- 사용자 요청에 따라 Vercel 환경변수 입력 가이드를 캡처 기반 PPTX로 제작했다.
- GTM / Vercel / Lemon Squeezy 공식 문서 화면을 재캡처하여 가독성 높은 뷰포트 기준 증거를 확보했다.
- `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_APP_URL`, `LEMONSQUEEZY_API_KEY`, `LEMONSQUEEZY_STORE_ID`, `LEMONSQUEEZY_WEBHOOK_SECRET`, `NEXT_PUBLIC_VARIANT_PRO` 6개 값을 어디서 찾는지 단계별로 정리했다.
- 슬라이드 산출물 경로는 git 추적에서 제외하도록 `.gitignore`를 업데이트했다.

## Artifacts
- 작업 소스 폴더: `tmp/slides/env-guide-20260309/`
- 최종 PPTX: `output/slides/20260309_parrotkit_vercel_env_step_guide.pptx`
- 최종 소스 JS: `output/slides/20260309_parrotkit_vercel_env_step_guide.source.js`
- 미리보기 몽타주: `output/slides/20260309_parrotkit_vercel_env_step_guide_montage.png`

## Captures
- `tmp/slides/env-guide-20260309/screenshots/01b_gtm_help_create_account_viewport.png`
- `tmp/slides/env-guide-20260309/screenshots/02b_vercel_env_docs_viewport.png`
- `tmp/slides/env-guide-20260309/screenshots/03b_lemon_api_getting_started_viewport.png`
- `tmp/slides/env-guide-20260309/screenshots/05_lemon_storeid_section.png`
- `tmp/slides/env-guide-20260309/screenshots/06_lemon_webhooks_guide.png`
- `tmp/slides/env-guide-20260309/screenshots/07_lemon_where_to_find_ids.png`

## Verification
- `node tmp/slides/env-guide-20260309/work/build-env-guide-deck.js`
  - 결과: PPTX 생성 성공, overlap/out-of-bounds 경고 없음
- `python3 /Users/baekjunho/.codex/skills/slides/scripts/render_slides.py tmp/slides/env-guide-20260309/build/20260309_parrotkit_vercel_env_step_guide.pptx --output_dir tmp/slides/env-guide-20260309/rendered`
  - 결과: 슬라이드 렌더 성공
- `python3 /Users/baekjunho/.codex/skills/slides/scripts/slides_test.py tmp/slides/env-guide-20260309/build/20260309_parrotkit_vercel_env_step_guide.pptx`
  - 결과: `Test passed. No overflow detected.`

## Notes
- macOS의 `._*` 리소스 포크 파일이 몽타주 생성 시 경고를 유발해 제거 후 재생성했다.
