# Lemon Squeezy 결제 연동 가이드

## 📋 설정 단계

### 1. Lemon Squeezy 계정 생성 및 스토어 설정
1. https://lemonsqueezy.com 회원가입
2. 스토어 생성
3. Settings > API 에서 API 키 생성

### 2. 제품 생성
1. Products > New Product
2. 두 가지 제품 생성:
   - **Free Plan**: $0 (또는 생략)
   - **Pro Plan**: $24/month 또는 원하는 가격

3. 각 제품의 **Variant ID** 복사

### 3. 환경 변수 설정

`.env.local` 파일에 다음 값들을 설정:

```env
# Lemon Squeezy API 키 (Settings > API)
LEMONSQUEEZY_API_KEY="your-api-key"

# 스토어 ID (Dashboard URL의 숫자)
LEMONSQUEEZY_STORE_ID="12345"

# Webhook Secret (Settings > Webhooks에서 생성)
LEMONSQUEEZY_WEBHOOK_SECRET="your-webhook-secret"

# Product Variant IDs (각 제품의 Variant ID)
NEXT_PUBLIC_LEMONSQUEEZY_PRODUCT_FREE="123456"
NEXT_PUBLIC_LEMONSQUEEZY_PRODUCT_PRO="123457"
```

### 4. Webhook 설정

1. Lemon Squeezy Dashboard > Settings > Webhooks
2. **Create Webhook** 클릭
3. URL 입력: `https://your-domain.vercel.app/api/webhooks/lemonsqueezy`
4. 이벤트 선택:
   - `order_created`
   - `subscription_created`
   - `subscription_updated`
   - `subscription_cancelled`
   - `subscription_payment_success`
5. Signing Secret 복사하여 `LEMONSQUEEZY_WEBHOOK_SECRET`에 저장

### 5. Vercel 환경 변수 설정

Vercel Dashboard에서 동일한 환경 변수들을 설정:
- `LEMONSQUEEZY_API_KEY`
- `LEMONSQUEEZY_STORE_ID`
- `LEMONSQUEEZY_WEBHOOK_SECRET`
- `NEXT_PUBLIC_LEMONSQUEEZY_PRODUCT_PRO`

## 🔧 테스트

### 로컬 테스트
```bash
npm run dev
```

1. http://localhost:3000/pricing 접속
2. Pro 플랜 선택
3. Lemon Squeezy Checkout 페이지로 리다이렉트 확인

### Webhook 로컬 테스트

로컬에서 webhook 테스트하려면:
```bash
npx localtunnel --port 3000
```

생성된 URL을 Lemon Squeezy Webhook 설정에 사용

## 📊 결제 플로우

```
사용자
  ↓
Pricing 페이지에서 Pro 선택
  ↓
/api/checkout 호출 (Checkout URL 생성)
  ↓
Lemon Squeezy Checkout 페이지로 이동
  ↓
결제 완료
  ↓
Webhook → /api/webhooks/lemonsqueezy
  ↓
구독 상태 DB 업데이트
```

## 🎯 다음 단계

1. **DB 스키마 업데이트**: `subscriptions` 테이블 추가
2. **대시보드 업데이트**: 구독 상태 표시
3. **접근 제어**: Pro 기능 제한
4. **결제 성공 페이지**: `/checkout/success` 생성

## 📚 참고 자료

- Lemon Squeezy Docs: https://docs.lemonsqueezy.com
- Lemon Squeezy JS SDK: https://github.com/lmsqueezy/lemonsqueezy.js
