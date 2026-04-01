'use client';

import React from 'react';
import { PricingPlan } from '@/types/auth';
import { ensureValidAccessToken } from '@/lib/auth/client-session';
import { logClientEvent } from '@/lib/client-events';

interface PricingCardProps {
  plan: PricingPlan;
}

export const PricingCard: React.FC<PricingCardProps> = ({ plan }) => {
  const isFree = plan.price === 0;
  const [loading, setLoading] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // 세일 종료 카운트다운
  React.useEffect(() => {
    if (!plan.saleEndDate) return;

    const calculateTimeLeft = () => {
      const saleEndDate = new Date(plan.saleEndDate!);
      const now = new Date();
      const difference = saleEndDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [plan.saleEndDate]);
  
  const handleCTAClick = async () => {
    // Coming Soon 플랜은 클릭 불가
    if (plan.comingSoon) {
      return;
    }
    
    if (isFree) {
      await logClientEvent('select_free_plan', {
        event_category: 'ecommerce',
        plan_name: plan.name,
        plan_price: plan.price,
        currency: 'USD',
        value: plan.price,
      });

      // Free 플랜: 회원가입 페이지로 이동
      window.location.href = '/signup';
      return;
    }

    // Pro 플랜: Lemon Squeezy Checkout
    setLoading(true);
    try {
      const token = await ensureValidAccessToken();
      const user = localStorage.getItem('user');
      const userData = user ? JSON.parse(user) : null;
      const authUserId = typeof userData?.id === 'string' ? userData.id : '';
      const userEmail = typeof userData?.email === 'string' ? userData.email : '';

      if (!token || !authUserId || !userEmail) {
        alert('결제를 진행하려면 먼저 로그인해주세요.');
        window.location.href = '/signin';
        return;
      }

      await logClientEvent('begin_checkout', {
        event_category: 'ecommerce',
        plan_name: plan.name,
        plan_price: plan.price,
        currency: 'USD',
        value: plan.price,
      });

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          variantId: process.env.NEXT_PUBLIC_VARIANT_PRO,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      await logClientEvent('checkout_redirected', {
        event_category: 'ecommerce',
        plan_name: plan.name,
        plan_price: plan.price,
        currency: 'USD',
        value: plan.price,
        checkout_provider: 'lemonsqueezy',
      });

      sessionStorage.setItem('parrotkit_pending_checkout', 'pro');
      sessionStorage.removeItem('parrotkit_purchase_success_logged');
      // Lemon Squeezy Checkout 페이지로 이동
      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error('Checkout error:', error);
      await logClientEvent('checkout_failed', {
        event_category: 'ecommerce',
        plan_name: plan.name,
        reason: error instanceof Error ? error.message : 'unknown_checkout_error',
      });
      alert('결제 페이지를 열 수 없습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="text-center mb-6">
        {plan.popular && (
          <div className="inline-block bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
            MOST POPULAR
          </div>
        )}
        <h3 className="text-xl font-bold text-gray-900 mb-3">{plan.name}</h3>
        <div className="mb-2">
          {plan.originalPrice && (
            <div className="mb-1">
              <span className="text-2xl text-gray-400 line-through">${plan.originalPrice}</span>
            </div>
          )}
          <div>
            <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
            <span className="text-gray-600 ml-1">{plan.period}</span>
          </div>
        </div>
        {isFree && (
          <p className="text-sm text-gray-500">no credit card required</p>
        )}
        {plan.saleEndDate && (
          <div className="mt-2">
            <p className="text-xs text-red-500 font-bold mb-1.5">🔥 LIMITED TIME OFFER</p>
            <div className="bg-red-50 rounded-lg p-2 border border-red-200">
              <p className="text-[10px] text-gray-600 text-center mb-1.5 font-semibold">Sale ends in:</p>
              <div className="grid grid-cols-4 gap-1">
                <div className="text-center">
                  <div className="bg-white rounded py-0.5 px-0.5 shadow-sm border border-red-100">
                    <div className="text-base font-bold text-red-500">{timeLeft.days}</div>
                    <div className="text-[8px] text-gray-500 uppercase leading-tight">Days</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-white rounded py-0.5 px-0.5 shadow-sm border border-red-100">
                    <div className="text-base font-bold text-red-500">{timeLeft.hours}</div>
                    <div className="text-[8px] text-gray-500 uppercase leading-tight">Hrs</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-white rounded py-0.5 px-0.5 shadow-sm border border-red-100">
                    <div className="text-base font-bold text-red-500">{timeLeft.minutes}</div>
                    <div className="text-[8px] text-gray-500 uppercase leading-tight">Min</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-white rounded py-0.5 px-0.5 shadow-sm border border-red-100">
                    <div className="text-base font-bold text-red-500">{timeLeft.seconds}</div>
                    <div className="text-[8px] text-gray-500 uppercase leading-tight">Sec</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {plan.comingSoon && (
          <p className="text-sm text-gray-500">Available Q2 2026</p>
        )}
      </div>

      {/* Description */}
      <p className="text-center text-gray-700 text-sm mb-4">
        {plan.description}
      </p>

      {/* Features */}
      <div className="mb-4 flex-grow">
        <ul className="space-y-1.5">
          {plan.features.map((feature, index) => {
            // 이모지 매핑
            let emoji = '✓';
            let text = feature;
            
            if (feature.includes('Reference Link Analyzer')) {
              emoji = '🔗';
              text = 'Reference Link Analyzer (limited)';
            } else if (feature.includes('Basic Shot Recipe Template')) {
              emoji = '📝';
              text = 'Basic Shot Recipe Template';
            } else if (feature.includes('Save up to')) {
              emoji = '💾';
              text = 'Save up to 10 recipes';
            } else if (feature.includes('Export (basic)')) {
              emoji = '📤';
              text = 'Export (basic)';
            } else if (feature.includes('Community Access')) {
              emoji = '👥';
              text = 'Community Access';
            } else if (feature.includes('Unlimited Recipe Generation')) {
              emoji = '♾️';
              text = 'Unlimited Recipe Generation';
            } else if (feature.includes('Shot-by-Shot Breakdown')) {
              emoji = '🎬';
              text = 'Shot-by-Shot Breakdown';
            } else if (feature.includes('Hook Variations')) {
              emoji = '🎣';
              text = 'Hook Variations + Script/VO';
            } else if (feature.includes('Format Library')) {
              emoji = '📚';
              text = 'Format Library (trending)';
            } else if (feature.includes('Recipe Vault')) {
              emoji = '🗄️';
              text = 'Recipe Vault (search, tags)';
            } else if (feature.includes('Export to Notion')) {
              emoji = '📄';
              text = 'Export to Notion/Docs';
            } else if (feature.includes('Priority Speed')) {
              emoji = '⚡';
              text = 'Priority Speed + Early Access';
            } else if (feature.includes('Everything in Pro')) {
              emoji = '✨';
              text = 'Everything in Pro';
            } else if (feature.includes('Up to 10 team')) {
              emoji = '👥';
              text = 'Up to 10 team members';
            } else if (feature.includes('Shared Recipe Library')) {
              emoji = '🤝';
              text = 'Shared Recipe Library';
            } else if (feature.includes('Advanced Analytics')) {
              emoji = '📊';
              text = 'Advanced Analytics';
            } else if (feature.includes('Brand Guidelines')) {
              emoji = '🎨';
              text = 'Brand Guidelines';
            } else if (feature.includes('Priority Support')) {
              emoji = '🆘';
              text = 'Priority Support';
            } else if (feature.includes('Custom Integrations')) {
              emoji = '🔌';
              text = 'Custom Integrations';
            }
            
            const isEnabled = emoji !== '👥' || !feature.includes('Community Access');
            
            return (
              <li key={index} className="flex items-center gap-2">
                <span className="text-base flex-shrink-0">
                  {emoji}
                </span>
                <span className={`text-xs leading-snug ${
                  isEnabled ? 'text-gray-700' : 'text-gray-400'
                }`}>
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
        disabled={loading || plan.comingSoon}
        className={`w-full py-3 font-semibold rounded-xl transition-colors ${
          plan.comingSoon 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white'
        }`}
      >
        {loading ? '처리 중...' : plan.buttonText}
      </button>
    </div>
  );
};
