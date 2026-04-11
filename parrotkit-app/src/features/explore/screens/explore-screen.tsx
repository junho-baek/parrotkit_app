import { FeaturePreviewScreen } from '@/core/ui/feature-preview-screen';
import { screenAccents } from '@/core/theme/colors';

export function ExploreScreen() {
  return (
    <FeaturePreviewScreen
      accentColor={screenAccents.explore}
      panels={['Trends', 'Search', 'Creators', 'Saved']}
      title="Explore"
    />
  );
}
