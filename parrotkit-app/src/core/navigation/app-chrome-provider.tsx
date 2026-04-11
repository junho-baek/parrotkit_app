import { usePathname } from 'expo-router';
import { createContext, PropsWithChildren, useContext, useEffect } from 'react';
import { SharedValue, useSharedValue } from 'react-native-reanimated';

type AppChromeContextValue = {
  topBarProgress: SharedValue<number>;
};

const AppChromeContext = createContext<AppChromeContextValue | null>(null);

export function AppChromeProvider({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const topBarProgress = useSharedValue(0);

  useEffect(() => {
    topBarProgress.value = 0;
  }, [pathname, topBarProgress]);

  return (
    <AppChromeContext.Provider
      value={{
        topBarProgress,
      }}
    >
      {children}
    </AppChromeContext.Provider>
  );
}

export function useAppChrome() {
  const context = useContext(AppChromeContext);

  if (!context) {
    throw new Error('useAppChrome must be used within AppChromeProvider');
  }

  return context;
}
