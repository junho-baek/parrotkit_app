import { LinearGradient } from 'expo-linear-gradient';
import { Href, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { brandActionGradientSoft } from '@/core/theme/colors';

export function AppTopBar() {
  const router = useRouter();

  return (
    <View className="h-12 flex-row items-center justify-center px-5">
      <Pressable
        accessibilityHint="Go to the home tab"
        accessibilityLabel="ParrotKit home"
        className="absolute left-5"
        onPress={() => router.navigate('/' as Href)}
      >
        {({ pressed }) => (
          <View className={pressed ? 'opacity-90' : undefined}>
            <LinearGradient
              colors={brandActionGradientSoft}
              end={{ x: 1, y: 1 }}
              start={{ x: 0, y: 0 }}
              style={{
                alignItems: 'center',
                borderColor: 'rgba(255,255,255,0.88)',
                borderRadius: 16,
                borderWidth: 1,
                height: 32,
                justifyContent: 'center',
                width: 32,
              }}
            >
              <Text className="text-[14px] font-black text-white">P</Text>
            </LinearGradient>
          </View>
        )}
      </Pressable>

      <Text className="text-[19px] font-black tracking-[-0.4px] text-ink">ParrotKit</Text>

      <View className="absolute right-5 h-8 w-8" />
    </View>
  );
}
