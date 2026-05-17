import { Text, View } from "react-native";

import type { RecipeBreakdownSummary } from "@/features/recipes/lib/recipe-breakdown-summary";

export function RecipeBreakdownPanel({
  breakdown,
}: {
  breakdown: RecipeBreakdownSummary;
}) {
  return (
    <View style={{ gap: 22, paddingHorizontal: 20, paddingTop: 18 }}>
      {breakdown.analysisState ? (
        <AnalysisStateNote body={breakdown.analysisState.body} />
      ) : null}
      {breakdown.sections.map((section) => (
        <BreakdownSection
          body={section.body}
          key={section.id}
          title={section.title}
        />
      ))}
    </View>
  );
}

function AnalysisStateNote({ body }: { body: string }) {
  return (
    <Text
      style={{
        color: "#64748B",
        fontSize: 13,
        fontWeight: "700",
        letterSpacing: 0,
        lineHeight: 18,
      }}
    >
      {body}
    </Text>
  );
}

function BreakdownSection({ body, title }: { body: string; title: string }) {
  return (
    <View style={{ gap: 5 }}>
      <Text
        style={{
          color: "#111827",
          fontSize: 16,
          fontWeight: "900",
          letterSpacing: 0,
          lineHeight: 22,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          color: "#475569",
          fontSize: 14,
          fontWeight: "600",
          letterSpacing: 0,
          lineHeight: 21,
        }}
      >
        {body}
      </Text>
    </View>
  );
}
