import { FeaturePreviewScreen } from '@/core/ui/feature-preview-screen';
import { screenAccents } from '@/core/theme/colors';

export function RecipesScreen() {
  return (
    <FeaturePreviewScreen
      accentColor={screenAccents.recipes}
      description="A library tab that can later hold saved recipe assets, edit flows, and stack-pushed detail screens without reworking the shell."
      eyebrow="LIBRARY"
      footerBody="Recipes stays anchored as a list-heavy root destination, which fits native tabs better than overloading the bar with transient creation flows."
      footerTitle="Saved content belongs in the tab shell."
      highlights={[
        'Persistent destination for saved recipe and script assets',
        'Natural home for list-heavy content with nested detail pushes later',
        'Works cleanly with the new Paste drawer as a separate creation entry point',
      ]}
      title="Recipes"
    />
  );
}
