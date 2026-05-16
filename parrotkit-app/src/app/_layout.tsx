import "react-native-gesture-handler";
import "../../global.css";

import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AppLanguageProvider } from "@/core/i18n/app-language";
import { AppThemeProvider } from "@/core/providers/app-theme-provider";
import { MockWorkspaceProvider } from "@/application/workspace/mock-workspace-provider";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppThemeProvider>
        <AppLanguageProvider>
          <MockWorkspaceProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="home" />
              <Stack.Screen
                name="recipe/[recipeId]/index"
                options={{
                  animation: "slide_from_right",
                }}
              />
              <Stack.Screen
                name="explore-recipe/[recipeId]"
                options={{
                  animation: "slide_from_right",
                }}
              />
              <Stack.Screen
                name="recipe/[recipeId]/prompter"
                options={{
                  animation: "slide_from_bottom",
                }}
              />
              <Stack.Screen
                name="quick-shoot"
                options={{
                  animation: "slide_from_left",
                }}
              />
              <Stack.Screen
                name="recipe-create"
                options={{
                  animation: "slide_from_bottom",
                  contentStyle: {
                    backgroundColor: "transparent",
                  },
                  presentation: "transparentModal",
                }}
              />
            </Stack>
          </MockWorkspaceProvider>
        </AppLanguageProvider>
      </AppThemeProvider>
    </GestureHandlerRootView>
  );
}
