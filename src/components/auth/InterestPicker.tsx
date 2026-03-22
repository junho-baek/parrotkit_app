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
    <div className="grid grid-cols-3 gap-2">
      {interests.map((interest, index) => (
        <button
          key={interest.category}
          type="button"
          data-selected={interest.selected ? 'true' : 'false'}
          onClick={() => onToggle(index)}
          className="brand-pill flex min-h-[52px] items-center justify-center rounded-[1.15rem] px-2.5 py-2 text-center text-[13px] font-bold leading-[1.15] tracking-[-0.03em]"
        >
          <span className="block text-center">{interest.category}</span>
        </button>
      ))}
    </div>
  );
};
