import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs, usePathname } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { useAppLanguage } from '@/core/i18n/app-language';
import { AppTopBar } from '@/core/navigation/app-top-bar';
import { GlobalSourceCta } from '@/core/navigation/global-source-cta';
import {
  NavigationChromeProvider,
  useNavigationChrome,
} from '@/core/navigation/navigation-chrome-context';

export function RootNativeTabs() {
  return (
    <NavigationChromeProvider>
      <RootTabsContent />
    </NavigationChromeProvider>
  );
}

function RootTabsContent() {
  const { copy } = useAppLanguage();
  const pathname = usePathname();
  const { homeQuickShootChromeHidden } = useNavigationChrome();
  const screenOwnsTopBar = pathname === '/recipes' || pathname.startsWith('/recipes/');
  const hiddenChromeColor = 'transparent';

  return (
    <View className="flex-1 bg-canvas">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: homeQuickShootChromeHidden ? hiddenChromeColor : '#111827',
          tabBarInactiveTintColor: homeQuickShootChromeHidden ? hiddenChromeColor : '#64748b',
          tabBarStyle: {
            backgroundColor: homeQuickShootChromeHidden ? hiddenChromeColor : '#ffffff',
            borderTopColor: homeQuickShootChromeHidden ? hiddenChromeColor : '#e2e8f0',
            display: homeQuickShootChromeHidden ? 'none' : 'flex',
            height: 64,
            paddingBottom: 8,
            paddingTop: 6,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: copy.nav.home,
            tabBarIcon: ({ color }) => <MaterialCommunityIcons color={color} name="home-variant-outline" size={22} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: copy.nav.explore,
            tabBarIcon: ({ color }) => <MaterialCommunityIcons color={color} name="compass-outline" size={22} />,
          }}
        />
        <Tabs.Screen
          name="source"
          options={{
            title: copy.nav.source,
            tabBarIcon: ({ color }) => <MaterialCommunityIcons color={color} name="layers-outline" size={22} />,
          }}
        />
        <Tabs.Screen
          name="recipes"
          options={{
            title: copy.nav.recipes,
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons color={color} name="book-open-page-variant-outline" size={22} />
            ),
          }}
        />
        <Tabs.Screen
          name="my"
          options={{
            title: copy.nav.my,
            tabBarIcon: ({ color }) => <MaterialCommunityIcons color={color} name="account-outline" size={22} />,
          }}
        />
      </Tabs>

      {homeQuickShootChromeHidden ? null : (
        <>
          {screenOwnsTopBar ? null : (
            <View pointerEvents="box-none" style={styles.topChromeLayer}>
              <AppTopBar />
            </View>
          )}
          <GlobalSourceCta />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topChromeLayer: {
    ...StyleSheet.absoluteFillObject,
    elevation: 30,
    zIndex: 40,
  },
});
