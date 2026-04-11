import { FeaturePreviewScreen } from '@/core/ui/feature-preview-screen';
import { screenAccents } from '@/core/theme/colors';

export function HomeScreen() {
  return (
    <FeaturePreviewScreen
      accentColor={screenAccents.home}
      panels={['Activity', 'Creators', 'Recents', 'Queue']}
      title="Parrotkit Home"
    />
  );
}
