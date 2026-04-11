import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { PropsWithChildren } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppChromeProvider } from '@/core/navigation/app-chrome-provider';
import { colors } from '@/core/theme/colors';

const appTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    border: colors.border,
    card: colors.surface,
    notification: colors.notification,
    primary: colors.text,
    text: colors.text,
  },
};

export function AppThemeProvider({ children }: PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <ThemeProvider value={appTheme}>
        <AppChromeProvider>
          <StatusBar style="dark" />
          {children}
        </AppChromeProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
