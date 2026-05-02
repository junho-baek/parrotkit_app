import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Icon, Label, NativeTabs, VectorIcon } from 'expo-router/unstable-native-tabs';
import { DynamicColorIOS, Platform, StyleSheet, View } from 'react-native';

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
      <RootNativeTabsContent />
    </NavigationChromeProvider>
  );
}

function RootNativeTabsContent() {
  const { homeQuickShootChromeHidden } = useNavigationChrome();
  const { copy } = useAppLanguage();
  const isIOS = Platform.OS === 'ios';
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
        <NativeTabs.Trigger name="index">
          <Icon
            androidSrc={{
              default: <VectorIcon family={MaterialCommunityIcons} name="home-variant-outline" />,
              selected: <VectorIcon family={MaterialCommunityIcons} name="home-variant" />,
            }}
            sf={{ default: 'house', selected: 'house.fill' }}
          />
          <Label hidden={homeQuickShootChromeHidden}>{copy.nav.home}</Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="explore">
          <Icon
            androidSrc={{
              default: <VectorIcon family={MaterialCommunityIcons} name="compass-outline" />,
              selected: <VectorIcon family={MaterialCommunityIcons} name="compass" />,
            }}
            sf={{ default: 'safari', selected: 'safari.fill' }}
          />
          <Label hidden={homeQuickShootChromeHidden}>{copy.nav.explore}</Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="source">
          <Icon
            androidSrc={{
              default: <VectorIcon family={MaterialCommunityIcons} name="layers-outline" />,
              selected: <VectorIcon family={MaterialCommunityIcons} name="layers" />,
            }}
            sf={{ default: 'square.stack.3d.up', selected: 'square.stack.3d.up.fill' }}
          />
          <Label hidden={homeQuickShootChromeHidden}>{copy.nav.source}</Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="recipes">
          <Icon
            androidSrc={{
              default: <VectorIcon family={MaterialCommunityIcons} name="book-open-page-variant-outline" />,
              selected: <VectorIcon family={MaterialCommunityIcons} name="book-open-page-variant" />,
            }}
            sf={{ default: 'book', selected: 'book.fill' }}
          />
          <Label hidden={homeQuickShootChromeHidden}>{copy.nav.recipes}</Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="my">
          <Icon
            androidSrc={{
              default: <VectorIcon family={MaterialCommunityIcons} name="account-outline" />,
              selected: <VectorIcon family={MaterialCommunityIcons} name="account" />,
            }}
            sf={{ default: 'person', selected: 'person.fill' }}
          />
          <Label hidden={homeQuickShootChromeHidden}>{copy.nav.my}</Label>
        </NativeTabs.Trigger>
      </NativeTabs>

      {homeQuickShootChromeHidden ? null : (
        <>
          <View pointerEvents="box-none" style={styles.topChromeLayer}>
            <AppTopBar />
          </View>
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
