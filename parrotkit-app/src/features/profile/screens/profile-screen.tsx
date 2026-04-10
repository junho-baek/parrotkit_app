import { FeaturePreviewScreen } from '@/core/ui/feature-preview-screen';
import { screenAccents } from '@/core/theme/colors';

export function ProfileScreen() {
  return (
    <FeaturePreviewScreen
      accentColor={screenAccents.profile}
      description="A personal tab for account, preferences, and usage state, wired into the same native shell as the rest of the app."
      eyebrow="PROFILE"
      footerBody="Settings and account management remain a destination tab, while capture starts from the action drawer so the nav model stays easy to scan."
      footerTitle="Profile is a true destination in the root nav."
      highlights={[
        'Straight path to settings, billing, and account surfaces',
        'Consistent native affordances without a custom JS tab bar',
        'Clear separation between persistent destinations and one-shot actions',
      ]}
      title="My"
    />
  );
}
