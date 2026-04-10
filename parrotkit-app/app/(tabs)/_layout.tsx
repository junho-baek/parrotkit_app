import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { DynamicColorIOS, Platform } from 'react-native';
import { NativeTabs, Icon, Label, VectorIcon } from 'expo-router/unstable-native-tabs';

export default function TabsLayout() {
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
      backgroundColor={isIOS ? null : '#ffffff'}
      blurEffect={isIOS ? 'systemChromeMaterial' : undefined}
      disableTransparentOnScrollEdge={isIOS}
      tintColor={iosTintColor}
      labelStyle={{
        color: isIOS ? iosTintColor : '#4b5563',
      }}
      minimizeBehavior={isIOS ? 'onScrollDown' : undefined}
    >
      <NativeTabs.Trigger name="index">
        <Icon
          sf={{ default: 'house', selected: 'house.fill' }}
          androidSrc={{
            default: <VectorIcon family={MaterialCommunityIcons} name="home-variant-outline" />,
            selected: <VectorIcon family={MaterialCommunityIcons} name="home-variant" />,
          }}
        />
        <Label>Home</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <Icon
          sf={{ default: 'safari', selected: 'safari.fill' }}
          androidSrc={{
            default: <VectorIcon family={MaterialCommunityIcons} name="compass-outline" />,
            selected: <VectorIcon family={MaterialCommunityIcons} name="compass" />,
          }}
        />
        <Label>Explore</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="paste">
        <Icon
          sf={{ default: 'plus.circle', selected: 'plus.circle.fill' }}
          androidSrc={{
            default: <VectorIcon family={MaterialCommunityIcons} name="link-variant-plus" />,
            selected: <VectorIcon family={MaterialCommunityIcons} name="link-variant" />,
          }}
        />
        <Label>Paste</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="recipes">
        <Icon
          sf={{ default: 'book', selected: 'book.fill' }}
          androidSrc={{
            default: <VectorIcon family={MaterialCommunityIcons} name="book-open-page-variant-outline" />,
            selected: <VectorIcon family={MaterialCommunityIcons} name="book-open-page-variant" />,
          }}
        />
        <Label>Recipes</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="my">
        <Icon
          sf={{ default: 'person', selected: 'person.fill' }}
          androidSrc={{
            default: <VectorIcon family={MaterialCommunityIcons} name="account-outline" />,
            selected: <VectorIcon family={MaterialCommunityIcons} name="account" />,
          }}
        />
        <Label>My</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
