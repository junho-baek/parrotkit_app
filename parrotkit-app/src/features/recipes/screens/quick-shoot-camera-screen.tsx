import { Href, useRouter } from 'expo-router';
import { useCallback } from 'react';

import { QuickShootCameraSurface } from '@/features/recipes/screens/quick-shoot-camera-surface';

export function QuickShootCameraScreen() {
  const router = useRouter();

  const handleExitHome = useCallback(() => {
    router.replace('/(tabs)' as Href);
  }, [router]);

  return (
    <QuickShootCameraSurface
      cameraActive
      onExitHome={handleExitHome}
    />
  );
}
