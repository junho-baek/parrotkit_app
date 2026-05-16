import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, TextInput, View } from 'react-native';

import type { AppLanguage } from '@/core/i18n/app-language';

export function ShootBoardNoteCta({
  checked,
  language,
  onChangeText,
  onToggleChecked,
  value,
}: {
  checked: boolean;
  language: AppLanguage;
  onChangeText: (value: string) => void;
  onToggleChecked: () => void;
  value: string;
}) {
  return (
    <View className="mx-4 mt-3 border-b border-stroke bg-canvas py-3">
      <View className="flex-row items-start gap-3">
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked }}
          className={`mt-1 h-6 w-6 items-center justify-center rounded-full border ${
            checked ? 'border-violet bg-violet' : 'border-slate-300 bg-white'
          }`}
          onPress={onToggleChecked}
        >
          {checked ? (
            <MaterialCommunityIcons color="#ffffff" name="check" size={14} />
          ) : null}
        </Pressable>
        <TextInput
          accessibilityLabel={language === 'ko' ? '촬영 메모' : 'Shooting note'}
          className={`min-h-[34px] flex-1 px-0 py-0 text-[14px] font-bold leading-5 ${
            checked ? 'text-muted' : 'text-ink'
          }`}
          maxLength={120}
          multiline
          onChangeText={onChangeText}
          placeholder={
            language === 'ko'
              ? '촬영 전 체크할 한 가지'
              : 'One reminder before recording'
          }
          placeholderTextColor="#94a3b8"
          value={value}
        />
      </View>
    </View>
  );
}
