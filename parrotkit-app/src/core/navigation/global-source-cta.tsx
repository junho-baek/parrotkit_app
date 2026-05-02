import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, usePathname, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppLanguage } from '@/core/i18n/app-language';
import { brandActionGradientSoft, brandActionShadow } from '@/core/theme/colors';

export function GlobalSourceCta() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const router = useRouter();
  const { copy } = useAppLanguage();

  if (pathname === '/source' || pathname === '/source-actions' || pathname === '/recipes') {
    return null;
  }

  return (
    <View pointerEvents="box-none" style={styles.layer}>
      <Pressable
        accessibilityHint={copy.sourceCta.accessibilityHint}
        accessibilityLabel={copy.sourceCta.accessibilityLabel}
        onPress={() => router.push('/source-actions' as Href)}
        style={[styles.pressable, { bottom: insets.bottom + 58 }]}
      >
        {({ pressed }) => (
          <View style={pressed ? styles.pressableContentPressed : styles.pressableContent}>
            <View className="items-center gap-2">
              <LinearGradient
                colors={brandActionGradientSoft}
                end={{ x: 1, y: 1 }}
                pointerEvents="none"
                start={{ x: 0, y: 0 }}
                style={styles.button}
              >
                <View pointerEvents="none" style={styles.buttonInnerGlow} />
                <View pointerEvents="none" style={styles.highlight} />
                <MaterialCommunityIcons color="#fffdf8" name="plus" size={24} />
              </LinearGradient>
              <Text className="text-[11px] font-semibold tracking-[0.2px] text-stone-600">
                {copy.sourceCta.label}
              </Text>
            </View>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderColor: 'rgba(255,255,255,0.88)',
    borderRadius: 999,
    borderWidth: 1,
    height: 60,
    justifyContent: 'center',
    shadowColor: brandActionShadow,
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    width: 60,
  },
  buttonInnerGlow: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 999,
    bottom: 2,
    left: 2,
    position: 'absolute',
    right: 2,
    top: 2,
  },
  highlight: {
    backgroundColor: 'rgba(255,255,255,0.32)',
    borderRadius: 999,
    height: 10,
    left: '50%',
    position: 'absolute',
    top: 8,
    transform: [{ translateX: -15 }],
    width: 30,
  },
  layer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  pressable: {
    position: 'absolute',
    right: 28,
  },
  pressableContent: {
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  pressableContentPressed: {
    opacity: 0.94,
    paddingHorizontal: 2,
    paddingVertical: 2,
    transform: [{ scale: 0.985 }],
  },
});
