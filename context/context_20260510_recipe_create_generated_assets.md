# Recipe Create Generated Assets Context

## 배경
- 사용자는 `generate` 스킬을 명시했고, recipe create drawer visual을 실제 GPT generated image로 교체하길 요청했다.
- `OPENAI_API_KEY`가 설정되어 있어 `/Users/baekjunho/.codex/skills/generate/scripts/image.py`를 실행했다.
- 스크립트 기본 모델은 `gpt-image-2`로 확인했다.

## 변경 사항
- `parrotkit-app/assets/recipe-create/`
  - `generated-goal-*.png` 6개를 생성했다.
  - `generated-niche-*.png` 5개를 생성했다.
  - 이전 curated JPG asset은 제거했다.
- `parrotkit-app/src/features/recipes/lib/recipe-create-visuals.ts`
  - React Native 런타임 asset require 경로를 generated PNG 파일로 교체했다.
  - Node/test fallback URI는 유지했다.

## 생성 명령
- 모든 이미지는 `uv run /Users/baekjunho/.codex/skills/generate/scripts/image.py`로 생성했다.
- Goal cards는 `--aspect portrait`로 생성되어 `1024x1536` PNG다.
- Niche thumbnails는 `--aspect square`로 생성되어 `1024x1024` PNG다.
- 모델은 스크립트 기본값인 `gpt-image-2`를 사용했다.

## 검증
- `cd parrotkit-app && npx tsx src/features/recipes/lib/recipe-create-flow.test.ts`
- `cd parrotkit-app && npx tsx src/features/recipes/components/shoot-board-scene-card-layout.test.ts`
- `cd parrotkit-app && npx tsx src/features/recipes/lib/shoot-board-model.test.ts`
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`

## 결과
- 모든 검증 명령은 exit code 0으로 통과했다.
- `npx` 실행 시 npm/Node 버전 경고가 출력되지만 테스트/타입체크 실패로 이어지지 않았다.

## 리스크
- PNG asset 11개가 추가되어 앱 번들 크기가 증가한다.
- 필요하면 추후 generated 원본은 유지하고 Expo/React Native에 맞는 압축 파생본으로 교체할 수 있다.
