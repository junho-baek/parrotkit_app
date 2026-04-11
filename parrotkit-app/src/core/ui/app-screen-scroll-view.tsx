import { useFocusEffect } from 'expo-router';
import { PropsWithChildren, useCallback, useRef } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollViewProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APP_TOP_BAR_HEIGHT, APP_TOP_BAR_HIDE_RANGE } from '@/core/navigation/app-top-bar';
import { useAppChrome } from '@/core/navigation/app-chrome-provider';

type AppScreenScrollViewProps = PropsWithChildren<
  Omit<ScrollViewProps, 'contentContainerStyle' | 'onScroll'> & {
    bottomPadding?: number;
    contentContainerStyle?: StyleProp<ViewStyle>;
    topSpacing?: number;
  }
>;

export function AppScreenScrollView({
  children,
  bottomPadding = 176,
  contentContainerStyle,
  topSpacing = 8,
  ...props
}: AppScreenScrollViewProps) {
  const insets = useSafeAreaInsets();
  const { topBarProgress } = useAppChrome();
  const scrollOffsetRef = useRef(0);
  const topPadding =
    APP_TOP_BAR_HEIGHT +
    insets.top +
    (Platform.OS === 'ios' ? Math.max(0, topSpacing - 6) : Math.max(2, topSpacing - 2));

  useFocusEffect(
    useCallback(() => {
      topBarProgress.value = Math.min(
        APP_TOP_BAR_HIDE_RANGE,
        Math.max(0, scrollOffsetRef.current)
      );
    }, [topBarProgress])
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = Math.max(event.nativeEvent.contentOffset.y, 0);
      scrollOffsetRef.current = offsetY;
      topBarProgress.value = Math.min(APP_TOP_BAR_HIDE_RANGE, offsetY);
    },
    [topBarProgress]
  );

  return (
    <Animated.ScrollView
      {...props}
      automaticallyAdjustContentInsets={false}
      className="flex-1 bg-canvas"
      contentInsetAdjustmentBehavior="never"
      contentContainerStyle={[
        {
          paddingBottom: bottomPadding,
          paddingTop: topPadding,
        },
        contentContainerStyle,
      ]}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      scrollIndicatorInsets={{
        bottom: bottomPadding,
        top: topPadding,
      }}
    >
      {children}
    </Animated.ScrollView>
  );
}
