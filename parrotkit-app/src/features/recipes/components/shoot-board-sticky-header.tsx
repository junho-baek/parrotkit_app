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
  const displayTitle = getQuietListTitle(language, title);

  return (
    <View className="border-b border-stroke bg-canvas px-4 py-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-[16px] font-black text-ink">
          {displayTitle}
        </Text>
        <Pressable
          accessibilityLabel={
            reorderMode
              ? language === 'ko'
                ? '순서 변경 완료'
                : 'Finish reordering'
              : language === 'ko'
                ? '순서 변경'
                : 'Reorder cuts'
          }
          accessibilityRole="button"
          accessibilityState={{ selected: reorderMode }}
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

function getQuietListTitle(language: AppLanguage, title?: string) {
  const defaultTitle = language === 'ko' ? '컷 리스트' : 'Cut list';

  if (!title || title === '촬영 보드' || title === 'Shooting board') {
    return defaultTitle;
  }

  return title;
}
