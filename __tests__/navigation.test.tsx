import React from 'react';
import * as ReactNative from 'react-native';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { AppNavigator } from '../src/navigation/AppNavigator';

let mockScreenOptions: { tabBarPosition: string };
let mockRenderTabBar: (props: BottomTabBarProps) => React.ReactNode;
jest.mock('@react-navigation/native', () => ({
  DarkTheme: { colors: {} },
  NavigationContainer: ({ children }: React.PropsWithChildren) => children,
}));
jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({
      children,
    }: {
      children: React.ReactElement<{ component: React.ComponentType }>[];
    }) => require('react').createElement(children[0].props.component),
    Screen: () => null,
  }),
}));
jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({
      tabBar,
      screenOptions,
    }: {
      tabBar: typeof mockRenderTabBar;
      screenOptions: typeof mockScreenOptions;
    }) => {
      mockScreenOptions = screenOptions;
      mockRenderTabBar = tabBar;
      return null;
    },
    Screen: () => null,
  }),
}));
jest.mock('react-native-safe-area-context', () => {
  const ReactModule = require('react');
  const context = ReactModule.createContext({
    top: 0,
    bottom: 34,
    left: 0,
    right: 0,
  });
  return { useSafeAreaInsets: () => ReactModule.useContext(context) };
});
jest.mock('../src/components/Gradient', () => ({
  Gradient: require('react-native').View,
}));
jest.mock('../src/components/Icon', () => ({
  Icon: require('react-native').View,
}));
jest.mock('../src/screens/Events', () => ({ EventsScreen: () => null }));
jest.mock('../src/screens/EventDetail', () => ({
  EventDetailScreen: () => null,
}));
jest.mock('../src/screens/Dining', () => ({
  DiningScreen: () => null,
  VenueDetailScreen: () => null,
}));
jest.mock('../src/screens/Hotel', () => ({
  HotelScreen: () => null,
  RoomDetailScreen: () => null,
}));
jest.mock('../src/screens/Tours', () => ({
  ToursScreen: () => null,
  TourDetailScreen: () => null,
}));
jest.mock('../src/screens/Explore', () => ({ ExploreScreen: () => null }));
jest.mock('../src/screens/Assistant', () => ({ AssistantScreen: () => null }));
jest.mock('../src/screens/Resources', () => ({
  ResourcesScreen: () => null,
  ResourceDetailScreen: () => null,
}));

test('tab bar render callback safely creates a component and handles tab selection', async () => {
  const initial = ReactNative.Dimensions.get('window');
  let navigator: ReactTestRenderer;
  let bar: ReactTestRenderer;
  await act(async () => {
    navigator = create(<AppNavigator />);
  });
  const navigate = jest.fn();
  const emit = jest.fn(() => ({ defaultPrevented: false }));
  const names = ['Events', 'Dining', 'Hotel', 'Tours', 'Explore'];
  const props = {
    state: { index: 0, routes: names.map(name => ({ key: name, name })) },
    navigation: { navigate, emit },
    descriptors: {},
    insets: { top: 0, bottom: 34, left: 0, right: 0 },
  } as unknown as BottomTabBarProps;
  const element = mockRenderTabBar(props);
  await act(async () => {
    bar = create(<>{element}</>);
  });
  for (const name of names) {
    expect(
      bar!.root.findAllByProps({ accessibilityLabel: name }).length,
    ).toBeGreaterThan(0);
  }
  await act(async () => {
    bar.root
      .findAllByProps({ accessibilityLabel: 'Dining' })[0]
      .props.onPress();
  });
  expect(navigate).toHaveBeenCalledWith('Dining');
  for (const [width, height, position] of [
    [890, 626, 'left'],
    [667, 320, 'left'],
    [320, 667, 'bottom'],
    [626, 890, 'bottom'],
    [402, 874, 'bottom'],
  ] as const) {
    await act(async () => {
      ReactNative.Dimensions.set({
        window: { width, height, scale: 3, fontScale: 1 },
        screen: { width, height, scale: 3, fontScale: 1 },
      });
      navigator.update(<AppNavigator />);
      bar.update(
        <>
          {mockRenderTabBar({ ...props, state: { ...props.state, index: 3 } })}
        </>,
      );
    });
    expect(mockScreenOptions.tabBarPosition).toBe(position);
    expect(
      bar!.root.findAllByProps({
        testID: position === 'left' ? 'navigation-rail' : 'navigation-bottom',
      }).length,
    ).toBeGreaterThan(0);
    expect(
      bar!.root.findAllByProps({ accessibilityLabel: 'Tours' })[0].props
        .accessibilityState.selected,
    ).toBe(true);
    for (const name of names) {
      expect(
        bar!.root.findAllByProps({ accessibilityLabel: name }).length,
      ).toBeGreaterThan(0);
    }
  }
  await act(async () => {
    ReactNative.Dimensions.set({ window: initial, screen: initial });
  });
  await act(async () => {
    navigator.unmount();
    bar.unmount();
  });
});
