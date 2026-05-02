import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Href, useRouter } from 'expo-router';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppLanguage } from '@/core/i18n/app-language';
import { useAppChrome } from '@/core/navigation/app-chrome-provider';

const parrotLogo = require('../../../assets/parrot-logo.png');

export const APP_TOP_BAR_HEIGHT = 44;
export const APP_TOP_BAR_HIDE_RANGE = 24;

export function AppTopBar() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { topBarProgress } = useAppChrome();
  const { copy } = useAppLanguage();
  const isIOS = Platform.OS === 'ios';

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = -interpolate(
      topBarProgress.value,
      [0, APP_TOP_BAR_HIDE_RANGE],
      [0, insets.top + APP_TOP_BAR_HEIGHT + 10],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      topBarProgress.value,
      [0, APP_TOP_BAR_HIDE_RANGE * 0.55, APP_TOP_BAR_HIDE_RANGE],
      [1, 0.98, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  return (
    <Animated.View
      needsOffscreenAlphaCompositing
      pointerEvents="box-none"
      renderToHardwareTextureAndroid
      style={[
        styles.shell,
        {
          paddingTop: insets.top,
        },
        animatedStyle,
      ]}
    >
      <View style={[styles.bar, isIOS ? styles.barIOS : styles.barAndroid]}>
        <Pressable
          accessibilityHint={copy.topBar.homeAccessibilityHint}
          accessibilityLabel={copy.topBar.homeAccessibilityLabel}
          hitSlop={10}
          onPress={() => router.navigate('/' as Href)}
          style={styles.logoButton}
        >
          {({ pressed }) => (
            <View style={[styles.logoWrap, pressed ? styles.logoWrapPressed : null]}>
              <Image resizeMode="contain" source={parrotLogo} style={styles.logoImage} />
            </View>
          )}
        </Pressable>

        <Text className="text-[17px] font-bold tracking-[-0.35px] text-ink">ParrotKit</Text>

        <Pressable
          accessibilityLabel={copy.topBar.notificationsAccessibilityLabel}
          accessibilityRole="button"
          hitSlop={10}
          style={styles.notificationButton}
        >
          <MaterialCommunityIcons color="#334155" name="bell-outline" size={23} />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>1</Text>
          </View>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bar: {
    alignItems: 'center',
    flexDirection: 'row',
    height: APP_TOP_BAR_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  barAndroid: {
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderBottomWidth: 0,
    elevation: 10,
    shadowColor: '#111827',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  barIOS: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  logoButton: {
    left: 20,
    position: 'absolute',
  },
  logoImage: {
    height: 28,
    width: 28,
  },
  logoWrap: {
    alignItems: 'center',
    borderRadius: 999,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  logoWrapPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  notificationBadge: {
    alignItems: 'center',
    backgroundColor: '#ff6b8a',
    borderColor: '#ffffff',
    borderRadius: 999,
    borderWidth: 1.5,
    height: 15,
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: -2,
    width: 15,
  },
  notificationBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
    lineHeight: 11,
  },
  notificationButton: {
    alignItems: 'center',
    height: 30,
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
    width: 30,
  },
  shell: {
    elevation: 24,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 40,
  },
});
