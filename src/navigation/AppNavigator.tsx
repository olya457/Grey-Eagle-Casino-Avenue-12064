import { MotionPressable as Pressable } from '../components/Motion';
import { SceneWidthInsetContext, useLayout } from '../hooks/useLayout';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { ResourcesScreen, ResourceDetailScreen } from '../screens/Resources';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
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
      testID={layout.wide ? 'navigation-rail' : 'navigation-bottom'}
      pointerEvents="box-none"
      style={[
        layout.wide ? n.railWrap : n.barWrap,
        layout.wide
          ? {
              width: 92 + insets.left,
              paddingLeft: insets.left + 8,
              paddingTop: insets.top + 8,
              paddingBottom: insets.bottom + 8,
            }
          : {
              bottom: insets.bottom + 8,
              left: Math.max(12, insets.left),
              right: Math.max(12, insets.right),
            },
      ]}
    >
      <ScrollView
        horizontal={!layout.wide}
        scrollEnabled={layout.wide}
        showsVerticalScrollIndicator={false}
        style={layout.wide ? n.railScroll : n.bottomScroll}
        contentContainerStyle={[
          n.bar,
          layout.wide ? n.rail : { maxWidth: layout.expanded ? 640 : 460 },
        ]}
      >
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
              style={[n.tab, layout.wide && n.railTab]}
            >
              <LinearGradient
                colors={focused ? gradient : ['#121e1700', '#121e1700']}
                style={[n.tabIcon, focused && n.active]}
              >
                <Icon
                  name={icons[route.name]}
                  color={focused ? colors.text : '#85958b'}
                  size={22}
                />
              </LinearGradient>
              {layout.expanded && !layout.wide && (
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
      </ScrollView>
    </View>
  );
}
function MainTabs() {
  const reduced = useReducedMotion();
  const layout = useLayout();
  const insets = useSafeAreaInsets();
  return (
    <SceneWidthInsetContext.Provider value={layout.wide ? 92 + insets.left : 0}>
      <Tabs.Navigator
        tabBar={props => <TabBar {...props} />}
        screenOptions={{
          tabBarPosition: layout.wide ? 'left' : 'bottom',
          headerShown: false,
          animation: reduced ? 'none' : 'fade',
          sceneStyle: { backgroundColor: '#071b12' },
        }}
      >
        <Tabs.Screen name="Events" component={EventsScreen} />
        <Tabs.Screen name="Dining" component={DiningScreen} />
        <Tabs.Screen name="Hotel" component={HotelScreen} />
        <Tabs.Screen name="Tours" component={ToursScreen} />
        <Tabs.Screen name="Explore" component={ExploreScreen} />
      </Tabs.Navigator>
    </SceneWidthInsetContext.Provider>
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
          background: '#071b12',
          card: colors.card,
          primary: colors.accent,
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#071b12' },
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
  railWrap: { flexShrink: 0, justifyContent: 'center', paddingRight: 8 },
  railScroll: { flexGrow: 0, flexShrink: 1 },
  bottomScroll: { width: '100%', maxWidth: 640, flexGrow: 0 },
  rail: { width: '100%', flexDirection: 'column', gap: 8, borderRadius: 32 },
  railTab: { flex: 0, minHeight: 48 },
  barWrap: { position: 'absolute', left: 20, right: 20, alignItems: 'center' },
  bar: {
    width: '100%',
    maxWidth: 460,
    padding: 6,
    flexDirection: 'row',
    backgroundColor: '#121e17f5',
    borderWidth: 1,
    borderColor: '#35453b',
    borderRadius: 40,
    shadowColor: '#7dce9d',
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
    borderColor: '#8bdaab',
    shadowColor: '#81ffb3',
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
  },
});
