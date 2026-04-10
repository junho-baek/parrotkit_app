import '../../global.css';

import { Stack } from 'expo-router';

import { AppThemeProvider } from '@/core/providers/app-theme-provider';
import { FloatingPasteButton } from '@/core/ui/floating-paste-button';

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="paste"
          options={{
            animation: 'slide_from_bottom',
            contentStyle: {
              backgroundColor: 'transparent',
            },
            presentation: 'transparentModal',
          }}
        />
      </Stack>
      <FloatingPasteButton />
    </AppThemeProvider>
  );
}
