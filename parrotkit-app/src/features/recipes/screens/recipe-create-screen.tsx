import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { ComponentProps, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppLanguage, type AppLanguage } from '@/core/i18n/app-language';
import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { brandActionGradient } from '@/core/theme/colors';
import { getRecipeCreateScrollBottomPadding } from '@/features/recipes/lib/recipe-create-layout';
import {
  getRecipeCreateInitialState,
  getRecipeCreateOptionPressState,
  getRecipeCreateOptions,
  type RecipeCreateLockedGuidanceMode,
  type RecipeCreateMode,
} from '@/features/recipes/lib/recipe-create-options';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
type CreateMode = RecipeCreateMode;
const creationOptions = getRecipeCreateOptions();

const createCopy = {
  en: {
    title: 'Start a new recipe',
    subtitle: 'Choose how you want to create this recipe.',
    close: 'Close',
    locked: 'Pro locked',
    lockedState: 'Locked',
    cta: {
      reference: 'Generate from reference',
      manual: 'Start from blank',
      brand: 'Brand context Pro / coming soon',
    },
    helper: {
      reference: 'Paste a video or post link and ParrotKit will draft the recipe structure.',
      manual: 'Start with a blank recipe and fill in the essentials yourself.',
      brand: 'Brand context setup is Pro / coming soon for v1.',
    },
    lockedGuidance: {
      reference: {
        title: 'Reference link is Pro / coming soon',
        body: 'Keep building the blank shoot-board now. Reference-link extraction stays locked for v1 and will not start an API flow.',
      },
      brand: {
        title: 'Brand context is Pro / coming soon',
        body: 'Keep building the blank shoot-board now. Brand-assisted setup stays locked for v1 and will not start a setup flow.',
      },
    } satisfies Record<RecipeCreateLockedGuidanceMode, { body: string; title: string }>,
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
        icon: 'lock-outline' as IconName,
        title: 'Brand context',
        body: 'Pro / coming soon',
      },
    } satisfies Record<CreateMode, { body: string; icon: IconName; title: string }>,
    fields: {
      referenceTitle: 'Reference URL',
      referencePlaceholder: 'Paste TikTok, Reels, Shorts, or product page link',
      manualTitle: 'Recipe basics',
      recipeTitle: 'Recipe title',
      recipeSummary: 'One-line summary',
      defaultRecipeTitle: 'Untitled shooting recipe',
      brandTitle: 'Brand context',
      brandPlaceholder: 'Pro / coming soon',
      included: 'What ParrotKit will draft',
      start: 'Start',
    },
    chips: {
      reference: ['Shot breakdown', 'Script draft', 'Prompter'],
      manual: ['Hook', 'Proof', 'CTA'],
      brand: ['Pro', 'Coming soon', 'Locked'],
    } satisfies Record<CreateMode, string[]>,
  },
  ko: {
    title: '새 레시피 시작',
    subtitle: '어떤 방식으로 레시피를 만들지 선택하세요.',
    close: '닫기',
    locked: 'Pro 잠금',
    lockedState: '잠금',
    cta: {
      reference: '레퍼런스로 만들기',
      manual: '빈 레시피로 시작',
      brand: '브랜드 컨텍스트 Pro / 준비 중',
    },
    helper: {
      reference: '영상이나 게시물 링크를 붙여넣으면 레시피 구조를 자동으로 잡아드려요.',
      manual: '빈 레시피에서 제목, 컷 구성, 문장을 직접 채워요.',
      brand: '브랜드 컨텍스트 설정은 v1에서 Pro / 준비 중입니다.',
    },
    lockedGuidance: {
      reference: {
        title: '레퍼런스 링크는 Pro / 준비 중',
        body: '지금은 빈 슛보드로 계속 만들 수 있어요. v1에서는 레퍼런스 링크 추출이 잠금 상태이며 API 흐름을 시작하지 않습니다.',
      },
      brand: {
        title: '브랜드 컨텍스트는 Pro / 준비 중',
        body: '지금은 빈 슛보드로 계속 만들 수 있어요. v1에서는 브랜드 기반 생성이 잠금 상태이며 별도 설정 흐름을 시작하지 않습니다.',
      },
    } satisfies Record<RecipeCreateLockedGuidanceMode, { body: string; title: string }>,
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
        icon: 'lock-outline' as IconName,
        title: '브랜드 컨텍스트',
        body: 'Pro / 준비 중',
      },
    } satisfies Record<CreateMode, { body: string; icon: IconName; title: string }>,
    fields: {
      referenceTitle: '레퍼런스 URL',
      referencePlaceholder: 'TikTok, Reels, Shorts, 제품 페이지 링크 붙여넣기',
      manualTitle: '레시피 기본 정보',
      recipeTitle: '레시피 제목',
      recipeSummary: '한 줄 설명',
      defaultRecipeTitle: '새 촬영 레시피',
      brandTitle: '브랜드 컨텍스트',
      brandPlaceholder: 'Pro / 준비 중',
      included: 'ParrotKit이 만들어줄 항목',
      start: '시작하기',
    },
    chips: {
      reference: ['컷 분석', '대사 초안', '프롬프터'],
      manual: ['Hook', 'Proof', 'CTA'],
      brand: ['Pro', '준비 중', '잠금'],
    } satisfies Record<CreateMode, string[]>,
  },
} satisfies Record<AppLanguage, Record<string, unknown>>;

export function RecipeCreateScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ mode?: string }>();
  const { language } = useAppLanguage();
  const { createBlankShootBoardRecipe } = useMockWorkspace();
  const copy = createCopy[language];
  const initialState = getRecipeCreateInitialState(params.mode);
  const [selectedMode, setSelectedMode] = useState<CreateMode>(initialState.selectedMode);
  const [lockedGuidanceMode, setLockedGuidanceMode] = useState<RecipeCreateLockedGuidanceMode | undefined>(
    initialState.lockedGuidanceMode
  );
  const [manualRecipeTitle, setManualRecipeTitle] = useState('');
  const modeCopy = copy.mode as Record<CreateMode, { body: string; icon: IconName; title: string }>;
  const ctaCopy = copy.cta as Record<CreateMode, string>;
  const helperCopy = copy.helper as Record<CreateMode, string>;
  const fieldsCopy = copy.fields as Record<string, string>;
  const lockedGuidanceCopy = copy.lockedGuidance as Record<RecipeCreateLockedGuidanceMode, { body: string; title: string }>;
  const selectedOption = creationOptions.find((option) => option.id === selectedMode);
  const lockedGuidance = lockedGuidanceMode ? lockedGuidanceCopy[lockedGuidanceMode] : undefined;
  const scrollBottomPadding = getRecipeCreateScrollBottomPadding(insets.bottom);

  const back = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/recipes' as Href);
  };

  const selected = modeCopy[selectedMode];

  const selectCreateMode = (mode: CreateMode) => {
    const nextState = getRecipeCreateOptionPressState(selectedMode, mode);
    setSelectedMode(nextState.selectedMode);
    setLockedGuidanceMode(nextState.lockedGuidanceMode);
  };

  const startSelectedFlow = () => {
    if (selectedOption?.isProLocked || selectedMode !== 'manual') {
      return;
    }

    const created = createBlankShootBoardRecipe({
      title: manualRecipeTitle.trim() || fieldsCopy.defaultRecipeTitle,
    });

    router.replace(created.destination as Href);
  };

  useEffect(() => {
    const nextState = getRecipeCreateInitialState(params.mode);
    setSelectedMode(nextState.selectedMode);
    setLockedGuidanceMode(nextState.lockedGuidanceMode);
  }, [params.mode]);

  return (
    <View className="flex-1 bg-canvas">
      <ScrollView
        automaticallyAdjustContentInsets={false}
        contentContainerStyle={{
          paddingBottom: scrollBottomPadding,
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
          {creationOptions.map((option) => (
            <CreateModeCard
              item={modeCopy[option.id]}
              key={option.id}
              lockedGuidanceLabel={option.lockedGuidanceLabel}
              lockedLabel={copy.lockedState as string}
              mode={option.id}
              onPress={() => selectCreateMode(option.id)}
              proBadgeLabel={option.proBadgeLabel}
              proLocked={option.isProLocked}
              selected={option.id === selectedMode}
            />
          ))}
        </View>

        {lockedGuidance ? (
          <View style={styles.lockedGuidancePanel}>
            <View style={styles.lockedGuidanceIcon}>
              <MaterialCommunityIcons color="#fff" name="lock-outline" size={18} />
            </View>
            <View className="min-w-0 flex-1">
              <Text className="text-[14px] font-black text-ink">{lockedGuidance.title}</Text>
              <Text className="mt-1 text-[12px] font-semibold leading-5 text-muted">{lockedGuidance.body}</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.detailPanel}>
          <View className="flex-row items-center gap-3">
            <ModeIcon active icon={selected.icon} mode={selectedMode} />
            <View className="min-w-0 flex-1">
              <Text className="text-[18px] font-black text-ink">{selected.title}</Text>
              <Text className="mt-1 text-[12px] font-semibold leading-5 text-muted">{helperCopy[selectedMode]}</Text>
            </View>
          </View>

          <ModeDetail
            copy={copy}
            manualRecipeTitle={manualRecipeTitle}
            mode={selectedMode}
            onChangeManualRecipeTitle={setManualRecipeTitle}
          />
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 14 }]}>
        <Pressable accessibilityRole="button" className="overflow-hidden rounded-[18px]" onPress={startSelectedFlow}>
          <LinearGradient colors={brandActionGradient} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={styles.ctaButton}>
            <Text className="text-[16px] font-black text-white">
              {selectedOption?.isProLocked ? `${ctaCopy[selectedMode]} · ${copy.locked as string}` : ctaCopy[selectedMode]}
            </Text>
            <MaterialCommunityIcons color="#fff" name={selectedOption?.isProLocked ? 'lock-outline' : 'arrow-right'} size={20} />
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

function CreateModeCard({
  item,
  lockedGuidanceLabel,
  lockedLabel,
  mode,
  onPress,
  proBadgeLabel,
  proLocked,
  selected,
}: {
  item: { body: string; icon: IconName; title: string };
  lockedGuidanceLabel?: string;
  lockedLabel: string;
  mode: CreateMode;
  onPress: () => void;
  proBadgeLabel?: string;
  proLocked: boolean;
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
        <View className="flex-row flex-wrap items-center gap-2">
          <Text className="text-[15px] font-black text-ink">{item.title}</Text>
          {proBadgeLabel ? (
            <View style={styles.proBadge}>
              <Text className="text-[10px] font-black text-white">{proBadgeLabel}</Text>
            </View>
          ) : null}
          {proLocked ? (
            <View style={styles.lockStateBadge}>
              <MaterialCommunityIcons color="#64748b" name="lock-outline" size={12} />
              <Text className="text-[10px] font-black text-slate-500">{lockedLabel}</Text>
            </View>
          ) : null}
        </View>
        <Text className="mt-1 text-[12px] font-semibold text-muted" numberOfLines={2}>
          {lockedGuidanceLabel ?? item.body}
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

function ModeDetail({
  copy,
  manualRecipeTitle,
  mode,
  onChangeManualRecipeTitle,
}: {
  copy: (typeof createCopy)['en'];
  manualRecipeTitle: string;
  mode: CreateMode;
  onChangeManualRecipeTitle: (value: string) => void;
}) {
  const fields = copy.fields as Record<string, string>;
  const chips = copy.chips as Record<CreateMode, string[]>;
  const lockedGuidance = copy.lockedGuidance as Record<RecipeCreateLockedGuidanceMode, { body: string; title: string }>;

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
      <View className="mt-5">
        <View style={styles.lockedDetailBox}>
          <MaterialCommunityIcons color="#64748b" name="lock-outline" size={28} />
          <Text className="mt-2 text-center text-[13px] font-black text-ink">{lockedGuidance.brand.title}</Text>
          <Text className="mt-1 text-center text-[12px] font-semibold leading-5 text-muted">{lockedGuidance.brand.body}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mt-5 gap-4">
      <ManualTitleField
        label={fields.manualTitle}
        onChangeText={onChangeManualRecipeTitle}
        placeholder={fields.defaultRecipeTitle}
        value={manualRecipeTitle}
      />
      <SimpleField label="" value={fields.recipeSummary} />
      <IncludedChips chips={chips.manual} label={fields.included} />
    </View>
  );
}

function ManualTitleField({
  label,
  onChangeText,
  placeholder,
  value,
}: {
  label: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <View className="gap-2">
      <Text className="text-[12px] font-black text-ink">{label}</Text>
      <TextInput
        accessibilityLabel={placeholder}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        style={styles.titleInput}
        value={value}
      />
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
  lockedGuidanceIcon: {
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 999,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  lockedGuidancePanel: {
    alignItems: 'center',
    backgroundColor: '#fff7ed',
    borderColor: '#fed7aa',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
    padding: 14,
  },
  lockStateBadge: {
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  proBadge: {
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 999,
    justifyContent: 'center',
    minHeight: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  titleInput: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 16,
    borderWidth: 1,
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
    minHeight: 50,
    paddingHorizontal: 14,
  },
  lockedDetailBox: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderColor: '#dbe3ee',
    borderRadius: 18,
    borderWidth: 1.5,
    justifyContent: 'center',
    minHeight: 132,
    padding: 16,
  },
});
