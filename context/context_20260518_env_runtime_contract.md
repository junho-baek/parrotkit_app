# 2026-05-18 Env Runtime Contract

## 요청

사용자가 이슈 #19의 실제 API 토큰 연결을 위해 `.env.local.example`을 정리해 달라고 요청했다. 또한 현재 서버가 있는지, Expo/React Native 앱만 있는 구조인지 혼란을 확인했다.

## 현재 구조

- 루트 `/Users/junho/project/parrotkit-app`는 Next.js 앱이며 API 서버/Vercel 런타임이다.
  - 예: `src/app/api/mobile/reference-recipe/route.ts`
  - 서버 전용 provider helper: `src/lib/supadata.ts`, `src/lib/replicate.ts`
- nested `/Users/junho/project/parrotkit-app/parrotkit-app`는 Expo React Native 앱이다.
  - 모바일 앱은 `EXPO_PUBLIC_PARROTKIT_API_URL`로 루트 API를 호출한다.
  - secret key는 Expo env에 넣지 않는다.

## 변경

- 루트 `.env.local.example`을 서버 env 중심으로 재정리했다.
  - `SUPERDATA_API_KEY` preferred
  - `SUPADATA_API_KEY` legacy/vendor alias
  - `REPLICATE_API_TOKEN`
  - Supabase publishable/secret/database URL 분리
  - Lemon Squeezy는 현재 web checkout 구현으로 유지
- `parrotkit-app/.env.local.example`을 새로 추가했다.
  - `EXPO_PUBLIC_PARROTKIT_API_URL`
  - optional public Supabase placeholders
  - optional future RevenueCat public placeholders
  - server secrets 금지 주석 추가
- `src/lib/supadata.ts`에서 `SUPERDATA_API_KEY`를 우선 읽고 기존 `SUPADATA_API_KEY`/`SUPADATA_API_TOKEN`도 허용하게 변경했다.
- provider runtime config와 test에 `superdataApiKeyEnv: 'SUPERDATA_API_KEY'`를 추가했다.
- `README.md`와 `parrotkit-app/docs/reference-analysis/provider-adapter-research.md`에서 현재 v1은 direct Gemini/OpenAI/Anthropic keys 없이 Replicate token을 사용한다고 정리했다.

## 검증

- PASS: `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/domain/recipes/reference-analysis-provider.test.ts`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` in `parrotkit-app/`
- PASS: `npm run check:architecture` in `parrotkit-app/`
- PASS: `git diff --check`
- BLOCKED: root `./node_modules/.bin/tsc --noEmit --pretty false` because root `node_modules/.bin/tsc` is not installed in this clone.

## 남은 일

- 실제 분석 pipeline 구현 시 root server env에 `SUPERDATA_API_KEY`와 `REPLICATE_API_TOKEN`을 넣고 `/api/mobile/reference-recipe` 또는 새 job endpoint에서만 사용한다.
- Native subscription은 아직 현재 코드에 없다. iOS/Android 출시용 구독은 StoreKit/Google Play 직접 구현 또는 RevenueCat 같은 broker를 별도 이슈로 잡는 것이 맞다.
