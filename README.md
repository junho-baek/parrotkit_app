# ParrotKit MVP - Viral Recipe for UGC Creators

ParrotKit은 UGC 크리에이터를 위한 바이럴 콘텐츠 제작 도구입니다. TikTok/Shorts 링크를 분석하여 촬영 가능한 레시피로 변환합니다.

🔗 **Production**: https://parrotkit.vercel.app  
📊 **Status**: Test Mode (Payment Integration Complete)

## 🚀 기술 스택

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Database**: NeonDB (PostgreSQL)
- **ORM**: Drizzle ORM
- **Auth**: JWT + bcrypt
- **AI**: Google Gemini 1.5 Flash Latest (무료 tier - 월 150만 요청)
- **Payment**: Lemon Squeezy (Subscription)
- **Analytics**: Google Analytics 4 (GA4), Microsoft Clarity
- **Deployment**: Vercel

## 📦 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음을 추가:

```env
# NeonDB Connection
DATABASE_URL="your-neondb-connection-string"

# JWT Secret (보안을 위해 랜덤 문자열로 변경 필수)
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Next.js
NEXT_PUBLIC_API_URL="http://localhost:3000"

# Google AI (Gemini) - REQUIRED
GOOGLE_AI_API_KEY="AIzaSyCdeVg88Ffg92vuVHYbGYmQNE4goizr5Jw"

# Lemon Squeezy Payment
LEMONSQUEEZY_API_KEY="your-api-key"
LEMONSQUEEZY_STORE_ID="282768"
LEMONSQUEEZY_WEBHOOK_SECRET="your-webhook-secret"

# Product & Variant IDs (Public)
NEXT_PUBLIC_PRODUCT_ID="801451"
NEXT_PUBLIC_VARIANT_PRO="1263925"
```

> **⚠️ 주의**: 
> - **GOOGLE_AI_API_KEY 필수**: https://aistudio.google.com/app/apikey 에서 발급
> - 프로덕션에서는 반드시 JWT_SECRET을 변경하세요.
> - Lemon Squeezy API Key는 대시보드에서 발급받으세요.
> - Webhook Secret은 Webhook 설정 시 생성됩니다.

### 3. 데이터베이스 테이블 생성

NeonDB 콘솔에서 다음 SQL을 실행:

```sql
CREATE TABLE mvp_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  interests TEXT[],
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  
  -- Subscription fields (added 2026-01-31)
  subscription_id VARCHAR(255),
  subscription_status VARCHAR(50) DEFAULT 'free',
  plan_type VARCHAR(20) DEFAULT 'free',
  subscription_ends_at TIMESTAMP
);

CREATE INDEX idx_mvp_users_email ON mvp_users(email);
CREATE INDEX idx_mvp_users_username ON mvp_users(username);
CREATE INDEX idx_mvp_users_subscription_id ON mvp_users(subscription_id);
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속

## 📱 API 엔드포인트

### 회원가입
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123"
}
```

### 로그인
```http
POST /api/auth/signin
Content-Type: application/json

{
  "username": "username",
  "password": "password123"
}

Response:
{
  "token": "jwt_token",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "interests": []
  }
}
```

### 관심사 업데이트
```http
PUT /api/interests
Authorization: Bearer {token}
Content-Type: application/json

{
  "interests": ["Meme/Trend", "Fashion", "Beauty"]
}
```

## 📂 프로젝트 구조

```
parrot-kit-mvp/
├── src/
│   ├── app/
│   │   ├── (tabs)/           # 탭 네비게이션 Route Group
│   │   │   ├── layout.tsx    # AppShell + BottomTabBar
│   │   │   ├── home/         # Home 탭 (레퍼런스 히스토리)
│   │   │   ├── explore/      # Explore 탭 (트렌딩)
│   │   │   ├── paste/        # Paste 탭 (URL 입력)
│   │   │   ├── recipes/      # Recipes 탭 (내 레시피)
│   │   │   └── my/           # My 탭 (프로필/설정)
│   │   ├── api/              # 백엔드 API Routes
│   │   │   ├── auth/
│   │   │   │   ├── signup/   # 회원가입
│   │   │   │   └── signin/   # 로그인
│   │   │   ├── interests/    # 관심사 업데이트
│   │   │   ├── checkout/     # Lemon Squeezy 결제
│   │   │   ├── webhooks/     # 구독 관리 Webhook
│   │   │   └── ...
│   │   ├── dashboard/        # (리다이렉트 → /home)
│   │   ├── interests/        # 관심사 선택
│   │   ├── onboarding/       # 온보딩
│   │   ├── pricing/          # 요금제
│   │   ├── signin/           # 로그인
│   │   ├── signup/           # 회원가입
│   │   ├── submit-video/     # URL 입력 (레거시)
│   │   └── ...
│   ├── components/           # React 컴포넌트
│   │   ├── auth/            # 인증 관련 컴포넌트
│   │   │   ├── ExploreContent.tsx  # Explore 탭 컴포넌트
│   │   │   └── ...
│   │   └── common/          # 공통 컴포넌트
│   │       ├── BottomTabBar.tsx    # 하단 탭 네비게이션
│   │       └── ...
│   ├── lib/                 # 라이브러리
│   │   ├── db.ts           # NeonDB 연결
│   │   └── schema.ts       # Drizzle 스키마
│   └── types/              # TypeScript 타입
├── drizzle.config.ts       # Drizzle 설정
├── .env.local             # 환경 변수
└── package.json
```

## 🎨 주요 기능

### 🎯 앱 스타일 UI/UX (2026-01-31 업데이트)
- **하단 탭 네비게이션**
  - 5개 탭: Home 🏠 / Explore 🔥 / Paste 📋 / Recipes 🎬 / My 👤
  - 모바일 앱 같은 직관적인 네비게이션
  - Safe-area 지원 (모바일 노치 대응)
  - 데스크탑에서도 앱처럼 중앙 정렬

- **Home 탭**: 최근 Paste한 레퍼런스 히스토리
- **Explore 탭**: 트렌딩 레퍼런스 (Like/Save with Optimistic UI)
- **Paste 탭**: 바이럴 비디오 URL 입력
- **Recipes 탭**: 내가 생성한 레시피 목록
- **My 탭**: 프로필, 구독 관리, 설정

### ✅ 핵심 기능
- ✅ 회원가입 (이메일/유저네임 중복 체크)
- ✅ 로그인 (JWT 인증)
- ✅ 관심사 선택 (다중 선택)
- ✅ NeonDB 연동
- ✅ TypeScript 지원
- ✅ 모바일 최적화 UI (하단 탭 네비게이션)
- ✅ Tailwind CSS
- ✅ **AI 기반 레시피 분석** (Google Gemini - 무료)
- ✅ **실시간 스크립트 수정 챗봇**
- ✅ **Lemon Squeezy 구독 결제 연동**
- ✅ **Webhook 기반 구독 관리 시스템**
- ✅ **대시보드 구독 상태 표시**
- ✅ **2주 세일 카운트다운 타이머**
- ✅ **온보딩 후 프로모션 모달**
- ✅ GA4 퍼널 분석 + Microsoft Clarity
- ✅ Vercel 프로덕션 배포

## 🔐 보안

- 비밀번호 bcrypt 해싱 (10 rounds)
- JWT 토큰 기반 인증 (7일 유효)
- API 라우트에서 토큰 검증
- SQL Injection 방지 (Drizzle ORM)
- 환경 변수 검증 (JWT_SECRET 필수)
- .gitignore로 .env 파일 보호

## � 배포 가이드 (Vercel)

### 1. GitHub에 코드 푸시
```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

### 2. Vercel 배포
1. https://vercel.com 접속
2. **Import Git Repository** 선택
3. GitHub 레포지토리 선택
4. **Environment Variables** 설정:
   - `DATABASE_URL`: NeonDB connection string
   - `JWT_SECRET`: 보안 키 (최소 32자)

**인증 & 온보딩:**
- `signup_start`: 회원가입 시작
- `sign_up`: 회원가입 완료
- `login`: 로그인
- `onboarding_complete`: 관심사 선택 완료

**탭 네비게이션:**
- `tab_home_click`: Home 탭 클릭
- `tab_explore_click`: Explore 탭 클릭
- `tab_paste_click`: Paste 탭 클릭
- `tab_recipes_click`: Recipes 탭 클릭
- `tab_my_click`: My 탭 클릭

**Explore 인터랙션:**
- `like_trending_reference`: 트렌딩 레퍼런스 좋아요
- `save_trending_reference`: 트렌딩 레퍼런스 저장

**결제 & 프로모션:**o 플랜 Variant ID (1263925)
5. **Deploy** 클릭

### 3. 배포 후 확인
- 웹사이트 정상 작동 확인
- GA4에서 실시간 데이터 확인
- 회원가입/로그인 테스트

## 📊 GA4 퍼널 분석

다음 이벤트가 추적됩니다:
- `signup_start`: 회원가입 시작
- `sign_up`: 회원가입 완료
- `login`: 로그인
- `onboarding_complete`: 관심사 선택 완료
- `view_pricing`: 프라이싱 페이지 조회
- `begin_checkout`: 결제 프로세스 시작
- `promo_modal_cta_click`: 프로모션 모달 CTA 클릭
- `promo_modal_close`: 프로모션 모달 닫기

GA4 콘솔: https://analytics.google.com  
Clarity 콘솔: https://clarity.microsoft.com

## 💳 Lemon Squeezy 결제 연동

### Test Mode
현재 Test Mode로 설정되어 있어 실제 결제는 발생하지 않습니다.

### 테스트 결제 방법
1. Pricing 페이지에서 "Pro로 시작하기" 클릭
2. 테스트 카드 번호 입력: `4242 4242 4242 4242`
3. 만료일: 미래 날짜 (예: 12/28)
4. CVC: 아무 3자리 숫자 (예: 123)

### Live Mode 전환
1. Lemon Squeezy 대시보드 접속
2. Settings > Store Settings
3. Test Mode OFF로 전환
4. Webhook 설정: `https://parrotkit.vercel.app/api/webhooks/lemonsqueezy`
   - Events: `subscription_created`, `subscription_updated`, `subscription_cancelled`, `subscription_payment_success`, `subscription_expired`
   - Signing Secret을 `.env.local`의 `LEMONSQUEEZY_WEBHOOK_SECRET`에 저장

### Webhook 처리 (자동화됨)
Webhook이 다음 이벤트를 자동으로 처리합니다:
- **subscription_created**: 새 구독 생성 시 DB에 사용자 정보 업데이트
- **subscription_payment_success**: 결제 성공 시 구독 연장
- **subscription_updated**: 구독 상태 변경 시 DB 업데이트
- **subscription_cancelled**: 구독 취소 시 상태 업데이트
- **subscription_expired**: 구독 만료 시 Free Plan으로 복구

### 환경 변수
```
LEMONSQUEEZY_API_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...
LEMONSQUEEZY_STORE_ID=282768
LEMONSQUEEZY_WEBHOOK_SECRET=your-webhook-secret
NEXT_PUBLIC_VARIANT_PRO=1263925
```

## 🐛 트러블슈팅

### 패키지 설치 오류
```bash
npm install --legacy-peer-deps
```

### NeonDB 연결 오류
- `.env.local`의 `DATABASE_URL` 확인
- NeonDB 프로젝트 활성화 확인
- SQL 테이블이 생성되었는지 확인

### 빌드 오류
```bash
Remove-Item -Path ".next" -Recurse -Force
npm run build
```

### JWT 오류
- `JWT_SECRET` 환경 변수가 설정되었는지 확인
- Vercel에 환경 변수가 설정되었는지 확인

### 배포 환경에서 결제 화면으로 안 넘어가는 문제
- Vercel 대시보드 → Settings → Environment Variables 확인
- `LEMONSQUEEZY_API_KEY`, `LEMONSQUEEZY_STORE_ID`, `NEXT_PUBLIC_VARIANT_PRO` 설정 확인
- 환경 변수 추가 후 반드시 **Redeploy** 실행

### Webhook 디버깅
- Lemon Squeezy 대시보드 → Webhooks → View Logs에서 전송 기록 확인
- Vercel Functions 로그에서 Webhook 수신 확인
- DB에서 `subscription_id`, `subscription_status` 업데이트 확인

## 🎯 주요 기능

### AI 레시피 분석 🤖
- **URL 입력 → 맞춤형 스크립트 생성**
  - YouTube, Instagram, TikTok 링크 지원
  - Google Gemini 1.5 Flash Latest AI가 비디오 분석
  - 6개 씬 자동 분할 (Hook, Introduction, Build Up, Peak, Resolution, Outro)
  - 각 씬마다 대사, 연기 지시, 제스처 가이드 제공
  - Niche/Goal/Description 기반 맞춤형 생성

- **실시간 Script Assistant 챗봇**
  - "더 짧게 만들어줘", "재미있게 바꿔줘" 등 자연어 명령
  - 현재 씬 컨텍스트 인식
  - 스크립트 즉시 재생성
  - 채팅 히스토리 유지
  - "Apply to Script" 버튼으로 원클릭 적용

- **비용**: 100% 무료 (Google Gemini Free Tier - 월 150만 요청)
- **모델**: gemini-1.5-flash-latest (최신 버전 자동 사용)

### 구독 관리 시스템
- **Free Plan**: 기본 기능 제공
- **Pro Plan**: 무제한 레시피 분석, 우선 지원
- 대시보드에서 실시간 구독 상태 조회
- 플랜 업그레이드/다운그레이드 지원
- Webhook 기반 자동 구독 관리

### 프로모션 기능
- 2주 한정 세일 (58% 할인: $24 → $9.99)
- 실시간 카운트다운 타이머 (초 단위 업데이트)
- 온보딩 완료 후 프로모션 모달 자동 표시
- GA4 이벤트 트래킹으로 전환율 분석

## 👨‍💻 개발자

김우열 (Wooyeol Kim)

---

**ParrotKit** - UGC 크리에이터를 위한 바이럴 콘텐츠 제작 도구  
프로덕션: https://parrotkit.vercel.app
