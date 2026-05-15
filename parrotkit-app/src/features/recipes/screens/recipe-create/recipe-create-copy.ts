import type { ComponentProps } from 'react';
import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import type { AppLanguage } from '@/core/i18n/app-language';
import type { RecipeCreateMode } from '@/features/recipes/lib/recipe-create-flow';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export const recipeCreateCopy = {
  en: {
    title: 'New recipe',
    close: 'Close',
    pro: 'Pro',
    linkPlaceholder: 'Paste a TikTok, Reels, Shorts, or product page link',
    invalidLink: 'Paste a valid link starting with http:// or https://',
    brandPlaceholder: 'Add brand context, product sheet, or campaign brief',
    nicheQuestion: "What's the niche?",
    otherPlaceholder: 'Type your niche',
    goalQuestion: "What's the goal?",
    cta: 'Open recipe board',
    mode: {
      manual: { icon: 'plus-box-outline' as IconName, tab: 'Blank' },
      reference: { icon: 'link-variant' as IconName, tab: 'Link' },
      brand: { icon: 'briefcase-plus-outline' as IconName, tab: 'Brand' },
    } satisfies Record<RecipeCreateMode, { icon: IconName; tab: string }>,
  },
  ko: {
    title: 'New recipe',
    close: '닫기',
    pro: 'Pro',
    linkPlaceholder: 'TikTok, Reels, Shorts, 제품 페이지 링크 붙여넣기',
    invalidLink: 'http:// 또는 https://로 시작하는 링크를 붙여넣어 주세요',
    brandPlaceholder: '브랜드 컨텍스트, 제품 자료, 캠페인 브리프 추가',
    nicheQuestion: '니치는 무엇인가요?',
    otherPlaceholder: '기타 니치 입력',
    goalQuestion: '목표는 무엇인가요?',
    cta: '레시피 보드 열기',
    mode: {
      manual: { icon: 'plus-box-outline' as IconName, tab: 'Blank' },
      reference: { icon: 'link-variant' as IconName, tab: 'Link' },
      brand: { icon: 'briefcase-plus-outline' as IconName, tab: 'Brand' },
    } satisfies Record<RecipeCreateMode, { icon: IconName; tab: string }>,
  },
} satisfies Record<AppLanguage, Record<string, unknown>>;

export type RecipeCreateCopy = (typeof recipeCreateCopy)['en'];
