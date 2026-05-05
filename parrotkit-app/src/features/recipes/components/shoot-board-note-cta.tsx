import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, Text, View } from 'react-native';

import type { AppLanguage } from '@/core/i18n/app-language';

export function ShootBoardNoteCta({
  language,
  onPress,
}: {
  language: AppLanguage;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      className="mx-4 mt-4 rounded-[18px] border border-dashed border-slate-300 bg-white px-4 py-4"
      onPress={onPress}
    >
      <View className="flex-row items-center gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-violet/10">
          <MaterialCommunityIcons color="#8b5cf6" name="note-edit-outline" size={20} />
        </View>
        <View className="min-w-0 flex-1">
          <Text className="text-[14px] font-black text-ink">
            {language === 'ko' ? '오늘의 메모를 입력해보세요.' : "Add today's shooting note."}
          </Text>
          <Text className="mt-1 text-[12px] font-semibold text-muted" numberOfLines={1}>
            {language === 'ko' ? '촬영 전 기억할 포인트를 한 줄로 남기기' : 'Keep one reminder before recording.'}
          </Text>
        </View>
        <MaterialCommunityIcons color="#94a3b8" name="chevron-right" size={22} />
      </View>
    </Pressable>
  );
}
