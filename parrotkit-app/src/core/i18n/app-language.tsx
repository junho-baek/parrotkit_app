import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';

export type AppLanguage = 'en' | 'ko';

type AppLanguageContextValue = {
  copy: AppLanguageCopy;
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
};

type AppLanguageCopy = {
  topBar: {
    homeAccessibilityHint: string;
    homeAccessibilityLabel: string;
    notificationsAccessibilityLabel: string;
  };
  nav: {
    explore: string;
    index: string;
    my: string;
  };
  sourceCta: {
    accessibilityHint: string;
    accessibilityLabel: string;
    label: string;
  };
  home: {
    continueAction: string;
    continueSection: string;
    continueTitleFallback: string;
    edit: string;
    emptyAction: string;
    emptyBody: string;
    emptyTitle: string;
    readyStatus: string;
    recentSection: string;
    quickStartSection: string;
    statusDownloaded: string;
    statusInProgress: string;
    statusOwned: string;
    viewAll: string;
    welcomeSubtitle: string;
    welcomeTitle: string;
  };
  profile: {
    english: string;
    korean: string;
    languageDescription: string;
    languageTitle: string;
    likedAction: string;
    likedEmptyBody: string;
    likedEmptyTitle: string;
    likedSection: string;
    proSection: string;
    proStatusBody: string;
    proStatusTitle: string;
    savedLabel: string;
    savedRecipesEmptyBody: string;
    savedRecipesEmptyTitle: string;
    savedRecipesSection: string;
    savedTakeFinal: string;
    savedTakeLocal: string;
    savedTakeSaved: string;
    savedTakesEmptyBody: string;
    savedTakesEmptyTitle: string;
    savedTakesSection: string;
    settingsSection: string;
    statsLikes: string;
    statsRecipes: string;
    statsStreak: string;
  };
};

const APP_LANGUAGE_COPY: Record<AppLanguage, AppLanguageCopy> = {
  en: {
    topBar: {
      homeAccessibilityHint: 'Go to the home tab',
      homeAccessibilityLabel: 'ParrotKit home',
      notificationsAccessibilityLabel: 'Notifications',
    },
    nav: {
      explore: 'Explore',
      index: 'Home',
      my: 'My',
    },
    sourceCta: {
      accessibilityHint: 'Open the add source sheet',
      accessibilityLabel: 'Add source',
      label: 'source',
    },
    home: {
      continueAction: 'Open recipe board',
      continueSection: 'Continue recent recipe',
      continueTitleFallback: 'Ready to shoot',
      edit: 'Edit',
      emptyAction: 'Quick Shoot',
      emptyBody: 'Open a blank prompter, write one cue, and record the first take.',
      emptyTitle: 'Start with a blank prompter',
      readyStatus: 'Ready',
      recentSection: 'Recent recipes',
      quickStartSection: 'Start your recipes quickly',
      statusDownloaded: 'Saved',
      statusInProgress: 'In progress',
      statusOwned: 'Owned',
      viewAll: 'View all',
      welcomeSubtitle: "Let's make a useful UGC recipe today.",
      welcomeTitle: 'Welcome back!',
    },
    profile: {
      english: 'English',
      korean: 'Korean',
      languageDescription: 'Choose the language used across Home, tabs, and core app controls.',
      languageTitle: 'App language',
      likedAction: 'Liked',
      likedEmptyBody: 'Like trending videos in Explore and they will show up here.',
      likedEmptyTitle: 'No liked references yet',
      likedSection: 'Liked References',
      proSection: 'Pro',
      proStatusBody: 'Reference links and brand context stay locked for v1. Blank recipes remain free.',
      proStatusTitle: 'Free plan',
      savedLabel: 'SAVED',
      savedRecipesEmptyBody: 'Create a blank recipe from Home and it will appear here.',
      savedRecipesEmptyTitle: 'No saved recipes yet',
      savedRecipesSection: 'Saved recipes',
      savedTakeFinal: 'Final',
      savedTakeLocal: 'Local',
      savedTakeSaved: 'Saved',
      savedTakesEmptyBody: 'Record and save a take from a cut card, then reopen it here.',
      savedTakesEmptyTitle: 'No saved takes yet',
      savedTakesSection: 'Saved takes',
      settingsSection: 'Settings',
      statsLikes: 'Likes',
      statsRecipes: 'Recipes',
      statsStreak: 'Streak',
    },
  },
  ko: {
    topBar: {
      homeAccessibilityHint: '홈 탭으로 이동',
      homeAccessibilityLabel: 'ParrotKit 홈',
      notificationsAccessibilityLabel: '알림',
    },
    nav: {
      explore: '탐색',
      index: '홈',
      my: '마이',
    },
    sourceCta: {
      accessibilityHint: '소스 추가 시트 열기',
      accessibilityLabel: '소스 추가',
      label: '소스',
    },
    home: {
      continueAction: '레시피 보드 열기',
      continueSection: '최근 레시피 이어하기',
      continueTitleFallback: '촬영 준비 완료',
      edit: '편집',
      emptyAction: '바로 촬영',
      emptyBody: '빈 프롬프터를 열고 첫 큐를 적은 뒤 바로 첫 테이크를 찍어보세요.',
      emptyTitle: '빈 프롬프터로 시작하기',
      readyStatus: '준비됨',
      recentSection: '최근 레시피',
      quickStartSection: '내 레시피 빠르게 시작하기',
      statusDownloaded: '저장됨',
      statusInProgress: '진행중',
      statusOwned: '내 레시피',
      viewAll: '전체 보기',
      welcomeSubtitle: '오늘도 바로 찍을 수 있는 UGC 레시피를 만들어볼까요?',
      welcomeTitle: '다시 오신 걸 환영해요!',
    },
    profile: {
      english: 'English',
      korean: '한국어',
      languageDescription: '홈, 탭, 주요 앱 컨트롤에 표시될 언어를 선택합니다.',
      languageTitle: '앱 언어',
      likedAction: '좋아요',
      likedEmptyBody: '탐색에서 저장한 인기 레퍼런스가 여기에 표시됩니다.',
      likedEmptyTitle: '아직 저장한 레퍼런스가 없어요',
      likedSection: '저장한 레퍼런스',
      proSection: 'Pro',
      proStatusBody: '레퍼런스 링크와 브랜드 컨텍스트는 v1에서 잠겨 있어요. 빈 레시피 만들기는 무료로 사용할 수 있습니다.',
      proStatusTitle: '무료 플랜',
      savedLabel: '저장됨',
      savedRecipesEmptyBody: '홈에서 빈 레시피를 만들면 여기에 표시됩니다.',
      savedRecipesEmptyTitle: '아직 저장한 레시피가 없어요',
      savedRecipesSection: '저장한 레시피',
      savedTakeFinal: 'Final',
      savedTakeLocal: '로컬',
      savedTakeSaved: '저장됨',
      savedTakesEmptyBody: '컷 카드에서 테이크를 저장하면 여기에서 다시 열 수 있어요.',
      savedTakesEmptyTitle: '아직 저장한 테이크가 없어요',
      savedTakesSection: '저장한 테이크',
      settingsSection: '설정',
      statsLikes: '좋아요',
      statsRecipes: '레시피',
      statsStreak: '연속일',
    },
  },
};

const AppLanguageContext = createContext<AppLanguageContextValue | null>(null);

export function AppLanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguage] = useState<AppLanguage>('en');
  const value = useMemo(
    () => ({
      copy: APP_LANGUAGE_COPY[language],
      language,
      setLanguage,
    }),
    [language]
  );

  return <AppLanguageContext.Provider value={value}>{children}</AppLanguageContext.Provider>;
}

export function useAppLanguage() {
  const context = useContext(AppLanguageContext);

  if (!context) {
    throw new Error('useAppLanguage must be used inside AppLanguageProvider');
  }

  return context;
}

export function formatSceneCount(language: AppLanguage, count: number) {
  return language === 'ko' ? `${count}개 씬` : `${count} ${count === 1 ? 'scene' : 'scenes'}`;
}

export function formatShotProgress(language: AppLanguage, shotCount: number, totalCount: number) {
  return language === 'ko' ? `${shotCount}/${totalCount}컷 촬영` : `${shotCount}/${totalCount} shots`;
}

export function localizeActivityLabel(language: AppLanguage, label?: string) {
  if (!label || language === 'en') {
    return label;
  }

  const normalized = label.trim();
  const replacements: Record<string, string> = {
    'Created just now': '방금 생성됨',
    'Last shot 18m ago': '마지막 촬영 18분 전',
    'Saved 2h ago': '2시간 전 저장',
    'Saved just now': '방금 저장됨',
    Yesterday: '어제',
  };

  return replacements[normalized] ?? normalized;
}
