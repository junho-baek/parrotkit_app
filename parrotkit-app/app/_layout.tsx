import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const appTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#f6f7fb',
    card: '#ffffff',
    primary: '#111827',
    text: '#111827',
    border: '#e5e7eb',
    notification: '#ff9568',
  },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={appTheme}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ThemeProvider>
  );
}
