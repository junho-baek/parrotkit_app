import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { ComponentProps, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppLanguage, type AppLanguage } from '@/core/i18n/app-language';
import { brandActionGradient } from '@/core/theme/colors';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
type CreateMode = 'reference' | 'manual' | 'brand';

const modes: CreateMode[] = ['reference', 'manual', 'brand'];

const createCopy = {
  en: {
    title: 'Start a new recipe',
    subtitle: 'Choose how you want to create this recipe.',
    close: 'Close',
    cta: {
      reference: 'Generate from reference',
      manual: 'Start from blank',
      brand: 'Upload brand brief',
    },
    helper: {
      reference: 'Paste a video or post link and ParrotKit will draft the recipe structure.',
      manual: 'Start with a blank recipe and fill in the essentials yourself.',
      brand: 'Upload a brand brief and convert it into creator-ready instructions.',
    },
    mode: {
      reference: {
        icon: 'link-variant' as IconName,
        title: 'Reference link',
        body: 'Auto-generate from a link',
      },
      manual: {
        icon: 'pencil-outline' as IconName,
        title: 'Create manually',
        body: 'Start with a blank recipe',
      },
      brand: {
        icon: 'cloud-upload-outline' as IconName,
        title: 'Brand brief',
        body: 'Make a campaign recipe',
      },
    } satisfies Record<CreateMode, { body: string; icon: IconName; title: string }>,
    fields: {
      referenceTitle: 'Reference URL',
      referencePlaceholder: 'Paste TikTok, Reels, Shorts, or product page link',
      manualTitle: 'Recipe basics',
      recipeTitle: 'Recipe title',
      recipeSummary: 'One-line summary',
      brandTitle: 'Brief upload',
      brandPlaceholder: 'PDF, doc, or image brief',
      included: 'What ParrotKit will draft',
      start: 'Start',
    },
    chips: {
      reference: ['Shot breakdown', 'Script draft', 'Prompter'],
      manual: ['Hook', 'Proof', 'CTA'],
      brand: ['Must include', 'Avoid claims', 'Tone guide'],
    } satisfies Record<CreateMode, string[]>,
  },
  ko: {
    title: '새 레시피 시작',
    subtitle: '어떤 방식으로 레시피를 만들지 선택하세요.',
    close: '닫기',
    cta: {
      reference: '레퍼런스로 만들기',
      manual: '빈 레시피로 시작',
      brand: '브랜드 브리프 업로드',
    },
    helper: {
      reference: '영상이나 게시물 링크를 붙여넣으면 레시피 구조를 자동으로 잡아드려요.',
      manual: '빈 레시피에서 제목, 컷 구성, 문장을 직접 채워요.',
      brand: '브랜드 브리프를 업로드하면 촬영 가능한 가이드로 바꿔드려요.',
    },
    mode: {
      reference: {
        icon: 'link-variant' as IconName,
        title: '레퍼런스 링크',
        body: '링크 붙여넣고 자동 생성',
      },
      manual: {
        icon: 'pencil-outline' as IconName,
        title: '직접 만들기',
        body: '빈 레시피로 시작',
      },
      brand: {
        icon: 'cloud-upload-outline' as IconName,
        title: '브랜드 브리프',
        body: '캠페인 레시피 만들기',
      },
    } satisfies Record<CreateMode, { body: string; icon: IconName; title: string }>,
    fields: {
      referenceTitle: '레퍼런스 URL',
      referencePlaceholder: 'TikTok, Reels, Shorts, 제품 페이지 링크 붙여넣기',
      manualTitle: '레시피 기본 정보',
      recipeTitle: '레시피 제목',
      recipeSummary: '한 줄 설명',
      brandTitle: '브리프 업로드',
      brandPlaceholder: 'PDF, 문서, 이미지 브리프',
      included: 'ParrotKit이 만들어줄 항목',
      start: '시작하기',
    },
    chips: {
      reference: ['컷 분석', '대사 초안', '프롬프터'],
      manual: ['Hook', 'Proof', 'CTA'],
      brand: ['필수 요소', '금지 표현', '톤 가이드'],
    } satisfies Record<CreateMode, string[]>,
  },
} satisfies Record<AppLanguage, Record<string, unknown>>;

export function RecipeCreateScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ mode?: string }>();
  const { language } = useAppLanguage();
  const copy = createCopy[language];
  const initialMode = isCreateMode(params.mode) ? params.mode : 'reference';
  const [selectedMode, setSelectedMode] = useState<CreateMode>(initialMode);
  const modeCopy = copy.mode as Record<CreateMode, { body: string; icon: IconName; title: string }>;
  const ctaCopy = copy.cta as Record<CreateMode, string>;
  const helperCopy = copy.helper as Record<CreateMode, string>;

  const back = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/recipes' as Href);
  };

  const selected = modeCopy[selectedMode];

  useEffect(() => {
    if (isCreateMode(params.mode)) {
      setSelectedMode(params.mode);
    }
  }, [params.mode]);

  return (
    <View className="flex-1 bg-canvas">
      <ScrollView
        automaticallyAdjustContentInsets={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 138,
          paddingHorizontal: 20,
          paddingTop: insets.top + 16,
        }}
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between">
          <Pressable accessibilityLabel={copy.close as string} accessibilityRole="button" onPress={back} style={styles.closeButton}>
            <MaterialCommunityIcons color="#111827" name="arrow-left" size={23} />
          </Pressable>
          <Text className="text-[17px] font-black text-ink">{copy.title as string}</Text>
          <Pressable accessibilityRole="button" onPress={back} style={styles.closeButton}>
            <MaterialCommunityIcons color="#111827" name="close" size={22} />
          </Pressable>
        </View>

        <View className="mt-4">
          <Text className="text-center text-[14px] font-semibold leading-5 text-muted">{copy.subtitle as string}</Text>
        </View>

        <View className="mt-5 gap-3">
          {modes.map((mode) => (
            <CreateModeCard
              item={modeCopy[mode]}
              key={mode}
              mode={mode}
              onPress={() => setSelectedMode(mode)}
              selected={mode === selectedMode}
            />
          ))}
        </View>

        <View style={styles.detailPanel}>
          <View className="flex-row items-center gap-3">
            <ModeIcon active icon={selected.icon} mode={selectedMode} />
            <View className="min-w-0 flex-1">
              <Text className="text-[18px] font-black text-ink">{selected.title}</Text>
              <Text className="mt-1 text-[12px] font-semibold leading-5 text-muted">{helperCopy[selectedMode]}</Text>
            </View>
          </View>

          <ModeDetail copy={copy} mode={selectedMode} />
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 14 }]}>
        <Pressable accessibilityRole="button" className="overflow-hidden rounded-[18px]">
          <LinearGradient colors={brandActionGradient} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={styles.ctaButton}>
            <Text className="text-[16px] font-black text-white">{ctaCopy[selectedMode]}</Text>
            <MaterialCommunityIcons color="#fff" name="arrow-right" size={20} />
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

function CreateModeCard({
  item,
  mode,
  onPress,
  selected,
}: {
  item: { body: string; icon: IconName; title: string };
  mode: CreateMode;
  onPress: () => void;
  selected: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.modeCard, selected ? styles.modeCardActive : null, selected ? modeActiveBorder(mode) : null]}
    >
      <ModeIcon icon={item.icon} mode={mode} />
      <View className="min-w-0 flex-1">
        <Text className="text-[15px] font-black text-ink">{item.title}</Text>
        <Text className="mt-1 text-[12px] font-semibold text-muted" numberOfLines={2}>
          {item.body}
        </Text>
      </View>
      <MaterialCommunityIcons color="#111827" name="chevron-right" size={22} />
    </Pressable>
  );
}

function ModeIcon({ active, icon, mode }: { active?: boolean; icon: IconName; mode: CreateMode }) {
  const color = mode === 'reference' ? '#15b8a6' : mode === 'manual' ? '#ff7a59' : '#64748b';
  const backgroundColor = mode === 'reference' ? '#e7fbf7' : mode === 'manual' ? '#fff1eb' : '#f1f5f9';

  return (
    <View style={[styles.modeIcon, { backgroundColor }, active ? styles.modeIconLarge : null]}>
      <MaterialCommunityIcons color={color} name={icon} size={active ? 27 : 25} />
    </View>
  );
}

function ModeDetail({ copy, mode }: { copy: (typeof createCopy)['en']; mode: CreateMode }) {
  const fields = copy.fields as Record<string, string>;
  const chips = copy.chips as Record<CreateMode, string[]>;

  if (mode === 'reference') {
    return (
      <View className="mt-5 gap-4">
        <SimpleField label={fields.referenceTitle} value={fields.referencePlaceholder} />
        <IncludedChips chips={chips.reference} label={fields.included} />
      </View>
    );
  }

  if (mode === 'brand') {
    return (
      <View className="mt-5 gap-4">
        <View style={styles.uploadBox}>
          <MaterialCommunityIcons color="#64748b" name="cloud-upload-outline" size={30} />
          <Text className="mt-2 text-[13px] font-black text-ink">{fields.brandTitle}</Text>
          <Text className="mt-1 text-[12px] font-semibold text-muted">{fields.brandPlaceholder}</Text>
        </View>
        <IncludedChips chips={chips.brand} label={fields.included} />
      </View>
    );
  }

  return (
    <View className="mt-5 gap-4">
      <SimpleField label={fields.manualTitle} value={fields.recipeTitle} />
      <SimpleField label="" value={fields.recipeSummary} />
      <IncludedChips chips={chips.manual} label={fields.included} />
    </View>
  );
}

function SimpleField({ label, value }: { label: string; value: string }) {
  return (
    <View className="gap-2">
      {label ? <Text className="text-[12px] font-black text-ink">{label}</Text> : null}
      <View style={styles.fieldBox}>
        <Text className="text-[13px] font-semibold text-slate-400">{value}</Text>
      </View>
    </View>
  );
}

function IncludedChips({ chips, label }: { chips: string[]; label: string }) {
  return (
    <View className="gap-3">
      <Text className="text-[12px] font-black text-ink">{label}</Text>
      <View className="flex-row flex-wrap gap-2">
        {chips.map((chip) => (
          <View key={chip} style={styles.chip}>
            <MaterialCommunityIcons color="#8c67ff" name="check" size={14} />
            <Text className="text-[12px] font-black text-violet">{chip}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function isCreateMode(value: string | undefined): value is CreateMode {
  return value === 'reference' || value === 'manual' || value === 'brand';
}

function modeActiveBorder(mode: CreateMode) {
  return {
    borderColor: mode === 'reference' ? '#8de4d7' : mode === 'manual' ? '#ffc3ae' : '#dbe3ee',
  };
}

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    backgroundColor: '#f4f0ff',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  closeButton: {
    alignItems: 'center',
    borderColor: '#e2e8f0',
    borderRadius: 999,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  ctaButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 56,
  },
  detailPanel: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 24,
    borderWidth: 1,
    marginTop: 16,
    padding: 16,
  },
  fieldBox: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 50,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  footer: {
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderTopColor: '#eef2f7',
    borderTopWidth: 1,
    bottom: 0,
    left: 0,
    paddingHorizontal: 20,
    paddingTop: 14,
    position: 'absolute',
    right: 0,
  },
  modeCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    minHeight: 84,
    padding: 14,
  },
  modeCardActive: {
    borderWidth: 1.5,
    shadowColor: '#0f172a',
    shadowOffset: { height: 10, width: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
  },
  modeIcon: {
    alignItems: 'center',
    borderRadius: 18,
    height: 54,
    justifyContent: 'center',
    width: 54,
  },
  modeIconLarge: {
    borderRadius: 20,
    height: 66,
    width: 66,
  },
  uploadBox: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderColor: '#dbe3ee',
    borderRadius: 18,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    justifyContent: 'center',
    minHeight: 118,
  },
});
