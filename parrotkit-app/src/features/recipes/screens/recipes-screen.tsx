import { FeaturePreviewScreen } from '@/core/ui/feature-preview-screen';
import { screenAccents } from '@/core/theme/colors';

export function RecipesScreen() {
  return (
    <FeaturePreviewScreen
      accentColor={screenAccents.recipes}
      description="A library tab that can later hold saved recipe assets, edit flows, and stack-pushed detail screens without reworking the shell."
      eyebrow="LIBRARY"
      footerBody="Recipes stays anchored as a list-heavy root destination, while Source handles import and creation entry points with its own sheet."
      footerTitle="Saved content belongs in the tab shell."
      highlights={[
        'Persistent destination for saved recipe and script assets',
        'Natural home for list-heavy content with nested detail pushes later',
        'Works cleanly with Source as a separate capture and import destination',
      ]}
      title="Recipes"
    />
  );
}
