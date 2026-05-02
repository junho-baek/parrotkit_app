import { Href, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  useWindowDimensions,
  type GestureResponderEvent,
} from 'react-native';

import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { useNavigationChrome } from '@/core/navigation/navigation-chrome-context';
import { HomeWorkspaceSurface } from '@/features/home/components/home-workspace-surface';
import { QuickShootRecipeDraftPreview } from '@/features/recipes/components/quick-shoot-recipe-draft-preview';
import { QuickShootCameraSurface } from '@/features/recipes/screens/quick-shoot-camera-surface';
import type { PrompterBlock } from '@/features/recipes/types/recipe-domain';

type PagerPage = 'recipe' | 'quick' | 'home';

const PAGE_INDEX: Record<PagerPage, number> = {
  recipe: 0,
  quick: 1,
  home: 2,
};

const QUICK_CAMERA_EXPOSURE_THRESHOLD = 0.7;

export function HomeQuickShootPagerScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { createQuickShootRecipe } = useMockWorkspace();
  const { setHomeQuickShootChromeHidden } = useNavigationChrome();
  const [activePage, setActivePage] = useState<PagerPage>('home');
  const [pagerGestureActive, setPagerGestureActive] = useState(false);
  const [quickCameraWarm, setQuickCameraWarm] = useState(false);
  const [prompterInteractionActive, setPrompterInteractionActive] = useState(false);
  const [quickBlocksSnapshot, setQuickBlocksSnapshot] = useState<PrompterBlock[]>([]);
  const quickBlocksRef = useRef<PrompterBlock[]>([]);
  const translateX = useRef(new Animated.Value(0)).current;
  const dragStartRef = useRef({ x: 0, y: 0, offset: 0 });
  const initialOffsetAppliedRef = useRef(false);
  const swipeTriggeredRef = useRef(false);

  const pageOffset = useCallback((page: PagerPage) => -PAGE_INDEX[page] * width, [width]);

  const updateQuickCameraWarm = useCallback((nextOffset: number, nextPage: PagerPage = activePage) => {
    if (width <= 0) return;

    const quickOffset = pageOffset('quick');
    const quickExposure = Math.max(0, Math.min(1, 1 - Math.abs(nextOffset - quickOffset) / width));
    const shouldWarm = nextPage === 'quick' || quickExposure >= QUICK_CAMERA_EXPOSURE_THRESHOLD;

    setQuickCameraWarm((current) => (current === shouldWarm ? current : shouldWarm));
  }, [activePage, pageOffset, width]);

  if (width > 0 && !initialOffsetAppliedRef.current) {
    const initialOffset = pageOffset('home');

    translateX.setValue(initialOffset);
    dragStartRef.current.offset = initialOffset;
    initialOffsetAppliedRef.current = true;
  }

  useEffect(() => {
    if (width <= 0 || !initialOffsetAppliedRef.current) return;

    const offset = pageOffset(activePage);

    translateX.setValue(offset);
    dragStartRef.current.offset = offset;
    updateQuickCameraWarm(offset, activePage);
  }, [activePage, pageOffset, translateX, updateQuickCameraWarm, width]);

  useEffect(() => {
    const chromeHidden = activePage !== 'home' || pagerGestureActive || quickCameraWarm;

    setHomeQuickShootChromeHidden(chromeHidden);

    return () => setHomeQuickShootChromeHidden(false);
  }, [activePage, pagerGestureActive, quickCameraWarm, setHomeQuickShootChromeHidden]);

  const settleToPage = useCallback((page: PagerPage, afterSettle?: () => void) => {
    const targetOffset = pageOffset(page);

    swipeTriggeredRef.current = true;

    Animated.timing(translateX, {
      duration: 210,
      easing: Easing.out(Easing.cubic),
      toValue: targetOffset,
      useNativeDriver: true,
    }).start(({ finished }) => {
      swipeTriggeredRef.current = false;
      setPagerGestureActive(false);

      if (!finished) return;

      setActivePage(page);
      updateQuickCameraWarm(targetOffset, page);
      dragStartRef.current.offset = targetOffset;
      afterSettle?.();
    });
  }, [pageOffset, translateX, updateQuickCameraWarm]);

  const createRecipeFromQuickShoot = useCallback(() => {
    const recipe = createQuickShootRecipe({
      blocks: quickBlocksRef.current,
      title: 'Quick Shoot Recipe',
    });

    router.push(`/recipe/${recipe.id}` as Href);
  }, [createQuickShootRecipe, router]);

  const openQuickShootRoute = useCallback(() => {
    const homeOffset = pageOffset('home');

    setActivePage('home');
    setPagerGestureActive(false);
    setQuickCameraWarm(false);
    setPrompterInteractionActive(false);
    translateX.setValue(homeOffset);
    dragStartRef.current.offset = homeOffset;
    router.push('/quick-shoot' as Href);
  }, [pageOffset, router, translateX]);

  const getDragState = useCallback((event: GestureResponderEvent) => {
    const start = dragStartRef.current;
    const dx = event.nativeEvent.pageX - start.x;
    const dy = event.nativeEvent.pageY - start.y;
    const horizontalIntent = Math.abs(dx) > 24 && Math.abs(dx) > Math.abs(dy) * 1.35;

    return { dx, horizontalIntent };
  }, []);

  const handleTouchStart = useCallback((event: GestureResponderEvent) => {
    const { pageX, pageY } = event.nativeEvent;

    swipeTriggeredRef.current = false;
    translateX.stopAnimation((currentOffset) => {
      dragStartRef.current = {
        x: pageX,
        y: pageY,
        offset: currentOffset,
      };
    });
  }, [translateX]);

  const handleTouchMove = useCallback((event: GestureResponderEvent) => {
    if (swipeTriggeredRef.current || prompterInteractionActive) return;

    const { dx, horizontalIntent } = getDragState(event);

    if (!horizontalIntent) return;

    setPagerGestureActive(true);

    const minOffset = pageOffset('home');
    const maxOffset = pageOffset('recipe');
    const nextOffset = Math.max(minOffset, Math.min(maxOffset, dragStartRef.current.offset + dx));

    translateX.setValue(nextOffset);
    updateQuickCameraWarm(nextOffset);
  }, [getDragState, pageOffset, prompterInteractionActive, translateX, updateQuickCameraWarm]);

  const handleTouchEnd = useCallback((event: GestureResponderEvent) => {
    if (swipeTriggeredRef.current) return;

    const { dx, horizontalIntent } = getDragState(event);
    const threshold = Math.min(150, width * 0.32);

    if (!horizontalIntent || Math.abs(dx) < threshold || prompterInteractionActive) {
      settleToPage(activePage);
      return;
    }

    if (activePage === 'home' && dx > 0) {
      settleToPage('quick', openQuickShootRoute);
      return;
    }

    if (activePage === 'quick' && dx < 0) {
      settleToPage('home');
      return;
    }

    if (activePage === 'quick' && dx > 0) {
      settleToPage('recipe', createRecipeFromQuickShoot);
      return;
    }

    if (activePage === 'recipe' && dx < 0) {
      settleToPage('quick');
      return;
    }

    settleToPage(activePage);
  }, [
    activePage,
    createRecipeFromQuickShoot,
    getDragState,
    openQuickShootRoute,
    prompterInteractionActive,
    settleToPage,
    width,
  ]);

  const handleTouchCancel = useCallback(() => {
    settleToPage(activePage);
  }, [activePage, settleToPage]);

  const handleQuickBlocksChange = useCallback((blocks: PrompterBlock[]) => {
    quickBlocksRef.current = blocks;
    setQuickBlocksSnapshot(blocks);
  }, []);

  if (width <= 0) {
    return <View style={styles.root} />;
  }

  return (
    <View
      style={styles.root}
      onTouchCancel={handleTouchCancel}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}
    >
      <Animated.View
        style={[
          styles.track,
          {
            width: width * 3,
            transform: [{ translateX }],
          },
        ]}
      >
        <View style={[styles.page, { width }]}>
          <QuickShootRecipeDraftPreview blocks={quickBlocksSnapshot} />
        </View>
        <View style={[styles.page, { width }]}>
          <QuickShootCameraSurface
            cameraActive={quickCameraWarm || activePage === 'quick'}
            onBlocksChange={handleQuickBlocksChange}
            onExitHome={() => settleToPage('home')}
            onPrompterInteractionChange={setPrompterInteractionActive}
          />
        </View>
        <View style={[styles.page, { width }]}>
          <HomeWorkspaceSurface />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#ffffff',
    flex: 1,
    overflow: 'hidden',
  },
  track: {
    flex: 1,
    flexDirection: 'row',
  },
  page: {
    flex: 1,
  },
});
