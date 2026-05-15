import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs, usePathname } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';

import { useAppLanguage } from '@/core/i18n/app-language';
import { AppTopBar } from '@/core/navigation/app-top-bar';
import { GlobalSourceCta } from '@/core/navigation/global-source-cta';
import {
  NavigationChromeProvider,
  useNavigationChrome,
} from '@/core/navigation/navigation-chrome-context';
import { type RootTabName, rootTabNames } from '@/core/navigation/root-tab-config';

export function RootNativeTabs() {
  return (
    <NavigationChromeProvider>
      <RootTabsContent />
    </NavigationChromeProvider>
  );
}

function RootTabsContent() {
  const { homeQuickShootChromeHidden } = useNavigationChrome();
  const pathname = usePathname();
  const { copy } = useAppLanguage();
  const screenOwnsTopBar = pathname === '/recipes' || pathname.startsWith('/recipes/');
  const hiddenChromeColor = 'transparent';

  return (
    <View className="flex-1 bg-canvas">
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: homeQuickShootChromeHidden ? hiddenChromeColor : '#111827',
          tabBarInactiveTintColor: homeQuickShootChromeHidden ? hiddenChromeColor : '#94a3b8',
          tabBarIcon: ({ color, focused, size }) => (
            <MaterialCommunityIcons
              color={color}
              name={getRootTabIcon(route.name as RootTabName, focused)}
              size={Math.max(size, 22)}
            />
          ),
          tabBarLabel: getRootTabLabel(copy.nav, route.name as RootTabName),
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '800',
          },
          tabBarStyle: homeQuickShootChromeHidden
            ? styles.hiddenTabBar
            : [styles.tabBar, Platform.OS === 'android' ? styles.androidTabBar : null],
        })}
      >
        {rootTabNames.map((tabName) => (
          <Tabs.Screen key={tabName} name={tabName} />
        ))}
        <Tabs.Screen name="source" options={{ href: null }} />
        <Tabs.Screen name="recipes" options={{ href: null }} />
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

function getRootTabIcon(tabName: RootTabName, focused: boolean) {
  switch (tabName) {
    case 'index':
      return focused ? 'home-variant' : 'home-variant-outline';
    case 'explore':
      return focused ? 'compass' : 'compass-outline';
    case 'my':
      return focused ? 'account' : 'account-outline';
  }
}

function getRootTabLabel(copy: Record<RootTabName, string>, tabName: RootTabName) {
  return copy[tabName];
}

const styles = StyleSheet.create({
  androidTabBar: {
    height: 72,
    paddingBottom: 10,
    paddingTop: 8,
  },
  hiddenTabBar: {
    backgroundColor: 'transparent',
    borderTopColor: 'transparent',
    elevation: 0,
    opacity: 0,
  },
  tabBar: {
    backgroundColor: '#ffffff',
  },
  topChromeLayer: {
    ...StyleSheet.absoluteFillObject,
    elevation: 30,
    zIndex: 40,
  },
});
