import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type GestureResponderHandlers,
  View,
} from 'react-native';

import type { AppLanguage } from '@/core/i18n/app-language';
import { brandActionGradient } from '@/core/theme/colors';
import {
  getShootBoardCutCompletionState,
  type ShootBoardCut,
  type ShootBoardCutTextPatch,
} from '@/features/recipes/lib/shoot-board-model';

export function ShootBoardSceneCard({
  cut,
  dragHandleProps,
  expanded,
  language,
  onPreview,
  onReset,
  onResult,
  onShoot,
  onToggleExpanded,
  onToggleRequiredCheck,
  onToggleSceneComplete,
  onUpdateText,
  reorderMode,
}: {
  cut: ShootBoardCut;
  dragHandleProps: GestureResponderHandlers;
  expanded: boolean;
  language: AppLanguage;
  onPreview: () => void;
  onReset: () => void;
  onResult: () => void;
  onShoot: () => void;
  onToggleExpanded: () => void;
  onToggleRequiredCheck: (checklistItemId: string, checked: boolean) => void;
  onToggleSceneComplete: (complete: boolean) => void;
  onUpdateText: (patch: ShootBoardCutTextPatch) => void;
  reorderMode: boolean;
}) {
  const completionState = getShootBoardCutCompletionState(cut);
  const accent = getRoleAccent(cut.role);
  return (
    <View style={[styles.card, { borderColor: getTakeStatusBorderColor(cut.takeStatus) }, cut.takeStatus === 'final' && styles.finalCard]}>
      <View className="flex-row items-start gap-2">
        <Pressable
          accessibilityLabel={language === 'ko' ? '드래그 핸들' : 'Drag handle'}
          accessibilityRole="button"
          style={styles.dragHandle}
          {...dragHandleProps}
        >
          <MaterialCommunityIcons color={reorderMode ? accent.main : '#94a3b8'} name="drag-vertical" size={22} />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          className="mt-0.5 h-8 w-8 items-center justify-center rounded-full"
          onPress={onToggleExpanded}
        >
          <MaterialCommunityIcons color="#111827" name={expanded ? 'chevron-down' : 'chevron-right'} size={22} />
        </Pressable>

        <Pressable accessibilityRole="button" className="min-w-0 flex-1" onPress={onToggleExpanded}>
          <View className="flex-row flex-wrap items-center gap-1.5">
            <Text className="text-[14px] font-black text-ink">
              {language === 'ko' ? cut.titleKo : cut.title}
            </Text>
            <Text className="text-[13px] font-black text-muted">·</Text>
            <Text className="text-[13px] font-black text-muted">{formatCutDuration(language, cut.durationSeconds)}</Text>
          </View>
          <Text className="mt-1 text-[13px] font-semibold leading-5 text-ink" numberOfLines={expanded ? 3 : 1}>
            {language === 'ko' ? cut.instructionKo ?? cut.instruction : cut.instruction}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: completionState === 'complete' }}
          onPress={() => onToggleSceneComplete(completionState !== 'complete')}
          style={[
            styles.completionCircle,
            completionState === 'complete' && { backgroundColor: accent.main, borderColor: accent.main },
            completionState === 'partial' && { borderColor: accent.main },
          ]}
        >
          {completionState === 'complete' ? <MaterialCommunityIcons color="#fff" name="check" size={16} /> : null}
          {completionState === 'partial' ? <View style={[styles.partialDash, { backgroundColor: accent.main }]} /> : null}
        </Pressable>
      </View>

      {expanded ? (
        <View style={styles.expandedBody}>
          <View className="flex-row items-center justify-between gap-3">
            <Text className="text-[12px] font-black uppercase tracking-[1.6px] text-muted">
              {language === 'ko' ? '텍스트 수정' : 'Edit text'}
            </Text>
            <Pressable
              accessibilityRole="button"
              className="flex-row items-center gap-1 rounded-full border border-stroke bg-white px-3 py-1.5"
              onPress={onReset}
            >
              <MaterialCommunityIcons color="#64748b" name="restore" size={14} />
              <Text className="text-[11px] font-black text-muted">
                {language === 'ko' ? '원래대로' : 'Reset'}
              </Text>
            </Pressable>
          </View>

          <DetailInput
            title={language === 'ko' ? '장면 지시' : 'Instruction'}
            value={language === 'ko' ? cut.instructionKo : cut.instruction}
            onChangeText={(value) => onUpdateText(language === 'ko' ? { instructionKo: value } : { instruction: value })}
          />
          <DetailInput
            title="Line to say"
            value={getLineToSay(language, cut)}
            onChangeText={(value) => onUpdateText(language === 'ko' ? { speakingLineKo: value } : { speakingLine: value })}
          />
          <DetailInput
            title={language === 'ko' ? '촬영 가이드' : 'Shooting guideline'}
            value={language === 'ko' ? cut.shootingGuidelineKo : cut.shootingGuideline}
            onChangeText={(value) => onUpdateText(language === 'ko' ? { shootingGuidelineKo: value } : { shootingGuideline: value })}
          />

          <View className="gap-2">
            <Text className="text-[12px] font-black text-ink">{language === 'ko' ? '필수 체크' : 'Required checklist'}</Text>
            {cut.requiredChecklist.map((item) => (
              <View className="flex-row items-center gap-2" key={item.id}>
                <Pressable
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: item.checked }}
                  onPress={() => onToggleRequiredCheck(item.id, !item.checked)}
                  style={[styles.checkBox, item.checked && { backgroundColor: accent.main, borderColor: accent.main }]}
                >
                  {item.checked ? <MaterialCommunityIcons color="#fff" name="check" size={13} /> : null}
                </Pressable>
                <TextInput
                  multiline
                  onChangeText={(value) => onUpdateText({
                    requiredChecklist: [
                      language === 'ko'
                        ? { id: item.id, labelKo: value }
                        : { id: item.id, label: value },
                    ],
                  })}
                  style={styles.inlineInput}
                  value={language === 'ko' ? item.labelKo : item.label}
                />
              </View>
            ))}
          </View>

          <View className="flex-row items-center gap-2">
            <Pressable
              accessibilityRole="button"
              className="flex-1 flex-row items-center justify-center gap-2 rounded-[12px] border border-stroke bg-white px-3 py-3"
              onPress={onPreview}
            >
              <MaterialCommunityIcons color="#111827" name="play-outline" size={17} />
              <Text className="text-[13px] font-black text-ink">Example</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              className="flex-1 flex-row items-center justify-center gap-2 rounded-[12px] border border-stroke bg-white px-3 py-3"
              onPress={onResult}
            >
              <MaterialCommunityIcons color="#111827" name="check-decagram-outline" size={16} />
              <Text className="text-[13px] font-black text-ink">Result</Text>
            </Pressable>
            <Pressable accessibilityRole="button" className="flex-1 overflow-hidden rounded-[12px]" onPress={onShoot}>
              <LinearGradient colors={brandActionGradient} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={styles.shootButton}>
                <MaterialCommunityIcons color="#fff" name="video-outline" size={17} />
                <Text className="text-[13px] font-black text-white">Shoot</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}

function DetailInput({
  onChangeText,
  title,
  value,
}: {
  onChangeText: (value: string) => void;
  title: string;
  value: string;
}) {
  return (
    <View className="gap-1.5">
      <Text className="text-[12px] font-black text-ink">{title}</Text>
      <TextInput
        multiline
        onChangeText={onChangeText}
        style={styles.detailInput}
        value={value}
      />
    </View>
  );
}

function formatCutDuration(language: AppLanguage, durationSeconds: number) {
  return language === 'ko' ? `${durationSeconds}초` : `${durationSeconds}s`;
}

function getLineToSay(language: AppLanguage, cut: ShootBoardCut) {
  if (language === 'ko') {
    return cut.speakingLineKo ?? cut.prompterLine ?? cut.speakingLine;
  }

  return cut.speakingLine;
}

function getTakeStatusBorderColor(status: ShootBoardCut['takeStatus']) {
  if (status === 'final') return '#8b5cf6';
  if (status === 'saved') return '#c4b5fd';
  if (status === 'needs_reshoot') return '#fb7185';
  return '#e2e8f0';
}

function getRoleAccent(role: ShootBoardCut['role']) {
  if (role === 'proof') return { main: '#f97316' };
  if (role === 'cta') return { main: '#8b5cf6' };
  if (role === 'scene') return { main: '#6366f1' };
  if (role === 'custom') return { main: '#64748b' };
  return { main: '#ff4f73' };
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.035,
    shadowRadius: 14,
  },
  checkBox: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#cbd5e1',
    borderRadius: 5,
    borderWidth: 1.3,
    height: 18,
    justifyContent: 'center',
    width: 18,
  },
  completionCircle: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#94a3b8',
    borderRadius: 999,
    borderWidth: 1.5,
    height: 26,
    justifyContent: 'center',
    marginTop: 4,
    width: 26,
  },
  dragHandle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -5,
    marginTop: 3,
    width: 17,
  },
  expandedBody: {
    borderTopColor: '#e2e8f0',
    borderTopWidth: 1,
    gap: 14,
    marginLeft: 41,
    marginTop: 12,
    paddingTop: 13,
  },
  detailInput: {
    borderBottomColor: '#e2e8f0',
    borderBottomWidth: 1,
    color: '#111827',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 20,
    minHeight: 30,
    paddingBottom: 7,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  finalCard: {
    shadowOpacity: 0.08,
  },
  inlineInput: {
    borderBottomColor: '#e2e8f0',
    borderBottomWidth: 1,
    color: '#111827',
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 20,
    minHeight: 26,
    paddingBottom: 5,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  partialDash: {
    borderRadius: 999,
    height: 3,
    width: 12,
  },
  shootButton: {
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    minHeight: 42,
    paddingHorizontal: 10,
  },
});
