import { LinearGradient } from 'expo-linear-gradient';
import { Image, Pressable, Text, View } from 'react-native';

import { brandActionGradient } from '@/core/theme/colors';

type MediaMetric = {
  icon: string;
  value: string;
};

type MediaTileCardProps = {
  thumbnail: string;
  title: string;
  subtitle: string;
  topLeftLabel?: string;
  topLeftTone?: 'brand' | 'warm' | 'success';
  topRightLabel?: string;
  leftMetric?: MediaMetric;
  rightMetric?: MediaMetric;
  onPress?: () => void;
  actionLabel?: string;
  actionMeta?: string;
  onAction?: () => void;
  actionTone?: 'brand' | 'neutral' | 'liked';
};

function getTopLeftClasses(tone: MediaTileCardProps['topLeftTone']) {
  switch (tone) {
    case 'warm':
      return 'bg-amber-500';
    case 'success':
      return 'bg-emerald-500';
    case 'brand':
    default:
      return 'bg-violet';
  }
}

export function MediaTileCard({
  thumbnail,
  title,
  subtitle,
  topLeftLabel,
  topLeftTone = 'brand',
  topRightLabel,
  leftMetric,
  rightMetric,
  onPress,
  actionLabel,
  actionMeta,
  onAction,
  actionTone = 'neutral',
}: MediaTileCardProps) {
  return (
    <View className="gap-2">
      <Pressable className="overflow-hidden rounded-[22px] border border-stroke bg-surface" onPress={onPress}>
        <View className="aspect-[9/16] overflow-hidden">
          <Image className="h-full w-full" resizeMode="cover" source={{ uri: thumbnail }} />
          <LinearGradient
            colors={['rgba(15,23,42,0.02)', 'rgba(15,23,42,0.18)', 'rgba(15,23,42,0.82)']}
            end={{ x: 0.5, y: 1 }}
            start={{ x: 0.5, y: 0 }}
            style={{ bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 }}
          />

          <View className="absolute inset-x-3 top-3 flex-row items-center justify-between">
            {topLeftLabel ? (
              <View className={`rounded-full px-2.5 py-1 ${getTopLeftClasses(topLeftTone)}`}>
                <Text className="text-[10px] font-bold uppercase tracking-[0.3px] text-white">{topLeftLabel}</Text>
              </View>
            ) : (
              <View />
            )}

            {topRightLabel ? (
              <View className="rounded-lg bg-black/70 px-2 py-1">
                <Text className="text-[10px] font-medium text-white">{topRightLabel}</Text>
              </View>
            ) : null}
          </View>

          <View className="absolute inset-x-3 bottom-3 gap-1.5">
            <Text className="text-sm font-bold leading-5 text-white" numberOfLines={2}>
              {title}
            </Text>
            <Text className="text-xs text-white/80" numberOfLines={1}>
              {subtitle}
            </Text>

            {(leftMetric || rightMetric) ? (
              <View className="flex-row items-center justify-between gap-2">
                {leftMetric ? (
                  <View className="rounded-lg bg-black/60 px-2 py-1">
                    <Text className="text-[11px] font-medium text-white">
                      {leftMetric.icon} {leftMetric.value}
                    </Text>
                  </View>
                ) : (
                  <View />
                )}

                {rightMetric ? (
                  <View className="rounded-lg bg-black/60 px-2 py-1">
                    <Text className="text-[11px] font-medium text-white">
                      {rightMetric.icon} {rightMetric.value}
                    </Text>
                  </View>
                ) : null}
              </View>
            ) : null}
          </View>
        </View>
      </Pressable>

      {actionLabel && onAction ? (
        actionTone === 'brand' ? (
          <Pressable onPress={onAction}>
            <LinearGradient colors={brandActionGradient} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={{ borderRadius: 16 }}>
              <View className="min-h-[42px] flex-row items-center justify-center gap-1.5 rounded-2xl px-3 py-2.5">
                <Text className="text-sm font-semibold text-white">{actionLabel}</Text>
                {actionMeta ? <Text className="text-xs font-semibold text-white/80">{actionMeta}</Text> : null}
              </View>
            </LinearGradient>
          </Pressable>
        ) : (
          <Pressable
            className={`min-h-[42px] flex-row items-center justify-center gap-1.5 rounded-2xl border px-3 py-2.5 ${
              actionTone === 'liked'
                ? 'border-rose-200 bg-rose-50'
                : 'border-stroke bg-surface'
            }`}
            onPress={onAction}
          >
            <Text className={`text-sm font-semibold ${actionTone === 'liked' ? 'text-rose-600' : 'text-ink'}`}>
              {actionLabel}
            </Text>
            {actionMeta ? (
              <Text className={`text-xs font-semibold ${actionTone === 'liked' ? 'text-rose-500' : 'text-muted'}`}>
                {actionMeta}
              </Text>
            ) : null}
          </Pressable>
        )
      ) : null}
    </View>
  );
}
