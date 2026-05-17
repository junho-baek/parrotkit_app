import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, Tabs, usePathname, useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, type AccessibilityRole, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppLanguage } from '@/core/i18n/app-language';
import { AppTopBar } from '@/core/navigation/app-top-bar';
import {
  NavigationChromeProvider,
  useNavigationChrome,
} from '@/core/navigation/navigation-chrome-context';
import {
  getNextPasteDrawerState,
  initialPasteDrawerState,
} from '@/core/navigation/paste-drawer-state';
import {
  hiddenRootTabNames,
  rootTabAccessibilityRoles,
  rootTabHrefs,
  rootTabMinimumTouchTarget,
  type RootTabName,
  rootTabNames,
} from '@/core/navigation/root-tab-config';
import {
  getRootTabBarLayout,
  rootTabBarCenterActionDiameter,
  rootTabBarCenterActionFrameHeight,
  rootTabBarCenterActionTopOffset,
} from '@/core/navigation/root-tab-safe-area';
import {
  getRootTabIcon,
  getVisibleRootTabName,
} from '@/core/navigation/root-tab-icons';
import { brandActionGradient } from '@/core/theme/colors';
import { RecipeCreateScreen } from '@/features/recipes/screens/recipe-create-screen';

export function RootNativeTabs() {
  return (
    <NavigationChromeProvider>
      <RootTabsContent />
    </NavigationChromeProvider>
  );
}

function RootTabsContent() {
  const { homeQuickShootChromeHidden } = useNavigationChrome();
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { copy } = useAppLanguage();
  const [pasteDrawerState, setPasteDrawerState] = useState(initialPasteDrawerState);
  const screenOwnsTopBar = pathname === '/recipes' || pathname.startsWith('/recipes/');
  const hiddenChromeColor = 'transparent';
  const tabBarLayout = getRootTabBarLayout({
    bottomInset: insets.bottom,
    platform: Platform.OS,
  });
  const openPasteDrawer = () => {
    setPasteDrawerState((current) => getNextPasteDrawerState(current, 'open'));
  };
  const closePasteDrawer = () => {
    setPasteDrawerState((current) => getNextPasteDrawerState(current, 'dismiss'));
  };
  const handlePasteRecipeCreated = (recipeId: string) => {
    setPasteDrawerState((current) => getNextPasteDrawerState(current, 'created'));
    router.push(`/recipe/${recipeId}` as Href);
  };

  return (
    <View className="flex-1 bg-canvas">
      <Tabs
        screenOptions={({ route }) => {
          const visibleTabName = getVisibleRootTabName(route.name);

          return {
            headerShown: false,
            tabBarActiveTintColor: homeQuickShootChromeHidden ? hiddenChromeColor : '#ff9568',
            tabBarInactiveTintColor: homeQuickShootChromeHidden ? hiddenChromeColor : '#94a3b8',
            tabBarIcon: ({ color, focused, size }) => {
              if (!visibleTabName) {
                return null;
              }

              if (visibleTabName === 'paste') {
                const pasteActionActive = focused || pasteDrawerState.open;

                return (
                  <View
                    pointerEvents="none"
                    style={[
                      styles.pasteTabIconFrame,
                      homeQuickShootChromeHidden ? styles.pasteTabIconFrameHidden : null,
                    ]}
                  >
                    <View
                      style={[
                        styles.pasteTabButtonHalo,
                        pasteActionActive ? styles.pasteTabButtonHaloActive : null,
                        focused ? styles.pasteTabButtonHaloFocused : null,
                      ]}
                    >
                      <LinearGradient
                        colors={brandActionGradient}
                        end={{ x: 1, y: 1 }}
                        start={{ x: 0, y: 0 }}
                        style={[
                          styles.pasteTabButton,
                          pasteActionActive ? styles.pasteTabButtonActive : null,
                          focused ? styles.pasteTabButtonFocused : null,
                        ]}
                      >
                        <MaterialCommunityIcons
                          color="#ffffff"
                          name={getRootTabIcon(visibleTabName, pasteActionActive)}
                          size={30}
                        />
                      </LinearGradient>
                    </View>
                    <Text
                      style={[
                        styles.pasteTabLabel,
                        pasteActionActive ? styles.pasteTabLabelActive : null,
                        focused ? styles.pasteTabLabelFocused : null,
                      ]}
                    >
                      {getRootTabLabel(copy.nav, visibleTabName)}
                    </Text>
                  </View>
                );
              }

              return (
                <View
                  style={[
                    styles.regularTabIconFrame,
                    focused ? styles.regularTabIconFrameFocused : null,
                  ]}
                >
                  <MaterialCommunityIcons
                    color={color}
                    name={getRootTabIcon(visibleTabName, focused)}
                    size={Math.max(size, 22)}
                  />
                </View>
              );
            },
            tabBarItemStyle:
              visibleTabName === 'paste' ? styles.pasteTabItem : styles.regularTabItem,
            tabBarIconStyle:
              visibleTabName === 'paste' ? styles.pasteTabIconStyle : styles.regularTabIconStyle,
            tabBarButton: visibleTabName
              ? (props) =>
                  visibleTabName === 'paste' ? (
                    <RootTabButton
                      {...props}
                      active={pasteDrawerState.open}
                      label={getRootTabLabel(copy.nav, visibleTabName)}
                      onPress={openPasteDrawer}
                      role={rootTabAccessibilityRoles[visibleTabName]}
                    />
                  ) : (
                    <RootTabButton
                      {...props}
                      label={getRootTabLabel(copy.nav, visibleTabName)}
                      role={rootTabAccessibilityRoles[visibleTabName]}
                    />
                  )
              : undefined,
            tabBarLabel:
              visibleTabName && visibleTabName !== 'paste'
                ? ({ color, focused }) => (
                    <Text
                      style={[
                        styles.regularTabLabel,
                        { color },
                        focused ? styles.regularTabLabelFocused : null,
                      ]}
                    >
                      {getRootTabLabel(copy.nav, visibleTabName)}
                    </Text>
                  )
                : '',
            tabBarStyle: homeQuickShootChromeHidden
              ? styles.hiddenTabBar
              : [styles.tabBar, tabBarLayout],
          };
        }}
      >
        {rootTabNames.map((tabName) => (
          <Tabs.Screen
            key={tabName}
            name={tabName}
            options={{
              href: getRootTabScreenHref(tabName),
            }}
          />
        ))}
        {hiddenRootTabNames.map((tabName) => (
          <Tabs.Screen key={tabName} name={tabName} options={{ href: null }} />
        ))}
      </Tabs>

      {homeQuickShootChromeHidden ? null : (
        <>
          {screenOwnsTopBar ? null : (
            <View pointerEvents="box-none" style={styles.topChromeLayer}>
              <AppTopBar />
            </View>
          )}
        </>
      )}

      {homeQuickShootChromeHidden || pasteDrawerState.open ? null : (
        <Pressable
          accessibilityLabel={getRootTabLabel(copy.nav, 'paste')}
          accessibilityRole={rootTabAccessibilityRoles.paste}
          hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
          onPress={openPasteDrawer}
          style={[
            styles.pasteActionHitTarget,
            {
              height: tabBarLayout.height + Math.abs(rootTabBarCenterActionTopOffset) + 12,
            },
          ]}
        />
      )}

      {pasteDrawerState.open ? (
        <View style={styles.pasteDrawerLayer}>
          <RecipeCreateScreen
            initialMode="reference"
            key={`paste-drawer-${pasteDrawerState.resetVersion}`}
            onClose={closePasteDrawer}
            onCreated={handlePasteRecipeCreated}
          />
        </View>
      ) : null}
    </View>
  );
}

function getRootTabLabel(copy: Record<RootTabName, string>, tabName: RootTabName) {
  return copy[tabName];
}

function getRootTabScreenHref(tabName: RootTabName) {
  if (tabName === 'paste') {
    // Expo Router hides `href: null` tab items on iOS/Expo Go; the custom button intercepts press.
    return '/' as Href;
  }

  return rootTabHrefs[tabName];
}

function RootTabButton({
  active,
  accessibilityState,
  children,
  label,
  onLongPress,
  onPress,
  role,
  style,
}: BottomTabBarButtonProps & {
  active?: boolean;
  label: string;
  role: AccessibilityRole;
}) {
  const isStandardTab = role === 'tab';
  const isSelected = accessibilityState?.selected === true;
  const isPasteActionActive = !isStandardTab && active === true;

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole={role}
      accessibilityState={
        isPasteActionActive ? { ...accessibilityState, expanded: true } : accessibilityState
      }
      android_ripple={
        isStandardTab
          ? {
              borderless: false,
              color: 'rgba(255, 149, 104, 0.14)',
              foreground: true,
            }
          : undefined
      }
      hitSlop={{ bottom: 8, left: 8, right: 8, top: 10 }}
      onLongPress={onLongPress}
      onPress={(event) => {
        if (!isStandardTab) {
          event.preventDefault();
        }

        onPress?.(event);
      }}
      style={({ pressed }) => [
        style,
        isStandardTab ? styles.regularTabButtonSurface : styles.pasteTabButtonSurface,
        isStandardTab && isSelected ? styles.regularTabButtonSurfaceActive : null,
        isPasteActionActive ? styles.pasteTabButtonSurfaceActive : null,
        pressed
          ? isStandardTab
            ? styles.regularTabButtonSurfacePressed
            : styles.pasteTabButtonSurfacePressed
          : null,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hiddenTabBar: {
    backgroundColor: 'transparent',
    borderTopColor: 'transparent',
    borderTopWidth: 0,
    elevation: 0,
    opacity: 0,
    shadowOpacity: 0,
  },
  pasteTabButton: {
    alignItems: 'center',
    borderRadius: rootTabBarCenterActionDiameter / 2,
    height: rootTabBarCenterActionDiameter,
    justifyContent: 'center',
    width: rootTabBarCenterActionDiameter,
  },
  pasteTabButtonActive: {
    borderColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 2,
  },
  pasteTabButtonFocused: {
    borderColor: 'rgba(255, 255, 255, 0.72)',
    borderWidth: 2,
  },
  pasteTabButtonHalo: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: 'rgba(255, 149, 104, 0.16)',
    borderRadius: (rootTabBarCenterActionDiameter + 8) / 2,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 9,
    height: rootTabBarCenterActionDiameter + 8,
    justifyContent: 'center',
    shadowColor: '#0f172a',
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    width: rootTabBarCenterActionDiameter + 8,
  },
  pasteTabButtonHaloActive: {
    backgroundColor: '#fff7f3',
    borderColor: 'rgba(255, 149, 104, 0.36)',
    elevation: 11,
    shadowColor: '#de81c1',
    shadowOpacity: 0.2,
    shadowRadius: 18,
    transform: [{ translateY: -2 }],
  },
  pasteTabButtonHaloFocused: {
    elevation: 11,
    shadowColor: '#de81c1',
    shadowOpacity: 0.2,
    shadowRadius: 18,
    transform: [{ translateY: -2 }],
  },
  pasteTabButtonSurface: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: rootTabMinimumTouchTarget,
    minWidth: rootTabMinimumTouchTarget,
    overflow: 'visible',
  },
  pasteTabButtonSurfaceActive: {
    opacity: 1,
  },
  pasteTabButtonSurfacePressed: {
    opacity: 0.86,
    transform: [{ translateY: 2 }, { scale: 0.93 }],
  },
  pasteTabIconFrame: {
    alignItems: 'center',
    height: rootTabBarCenterActionFrameHeight,
    justifyContent: 'flex-start',
    marginTop: rootTabBarCenterActionTopOffset - 2,
    width: rootTabBarCenterActionFrameHeight,
  },
  pasteTabIconFrameHidden: {
    opacity: 0,
  },
  pasteTabIconStyle: {
    height: rootTabBarCenterActionFrameHeight,
    marginBottom: 0,
    marginTop: 0,
  },
  pasteTabItem: {
    overflow: 'visible',
  },
  pasteTabLabel: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '900',
    lineHeight: 14,
    marginTop: 1,
    textAlign: 'center',
  },
  pasteTabLabelActive: {
    color: '#ff9568',
  },
  pasteTabLabelFocused: {
    color: '#ff9568',
  },
  regularTabIconFrame: {
    alignItems: 'center',
    borderRadius: 16,
    height: 30,
    justifyContent: 'center',
    marginBottom: 1,
    width: 40,
  },
  regularTabIconFrameFocused: {
    backgroundColor: '#fff1ea',
  },
  regularTabIconStyle: {
    height: 32,
    marginBottom: 0,
    marginTop: 0,
  },
  regularTabButtonSurface: {
    alignItems: 'center',
    borderRadius: 18,
    flex: 1,
    justifyContent: 'center',
    minHeight: rootTabMinimumTouchTarget,
    minWidth: rootTabMinimumTouchTarget,
    overflow: 'hidden',
  },
  regularTabButtonSurfaceActive: {
    backgroundColor: 'rgba(255, 149, 104, 0.08)',
  },
  regularTabButtonSurfacePressed: {
    backgroundColor: 'rgba(255, 149, 104, 0.14)',
    opacity: 0.92,
    transform: [{ scale: 0.97 }],
  },
  regularTabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: rootTabMinimumTouchTarget,
    minWidth: rootTabMinimumTouchTarget,
    paddingTop: 0,
  },
  regularTabLabel: {
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 13,
    marginTop: 0,
    textAlign: 'center',
  },
  regularTabLabelFocused: {
    fontWeight: '900',
  },
  pasteDrawerLayer: {
    ...StyleSheet.absoluteFillObject,
    elevation: 50,
    zIndex: 60,
  },
  pasteActionHitTarget: {
    bottom: 0,
    left: '50%',
    marginLeft: -(rootTabBarCenterActionFrameHeight + 28) / 2,
    position: 'absolute',
    width: rootTabBarCenterActionFrameHeight + 28,
    zIndex: 55,
    elevation: 55,
  },
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopColor: '#f1f5f9',
    borderTopWidth: StyleSheet.hairlineWidth,
    elevation: 16,
    overflow: 'visible',
    shadowColor: '#0f172a',
    shadowOffset: { height: -4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
  },
  topChromeLayer: {
    ...StyleSheet.absoluteFillObject,
    elevation: 30,
    zIndex: 40,
  },
});
