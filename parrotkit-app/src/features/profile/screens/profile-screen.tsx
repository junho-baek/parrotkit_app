import { FeaturePreviewScreen } from '@/core/ui/feature-preview-screen';
import { screenAccents } from '@/core/theme/colors';

export function ProfileScreen() {
  return (
    <FeaturePreviewScreen
      accentColor={screenAccents.profile}
      panels={['Account', 'Billing', 'Usage', 'Settings']}
      title="My"
    />
  );
}
