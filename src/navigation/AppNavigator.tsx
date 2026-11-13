import { MotionPressable as Pressable } from '../components/Motion';
import { useLayout } from '../hooks/useLayout';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { ResourcesScreen, ResourceDetailScreen } from '../screens/Resources';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gradient as LinearGradient } from '../components/Gradient';
import { RootParams, TabParams } from './types';
import { Icon, IconName } from '../components/Icon';
import { colors, gradient, s } from '../theme';
import { EventsScreen } from '../screens/Events';
import { EventDetailScreen } from '../screens/EventDetail';
import { DiningScreen, VenueDetailScreen } from '../screens/Dining';
import { HotelScreen, RoomDetailScreen } from '../screens/Hotel';
import { ToursScreen, TourDetailScreen } from '../screens/Tours';
import { ExploreScreen } from '../screens/Explore';
import { AssistantScreen } from '../screens/Assistant';
const Stack = createNativeStackNavigator<RootParams>();
const Tabs = createBottomTabNavigator<TabParams>();
const icons: Record<string, IconName> = {
  Events: 'events',
  Dining: 'dining',
  Hotel: 'hotel',
  Tours: 'tours',
  Explore: 'explore',
};
function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  return (
    <View
      pointerEvents="box-none"
      style={[
        n.barWrap,
        {
          bottom: insets.bottom + 8,
          left: Math.max(12, insets.left),
          right: Math.max(12, insets.right),
        },
      ]}
    >
      <View style={[n.bar, { maxWidth: layout.expanded ? 640 : 460 }]}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityLabel={route.name}
              accessibilityState={{ selected: focused }}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
              onLongPress={() =>
                navigation.emit({ type: 'tabLongPress', target: route.key })
              }
              style={n.tab}
            >
              <LinearGradient
                colors={focused ? gradient : ['#12151e00', '#12151e00']}
                style={[n.tabIcon, focused && n.active]}
              >
                <Icon
                  name={icons[route.name]}
                  color={focused ? colors.text : '#858995'}
                  size={22}
                />
              </LinearGradient>
              {layout.expanded && (
                <Text
                  style={[
                    s.small,
                    { color: focused ? colors.text : colors.muted },
                  ]}
                >
                  {route.name}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
function MainTabs() {
  const reduced = useReducedMotion();
  return (
    <Tabs.Navigator
      tabBar={props => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        animation: reduced ? 'none' : 'fade',
        sceneStyle: { backgroundColor: '#000' },
      }}
    >
      <Tabs.Screen name="Events" component={EventsScreen} />
      <Tabs.Screen name="Dining" component={DiningScreen} />
      <Tabs.Screen name="Hotel" component={HotelScreen} />
      <Tabs.Screen name="Tours" component={ToursScreen} />
      <Tabs.Screen name="Explore" component={ExploreScreen} />
    </Tabs.Navigator>
  );
}
export function AppNavigator() {
  const reduced = useReducedMotion();
  return (
    <NavigationContainer
      theme={{
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: '#000',
          card: colors.card,
          primary: colors.accent,
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#000' },
          animation: reduced ? 'none' : 'slide_from_right',
        }}
      >
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="EventDetail" component={EventDetailScreen} />
        <Stack.Screen name="VenueDetail" component={VenueDetailScreen} />
        <Stack.Screen name="RoomDetail" component={RoomDetailScreen} />
        <Stack.Screen name="TourDetail" component={TourDetailScreen} />
        <Stack.Screen name="Assistant" component={AssistantScreen} />
        <Stack.Screen name="Resources" component={ResourcesScreen} />
        <Stack.Screen name="ResourceDetail" component={ResourceDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const n = StyleSheet.create({
  barWrap: { position: 'absolute', left: 20, right: 20, alignItems: 'center' },
  bar: {
    width: '100%',
    maxWidth: 460,
    padding: 6,
    flexDirection: 'row',
    backgroundColor: '#12151ef5',
    borderWidth: 1,
    borderColor: '#353945',
    borderRadius: 40,
    shadowColor: '#7d93ce',
    shadowOpacity: 0.16,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  tabIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: {
    borderWidth: 1,
    borderColor: '#8b9fda',
    shadowColor: '#819aff',
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
  },
});
