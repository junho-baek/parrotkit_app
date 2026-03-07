'use client';

import React from 'react';
import Link from 'next/link';
import { PricingCard } from '@/components/auth';
import { PRICING_PLANS } from '@/types/auth';
import { logClientEvent } from '@/lib/client-events';

export default function PricingPage() {
  React.useEffect(() => {
    void logClientEvent('view_pricing', {
      event_category: 'ecommerce',
      page_title: 'Pricing Page',
      plan_count: PRICING_PLANS.length,
    });
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Mobile App Style Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <img src="/parrot-logo.png" alt="Parrot Kit" className="w-6 h-6" />
          <h1 className="text-xl font-bold text-gray-900">Pricing</h1>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
            <p className="text-lg text-gray-600">
              Create viral content with AI-powered recipe generation
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {PRICING_PLANS.map(plan => (
              <PricingCard key={plan.name} plan={plan} />
            ))}
          </div>

          {/* FAQ */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">FAQ</h2>
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
                <p className="text-gray-600 text-sm">
                  Yes, you can cancel your Pro subscription anytime. No long-term commitment required.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Can I upgrade or downgrade?</h3>
                <p className="text-gray-600 text-sm">
                  Of course! You can upgrade to Pro or downgrade to Free at any time.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h3>
                <p className="text-gray-600 text-sm">
                  We offer a 14-day money-back guarantee if you're not satisfied with Pro Plan.
                </p>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-12 text-center mb-8">
            <Link
              href="/home"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
        </div>
      </div>
  );
}
