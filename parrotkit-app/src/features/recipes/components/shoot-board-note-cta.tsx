import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, Text, TextInput, View } from 'react-native';

import type { AppLanguage } from '@/core/i18n/app-language';

export function ShootBoardNoteCta({
  checked,
  expanded,
  language,
  onChangeText,
  onClose,
  onToggleChecked,
  value,
}: {
  checked: boolean;
  expanded: boolean;
  language: AppLanguage;
  onChangeText: (value: string) => void;
  onClose: () => void;
  onToggleChecked: () => void;
  value: string;
}) {
  if (!expanded) return null;

  return (
    <View className="mx-5 mb-3 border-b border-stroke bg-white pb-4">
      <TextInput
        accessibilityLabel={
          language === 'ko' ? '오늘의 촬영 메모' : "Today's shooting note"
        }
        className="min-h-[74px] px-0 py-0 text-[15px] font-bold leading-6 text-ink"
        maxLength={160}
        multiline
        onChangeText={onChangeText}
        placeholder={
          language === 'ko'
            ? '촬영 전에 기억할 점을 적어두세요.'
            : 'Write one reminder before recording.'
        }
        placeholderTextColor="#94a3b8"
        value={value}
      />
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        className="mt-3 flex-row items-center gap-2 py-1"
        onPress={onToggleChecked}
      >
        <View
          className={`h-6 w-6 items-center justify-center rounded-full border ${
            checked ? 'border-violet bg-violet' : 'border-slate-300 bg-white'
          }`}
        >
          {checked ? (
            <MaterialCommunityIcons color="#ffffff" name="check" size={14} />
          ) : null}
        </View>
        <Text className="flex-1 text-[14px] font-black text-ink">
          {language === 'ko' ? '촬영 전 확인 완료' : 'Ready before recording'}
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        className="mt-3 self-start rounded-full bg-ink px-4 py-2"
        onPress={onClose}
      >
        <Text className="text-[13px] font-black text-white">
          {language === 'ko' ? '닫기' : 'Done'}
        </Text>
      </Pressable>
    </View>
  );
}
