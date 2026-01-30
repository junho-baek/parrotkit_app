# ParrotKit MVP 배포 체크리스트

## 📅 프로젝트 정보
- **목표 런칭일**: 2026-02-14 (세일 종료일)
- **현재 진행률**: 45% (결제 시스템 완성, 핵심 기능 구현 필요)
- **배포 환경**: Vercel (https://parrotkit.vercel.app)

---

## ✅ 완료된 작업 (2026-01-31)

### 1. Lemon Squeezy 결제 연동
- [x] Lemon Squeezy SDK 설치 및 설정
- [x] Store ID 수정 (801451 → 282768)
- [x] Checkout API 구현 (`/api/checkout`)
- [x] Test Mode 결제 플로우 테스트 완료
- [x] 환경 변수 최적화 (NEXT_PUBLIC_VARIANT_PRO)
- [x] Vercel 환경 변수 설정 완료
- [x] 배포 환경 결제 플로우 정상 작동 확인

### 2. 데이터베이스 스키마 확장
- [x] mvp_users 테이블에 구독 필드 4개 추가
  - `subscription_id`: Lemon Squeezy 구독 ID
  - `subscription_status`: 구독 상태 (active, cancelled, expired)
  - `plan_type`: 플랜 타입 (free, pro)
  - `subscription_ends_at`: 구독 만료일
- [x] Migration 스크립트 작성 및 실행
- [x] NeonDB에 테이블 구조 업데이트 완료

### 3. Webhook 핸들러 구현
- [x] Webhook signature 검증 로직
- [x] 5개 이벤트 처리 구현:
  - `subscription_created` → DB 업데이트
  - `subscription_updated` → 상태 업데이트
  - `subscription_cancelled` → 구독 취소
  - `subscription_payment_success` → 구독 연장
  - `subscription_expired` → Free Plan 복구
- [x] 에러 핸들링 및 로깅 추가

### 4. 대시보드 기능 구현
- [x] Settings 탭에 구독 정보 표시
- [x] 현재 플랜 및 다음 결제일 표시
- [x] Pro 업그레이드 버튼 구현
- [x] `/api/user/profile` 엔드포인트 추가
- [x] 실시간 구독 상태 조회 기능

### 5. 프로모션 기능
- [x] 2주 세일 카운트다운 타이머 (실시간 업데이트)
- [x] 온보딩 후 프로모션 모달 (58% 할인)
- [x] Pricing Card 컴팩트 레이아웃
- [x] Team/Agency Plan 추가 (Coming Soon)

### 6. Analytics & Tracking
- [x] GA4 이벤트 트래킹 (signup, login, checkout)
- [x] Microsoft Clarity 세션 녹화
- [x] 결제 퍼널 이벤트 (`promo_modal_cta_click`, `begin_checkout`)

### 7. 코드 최적화 및 문서화
- [x] TypeScript 타입 에러 수정
- [x] Production build 테스트 통과
- [x] README.md 업데이트 (구독 시스템, Webhook 가이드)
- [x] 환경 변수 문서화
- [x] Test Mode 사용법 작성

---

## 🔥 1순위: 결제 시스템 완성 (완료 ✅)

### A. Vercel 환경 변수 설정 ✅
**상태**: 완료

**설정 완료된 환경 변수**:
```bash
# 결제 관련 (3개)
LEMONSQUEEZY_API_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9... ✅
LEMONSQUEEZY_STORE_ID=282768 ✅
NEXT_PUBLIC_VARIANT_PRO=1263925 ✅

# 기존 변수
DATABASE_URL=postgresql://... ✅
JWT_SECRET=(32자 이상 보안 키) ✅
NEXT_PUBLIC_API_URL=https://parrotkit.vercel.app ✅
```

**검증 완료**:
- [x] Vercel 대시보드에서 환경 변수 추가
- [x] Redeploy 완료
- [x] 배포 환경에서 결제 플로우 정상 작동 확인

### B. 데이터베이스 스키마 확장 ✅
**파일**: `src/lib/schema.ts`

**추가된 필드** (mvp_users 테이블):
```typescript
subscriptionId: varchar('subscription_id', { length: 255 }),
subscriptionStatus: varchar('subscription_status', { length: 50 }).default('free'),
planType: varchar('plan_type', { length: 20 }).default('free'),
subscriptionEndsAt: timestamp('subscription_ends_at'),
```

**완료 작업**:
- [x] `src/lib/schema.ts` 수정
- [x] Migration 스크립트 작성 (`scripts/migrate.ts`)
- [x] Migration 실행 완료
- [x] NeonDB 테이블 구조 업데이트 확인

### C. Webhook 핸들러 구현 ✅
**파일**: `src/app/api/webhooks/lemonsqueezy/route.ts`

**구현된 이벤트**:
- [x] `subscription_created` → DB에 구독 정보 저장 (userId 또는 이메일 매칭)
- [x] `subscription_payment_success` → 결제 성공 시 구독 연장
- [x] `subscription_updated` → 구독 상태 업데이트
- [x] `subscription_cancelled` → 구독 취소 처리
- [x] `subscription_expired` → 만료 시 Free Plan 복구

**완료 작업**:
- [x] Webhook signature 검증 로직 (HMAC SHA256)
- [x] 각 이벤트별 DB 업데이트 로직 구현
- [x] 에러 핸들링 및 상세 로깅
- [x] Checkout API `custom_data` 필드명 수정 (user_id → userId)

**Lemon Squeezy 대시보드 설정 필요**:
- [ ] Webhook URL 등록: `https://parrotkit.vercel.app/api/webhooks/lemonsqueezy`
- [ ] Events 선택: subscription_created, subscription_updated, subscription_cancelled, subscription_payment_success, subscription_expired
- [ ] Signing Secret을 `LEMONSQUEEZY_WEBHOOK_SECRET` 환경 변수에 추가

### D. 대시보드 기능 구현 ✅
**파일**: `src/components/auth/DashboardContent.tsx`, `src/app/api/user/profile/route.ts`

**구현 완료**:
- [x] Settings 탭에 구독 정보 카드 추가
- [x] 현재 플랜 (Free/Pro) 표시
- [x] 다음 결제일 표시
- [x] Pro 업그레이드 버튼 (Free Plan 사용자만)
- [x] 구독 상태 실시간 조회 API (`/api/user/profile`)
- [x] JWT 인증 기반 사용자 정보 조회

### E. Live Mode 전환 (보류)
**현재 상태**: Test Mode 활성화 중

**전환 절차**:
- [ ] Lemon Squeezy 대시보드 → Settings → Store Settings
- [ ] Test Mode → OFF 전환 (스토어 승인 필요할 수 있음)
- [ ] Live Mode API Key 발급
- [ ] Vercel 환경 변수 `LEMONSQUEEZY_API_KEY` 업데이트
- [ ] 실제 결제 테스트 (소액 결제 후 환불)

---

## 🎯 2순위: 핵심 기능 구현

### E. 대시보드 기능 구현
**현재 상태**: UI만 존재, 실제 기능 없음

**구현 항목**:
- [ ] 구독 상태 표시 (Free/Pro, 만료일)
- [ ] 플랜 업그레이드 버튼 (Free → Pro)
- [ ] 플랜 다운그레이드/취소 버튼
- [ ] 결제 내역 조회 (Lemon Squeezy API)
- [ ] 레시피 분석 기록 조회 (DB에서 조회)

**파일**:
- `src/app/dashboard/page.tsx`
- `src/components/auth/DashboardContent.tsx`

### F. 레시피 분석 API 구현
**파일**: `src/app/api/analyze/route.ts`

**필요한 연동**:
- [ ] OpenAI API 또는 Claude API 연동
- [ ] 비디오/이미지에서 레시피 추출 로직
- [ ] 응답 형식: `{ ingredients: [], steps: [], cookingTime: string, difficulty: string }`
- [ ] Free Plan: 월 3회 제한, Pro Plan: 무제한

**환경 변수**:
```bash
OPENAI_API_KEY=sk-... (또는 ANTHROPIC_API_KEY)
```

### G. 비디오 업로드 구현
**파일**: `src/app/submit-video/page.tsx`

**선택지**:
1. **Vercel Blob Storage** (간단, Vercel 통합)
2. **AWS S3** (확장성, 비용 효율적)

**구현 순서**:
- [ ] 파일 업로드 API 구현 (`/api/upload`)
- [ ] 비디오 → 프레임 추출 (FFmpeg 또는 Cloudinary)
- [ ] 추출된 이미지를 AI 분석 API로 전송
- [ ] 진행 상황 표시 (Progress bar)

### H. 구독 상태별 접근 제어
**미들웨어 구현**:
- [ ] `src/middleware.ts` 생성
- [ ] JWT 토큰에서 userId 추출
- [ ] DB에서 구독 상태 조회
- [ ] Free Plan 사용 횟수 체크 (월 3회)
- [ ] Pro Plan은 무제한 허용

---

## 🛡️ 3순위: 보안 & 안정성

### I. 법적 문서
- [ ] 이용약관 작성 (`src/app/terms/page.tsx`)
- [ ] 개인정보처리방침 작성 (`src/app/privacy/page.tsx`)
- [ ] 회원가입 페이지에 동의 체크박스 추가
- [ ] 환불 정책 명시 (Lemon Squeezy 기준)

### J. 에러 트래킹
- [ ] Sentry 설치: `npm install @sentry/nextjs`
- [ ] `sentry.client.config.ts`, `sentry.server.config.ts` 설정
- [ ] Vercel 환경 변수: `SENTRY_DSN`, `SENTRY_AUTH_TOKEN`
- [ ] 결제 실패, API 에러, 프론트엔드 에러 모두 추적

### K. Rate Limiting
**도구**: Upstash Redis + Vercel Edge Config

**설정**:
- [ ] `/api/auth/signup`: 5회/분
- [ ] `/api/auth/signin`: 5회/분
- [ ] `/api/analyze`: 10회/시간 (Free), 무제한 (Pro)

### L. 이메일 알림
**도구**: Resend (추천) 또는 SendGrid

**템플릿**:
- [ ] 회원가입 환영 메일
- [ ] 구독 시작 확인 메일
- [ ] 결제 성공 메일
- [ ] 구독 만료 3일 전 알림

**환경 변수**:
```bash
RESEND_API_KEY=re_...
```

---

## 🎨 4순위: UX & 최적화

### M. 모바일 최적화
- [ ] iPhone (Safari) 전체 플로우 테스트
- [ ] Android (Chrome) 전체 플로우 테스트
- [ ] iPad 태블릿 레이아웃 검증
- [ ] 터치 제스처 확인 (스와이프, 핀치)
- [ ] 모바일에서 프라이싱 카드, 모달 레이아웃 검증

### N. 로딩 & 에러 처리
- [ ] `react-hot-toast` 또는 `sonner` 설치
- [ ] 모든 API 호출에 로딩 스피너 추가
- [ ] 네트워크 에러 시 재시도 버튼
- [ ] 타임아웃 처리 (30초)
- [ ] 사용자 친화적 에러 메시지

### O. SEO 최적화
- [ ] `src/app/layout.tsx`에 기본 메타데이터 설정
- [ ] 각 페이지별 metadata export
- [ ] `public/robots.txt` 생성
- [ ] `src/app/sitemap.ts` 생성
- [ ] Google Search Console 등록
- [ ] Open Graph 이미지 생성

### P. 성능 최적화
- [ ] `next/image` 사용 (현재 `<img>` 태그 교체)
- [ ] `@next/bundle-analyzer` 설치 및 분석
- [ ] Dynamic import로 Code splitting
- [ ] Lighthouse 점수 측정 (목표: 90+)
- [ ] LCP, FID, CLS 개선

---

## 📊 5순위: 운영 준비

### Q. 데이터베이스 백업
- [ ] NeonDB 대시보드에서 자동 백업 활성화 (일일)
- [ ] 백업 export 스크립트 작성
- [ ] 재해 복구 시나리오 문서화
- [ ] 스테이징 DB 환경 구축

### R. 고객 지원
- [ ] Intercom 또는 Tawk.to 채팅 위젯 설치
- [ ] FAQ 페이지 작성 (`src/app/faq/page.tsx`)
- [ ] 지원 이메일 설정 (support@parrotkit.com)
- [ ] 응답 시간 목표: 24시간 이내

### S. 런칭 준비
- [ ] 도메인 연결 확인 (parrotkit.com)
- [ ] SSL 인증서 활성화 확인
- [ ] GA4 실시간 데이터 모니터링
- [ ] Clarity 세션 녹화 확인
- [ ] 소셜 미디어 계정 준비 (Twitter, Instagram)
- [ ] 런칭 공지 작성
- [ ] Product Hunt 등록 준비

---

## ✅ 해결 완료: 배포 이슈

### 배포 환경에서 결제 화면으로 안 넘어가는 문제 (해결됨 ✅)

**증상**: 로컬에서는 정상 작동, Vercel 배포 환경에서는 결제 화면 이동 실패

**근본 원인**: Vercel 환경 변수 미설정

**해결 방법**:
1. Vercel 대시보드 → Settings → Environment Variables
2. 3개 환경 변수 추가:
   - `LEMONSQUEEZY_API_KEY`
   - `LEMONSQUEEZY_STORE_ID`
   - `NEXT_PUBLIC_VARIANT_PRO`
3. Redeploy 실행
4. ✅ 배포 환경에서 결제 플로우 정상 작동 확인

---

## 📈 진행 현황

| 카테고리 | 완료 | 전체 | 진행률 |
|---------|------|------|--------|
| 결제 시스템 | 4 | 4 | 100% ✅ |
| 핵심 기능 | 1 | 4 | 25% |
| 보안 & 안정성 | 0 | 4 | 0% |
| UX & 최적화 | 1 | 4 | 25% |
| 운영 준비 | 0 | 3 | 0% |
| **전체** | **6** | **19** | **32%** |
1. Vercel 환경 변수 추가 후 **Redeploy** (자동 배포 안 됨!)
2. `NEXT_PUBLIC_` 접두사가 없는 환경 변수는 서버에서만 접근 가능
3. 환경 변수 추가 후 반드시 **Redeploy** 클릭

---

## 📈 진행 현황

| 카테고리 | 완료 | 전체 | 진행률 |
|---------|------|------|--------|
| 결제 시스템 | 1 | 4 | 25% |
| 핵심 기능 | 0 | 4 | 0% |
| 보안 & 안정성 | 0 | 4 | 0% |
| UX & 최적화 | 0 | 4 | 0% |
| 운영 준비 | 0 | 3 | 0% |
| **전체** | **1** | **19** | **5%** |

---

## 🎯 이번 주 목표 (2026-02-01 ~ 02-07)

1. ✅ **Vercel 환경 변수 설정 및 배포 이슈 해결** (완료)
2. ✅ **데이터베이스 스키마 확장 (구독 필드 추가)** (완료)
3. ✅ **Webhook 핸들러 구현** (완료)
4. ✅ **대시보드 기본 기능 구현 (구독 상태 표시)** (완료)
5. ✅ **TypeScript 에러 수정 및 Production Build 통과** (완료)
6. **Lemon Squeezy Webhook URL 등록** (남은 작업)
7. **레시피 분석 API 구현 시작** (다음 주)

---

## 📞 연락처 & 리소스

- **GitHub**: https://github.com/YEAAAAAAAAAAp/Parrotkit
- **Vercel**: https://parrotkit.vercel.app
- **Lemon Squeezy Dashboard**: https://app.lemonsqueezy.com/dashboard
- **NeonDB Console**: https://console.neon.tech
- **GA4 Console**: https://analytics.google.com
- **Clarity Console**: https://clarity.microsoft.com

---

**Last Updated**: 2026-01-31  
**Next Review**: 2026-02-07
