import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';

// Lemon Squeezy 초기화
if (!process.env.LEMONSQUEEZY_API_KEY) {
  throw new Error('LEMONSQUEEZY_API_KEY is required');
}

lemonSqueezySetup({
  apiKey: process.env.LEMONSQUEEZY_API_KEY,
  onError: (error) => console.error('Lemon Squeezy Error:', error),
});

export { lemonSqueezySetup };
