import { Href, useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppChrome } from '@/core/navigation/app-chrome-provider';

const parrotLogo = require('../../../assets/parrot-logo.png');

export const APP_TOP_BAR_HEIGHT = 44;
export const APP_TOP_BAR_HIDE_RANGE = 88;

export function AppTopBar() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { topBarProgress } = useAppChrome();

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
      pointerEvents="box-none"
      style={[
        styles.shell,
        {
          paddingTop: insets.top,
        },
        animatedStyle,
      ]}
    >
      <View style={styles.bar}>
        <Pressable
          accessibilityHint="Go to the home tab"
          accessibilityLabel="ParrotKit home"
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

        <View style={styles.rightSpacer} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bar: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderBottomColor: 'rgba(148,163,184,0.2)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    height: APP_TOP_BAR_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 20,
    shadowColor: '#111827',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.04,
    shadowRadius: 16,
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
  rightSpacer: {
    height: 28,
    position: 'absolute',
    right: 20,
    width: 28,
  },
  shell: {
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 20,
  },
});
