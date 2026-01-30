'use client';

import React from 'react';
import { PricingPlan } from '@/types/auth';
import { Button } from '@/components/common';

interface PricingCardProps {
  plan: PricingPlan;
}

export const PricingCard: React.FC<PricingCardProps> = ({ plan }) => {
  const isFree = plan.price === 0;
  const [loading, setLoading] = React.useState(false);
  
  const handleCTAClick = async () => {
    // GA4: 가격 플랜 CTA 클릭
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', isFree ? 'select_free_plan' : 'begin_checkout', {
        event_category: 'ecommerce',
        plan_name: plan.name,
        plan_price: plan.price,
        currency: 'USD',
        value: plan.price
      });
    }
    
    if (isFree) {
      // Free 플랜: 회원가입 페이지로 이동
      window.location.href = '/signup';
      return;
    }

    // Pro 플랜: Lemon Squeezy Checkout
    setLoading(true);
    try {
      const user = localStorage.getItem('user');
      const userData = user ? JSON.parse(user) : null;

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_PRODUCT_PRO,
          userId: userData?.id,
          userEmail: userData?.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      // Lemon Squeezy Checkout 페이지로 이동
      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('결제 페이지를 열 수 없습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3">{plan.name}</h3>
        <div className="mb-2">
          <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
          <span className="text-gray-600 ml-1">{plan.period}</span>
        </div>
        {isFree && (
          <p className="text-sm text-gray-500">no credit card required</p>
        )}
        {!isFree && plan.price === 24 && (
          <p className="text-sm text-gray-500">Billed yearly ($288/year)</p>
        )}
      </div>

      {/* Description */}
      <p className="text-center text-gray-700 text-sm mb-6">
        {plan.description}
      </p>

      {/* Features */}
      <div className="mb-6 flex-grow">
        <ul className="space-y-2">
          {plan.features.map((feature, index) => {
            const isEnabled = !feature.startsWith('❌') && !feature.startsWith('⭕');
            const icon = feature.startsWith('✅') ? '✅' : 
                        feature.startsWith('📷') ? '📷' : 
                        feature.startsWith('💾') ? '💾' : 
                        feature.startsWith('📄') ? '📄' : 
                        feature.startsWith('🚀') ? '🚀' :
                        feature.startsWith('❌') ? '❌' : 
                        feature.startsWith('⭕') ? '⭕' : '✅';
            
            // Remove emoji from text
            let text = feature.replace(/^[✅📷💾📄🚀❌⭕]\s*/, '');
            
            return (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="text-lg flex-shrink-0">{icon}</span>
                <span className={isEnabled ? 'text-gray-700' : 'text-gray-400'}>
                  {text}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* CTA Button */}
      <button 
        onClick={handleCTAClick}
        disabled={loading}
        className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold rounded-xl transition-colors"
      >
        {loading ? '처리 중...' : plan.buttonText}
      </button>
    </div>
  );
};
