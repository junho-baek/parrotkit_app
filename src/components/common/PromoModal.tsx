'use client';

import React, { useEffect, useState } from 'react';

interface PromoModalProps {
  onClose: () => void;
}

export const PromoModal: React.FC<PromoModalProps> = ({ onClose }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const saleEndDate = new Date('2026-02-14T23:59:59');
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
  }, []);

  const handleGetProClick = () => {
    // GA4: 프로모션 모달 CTA 클릭
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'promo_modal_cta_click', {
        event_category: 'conversion',
        discount_percentage: '58%',
      });
    }

    window.location.href = '/pricing';
  };

  const handleCloseClick = () => {
    // GA4: 프로모션 모달 닫기
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'promo_modal_close', {
        event_category: 'engagement',
      });
    }

    onClose();
  };

  const discountPercentage = Math.round(((24 - 9.99) / 24) * 100);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative animate-scale-in shadow-2xl">
        {/* Close Button */}
        <button
          onClick={handleCloseClick}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>

        {/* Badge */}
        <div className="text-center mb-4">
          <span className="inline-block bg-red-500 text-white text-xs font-bold px-4 py-1 rounded-full">
            🔥 LIMITED TIME OFFER
          </span>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
          Launch Sale!
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Get Pro Plan with <span className="text-red-500 font-bold">{discountPercentage}% OFF</span>
        </p>

        {/* Countdown */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
          <p className="text-center text-sm font-semibold text-gray-700 mb-3">
            ⏰ Offer ends in:
          </p>
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center">
              <div className="bg-white rounded-lg py-3 px-2 shadow-sm">
                <div className="text-2xl font-bold text-gray-900">{timeLeft.days}</div>
                <div className="text-xs text-gray-500 uppercase">Days</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg py-3 px-2 shadow-sm">
                <div className="text-2xl font-bold text-gray-900">{timeLeft.hours}</div>
                <div className="text-xs text-gray-500 uppercase">Hours</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg py-3 px-2 shadow-sm">
                <div className="text-2xl font-bold text-gray-900">{timeLeft.minutes}</div>
                <div className="text-xs text-gray-500 uppercase">Mins</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg py-3 px-2 shadow-sm">
                <div className="text-2xl font-bold text-gray-900">{timeLeft.seconds}</div>
                <div className="text-xs text-gray-500 uppercase">Secs</div>
              </div>
            </div>
          </div>
        </div>

        {/* Price Comparison */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Regular Price</div>
              <div className="text-2xl font-bold text-gray-400 line-through">$24</div>
            </div>
            <div className="text-3xl text-gray-300">→</div>
            <div className="text-center">
              <div className="text-sm text-red-500 font-semibold mb-1">Launch Price</div>
              <div className="text-3xl font-bold text-red-500">$9.99</div>
            </div>
          </div>
          <p className="text-center text-xs text-gray-500 mt-3">per month</p>
        </div>

        {/* Benefits */}
        <ul className="space-y-2 mb-6">
          <li className="flex items-center gap-2 text-sm text-gray-700">
            <span className="text-green-500">✓</span>
            <span>Unlimited Recipe Generation</span>
          </li>
          <li className="flex items-center gap-2 text-sm text-gray-700">
            <span className="text-green-500">✓</span>
            <span>Advanced Shot-by-Shot Breakdown</span>
          </li>
          <li className="flex items-center gap-2 text-sm text-gray-700">
            <span className="text-green-500">✓</span>
            <span>Priority Support & Early Features</span>
          </li>
        </ul>

        {/* CTA Button */}
        <button
          onClick={handleGetProClick}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg"
        >
          Get Pro Now - Save {discountPercentage}%! 🚀
        </button>

        <p className="text-center text-xs text-gray-500 mt-4">
          No credit card required to start
        </p>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};
