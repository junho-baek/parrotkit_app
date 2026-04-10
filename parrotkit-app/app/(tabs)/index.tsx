import { NativeTabScreen } from '../../src/components/native-tab-screen';

export default function HomeScreen() {
  return (
    <NativeTabScreen
      title="Parrotkit Home"
      eyebrow="HOME"
      description="A native-first home tab for quickly checking how the real platform tab bar feels on iOS and Android."
      accentColor="#ff9568"
      highlights={[
        'System tab bar selection and icon rendering',
        'Safe-area handling at the bottom edge',
        'Scrolling behavior with a native tab container',
      ]}
    />
  );
}
