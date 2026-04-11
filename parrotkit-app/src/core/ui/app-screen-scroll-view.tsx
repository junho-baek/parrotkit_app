import { PropsWithChildren } from 'react';
import { ScrollViewProps, StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedScrollHandler } from 'react-native-reanimated';
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
  const { topBarLastScrollY, topBarProgress } = useAppChrome();

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      const offsetY = Math.max(event.contentOffset.y, 0);
      const delta = offsetY - topBarLastScrollY.value;
      const nextProgress = Math.min(
        APP_TOP_BAR_HIDE_RANGE,
        Math.max(0, topBarProgress.value + delta)
      );

      topBarLastScrollY.value = offsetY;
      topBarProgress.value = offsetY <= 0 ? 0 : nextProgress;
    },
  });

  return (
    <Animated.ScrollView
      {...props}
      className="flex-1 bg-canvas"
      contentContainerStyle={[
        {
          paddingBottom: bottomPadding,
          paddingTop: insets.top + APP_TOP_BAR_HEIGHT + topSpacing,
        },
        contentContainerStyle,
      ]}
      onScroll={onScroll}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </Animated.ScrollView>
  );
}
