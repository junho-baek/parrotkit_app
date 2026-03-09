# Vercel Env 변수 단계별 슬라이드 가이드 플랜 (2026-03-09)

## 배경
- 운영용 환경변수 입력 경로를 팀원이 헷갈리지 않도록 화면 캡처 기반 단계별 안내 자료가 필요하다.
- 사용자 요청으로 슬라이드(PPTX) 산출물을 생성하고, 산출물 경로는 git 추적에서 제외해야 한다.

## 목표
- GTM/LemonSqueezy 중심으로 Vercel 환경변수 확인 위치를 초보자도 따라할 수 있는 슬라이드로 정리한다.
- 캡처 근거 이미지를 포함한 PPTX와 소스 JS를 함께 생성한다.
- 슬라이드 산출물 경로를 `.gitignore`에 반영한다.

## 범위
- 포함: 공식 문서/콘솔 캡처, 슬라이드 제작, 렌더/오버플로우 검증, `.gitignore` 업데이트, context 기록
- 제외: 실제 Vercel/Supabase/LemonSqueezy 계정 생성 대행, 실서비스 배포 변경

## 변경 파일
- `plans/20260309_env_var_slides_guide.md`
- `tmp/slides/env-guide-20260309/*` (작업 소스)
- `output/slides/*` (최종 PPTX/소스)
- `.gitignore`
- `context/context_20260309_*.md`

## 테스트
- `python3 /Users/baekjunho/.codex/skills/slides/scripts/render_slides.py <pptx> --output_dir <dir>`
- `python3 /Users/baekjunho/.codex/skills/slides/scripts/slides_test.py <pptx>`
- 필요 시 montage 생성 후 수동 시각 검토

## 롤백
- 이번 작업 커밋을 revert 하거나 생성된 슬라이드/ignore 항목만 선택적으로 되돌린다.

## 리스크
- 외부 문서 UI 변경으로 캡처 내용이 이후 달라질 수 있음
- 긴 한글 텍스트로 인해 슬라이드 overflow 가능성
- 문서 캡처가 계정 상태에 따라 일부 화면과 다를 수 있음

## 결과
- 공식 문서/콘솔 캡처 기반 8장짜리 Vercel env 변수 입력 가이드 PPTX 생성 완료
- 산출물:
  - `output/slides/20260309_parrotkit_vercel_env_step_guide.pptx`
  - `output/slides/20260309_parrotkit_vercel_env_step_guide.source.js`
  - `output/slides/20260309_parrotkit_vercel_env_step_guide_montage.png`
- 렌더/overflow 검증 통과:
  - `render_slides.py` 성공
  - `slides_test.py`: `Test passed. No overflow detected.`
- `.gitignore`에 `/output/slides/`, `/tmp/slides/` 추가

## 연결 Context
- `context/context_20260309_182151_vercel_env_slides.md`
