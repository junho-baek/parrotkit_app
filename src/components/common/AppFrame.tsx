'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AppFrameProps {
  children: React.ReactNode;
}

/**
 * AppFrame - 안정적인 앱 프레임 컨테이너
 * 
 * 특징:
 * - 모바일 주소창/키보드로 인한 100vh 흔들림 방지 (dvh 사용)
 * - 고정 비율 유지 (9:16 기준, 반응형)
 * - 레터박스로 남은 공간 처리
 * - 내부 스크롤 (브라우저 전체 스크롤 X)
 * - Safe area inset 자동 처리
 */
export const AppFrame: React.FC<AppFrameProps> = ({ children }) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    width: '100%',
    height: '100dvh',
    scale: 1,
  });

  useEffect(() => {
    const updateDimensions = () => {
      // visualViewport API로 실제 보이는 뷰포트 크기 계산 (키보드 제외)
      const vw = window.visualViewport?.width || window.innerWidth;
      const vh = window.visualViewport?.height || window.innerHeight;

      // 모바일 앱 비율: 9:16 (세로 모드 기준)
      const targetRatio = 9 / 16;
      
      // 현재 뷰포트 비율
      const currentRatio = vw / vh;

      let finalWidth = vw;
      let finalHeight = vh;
      let scale = 1;

      // 데스크탑/태블릿: 최대 너비 제한 + 가운데 정렬
      if (vw > 768) {
        // 최대 앱 너비 (태블릿 기준)
        const maxWidth = 480;
        finalWidth = Math.min(maxWidth, vw);
        finalHeight = vh;
      } else {
        // 모바일: 전체 화면 사용
        finalWidth = vw;
        finalHeight = vh;
      }

      setDimensions({
        width: `${finalWidth}px`,
        height: `${finalHeight}px`,
        scale,
      });
    };

    // 초기 설정
    updateDimensions();

    // 리사이즈/회전/키보드 이벤트 처리
    const handleResize = () => {
      updateDimensions();
    };

    window.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('scroll', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('scroll', handleResize);
    };
  }, []);

  return (
    <>
      {/* Letterbox Background (남는 공간) */}
      <div className="fixed inset-0 bg-gray-800" style={{ zIndex: -1 }} />
      
      {/* App Frame Container */}
      <div
        ref={frameRef}
        className="app-frame-container fixed top-1/2 left-1/2 bg-white overflow-hidden"
        style={{
          width: dimensions.width,
          height: dimensions.height,
          transform: `translate(-50%, -50%) scale(${dimensions.scale})`,
          transformOrigin: 'center',
          maxWidth: '480px',
          boxShadow: '0 0 40px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Internal Scrollable Content */}
        <div className="relative w-full h-full overflow-hidden flex flex-col">
          {children}
        </div>
      </div>

      {/* Global Styles for Stable Viewport */}
      <style jsx global>{`
        /* 브라우저 스크롤 방지 */
        html, body {
          overflow: hidden;
          width: 100%;
          height: 100%;
          overscroll-behavior: none;
        }

        /* iOS Safari 바운스 방지 */
        body {
          overflow: hidden;
          -webkit-overflow-scrolling: touch;
        }

        /* 내부 스크롤 활성화 */
        .app-frame-container * {
          overscroll-behavior: contain;
        }
      `}</style>
    </>
  );
};
