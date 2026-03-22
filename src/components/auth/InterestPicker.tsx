'use client';

import React from 'react';
import type { InterestCategory } from '@/types/auth';

interface InterestTag {
  category: InterestCategory;
  selected: boolean;
}

interface InterestPickerProps {
  interests: InterestTag[];
  onToggle: (index: number) => void;
}

export const InterestPicker: React.FC<InterestPickerProps> = ({
  interests,
  onToggle,
}) => {
  return (
    <div className="mx-auto grid max-w-[21rem] grid-cols-3 justify-items-center gap-3">
      {interests.map((interest, index) => (
        <button
          key={interest.category}
          type="button"
          data-selected={interest.selected ? 'true' : 'false'}
          onClick={() => onToggle(index)}
          className="brand-pill flex min-h-[54px] w-[100px] items-center justify-center rounded-[1.15rem] px-2.5 py-2 text-center text-[13px] font-bold leading-[1.15] tracking-[-0.03em]"
          style={
            interest.selected
              ? {
                  backgroundImage: 'linear-gradient(135deg, #ff9568 0%, #de81c1 52%, #8c67ff 100%)',
                  backgroundColor: '#de81c1',
                  color: '#ffffff',
                  border: 'none',
                  boxShadow: '0 12px 22px rgba(140, 103, 255, 0.2)',
                }
              : undefined
          }
        >
          <span className="block text-center">{interest.category}</span>
        </button>
      ))}
    </div>
  );
};
