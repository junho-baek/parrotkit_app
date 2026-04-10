import { NativeTabScreen } from '../../src/components/native-tab-screen';

export default function MyScreen() {
  return (
    <NativeTabScreen
      title="My"
      eyebrow="PROFILE"
      description="A personal tab for account, preferences, and usage state, wired into the same native shell as the rest of the app."
      accentColor="#0f766e"
      highlights={[
        'Profile/account destination in the root nav',
        'Straight path to settings and subscription surfaces',
        'Native tab affordances without custom bar maintenance',
      ]}
    />
  );
}
