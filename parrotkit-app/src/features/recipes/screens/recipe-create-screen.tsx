import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { ComponentProps, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppLanguage, type AppLanguage } from '@/core/i18n/app-language';
import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { brandActionGradient } from '@/core/theme/colors';
import {
  getInitialRecipeCreateMode,
  getRecipeCreatePrimaryAction,
  isRecipeCreateModePro,
  recipeCreateModes,
  type RecipeCreateMode,
} from '@/features/recipes/lib/recipe-create-flow';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

const createCopy = {
  en: {
    title: 'Start a new recipe',
    subtitle: 'Open the shoot board first, then add scenes as you build.',
    close: 'Close',
    blankTitle: 'New shooting recipe',
    blankNotes: 'Started from the recipe shoot board.',
    pro: 'Pro',
    cta: {
      reference: 'Open reference workflow',
      manual: 'Start in shoot board',
      brand: 'Add brand context',
    },
    mode: {
      manual: {
        icon: 'plus-box-outline' as IconName,
        tab: 'Blank',
        title: 'Start new recipe',
        body: 'Create directly inside the recipe execution board.',
      },
      reference: {
        icon: 'link-variant' as IconName,
        tab: 'Link',
        title: 'Reference link',
        body: 'Paste a short-form video or post and let ParrotKit draft the structure.',
      },
      brand: {
        icon: 'briefcase-upload-outline' as IconName,
        tab: 'Brand',
        title: 'Brand context',
        body: 'Bring in a brief, product sheet, or campaign guardrails.',
      },
    } satisfies Record<RecipeCreateMode, { body: string; icon: IconName; tab: string; title: string }>,
    fields: {
      referenceTitle: 'Reference URL',
      referencePlaceholder: 'TikTok, Reels, Shorts, or product page link',
      boardTitle: 'Recipe execution board',
      boardBody: 'Start with a draft workspace, then add scenes, lines, checks, and takes from one place.',
      brandTitle: 'Brand Context PDF',
      brandPlaceholder: 'Upload guideline PDF, brief, or product sheet',
      included: 'What this mode prepares',
    },
    chips: {
      manual: ['Add scenes', 'Shoot mode', 'Export'],
      reference: ['Shot breakdown', 'Script draft', 'Prompter'],
      brand: ['Must include', 'Avoid claims', 'Tone guide'],
    } satisfies Record<RecipeCreateMode, string[]>,
  },
  ko: {
    title: '새 레시피 시작',
    subtitle: '먼저 실행 보드를 열고, 필요한 씬을 바로 추가하세요.',
    close: '닫기',
    blankTitle: '새 촬영 레시피',
    blankNotes: '레시피 실행 보드에서 시작한 draft입니다.',
    pro: 'Pro',
    cta: {
      reference: '레퍼런스 워크플로 열기',
      manual: '촬영 보드에서 시작',
      brand: '브랜드 컨텍스트 추가',
    },
    mode: {
      manual: {
        icon: 'plus-box-outline' as IconName,
        tab: 'Blank',
        title: '새 레시피 시작',
        body: '레시피 실행 화면에서 씬을 추가하며 바로 만듭니다.',
      },
      reference: {
        icon: 'link-variant' as IconName,
        tab: '링크',
        title: '레퍼런스 링크',
        body: '숏폼 영상이나 게시물 링크를 붙여넣고 구조를 잡습니다.',
      },
      brand: {
        icon: 'briefcase-upload-outline' as IconName,
        tab: '브랜드',
        title: '브랜드 컨텍스트',
        body: '브리프, 제품 자료, 캠페인 가이드를 촬영 지시로 바꿉니다.',
      },
    } satisfies Record<RecipeCreateMode, { body: string; icon: IconName; tab: string; title: string }>,
    fields: {
      referenceTitle: '레퍼런스 URL',
      referencePlaceholder: 'TikTok, Reels, Shorts, 제품 페이지 링크',
      boardTitle: '레시피 실행 보드',
      boardBody: 'Draft 작업 공간에서 씬, 대사, 체크리스트, take를 한 번에 추가하세요.',
      brandTitle: '브랜드 컨텍스트 PDF',
      brandPlaceholder: '가이드 PDF, 브리프, 제품 자료 업로드',
      included: '이 모드에서 준비되는 것',
    },
    chips: {
      manual: ['씬 추가', '촬영 모드', '내보내기'],
      reference: ['컷 분석', '대사 초안', '프롬프터'],
      brand: ['필수 요소', '금지 표현', '톤 가이드'],
    } satisfies Record<RecipeCreateMode, string[]>,
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
  const modeCopy = copy.mode as Record<RecipeCreateMode, { body: string; icon: IconName; tab: string; title: string }>;
  const ctaCopy = copy.cta as Record<RecipeCreateMode, string>;

  const back = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/recipes' as Href);
  };

  const handlePrimaryAction = () => {
    const action = getRecipeCreatePrimaryAction(selectedMode);

    if (action === 'open-shoot-board') {
      const recipe = createRecipeDraft({
        notes: copy.blankNotes as string,
        title: copy.blankTitle as string,
      });

      router.replace(`/recipe/${recipe.id}` as Href);
      return;
    }

    router.replace('/source-actions' as Href);
  };

  useEffect(() => {
    setSelectedMode(getInitialRecipeCreateMode(params.mode));
  }, [params.mode]);

  return (
    <View style={styles.overlay}>
      <Pressable accessibilityLabel={copy.close as string} onPress={back} style={StyleSheet.absoluteFillObject} />

      <View
        style={[
          styles.sheet,
          {
            maxHeight: '92%',
            paddingBottom: Math.max(insets.bottom, 12),
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(213,232,255,0.78)', 'rgba(239,229,255,0.5)', 'rgba(255,255,255,0)']}
          end={{ x: 0.5, y: 1 }}
          pointerEvents="none"
          start={{ x: 0.5, y: 0 }}
          style={styles.topGlow}
        />

        <View style={styles.handle} />

        <View style={styles.header}>
          <Pressable accessibilityLabel={copy.close as string} accessibilityRole="button" onPress={back} style={styles.closeButton}>
            <MaterialCommunityIcons color="#111827" name="arrow-left" size={23} />
          </Pressable>
          <Text style={styles.headerTitle}>{copy.title as string}</Text>
          <Pressable accessibilityLabel={copy.close as string} accessibilityRole="button" onPress={back} style={styles.closeButton}>
            <MaterialCommunityIcons color="#111827" name="close" size={22} />
          </Pressable>
        </View>

        <Text style={styles.subtitle}>{copy.subtitle as string}</Text>

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

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ModeDetail copy={copy} mode={selectedMode} />
        </ScrollView>

        <View style={styles.footer}>
          <Pressable accessibilityRole="button" onPress={handlePrimaryAction} style={styles.primaryButtonPressable}>
            <LinearGradient
              colors={brandActionGradient}
              end={{ x: 1, y: 1 }}
              start={{ x: 0, y: 0 }}
              style={styles.ctaButton}
            >
              <Text style={styles.ctaText}>{ctaCopy[selectedMode]}</Text>
              <MaterialCommunityIcons color="#fff" name="arrow-right" size={21} />
            </LinearGradient>
          </Pressable>
        </View>
      </View>
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
  item: { body: string; icon: IconName; tab: string; title: string };
  mode: RecipeCreateMode;
  onPress: () => void;
  proLabel: string;
  selected: boolean;
}) {
  const pro = isRecipeCreateModePro(mode);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.modeTab, selected ? styles.modeTabActive : null]}
    >
      <View style={[styles.modeTabIcon, selected ? modeTabActiveTone(mode) : modeTabTone(mode)]}>
        <MaterialCommunityIcons color={modeColor(mode)} name={item.icon} size={22} />
      </View>
      <View style={styles.modeTabLabelRow}>
        <Text numberOfLines={1} style={[styles.modeTabText, selected ? styles.modeTabTextActive : null]}>
          {item.tab}
        </Text>
        {pro ? <ProBadge compact label={proLabel} /> : null}
      </View>
    </Pressable>
  );
}

function ModeDetail({
  copy,
  mode,
}: {
  copy: (typeof createCopy)['en'];
  mode: RecipeCreateMode;
}) {
  const modeCopy = copy.mode as Record<RecipeCreateMode, { body: string; icon: IconName; tab: string; title: string }>;
  const fields = copy.fields as Record<string, string>;
  const chips = copy.chips as Record<RecipeCreateMode, string[]>;
  const selected = modeCopy[mode];

  return (
    <View style={styles.detailPanel}>
      <View style={styles.detailHeader}>
        <View style={[styles.detailIcon, modeTabActiveTone(mode)]}>
          <MaterialCommunityIcons color={modeColor(mode)} name={selected.icon} size={27} />
        </View>
        <View style={styles.detailTitleBlock}>
          <View style={styles.detailTitleRow}>
            <Text style={styles.detailTitle}>{selected.title}</Text>
            {isRecipeCreateModePro(mode) ? <ProBadge label={copy.pro as string} /> : null}
          </View>
          <Text style={styles.detailBody}>{selected.body}</Text>
        </View>
      </View>

      {mode === 'manual' ? (
        <View style={styles.boardCard}>
          <View style={styles.boardIcon}>
            <MaterialCommunityIcons color="#8c67ff" name="view-dashboard-outline" size={23} />
          </View>
          <View style={styles.boardCopy}>
            <Text style={styles.boardTitle}>{fields.boardTitle}</Text>
            <Text style={styles.boardBody}>{fields.boardBody}</Text>
          </View>
        </View>
      ) : null}

      {mode === 'reference' ? (
        <View style={styles.modeFieldGroup}>
          <SimpleField label={fields.referenceTitle} value={fields.referencePlaceholder} />
        </View>
      ) : null}

      {mode === 'brand' ? (
        <View style={styles.modeFieldGroup}>
          <View style={styles.uploadBox}>
            <View style={styles.uploadIcon}>
              <MaterialCommunityIcons color="#64748b" name="file-document-outline" size={23} />
            </View>
            <View style={styles.uploadCopy}>
              <View style={styles.detailTitleRow}>
                <Text style={styles.uploadTitle}>{fields.brandTitle}</Text>
                <ProBadge label={copy.pro as string} />
              </View>
              <Text style={styles.uploadBody}>{fields.brandPlaceholder}</Text>
            </View>
            <MaterialCommunityIcons color="#111827" name="chevron-right" size={21} />
          </View>
        </View>
      ) : null}

      <IncludedChips chips={chips[mode]} label={fields.included} />
    </View>
  );
}

function SimpleField({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.simpleField}>
      <Text style={styles.simpleFieldLabel}>{label}</Text>
      <View style={styles.fieldBox}>
        <Text style={styles.fieldValue}>{value}</Text>
      </View>
    </View>
  );
}

function IncludedChips({ chips, label }: { chips: string[]; label: string }) {
  return (
    <View style={styles.chipGroup}>
      <Text style={styles.chipGroupLabel}>{label}</Text>
      <View style={styles.chipWrap}>
        {chips.map((chip) => (
          <View key={chip} style={styles.chip}>
            <MaterialCommunityIcons color="#8c67ff" name="check" size={14} />
            <Text style={styles.chipText}>{chip}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function ProBadge({ compact, label }: { compact?: boolean; label: string }) {
  return (
    <View style={[styles.proBadge, compact ? styles.proBadgeCompact : null]}>
      <Text style={[styles.proBadgeText, compact ? styles.proBadgeTextCompact : null]}>{label}</Text>
    </View>
  );
}

function modeColor(mode: RecipeCreateMode) {
  if (mode === 'reference') return '#14b8a6';
  if (mode === 'brand') return '#8c67ff';
  return '#ff7a59';
}

function modeTabTone(mode: RecipeCreateMode) {
  return {
    backgroundColor: mode === 'reference' ? '#e7fbf7' : mode === 'brand' ? '#f4f0ff' : '#fff1eb',
  };
}

function modeTabActiveTone(mode: RecipeCreateMode) {
  return {
    backgroundColor: mode === 'reference' ? '#dffaf4' : mode === 'brand' ? '#eee7ff' : '#ffece3',
  };
}

const styles = StyleSheet.create({
  boardBody: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 18,
    marginTop: 3,
  },
  boardCard: {
    alignItems: 'center',
    backgroundColor: '#fff7f1',
    borderColor: '#ffe0d0',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
    padding: 14,
  },
  boardCopy: {
    flex: 1,
    minWidth: 0,
  },
  boardIcon: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 17,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  boardTitle: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0,
  },
  chip: {
    alignItems: 'center',
    backgroundColor: '#f4f0ff',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  chipGroup: {
    gap: 10,
    marginTop: 18,
  },
  chipGroupLabel: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
  },
  chipText: {
    color: '#8c67ff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
    minHeight: 58,
  },
  ctaText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0,
  },
  detailBody: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 20,
    marginTop: 3,
  },
  detailHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 13,
  },
  detailIcon: {
    alignItems: 'center',
    borderRadius: 20,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  detailPanel: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
  },
  detailTitle: {
    color: '#111827',
    flexShrink: 1,
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 23,
  },
  detailTitleBlock: {
    flex: 1,
    minWidth: 0,
  },
  detailTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  fieldBox: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 14,
  },
  fieldValue: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 18,
  },
  footer: {
    borderTopColor: '#eef2f7',
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  handle: {
    alignSelf: 'center',
    backgroundColor: '#d7dde7',
    borderRadius: 999,
    height: 5,
    marginBottom: 17,
    marginTop: 18,
    width: 58,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
  },
  modeFieldGroup: {
    marginTop: 18,
  },
  modeTab: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    gap: 8,
    minHeight: 88,
    paddingHorizontal: 6,
    paddingVertical: 10,
  },
  modeTabActive: {
    backgroundColor: '#ffffff',
    borderColor: '#c7d2fe',
    shadowColor: '#0f172a',
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },
  modeTabIcon: {
    alignItems: 'center',
    borderRadius: 16,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  modeTabLabelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    justifyContent: 'center',
    minHeight: 18,
  },
  modeTabText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
  },
  modeTabTextActive: {
    color: '#111827',
  },
  modeTabs: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  overlay: {
    backgroundColor: 'rgba(15, 23, 42, 0.28)',
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
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  proBadgeCompact: {
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  proBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  proBadgeTextCompact: {
    fontSize: 8,
  },
  scrollContent: {
    paddingBottom: 16,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sheet: {
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    borderColor: 'rgba(255,255,255,0.9)',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1,
    maxWidth: 500,
    overflow: 'hidden',
    shadowColor: '#0f172a',
    shadowOffset: { height: -18, width: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 44,
    width: '100%',
  },
  simpleField: {
    gap: 8,
  },
  simpleFieldLabel: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
  },
  subtitle: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 20,
    paddingHorizontal: 38,
    paddingTop: 16,
    textAlign: 'center',
  },
  topGlow: {
    height: 174,
    left: -10,
    position: 'absolute',
    right: -10,
    top: 0,
  },
  uploadBody: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 18,
    marginTop: 3,
  },
  uploadBox: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderColor: '#dbe3ee',
    borderRadius: 18,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: 12,
    minHeight: 86,
    padding: 14,
  },
  uploadCopy: {
    flex: 1,
    minWidth: 0,
  },
  uploadIcon: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 17,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  uploadTitle: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0,
  },
});
