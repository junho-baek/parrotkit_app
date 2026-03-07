# ParrotKit Context: Project Setup & Testing Notes (2026-02-25)

## Branch & baseline
- Branch: `codex/junho/test`
- Base commit: currently synced with `origin/main`

## Project setup
- Framework: Next.js 16 (App Router), React 19, TypeScript 5
- Core directories
  - `src/app` (routes/pages/API)
  - `src/components` (UI components)
  - `src/lib` (db/schema/ai/video helpers)
  - `src/types` (shared types)
  - `drizzle` (DB schema/migrations)

## Environment requirements
- `DATABASE_URL` (PostgreSQL connection)
- `JWT_SECRET`
- `GOOGLE_AI_API_KEY`
- Lemon Squeezy optional but required for checkout/webhook tests
  - `LEMONSQUEEZY_API_KEY`
  - `LEMONSQUEEZY_STORE_ID`
  - `LEMONSQUEEZY_PRODUCT_ID`
  - `LEMONSQUEEZY_WEBHOOK_SECRET`
  - `NEXT_PUBLIC_VARIANT_PRO`

## Run commands
- `npm install`
- `npx drizzle-kit push` (DB schema sync)
- `npm run dev`
- `npm run lint`
- `npm run build`

## Runtime prerequisites
- FFmpeg installed and on PATH (`ffmpeg -version`)
- `.env.local` loaded
- PostgreSQL reachable from app runtime

## API routes (smoke checklist)
- `POST /api/analyze`
  - Body: `{ "url": "https://youtu.be/...", "niche": "string", "goal": "string", "description": "string" }`
  - Expected: 200 with `scenes[]`
- `POST /api/chat`
  - Body: `{ "messages": [{"role":"user","content":"..."}], "scenes"?: [], "currentScene"?: {"id":1,"title":"","script":["..."]} }`
  - Expected: 200 with `{ message: string }`
- `POST /api/auth/signup`
  - Body: `{ "email": "test@example.com", "username": "test", "password": "pass1234" }`
  - Expected: 201 with token + user
- `POST /api/auth/signin`
  - Body: `{ "username": "test", "password": "pass1234" }`
  - Expected: 200 with token + user
- `PUT /api/interests`
  - Header: `Authorization: Bearer <JWT>`
  - Body: `{ "interests": ["DIY", "Cooking"] }`
  - Expected: 200
- `GET /api/user/profile`
  - Header: `Authorization: Bearer <JWT>`
  - Expected: 200 with user profile
- `POST /api/checkout`
  - Body: `{ "variantId": "variant-id", "userId": 1, "userEmail": "test@example.com" }`
  - Expected: 200 with `checkoutUrl` when LS envs are valid
- `POST /api/export`
  - multipart/form-data: `email`, one or more `videos` files
  - Expected: 200 and `{ success: true, videoCount }`
- `POST /api/webhooks/lemonsqueezy`
  - Requires `x-signature` header + raw JSON body
  - Expected: 200 `{ received: true }`

## Quick test checklist
1. Start dev server: `npm run dev`
2. Sign up, sign in, capture token
3. Update interests/profile route with token
4. Hit analyze/chat with known URL and short message
5. Verify export endpoint with a small dummy file
6. Validate webhook handler by sending signed payload if Lemon Squeezy is configured

## Notes
- `analyze` and `chat` require valid Gemini key and can be rate-limited by Google API.
- DB errors appear immediately on import because `src/lib/db.ts` throws when `DATABASE_URL` is missing.
- Current branch has no test-route abstractions (`/api/test/*`) or n8n proxy wiring in this clean restore.
