import { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { NativeRecipeScene } from '@/features/recipes/types/recipe-domain';

export function SceneAnalysisPanel({ scene }: { scene: NativeRecipeScene }) {
  const transcriptLines = scene.analysis.transcriptOriginal?.length
    ? scene.analysis.transcriptOriginal
    : scene.analysis.transcriptSnippet
      ? [scene.analysis.transcriptSnippet]
      : [];
  const whyItWorks = scene.analysis.whyItWorks.filter(Boolean);

  return (
    <View className="gap-4">
      <Section title="Original Script">
        {transcriptLines.length ? transcriptLines.map((line, index) => (
          <LineCard key={`${scene.id}-script-${index}`} index={index + 1} text={line} />
        )) : <EmptyCard text="No original transcript was captured for this cut." />}
      </Section>

      <Section title="Motion View">
        <View className="rounded-[22px] border border-sky-100 bg-sky-50 px-4 py-4">
          <Text className="text-sm leading-6 text-ink">
            {scene.analysis.motionDescription || 'No motion-specific description was extracted for this cut.'}
          </Text>
        </View>
      </Section>

      <Section title="Why It Works">
        {whyItWorks.length ? whyItWorks.map((line, index) => (
          <LineCard key={`${scene.id}-why-${index}`} index={index + 1} text={line} />
        )) : <EmptyCard text="No reasoning notes were captured for this cut." />}
      </Section>
    </View>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="gap-2">
      <Text className="text-[12px] font-semibold uppercase tracking-[0.8px] text-muted">{title}</Text>
      <View className="gap-2">{children}</View>
    </View>
  );
}

function LineCard({ index, text }: { index: number; text: string }) {
  return (
    <View className="flex-row gap-3 rounded-[22px] border border-stroke bg-surface px-4 py-4">
      <View className="h-6 w-6 items-center justify-center rounded-full bg-slate-100">
        <Text className="text-xs font-black text-ink">{index}</Text>
      </View>
      <Text className="flex-1 text-sm leading-6 text-ink">{text}</Text>
    </View>
  );
}

function EmptyCard({ text }: { text: string }) {
  return (
    <View className="rounded-[22px] border border-dashed border-stroke bg-surface px-4 py-4">
      <Text className="text-sm leading-6 text-muted">{text}</Text>
    </View>
  );
}
