'use client';

import React from 'react';
import Image from 'next/image';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Creating a video recipe just for you...'
}) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 z-[9999] flex flex-col items-center justify-center p-6">
      {/* Floating Logo Animation */}
      <div className="relative w-40 h-40 mb-8">
        <div className="absolute inset-0 animate-float">
          <Image
            src="/parrot-logo.png"
            alt="Parrot Kit"
            width={160}
            height={160}
            className="w-full h-full drop-shadow-2xl"
            priority
          />
        </div>
      </div>

      {/* Animated dots */}
      <div className="flex gap-2 mb-6">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
        {message}
      </h2>
      <p className="text-gray-900 font-semibold text-center text-base max-w-md">
        Analyzing video structure and detecting key moments
      </p>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) rotate(5deg);
          }
          50% {
            transform: translateY(-10px) rotate(-5deg);
          }
          75% {
            transform: translateY(-25px) rotate(3deg);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
