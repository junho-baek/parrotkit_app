# 2026-05-18 Env Runtime Contract Plan

## 배경

레퍼런스 링크 분석을 실제 토큰으로 연결하려면 어떤 키를 루트 서버와 Expo 앱 중 어디에 넣어야 하는지 명확해야 한다. 현재 루트는 Next.js API 서버/Vercel 런타임이고, `parrotkit-app/`은 Expo React Native 클라이언트다.

## 목표

- `.env.local.example`에 Super Data/Supadata와 Replicate 키 위치를 명확히 추가한다.
- Expo 앱용 env example을 따로 만들어 secret key가 클라이언트 번들에 들어가지 않게 안내한다.
- 코드/문서의 SuperData 명칭을 현재 사용자 운영 방식에 맞춰 `SUPERDATA_API_KEY` 우선, `SUPADATA_API_KEY` 호환으로 정리한다.
- 현재 서버 구조를 추후 작업자가 헷갈리지 않게 기록한다.

## 범위

- 포함: env example, provider runtime config, provider research doc, context 기록, focused verification.
- 제외: 실제 API 키 입력, Supabase schema 변경, 결제 구현, 실제 분석 worker/network pipeline 확장.

## 변경 파일

- `.env.local.example`
- `parrotkit-app/.env.local.example`
- `src/lib/supadata.ts`
- `parrotkit-app/src/domain/recipes/reference-analysis-provider.ts`
- `parrotkit-app/src/domain/recipes/reference-analysis-provider.test.ts`
- `parrotkit-app/docs/reference-analysis/provider-adapter-research.md`
- `README.md`
- `plans/20260518_env_runtime_contract.md`
- `context/context_20260518_env_runtime_contract.md`

## 테스트

- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/domain/recipes/reference-analysis-provider.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `git diff --check`

## 롤백

이번 커밋을 revert하면 기존 `SUPADATA_API_KEY`/`REPLICATE_API_TOKEN` 기반 설정과 기존 env example으로 돌아간다. 실제 secret 값은 repo에 추가하지 않는다.

## 리스크

- Super Data와 Supadata 명칭 혼선이 남을 수 있다. 그래서 server env는 `SUPERDATA_API_KEY`를 우선으로 두고, 기존 코드/문서 호환을 위해 `SUPADATA_API_KEY`도 계속 허용한다.
- Native subscription은 아직 구현되어 있지 않다. 이번 작업은 RevenueCat/StoreKit/Google Play 키를 실제로 연결하지 않고, Expo에는 공개 SDK 키만 넣는 방향을 문서화하는 데 그친다.

## 결과

- 루트 `.env.local.example`을 Next.js/Vercel 서버 env로 재정리했다.
- `SUPERDATA_API_KEY`를 preferred env로 추가하고 기존 `SUPADATA_API_KEY`/`SUPADATA_API_TOKEN`도 서버 코드에서 계속 허용했다.
- `REPLICATE_API_TOKEN`을 현재 v1 모델 실행용 필수 서버 env로 문서화했다.
- Expo 앱용 `parrotkit-app/.env.local.example`을 추가해 `EXPO_PUBLIC_PARROTKIT_API_URL`과 public Supabase/RevenueCat placeholder만 남겼다.
- README와 provider research 문서에서 Gemini/OpenAI/Anthropic direct keys는 Replicate 기반 v1에는 필요 없다고 명시했다.

## 검증

- PASS: `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/domain/recipes/reference-analysis-provider.test.ts`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` in `parrotkit-app/`
- PASS: `npm run check:architecture` in `parrotkit-app/`
- PASS: `git diff --check`
- BLOCKED: root `./node_modules/.bin/tsc --noEmit --pretty false` because root `node_modules/.bin/tsc` is not installed in this clone.
