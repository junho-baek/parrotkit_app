import { Href, useRouter } from 'expo-router';
import { useCallback, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type GestureResponderEvent,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { brandActionGradient } from '@/core/theme/colors';
import { AppScreenScrollView } from '@/core/ui/app-screen-scroll-view';
import { MediaTileCard } from '@/core/ui/media-tile-card';
import { LinearGradient } from 'expo-linear-gradient';

const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

export function HomeScreen() {
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();
  const { homeStats, recentReferences, recipes } = useMockWorkspace();
  const homeTranslateX = useRef(new Animated.Value(0)).current;
  const swipeStartRef = useRef({ x: 0, y: 0 });
  const swipeTriggeredRef = useRef(false);
  const openQuickShoot = useCallback(() => {
    router.push('/quick-shoot' as Href);
  }, [router]);

  const animateHomeTo = useCallback((toValue: number, onComplete?: () => void) => {
    Animated.timing(homeTranslateX, {
      duration: toValue === 0 ? 180 : 210,
      easing: Easing.out(Easing.cubic),
      toValue,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        onComplete?.();
      }
    });
  }, [homeTranslateX]);

  const getSwipeState = useCallback((event: GestureResponderEvent) => {
    const start = swipeStartRef.current;
    const dx = event.nativeEvent.pageX - start.x;
    const dy = event.nativeEvent.pageY - start.y;
    const horizontalIntent = Math.abs(dx) > Math.abs(dy) * 1.25;

    return { dx, horizontalIntent };
  }, []);

  const handleTouchStart = useCallback((event: GestureResponderEvent) => {
    swipeTriggeredRef.current = false;
    homeTranslateX.stopAnimation();
    swipeStartRef.current = {
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY,
    };
  }, [homeTranslateX]);

  const handleTouchMove = useCallback((event: GestureResponderEvent) => {
    if (swipeTriggeredRef.current) return;

    const { dx, horizontalIntent } = getSwipeState(event);

    if (!horizontalIntent || dx <= 0) {
      homeTranslateX.setValue(0);
      return;
    }

    homeTranslateX.setValue(Math.min(dx, windowWidth));
  }, [getSwipeState, homeTranslateX, windowWidth]);

  const handleTouchEnd = useCallback((event: GestureResponderEvent) => {
    if (swipeTriggeredRef.current) return;

    const { dx, horizontalIntent } = getSwipeState(event);
    const shouldOpenQuickShoot = dx > Math.min(120, windowWidth * 0.28) && horizontalIntent;

    if (shouldOpenQuickShoot) {
      swipeTriggeredRef.current = true;
      animateHomeTo(windowWidth, () => {
        openQuickShoot();
        homeTranslateX.setValue(0);
      });
      return;
    }

    animateHomeTo(0);
  }, [animateHomeTo, getSwipeState, homeTranslateX, openQuickShoot, windowWidth]);

  const handleTouchCancel = useCallback(() => {
    animateHomeTo(0);
  }, [animateHomeTo]);

  return (
    <View className="flex-1 overflow-hidden bg-canvas">
      <QuickShootPeekPanel />

      <Animated.View
        style={[
          styles.homeSurface,
          {
            transform: [{ translateX: homeTranslateX }],
          },
        ]}
      >
        <AppScreenScrollView
          onTouchCancel={handleTouchCancel}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
          onTouchStart={handleTouchStart}
        >
          <View className="gap-5 px-5">
            <View className="gap-1">
              <Text className="text-[32px] font-black leading-[36px] text-ink">Welcome!</Text>
              <Text className="text-[15px] font-medium text-ink">Your creative workspace</Text>
            </View>

            <View className="flex-row gap-2.5">
              <StatCard tone="blue" title="References" value={String(homeStats.references)} />
              <StatCard tone="violet" title="Recipes" value={String(homeStats.recipes)} />
              <StatCard tone="rose" title="Views" value={compactFormatter.format(homeStats.views)} />
            </View>

            <PressableAction
              body="Turn viral videos into actionable recipes"
              cta="+ New"
              onPress={() => router.push('/source-actions' as Href)}
              title="Create Recipe"
            />

            {recipes[0] ? (
              <View className="gap-2 rounded-[28px] border border-stroke bg-surface px-5 py-5">
                <Text className="text-[12px] font-semibold uppercase tracking-[0.8px] text-muted">Latest draft</Text>
                <Text className="text-[22px] font-black leading-[28px] text-ink">{recipes[0].title}</Text>
                <Text className="text-sm leading-6 text-muted">{recipes[0].summary}</Text>
                <View className="flex-row gap-2">
                  <Chip label={recipes[0].platform} />
                  <Chip label={recipes[0].goal} />
                </View>
              </View>
            ) : null}

            <View className="gap-3">
              <Text className="text-[18px] font-bold text-ink">Recent References</Text>

              <View className="flex-row flex-wrap gap-3">
                {recentReferences.map((reference) => (
                  <View key={reference.id} className="w-[48%]">
                    <MediaTileCard
                      actionLabel={reference.recipeId ? 'Open Recipe' : 'Paste Again'}
                      actionTone={reference.recipeId ? 'brand' : 'neutral'}
                      leftMetric={{ icon: '👁', value: reference.views }}
                      onAction={() =>
                        reference.recipeId
                          ? router.push(`/recipe/${reference.recipeId}` as Href)
                          : router.push('/source-actions' as Href)
                      }
                      onPress={() =>
                        reference.recipeId
                          ? router.push(`/recipe/${reference.recipeId}` as Href)
                          : router.push('/source-actions' as Href)
                      }
                      subtitle={reference.creator}
                      thumbnail={reference.thumbnail}
                      title={reference.title}
                      topLeftLabel="NEW"
                      topLeftTone="brand"
                      topRightLabel={reference.duration}
                    />
                  </View>
                ))}
              </View>
            </View>
          </View>
        </AppScreenScrollView>
      </Animated.View>
    </View>
  );
}

function QuickShootPeekPanel() {
  return (
    <LinearGradient
      colors={['#020617', '#111827', '#312e81']}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={styles.quickShootPeek}
    >
      <View style={styles.cameraGlyph}>
        <MaterialCommunityIcons color="#ffffff" name="camera-iris" size={52} />
      </View>
      <Text style={styles.peekTitle}>Quick Shoot</Text>
    </LinearGradient>
  );
}

function StatCard({
  title,
  value,
  tone,
}: {
  title: string;
  value: string;
  tone: 'blue' | 'violet' | 'rose';
}) {
  const gradientColors =
    tone === 'blue'
      ? (['#eff6ff', '#dbeafe'] as const)
      : tone === 'violet'
        ? (['#f5f3ff', '#ede9fe'] as const)
        : (['#fff1f2', '#ffe4e6'] as const);
  const valueColor = tone === 'blue' ? '#0284c7' : tone === 'violet' ? '#7c3aed' : '#e11d48';

  return (
    <LinearGradient colors={gradientColors} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={{ borderRadius: 22, flex: 1 }}>
      <View className="px-3 py-3">
        <Text className="text-[22px] font-black" style={{ color: valueColor }}>
          {value}
        </Text>
        <Text className="mt-1 text-[11px] font-semibold text-black/60">{title}</Text>
      </View>
    </LinearGradient>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <View className="rounded-full bg-slate-100 px-3 py-1.5">
      <Text className="text-[11px] font-semibold text-slate-600">{label}</Text>
    </View>
  );
}

function PressableAction({
  title,
  body,
  cta,
  onPress,
}: {
  title: string;
  body: string;
  cta: string;
  onPress: () => void;
}) {
  return (
    <LinearGradient colors={brandActionGradient} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={{ borderRadius: 24 }}>
      <View className="flex-row items-center justify-between rounded-[24px] px-5 py-5">
        <View className="flex-1 gap-1 pr-4">
          <Text className="text-[18px] font-bold text-white">{title}</Text>
          <Text className="text-[13px] text-white/90">{body}</Text>
        </View>

        <View className="overflow-hidden rounded-2xl">
          <Text
            className="rounded-2xl bg-white px-4 py-2.5 text-sm font-bold text-sky-600"
            onPress={onPress}
          >
            {cta}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  homeSurface: {
    backgroundColor: '#f8fafc',
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 18, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 28,
  },
  quickShootPeek: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraGlyph: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 999,
    borderWidth: 1,
    height: 106,
    justifyContent: 'center',
    width: 106,
  },
  peekTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 18,
  },
});
