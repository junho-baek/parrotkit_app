import '../../global.css';

import { Stack } from 'expo-router';

import { AppThemeProvider } from '@/core/providers/app-theme-provider';

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="source-actions"
          options={{
            animation: 'slide_from_bottom',
            contentStyle: {
              backgroundColor: 'transparent',
            },
            presentation: 'transparentModal',
          }}
        />
      </Stack>
    </AppThemeProvider>
  );
}
