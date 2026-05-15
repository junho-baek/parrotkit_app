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

import { useAppLanguage } from '@/core/i18n/app-language';
import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { brandActionGradient } from '@/core/theme/colors';
import { toImageSource } from '@/core/ui/image-source';
import {
  getInitialRecipeCreateMode,
  getRecipeCreateModeInputConfig,
  getRecipeCreateDraftContext,
  getRecipeCreatePrimaryAction,
  getRecipeCreateSubmitState,
  isRecipeCreateModePro,
  recipeCreateGoals,
  recipeCreateModes,
  recipeCreateNiches,
  type RecipeCreateGoalId,
  type RecipeCreateMode,
  type RecipeCreateNicheId,
} from '@/features/recipes/lib/recipe-create-flow';
import {
  buildLocalFallbackResult,
  mapGeneratedRecipeToMockScenes,
} from '@/features/recipes/lib/reference-recipe-generation';
import { recipeCreateCopy } from '@/features/recipes/screens/recipe-create/recipe-create-copy';
import { recipeCreateStyles as styles } from '@/features/recipes/screens/recipe-create/recipe-create-styles';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

type RecipeCreateScreenProps = {
  initialMode?: RecipeCreateMode;
  onClose?: () => void;
  onCreated?: (recipeId: string) => void;
};

export function RecipeCreateScreen({
  initialMode: initialModeOverride,
  onClose,
  onCreated,
}: RecipeCreateScreenProps = {}) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ mode?: string }>();
  const { language } = useAppLanguage();
  const { createRecipeDraft } = useMockWorkspace();
  const copy = recipeCreateCopy[language];
  const initialMode = initialModeOverride ?? getInitialRecipeCreateMode(params.mode);
  const [selectedMode, setSelectedMode] = useState<RecipeCreateMode>(initialMode);
  const [selectedNicheId, setSelectedNicheId] = useState<RecipeCreateNicheId>('beauty');
  const [selectedGoalId, setSelectedGoalId] = useState<RecipeCreateGoalId>('ad');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [customNicheLabel, setCustomNicheLabel] = useState('');
  const modeCopy = copy.mode as Record<RecipeCreateMode, { icon: IconName; tab: string }>;
  const submitState = getRecipeCreateSubmitState({
    mode: selectedMode,
    referenceUrl,
  });

  const dismissDrawer = () => {
    if (onClose) {
      onClose();
      return;
    }

    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/' as Href);
  };

  const handlePrimaryAction = () => {
    if (!submitState.enabled) {
      return;
    }

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
    const referenceResult =
      selectedMode === 'reference'
        ? buildLocalFallbackResult({
            goalId: selectedGoalId,
            nicheId: selectedNicheId,
            referenceUrl,
          })
        : null;
    const recipe = createRecipeDraft({
      ...draft,
      ...(referenceResult
        ? {
            referenceVideoSource: referenceResult.reference.url,
            scenes: mapGeneratedRecipeToMockScenes(referenceResult),
            summary: referenceResult.recipe.oneLineDescription,
            thumbnail: referenceResult.reference.thumbnailUrl,
            title: referenceResult.recipe.title,
          }
        : null),
    });

    if (onCreated) {
      onCreated(recipe.id);
      return;
    }

    router.replace(`/recipe/${recipe.id}` as Href);
  };

  useEffect(() => {
    setSelectedMode(initialModeOverride ?? getInitialRecipeCreateMode(params.mode));
  }, [initialModeOverride, params.mode]);

  return (
    <View style={styles.overlay}>
      <Pressable
        accessibilityLabel={copy.close as string}
        onPress={dismissDrawer}
        style={StyleSheet.absoluteFillObject}
        testID="recipe-create-dismiss-backdrop"
      />

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
          <Pressable
            accessibilityLabel={copy.close as string}
            accessibilityRole="button"
            hitSlop={12}
            onPress={dismissDrawer}
            testID="recipe-create-close-button"
          >
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
            referenceLinkError={
              submitState.referenceLinkError ? (copy.invalidLink as string) : null
            }
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
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: !submitState.enabled }}
            disabled={!submitState.enabled}
            onPress={handlePrimaryAction}
            style={styles.primaryButtonPressable}
            testID="recipe-create-primary-action"
          >
            <LinearGradient
              colors={brandActionGradient}
              end={{ x: 1, y: 1 }}
              start={{ x: 0, y: 0 }}
              style={[styles.ctaButton, !submitState.enabled ? styles.ctaButtonDisabled : null]}
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
  referenceLinkError,
}: {
  brandPlaceholder: string;
  linkPlaceholder: string;
  mode: RecipeCreateMode;
  onChangeReferenceUrl: (value: string) => void;
  referenceUrl: string;
  referenceLinkError: string | null;
}) {
  if (mode === 'manual') {
    return <View style={styles.modeInputSpacer} />;
  }

  const iconName: IconName = mode === 'brand' ? 'briefcase-outline' : 'link-variant';
  const inputConfig = getRecipeCreateModeInputConfig({
    brandPlaceholder,
    linkPlaceholder,
    mode,
    referenceUrl,
  });

  if (!inputConfig.visible) {
    return <View style={styles.modeInputSpacer} />;
  }

  return (
    <View>
      <View
        style={[
          styles.underlineInputRow,
          referenceLinkError ? styles.underlineInputRowError : null,
        ]}
      >
        <MaterialCommunityIcons
          color={referenceLinkError ? '#e5484d' : '#64748b'}
          name={iconName}
          size={25}
        />
        <TextInput
          accessibilityHint={referenceLinkError ?? undefined}
          accessibilityLabel={inputConfig.placeholder}
          autoCapitalize="none"
          autoCorrect={false}
          editable={inputConfig.editable}
          inputMode={inputConfig.inputMode}
          keyboardType={inputConfig.keyboardType}
          onChangeText={onChangeReferenceUrl}
          placeholder={inputConfig.placeholder}
          placeholderTextColor="#9aa5b8"
          style={styles.underlineInput}
          testID={mode === 'reference' ? 'recipe-create-reference-link-input' : undefined}
          value={inputConfig.value}
        />
      </View>
      {referenceLinkError ? (
        <Text
          accessibilityRole="alert"
          style={styles.inputErrorText}
          testID="recipe-create-reference-link-error"
        >
          {referenceLinkError}
        </Text>
      ) : null}
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
