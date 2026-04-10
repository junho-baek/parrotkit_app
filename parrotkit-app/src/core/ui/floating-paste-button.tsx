import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Href, usePathname, useRouter } from 'expo-router';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_PATHS = new Set(['/', '/explore', '/recipes', '/my']);

export function FloatingPasteButton() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const router = useRouter();

  if (!TAB_PATHS.has(pathname)) {
    return null;
  }

  return (
    <View pointerEvents="box-none" style={styles.wrapper}>
      <Pressable
        accessibilityHint="Open the paste quick-capture drawer"
        accessibilityLabel="Open paste drawer"
        className="h-16 w-16 items-center justify-center rounded-full border border-white/80 bg-ink"
        onPress={() => router.push('/paste' as Href)}
        style={[
          styles.button,
          {
            bottom: Platform.OS === 'ios' ? insets.bottom + 10 : 22,
          },
        ]}
      >
        <MaterialCommunityIcons color="#fffdf8" name="link-variant-plus" size={28} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  button: {
    elevation: 10,
    shadowColor: '#111827',
    shadowOpacity: 0.24,
    shadowRadius: 24,
    shadowOffset: {
      width: 0,
      height: 14,
    },
  },
});
