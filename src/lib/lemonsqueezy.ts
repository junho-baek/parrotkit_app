import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';

let isConfigured = false;

export function ensureLemonSqueezyConfigured() {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  if (!apiKey) {
    throw new Error('LEMONSQUEEZY_API_KEY is required');
  }

  if (isConfigured) {
    return;
  }

  lemonSqueezySetup({
    apiKey,
    onError: (error) => console.error('Lemon Squeezy Error:', error),
  });

  isConfigured = true;
}
