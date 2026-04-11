import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, useRouter } from 'expo-router';
import { useState } from 'react';
import {
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

import { rotatingPlatforms } from '@/core/mocks/parrotkit-data';
import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { brandActionGradient, brandActionShadow } from '@/core/theme/colors';
import { RotatingWord } from '@/core/ui/rotating-word';

const titlePlaceholder = 'e.g., Korean Diet Viral Hook...';
const urlPlaceholder = 'https://www.tiktok.com/@username/video/...';
const nichePlaceholder = 'e.g., Cooking, Fitness...';
const goalPlaceholder = 'e.g., Better hook pacing...';
const notesPlaceholder = 'Anything specific to preserve or improve...';

export function SourceActionSheetScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { createRecipeDraft } = useMockWorkspace();

  const [recipeTitle, setRecipeTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [niche, setNiche] = useState('');
  const [goal, setGoal] = useState('');
  const [notes, setNotes] = useState('');
  const [showContext, setShowContext] = useState(true);
  const [titleError, setTitleError] = useState('');
  const [urlError, setUrlError] = useState('');

  const handleSubmit = () => {
    let hasError = false;

    if (!recipeTitle.trim()) {
      setTitleError('Please enter a recipe title.');
      hasError = true;
    }

    if (!videoUrl.trim()) {
      setUrlError('Please paste a video URL.');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const recipe = createRecipeDraft({
      goal,
      niche,
      notes,
      title: recipeTitle,
      videoUrl,
    });

    router.replace(`/recipe/${recipe.id}` as Href);
  };

  return (
    <View className="flex-1 bg-black/30">
      <Pressable className="flex-1" onPress={() => router.back()} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="items-center bg-transparent">
          <View
            className="w-full overflow-hidden rounded-t-[32px] border border-b-0 border-white/80 bg-white px-4 pt-4"
            style={[styles.sheet, { maxHeight: '92%' }]}
          >
            <LinearGradient
              colors={['rgba(213,232,255,0.74)', 'rgba(238,228,255,0.46)', 'rgba(255,255,255,0)']}
              end={{ x: 0.5, y: 1 }}
              pointerEvents="none"
              start={{ x: 0.5, y: 0 }}
              style={styles.topGlow}
            />
            <LinearGradient
              colors={['rgba(255,255,255,0)', 'rgba(226,232,240,0.95)', 'rgba(255,255,255,0)']}
              end={{ x: 1, y: 0 }}
              pointerEvents="none"
              start={{ x: 0, y: 0 }}
              style={styles.topRule}
            />

            <View className="relative z-10 items-center pb-3">
              <View className="h-1.5 w-12 rounded-full bg-slate-300/80" />
            </View>

            <ScrollView
              className="relative z-10"
              contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 16) }]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View className="gap-4 px-1 pb-1 pt-2">
                <View className="items-center gap-1.5">
                  <View className="flex-row flex-wrap items-center justify-center">
                    <Text style={styles.headline} className="text-slate-950">
                      Paste a viral{' '}
                    </Text>
                    <RotatingWord
                      reserveSpace={false}
                      textStyle={styles.headline}
                      words={[
                        { color: '#8b5cf6', label: rotatingPlatforms[0] },
                        { color: '#ff6b6b', label: rotatingPlatforms[1] },
                        { color: '#ef4444', label: rotatingPlatforms[2] },
                      ]}
                    />
                    <Text style={styles.headline} className="text-slate-950">
                      {' '}link,
                    </Text>
                  </View>

                  <Text style={styles.headline} className="text-center text-slate-950">
                    then turn it into your own content recipe🦜.
                  </Text>
                </View>

                <View className="gap-3.5">
                  <FormField
                    error={titleError}
                    label="Recipe Title *"
                    onChangeText={(value) => {
                      if (titleError) {
                        setTitleError('');
                      }
                      setRecipeTitle(value);
                    }}
                    placeholder={titlePlaceholder}
                    value={recipeTitle}
                  />

                  <FormField
                    autoCapitalize="none"
                    autoCorrect={false}
                    error={urlError}
                    inputMode="url"
                    keyboardType="url"
                    label="Video URL *"
                    onChangeText={(value) => {
                      if (urlError) {
                        setUrlError('');
                      }
                      setVideoUrl(value);
                    }}
                    placeholder={urlPlaceholder}
                    value={videoUrl}
                  />

                  <View className="overflow-hidden rounded-[22px] border border-slate-200/85 bg-slate-50/75">
                    <Pressable
                      className="flex-row items-center justify-between gap-3 px-4 py-3"
                      onPress={() => setShowContext((current) => !current)}
                    >
                      <Text className="text-sm font-semibold text-slate-700">Your Context</Text>
                      <MaterialCommunityIcons color="#64748b" name={showContext ? 'chevron-up' : 'chevron-down'} size={18} />
                    </Pressable>

                    {showContext ? (
                      <View className="gap-3 px-4 pb-4 pt-1">
                        <View className="flex-row gap-3">
                          <View className="flex-1">
                            <FormField
                              label="Niche"
                              onChangeText={setNiche}
                              placeholder={nichePlaceholder}
                              value={niche}
                            />
                          </View>

                          <View className="flex-1">
                            <FormField
                              label="Goal"
                              onChangeText={setGoal}
                              placeholder={goalPlaceholder}
                              value={goal}
                            />
                          </View>
                        </View>

                        <View className="gap-1">
                          <Text className="text-[13px] font-semibold text-slate-900">Notes</Text>
                          <TextInput
                            multiline
                            className="min-h-[84px] rounded-2xl border border-slate-200/90 bg-white px-4 py-3 text-[15px] font-medium text-slate-900"
                            onChangeText={setNotes}
                            placeholder={notesPlaceholder}
                            placeholderTextColor="#94a3b8"
                            style={styles.textArea}
                            textAlignVertical="top"
                            value={notes}
                          />
                        </View>

                        <View className="gap-1">
                          <View className="flex-row items-center justify-between gap-3">
                            <Text className="text-[13px] font-semibold text-slate-900">Brand Context PDF</Text>
                            <Text className="text-[11px] font-semibold text-slate-400">Optional</Text>
                          </View>

                          <Pressable className="flex-row items-center justify-between gap-3 rounded-2xl border border-dashed border-slate-300 bg-white/90 px-4 py-3">
                            <View className="min-w-0 flex-1 flex-row items-center gap-3">
                              <View className="h-10 w-10 items-center justify-center rounded-2xl bg-slate-100">
                                <MaterialCommunityIcons color="#475569" name="file-document-outline" size={18} />
                              </View>

                              <View className="min-w-0 flex-1">
                                <Text className="text-sm font-semibold text-slate-900" numberOfLines={1}>
                                  Upload guideline PDF, brief, or product sheet
                                </Text>
                                <Text className="text-xs text-slate-500" numberOfLines={1}>
                                  Optional brand context used to shape cut-by-cut recommendations.
                                </Text>
                              </View>
                            </View>

                            <Text className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                              Add PDF
                            </Text>
                          </Pressable>
                        </View>
                      </View>
                    ) : null}
                  </View>

                  <Pressable onPress={handleSubmit}>
                    <LinearGradient colors={brandActionGradient} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={styles.cta}>
                      <View className="flex-row items-center justify-center gap-2 rounded-2xl px-5 py-3">
                        <Text className="text-[15px] font-semibold text-white">Analyze Video</Text>
                        <MaterialCommunityIcons color="#fffdf8" name="arrow-right" size={18} />
                      </View>
                    </LinearGradient>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

type FormFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  error?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  keyboardType?: 'default' | 'url';
  inputMode?: 'text' | 'url';
};

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  autoCapitalize = 'sentences',
  autoCorrect = true,
  keyboardType = 'default',
  inputMode = 'text',
}: FormFieldProps) {
  return (
    <View className="gap-1">
      <Text className="text-[13px] font-semibold text-slate-900">{label}</Text>
      <TextInput
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        className="rounded-2xl border border-slate-200/90 bg-white px-4 py-3 text-[15px] font-medium text-slate-900"
        inputMode={inputMode}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        style={styles.input}
        value={value}
      />
      <Text className="min-h-[18px] text-[13px] text-rose-600">{error ?? ''}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cta: {
    borderRadius: 18,
    shadowColor: brandActionShadow,
    shadowOpacity: 0.22,
    shadowRadius: 30,
    shadowOffset: {
      width: 0,
      height: 14,
    },
  },
  headline: {
    fontSize: 25,
    fontWeight: '800',
    letterSpacing: -1.1,
    lineHeight: 25.5,
  },
  input: {
    shadowColor: '#0f172a',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },
  platformWordSky: {
    color: '#8b5cf6',
  },
  scrollContent: {
    paddingBottom: 4,
  },
  sheet: {
    alignSelf: 'center',
    maxWidth: 500,
    shadowColor: '#0f172a',
    shadowOpacity: 0.14,
    shadowRadius: 44,
    shadowOffset: {
      width: 0,
      height: -18,
    },
  },
  textArea: {
    shadowColor: '#0f172a',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },
  topGlow: {
    height: 192,
    left: -12,
    position: 'absolute',
    right: -12,
    top: 0,
  },
  topRule: {
    height: 1,
    left: 16,
    position: 'absolute',
    right: 16,
    top: 0,
  },
});
