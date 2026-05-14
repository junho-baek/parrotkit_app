import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, Text, View } from 'react-native';

import type { AppLanguage } from '@/core/i18n/app-language';

export function ShootBoardStickyHeader({
  language,
  onToggleReorder,
  reorderMode,
  title,
}: {
  language: AppLanguage;
  onToggleReorder: () => void;
  reorderMode: boolean;
  title?: string;
}) {
  return (
    <View className="border-b border-stroke bg-canvas px-4 py-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-[18px] font-black tracking-[0.2px] text-ink">
          {title ?? (language === 'ko' ? '컷 카드' : 'Cut cards')}
        </Text>
        <Pressable
          accessibilityRole="button"
          className="flex-row items-center gap-1.5 rounded-full px-2 py-1"
          onPress={onToggleReorder}
        >
          <MaterialCommunityIcons color="#64748b" name={reorderMode ? 'check' : 'swap-vertical'} size={17} />
          <Text className="text-[13px] font-black text-muted">
            {reorderMode ? (language === 'ko' ? '완료' : 'Done') : (language === 'ko' ? '순서 변경' : 'Reorder')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
