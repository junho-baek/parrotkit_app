import { FeaturePreviewScreen } from '@/core/ui/feature-preview-screen';
import { screenAccents } from '@/core/theme/colors';

export function RecipesScreen() {
  return (
    <FeaturePreviewScreen
      accentColor={screenAccents.recipes}
      panels={['Recipes', 'Scripts', 'Assets', 'Saved']}
      title="Recipes"
    />
  );
}
