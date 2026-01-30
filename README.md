# ParrotKit MVP - Next.js + NeonDB

ParrotKit은 UGC 크리에이터를 위한 바이럴 콘텐츠 제작 도구입니다.

🔗 **Production**: https://parrotkit.vercel.app

## 🚀 기술 스택

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Database**: NeonDB (PostgreSQL)
- **ORM**: Drizzle ORM
- **Auth**: JWT + bcrypt
- **Analytics**: Google Analytics 4 (GA4)
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
DATABASE_URL="postgresql://neondb_owner:npg_6XqtEySmTla7@ep-tiny-shape-ah45fn88-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

# JWT Secret (보안을 위해 랜덤 문자열로 변경 필수)
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Next.js
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

> **⚠️ 주의**: 프로덕션에서는 반드시 JWT_SECRET을 변경하세요.

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
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_mvp_users_email ON mvp_users(email);
CREATE INDEX idx_mvp_users_username ON mvp_users(username);
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
│   │   ├── api/              # 백엔드 API Routes
│   │   │   ├── auth/
│   │   │   │   ├── signup/   # 회원가입
│   │   │   │   └── signin/   # 로그인
│   │   │   └── interests/    # 관심사 업데이트
│   │   ├── dashboard/        # 대시보드
│   │   ├── interests/        # 관심사 선택
│   │   ├── onboarding/       # 온보딩
│   │   ├── pricing/          # 요금제
│   │   ├── signin/           # 로그인
│   │   ├── signup/           # 회원가입
│   │   └── ...
│   ├── components/           # React 컴포넌트
│   │   ├── auth/            # 인증 관련 컴포넌트
│   │   └── common/          # 공통 컴포넌트
│   ├── lib/                 # 라이브러리
│   │   ├── db.ts           # NeonDB 연결
│   │   └── schema.ts       # Drizzle 스키마
│   └── types/              # TypeScript 타입
├── drizzle.config.ts       # Drizzle 설정
├── .env.local             # 환경 변수
└── package.json
```

## 🎨 주요 기능

- ✅ 회원가입 (이메일/유저네임 중복 체크)
- ✅ 로그인 (JWT 인증)
- ✅ 관심사 선택 (다중 선택)
- ✅ NeonDB 연동
- ✅ TypeScript 지원
- ✅ 모바일 최적화 UI
- ✅ Tailwind CSS
- ✅ GA4 퍼널 분석 통합
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
   - `JWT_SECRET`: 보안 키
   - `NEXT_PUBLIC_API_URL`: Vercel 배포 URL
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
- `begin_checkout`: 유료 플랜 선택

GA4 콘솔: https://analytics.google.com

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

## 👨‍💻 개발자

김우열 (Wooyeol Kim)

---

**ParrotKit** - UGC 크리에이터를 위한 바이럴 콘텐츠 제작 도구  
프로덕션: https://parrotkit.vercel.app
