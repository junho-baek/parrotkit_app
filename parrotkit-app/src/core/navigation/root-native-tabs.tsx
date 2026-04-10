import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Icon, Label, NativeTabs, VectorIcon } from 'expo-router/unstable-native-tabs';
import { DynamicColorIOS, Platform } from 'react-native';

export function RootNativeTabs() {
  const isIOS = Platform.OS === 'ios';
  const iosTintColor = isIOS
    ? DynamicColorIOS({
        dark: '#ffffff',
        light: '#111827',
      })
    : '#111827';

  return (
    <NativeTabs
      badgeBackgroundColor="#ff9568"
      backgroundColor={isIOS ? null : '#fffdf8'}
      blurEffect={isIOS ? 'systemChromeMaterial' : undefined}
      disableTransparentOnScrollEdge={isIOS}
      labelStyle={{
        color: isIOS ? iosTintColor : '#57534e',
      }}
      minimizeBehavior={isIOS ? 'onScrollDown' : undefined}
      tintColor={iosTintColor}
    >
      <NativeTabs.Trigger name="index">
        <Icon
          androidSrc={{
            default: <VectorIcon family={MaterialCommunityIcons} name="home-variant-outline" />,
            selected: <VectorIcon family={MaterialCommunityIcons} name="home-variant" />,
          }}
          sf={{ default: 'house', selected: 'house.fill' }}
        />
        <Label>Home</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <Icon
          androidSrc={{
            default: <VectorIcon family={MaterialCommunityIcons} name="compass-outline" />,
            selected: <VectorIcon family={MaterialCommunityIcons} name="compass" />,
          }}
          sf={{ default: 'safari', selected: 'safari.fill' }}
        />
        <Label>Explore</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="recipes">
        <Icon
          androidSrc={{
            default: <VectorIcon family={MaterialCommunityIcons} name="book-open-page-variant-outline" />,
            selected: <VectorIcon family={MaterialCommunityIcons} name="book-open-page-variant" />,
          }}
          sf={{ default: 'book', selected: 'book.fill' }}
        />
        <Label>Recipes</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="my">
        <Icon
          androidSrc={{
            default: <VectorIcon family={MaterialCommunityIcons} name="account-outline" />,
            selected: <VectorIcon family={MaterialCommunityIcons} name="account" />,
          }}
          sf={{ default: 'person', selected: 'person.fill' }}
        />
        <Label>My</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
