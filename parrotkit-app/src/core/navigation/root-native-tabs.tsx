import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { usePathname } from 'expo-router';
import { Icon, Label, NativeTabs, VectorIcon } from 'expo-router/unstable-native-tabs';
import { DynamicColorIOS, Platform, StyleSheet, View } from 'react-native';

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
      <RootNativeTabsContent />
    </NavigationChromeProvider>
  );
}

function RootNativeTabsContent() {
  const { homeQuickShootChromeHidden } = useNavigationChrome();
  const pathname = usePathname();
  const { copy } = useAppLanguage();
  const isIOS = Platform.OS === 'ios';
  const screenOwnsTopBar = pathname === '/recipes' || pathname.startsWith('/recipes/');
  const hiddenChromeColor = 'transparent';
  const iosTintColor = isIOS
    ? DynamicColorIOS({
        dark: '#ffffff',
        light: '#111827',
      })
    : '#111827';
  const tabTintColor = homeQuickShootChromeHidden ? hiddenChromeColor : iosTintColor;
  const tabLabelColor = homeQuickShootChromeHidden
    ? hiddenChromeColor
    : isIOS
      ? iosTintColor
      : '#57534e';

  return (
    <View className="flex-1 bg-canvas">
      <NativeTabs
        badgeBackgroundColor={homeQuickShootChromeHidden ? hiddenChromeColor : '#ff9568'}
        backgroundColor={homeQuickShootChromeHidden ? hiddenChromeColor : isIOS ? null : '#ffffff'}
        blurEffect={isIOS ? (homeQuickShootChromeHidden ? 'none' : 'systemChromeMaterial') : undefined}
        disableTransparentOnScrollEdge={isIOS && !homeQuickShootChromeHidden}
        iconColor={homeQuickShootChromeHidden ? { default: hiddenChromeColor, selected: hiddenChromeColor } : undefined}
        labelStyle={{
          color: tabLabelColor,
        }}
        labelVisibilityMode={homeQuickShootChromeHidden ? 'unlabeled' : undefined}
        minimizeBehavior={isIOS ? 'onScrollDown' : undefined}
        shadowColor={homeQuickShootChromeHidden ? hiddenChromeColor : undefined}
        tintColor={tabTintColor}
      >
        {rootTabNames.map((tabName) => (
          <NativeTabs.Trigger key={tabName} name={tabName}>
            <RootTabIcon tabName={tabName} />
            <Label hidden={homeQuickShootChromeHidden}>{getRootTabLabel(copy.nav, tabName)}</Label>
          </NativeTabs.Trigger>
        ))}
      </NativeTabs>

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

function RootTabIcon({ tabName }: { tabName: RootTabName }) {
  switch (tabName) {
    case 'index':
      return (
        <Icon
          androidSrc={{
            default: <VectorIcon family={MaterialCommunityIcons} name="home-variant-outline" />,
            selected: <VectorIcon family={MaterialCommunityIcons} name="home-variant" />,
          }}
          sf={{ default: 'house', selected: 'house.fill' }}
        />
      );
    case 'explore':
      return (
        <Icon
          androidSrc={{
            default: <VectorIcon family={MaterialCommunityIcons} name="compass-outline" />,
            selected: <VectorIcon family={MaterialCommunityIcons} name="compass" />,
          }}
          sf={{ default: 'safari', selected: 'safari.fill' }}
        />
      );
    case 'my':
      return (
        <Icon
          androidSrc={{
            default: <VectorIcon family={MaterialCommunityIcons} name="account-outline" />,
            selected: <VectorIcon family={MaterialCommunityIcons} name="account" />,
          }}
          sf={{ default: 'person', selected: 'person.fill' }}
        />
      );
  }
}

function getRootTabLabel(copy: Record<RootTabName, string>, tabName: RootTabName) {
  return copy[tabName];
}

const styles = StyleSheet.create({
  topChromeLayer: {
    ...StyleSheet.absoluteFillObject,
    elevation: 30,
    zIndex: 40,
  },
});
