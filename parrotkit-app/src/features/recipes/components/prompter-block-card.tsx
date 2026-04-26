import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, Text, View } from 'react-native';

import { PrompterBlock } from '@/features/recipes/types/recipe-domain';

function getTone(block: PrompterBlock) {
  if (block.accentColor === 'coral') return 'border-[#ffb299] bg-[#fff1eb]';
  if (block.accentColor === 'green') return 'border-[#9be4b6] bg-[#effcf4]';
  if (block.accentColor === 'yellow') return 'border-[#f4d774] bg-[#fff9e7]';
  if (block.accentColor === 'pink') return 'border-[#ffb6d9] bg-[#fff0f8]';
  return 'border-[#a8d1ff] bg-[#eef6ff]';
}

export function PrompterBlockCard({
  block,
  onToggle,
}: {
  block: PrompterBlock;
  onToggle: (blockId: string, visible: boolean) => void;
}) {
  return (
    <Pressable
      className={`min-h-[118px] rounded-[22px] border px-4 py-4 ${block.visible ? getTone(block) : 'border-stroke bg-surface'}`}
      onPress={() => onToggle(block.id, !block.visible)}
    >
      <View className="mb-4 flex-row items-center justify-between">
        <View className={`h-3 w-3 rounded-full ${block.visible ? 'bg-violet' : 'bg-slate-300'}`} />
        <MaterialCommunityIcons
          color={block.visible ? '#6366f1' : '#cbd5e1'}
          name={block.visible ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
          size={20}
        />
      </View>
      <Text className="text-[13px] font-semibold leading-6 text-ink">{block.content}</Text>
    </Pressable>
  );
}
