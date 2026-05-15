import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { ComponentProps, useEffect, useState } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppLanguage, type AppLanguage } from '@/core/i18n/app-language';
import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { brandActionGradient } from '@/core/theme/colors';
import { toImageSource } from '@/core/ui/image-source';
import {
  getInitialRecipeCreateMode,
  getRecipeCreateDraftContext,
  getRecipeCreatePrimaryAction,
  isRecipeCreateModePro,
  recipeCreateGoals,
  recipeCreateModes,
  recipeCreateNiches,
  type RecipeCreateGoalId,
  type RecipeCreateMode,
  type RecipeCreateNicheId,
} from '@/features/recipes/lib/recipe-create-flow';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

const createCopy = {
  en: {
    title: 'New recipe',
    close: 'Close',
    pro: 'Pro',
    linkPlaceholder: 'Paste a TikTok, Reels, Shorts, or product page link',
    brandPlaceholder: 'Add brand context, product sheet, or campaign brief',
    nicheQuestion: "What's the niche?",
    otherPlaceholder: 'Type your niche',
    goalQuestion: "What's the goal?",
    cta: 'Open recipe board',
    mode: {
      manual: { icon: 'plus-box-outline' as IconName, tab: 'Blank' },
      reference: { icon: 'link-variant' as IconName, tab: 'Link' },
      brand: { icon: 'briefcase-plus-outline' as IconName, tab: 'Brand' },
    } satisfies Record<RecipeCreateMode, { icon: IconName; tab: string }>,
  },
  ko: {
    title: 'New recipe',
    close: '닫기',
    pro: 'Pro',
    linkPlaceholder: 'TikTok, Reels, Shorts, 제품 페이지 링크 붙여넣기',
    brandPlaceholder: '브랜드 컨텍스트, 제품 자료, 캠페인 브리프 추가',
    nicheQuestion: '니치는 무엇인가요?',
    otherPlaceholder: '기타 니치 입력',
    goalQuestion: '목표는 무엇인가요?',
    cta: '레시피 보드 열기',
    mode: {
      manual: { icon: 'plus-box-outline' as IconName, tab: 'Blank' },
      reference: { icon: 'link-variant' as IconName, tab: 'Link' },
      brand: { icon: 'briefcase-plus-outline' as IconName, tab: 'Brand' },
    } satisfies Record<RecipeCreateMode, { icon: IconName; tab: string }>,
  },
} satisfies Record<AppLanguage, Record<string, unknown>>;

export function RecipeCreateScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ mode?: string }>();
  const { language } = useAppLanguage();
  const { createRecipeDraft } = useMockWorkspace();
  const copy = createCopy[language];
  const initialMode = getInitialRecipeCreateMode(params.mode);
  const [selectedMode, setSelectedMode] = useState<RecipeCreateMode>(initialMode);
  const [selectedNicheId, setSelectedNicheId] = useState<RecipeCreateNicheId>('beauty');
  const [selectedGoalId, setSelectedGoalId] = useState<RecipeCreateGoalId>('ad');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [customNicheLabel, setCustomNicheLabel] = useState('');
  const modeCopy = copy.mode as Record<RecipeCreateMode, { icon: IconName; tab: string }>;

  const back = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/' as Href);
  };

  const handlePrimaryAction = () => {
    const action = getRecipeCreatePrimaryAction(selectedMode);

    if (action !== 'open-shoot-board') {
      return;
    }

    const draft = getRecipeCreateDraftContext({
      customNicheLabel,
      goalId: selectedGoalId,
      mode: selectedMode,
      nicheId: selectedNicheId,
      referenceUrl,
    });
    const recipe = createRecipeDraft(draft);

    router.replace(`/recipe/${recipe.id}` as Href);
  };

  useEffect(() => {
    setSelectedMode(getInitialRecipeCreateMode(params.mode));
  }, [params.mode]);

  return (
    <View style={styles.overlay}>
      <Pressable accessibilityLabel={copy.close as string} onPress={back} style={StyleSheet.absoluteFillObject} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[
          styles.sheet,
          {
            maxHeight: '94%',
            paddingBottom: Math.max(insets.bottom, 12),
          },
        ]}
      >
        <View style={styles.handle} />

        <View style={styles.header}>
          <Pressable accessibilityLabel={copy.close as string} accessibilityRole="button" hitSlop={12} onPress={back}>
            <MaterialCommunityIcons color="#05070d" name="close" size={29} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>{copy.title as string}</Text>

          <View style={styles.modeTabs}>
            {recipeCreateModes.map((mode) => (
              <CreateModeTab
                item={modeCopy[mode]}
                key={mode}
                mode={mode}
                onPress={() => setSelectedMode(mode)}
                proLabel={copy.pro as string}
                selected={mode === selectedMode}
              />
            ))}
          </View>

          <ModeInput
            brandPlaceholder={copy.brandPlaceholder as string}
            linkPlaceholder={copy.linkPlaceholder as string}
            mode={selectedMode}
            onChangeReferenceUrl={setReferenceUrl}
            referenceUrl={referenceUrl}
          />

          <QuestionTitle title={copy.nicheQuestion as string} />
          <View style={styles.nicheGrid}>
            {recipeCreateNiches.map((niche) => (
              <NicheOption
                key={niche.id}
                label={language === 'ko' ? niche.labelKo : niche.label}
                niche={niche}
                onPress={() => setSelectedNicheId(niche.id)}
                selected={niche.id === selectedNicheId}
              />
            ))}
          </View>

          {selectedNicheId === 'other' ? (
            <View style={styles.otherInputRow}>
              <MaterialCommunityIcons color="#ff9568" name="dots-horizontal-circle-outline" size={24} />
              <TextInput
                accessibilityLabel={copy.otherPlaceholder as string}
                autoCapitalize="words"
                maxLength={40}
                onChangeText={setCustomNicheLabel}
                placeholder={copy.otherPlaceholder as string}
                placeholderTextColor="#9aa5b8"
                style={styles.otherInput}
                value={customNicheLabel}
              />
            </View>
          ) : null}

          <QuestionTitle title={copy.goalQuestion as string} />
          <View style={styles.goalGrid}>
            {recipeCreateGoals.map((goal) => (
              <GoalCard
                goal={goal}
                key={goal.id}
                label={language === 'ko' ? goal.labelKo : goal.label}
                onPress={() => setSelectedGoalId(goal.id)}
                selected={goal.id === selectedGoalId}
              />
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable accessibilityRole="button" onPress={handlePrimaryAction} style={styles.primaryButtonPressable}>
            <LinearGradient
              colors={brandActionGradient}
              end={{ x: 1, y: 1 }}
              start={{ x: 0, y: 0 }}
              style={styles.ctaButton}
            >
              <Text style={styles.ctaText}>{copy.cta as string}</Text>
              <MaterialCommunityIcons color="#fff" name="arrow-right" size={25} />
            </LinearGradient>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function CreateModeTab({
  item,
  mode,
  onPress,
  proLabel,
  selected,
}: {
  item: { icon: IconName; tab: string };
  mode: RecipeCreateMode;
  onPress: () => void;
  proLabel: string;
  selected: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.modeTab, selected ? styles.modeTabActive : null]}
    >
      <MaterialCommunityIcons color={selected ? '#ff9568' : '#64748b'} name={item.icon} size={23} />
      <Text style={[styles.modeTabText, selected ? styles.modeTabTextActive : null]}>{item.tab}</Text>
      {isRecipeCreateModePro(mode) ? <ProBadge label={proLabel} /> : null}
    </Pressable>
  );
}

function ModeInput({
  brandPlaceholder,
  linkPlaceholder,
  mode,
  onChangeReferenceUrl,
  referenceUrl,
}: {
  brandPlaceholder: string;
  linkPlaceholder: string;
  mode: RecipeCreateMode;
  onChangeReferenceUrl: (value: string) => void;
  referenceUrl: string;
}) {
  if (mode === 'manual') {
    return <View style={styles.modeInputSpacer} />;
  }

  const iconName: IconName = mode === 'brand' ? 'briefcase-outline' : 'link-variant';
  const placeholder = mode === 'brand' ? brandPlaceholder : linkPlaceholder;

  return (
    <View style={styles.underlineInputRow}>
      <MaterialCommunityIcons color="#64748b" name={iconName} size={25} />
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        editable={mode === 'reference'}
        inputMode={mode === 'reference' ? 'url' : 'text'}
        keyboardType={mode === 'reference' ? 'url' : 'default'}
        onChangeText={onChangeReferenceUrl}
        placeholder={placeholder}
        placeholderTextColor="#9aa5b8"
        style={styles.underlineInput}
        value={mode === 'reference' ? referenceUrl : ''}
      />
    </View>
  );
}

function QuestionTitle({ title }: { title: string }) {
  return <Text style={styles.questionTitle}>{title}</Text>;
}

function NicheOption({
  label,
  niche,
  onPress,
  selected,
}: {
  label: string;
  niche: (typeof recipeCreateNiches)[number];
  onPress: () => void;
  selected: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.nicheOption, selected ? styles.nicheOptionActive : null]}
    >
      <MaterialCommunityIcons color={selected ? '#ff9568' : '#94a3b8'} name={getNicheIcon(niche.id)} size={25} />
      <Text numberOfLines={1} style={[styles.nicheLabel, selected ? styles.nicheLabelActive : null]}>
        {label}
      </Text>
      {selected ? (
        <MaterialCommunityIcons color="#ff9568" name="check-circle" size={20} style={styles.nicheCheck} />
      ) : null}
    </Pressable>
  );
}

function GoalCard({
  goal,
  label,
  onPress,
  selected,
}: {
  goal: (typeof recipeCreateGoals)[number];
  label: string;
  onPress: () => void;
  selected: boolean;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.goalCardPressable}>
      <ImageBackground
        imageStyle={styles.goalImage}
        resizeMode="cover"
        source={toImageSource(goal.imageSource)}
        style={[styles.goalCard, selected ? styles.goalCardActive : null]}
      >
        <LinearGradient colors={['rgba(15,23,42,0.04)', 'rgba(15,23,42,0.62)']} style={StyleSheet.absoluteFill} />
        {selected ? (
          <View style={styles.goalCheck}>
            <MaterialCommunityIcons color="#ffffff" name="check" size={25} />
          </View>
        ) : null}
        <View style={styles.goalCopy}>
          <MaterialCommunityIcons color="#ffffff" name={getGoalIcon(goal.id)} size={29} />
          <Text numberOfLines={2} style={styles.goalLabel}>
            {label}
          </Text>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

function ProBadge({ label }: { label: string }) {
  return (
    <View style={styles.proBadge}>
      <Text style={styles.proBadgeText}>{label}</Text>
    </View>
  );
}

function getNicheIcon(nicheId: RecipeCreateNicheId): IconName {
  if (nicheId === 'beauty') return 'lipstick';
  if (nicheId === 'food') return 'food-apple-outline';
  if (nicheId === 'fitness') return 'dumbbell';
  if (nicheId === 'home') return 'home-heart';
  if (nicheId === 'tech') return 'cellphone';
  return 'dots-horizontal';
}

function getGoalIcon(goalId: RecipeCreateGoalId): IconName {
  if (goalId === 'ad') return 'bullhorn-outline';
  if (goalId === 'sell') return 'shopping-outline';
  if (goalId === 'recipe-product') return 'cube-outline';
  if (goalId === 'personal') return 'account-outline';
  if (goalId === 'viral') return 'star-outline';
  return 'chart-line-variant';
}

const styles = StyleSheet.create({
  ctaButton: {
    alignItems: 'center',
    borderRadius: 18,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    minHeight: 62,
  },
  ctaText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  goalCard: {
    aspectRatio: 0.78,
    borderRadius: 18,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  goalCardActive: {
    borderColor: '#ff9568',
    borderWidth: 2,
    shadowColor: '#ff9568',
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.23,
    shadowRadius: 16,
  },
  goalCardPressable: {
    flexBasis: '31.6%',
  },
  goalCheck: {
    alignItems: 'center',
    backgroundColor: '#ff9568',
    borderRadius: 999,
    height: 38,
    justifyContent: 'center',
    position: 'absolute',
    right: -4,
    top: -4,
    width: 38,
    zIndex: 2,
  },
  goalCopy: {
    alignItems: 'center',
    gap: 6,
    paddingBottom: 14,
    paddingHorizontal: 8,
    zIndex: 1,
  },
  goalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingBottom: 8,
  },
  goalImage: {
    borderRadius: 18,
  },
  goalLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 18,
    textAlign: 'center',
  },
  handle: {
    alignSelf: 'center',
    backgroundColor: '#d7dbe3',
    borderRadius: 999,
    height: 5,
    marginTop: 16,
    width: 58,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 52,
    paddingHorizontal: 24,
  },
  modeInputSpacer: {
    height: 22,
  },
  modeTab: {
    alignItems: 'center',
    borderColor: '#e4e8f0',
    borderRadius: 20,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 10,
    position: 'relative',
  },
  modeTabActive: {
    backgroundColor: '#fff1eb',
    borderColor: '#fff1eb',
  },
  modeTabText: {
    color: '#64748b',
    flexShrink: 1,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0,
  },
  modeTabTextActive: {
    color: '#05070d',
  },
  modeTabs: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 28,
  },
  nicheCheck: {
    position: 'absolute',
    right: 8,
    top: 8,
  },
  nicheGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  nicheLabel: {
    color: '#05070d',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 18,
    textAlign: 'center',
  },
  nicheLabelActive: {
    color: '#ff9568',
  },
  nicheOption: {
    alignItems: 'center',
    borderColor: '#e4e8f0',
    borderRadius: 24,
    borderWidth: 1,
    flexBasis: '30.8%',
    gap: 8,
    justifyContent: 'center',
    minHeight: 92,
    paddingHorizontal: 8,
    paddingVertical: 10,
    position: 'relative',
  },
  nicheOptionActive: {
    borderColor: '#ff9568',
    borderWidth: 1.5,
    shadowColor: '#ff9568',
    shadowOffset: { height: 5, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  otherInput: {
    color: '#111827',
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    minWidth: 0,
    paddingVertical: 0,
  },
  otherInputRow: {
    alignItems: 'center',
    borderColor: '#ffd8c8',
    borderRadius: 20,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
    minHeight: 54,
    paddingHorizontal: 16,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  primaryButtonPressable: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  proBadge: {
    backgroundColor: '#111827',
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 3,
    position: 'absolute',
    right: 5,
    top: 4,
  },
  proBadgeText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  questionTitle: {
    color: '#05070d',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
    marginBottom: 14,
    marginTop: 32,
  },
  scrollContent: {
    paddingBottom: 118,
    paddingHorizontal: 20,
  },
  sheet: {
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
    width: '100%',
  },
  title: {
    color: '#05070d',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 33,
    marginTop: 6,
  },
  underlineInput: {
    color: '#111827',
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0,
    minWidth: 0,
    paddingVertical: 0,
  },
  underlineInputRow: {
    alignItems: 'center',
    borderBottomColor: '#ff9568',
    borderBottomWidth: 1.5,
    flexDirection: 'row',
    gap: 16,
    marginTop: 34,
    minHeight: 50,
    paddingBottom: 10,
  },
});
