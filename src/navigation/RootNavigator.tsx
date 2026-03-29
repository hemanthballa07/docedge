import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { DealDetailScreen } from '../screens/DealDetailScreen';
import { FeedScreen } from '../screens/FeedScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { TrackedScreen } from '../screens/TrackedScreen';

export type FeedStackParamList = {
  FeedList: undefined;
  DealDetail: { dealId: string };
};

export type TrackedStackParamList = {
  TrackedList: undefined;
  TrackedDetail: { dealId: string };
};

type TabParamList = {
  Feed: undefined;
  Tracked: undefined;
  Settings: undefined;
};

const FeedStack = createNativeStackNavigator<FeedStackParamList>();
const TrackedStack = createNativeStackNavigator<TrackedStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function FeedStackNavigator() {
  return (
    <FeedStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#FFFFFF' },
        headerTintColor: '#111827',
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
      }}
    >
      <FeedStack.Screen name="FeedList" component={FeedScreen} options={{ headerShown: false }} />
      <FeedStack.Screen name="DealDetail" component={DealDetailScreen} options={{ title: 'Deal Details' }} />
    </FeedStack.Navigator>
  );
}

function TrackedStackNavigator() {
  return (
    <TrackedStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#FFFFFF' },
        headerTintColor: '#111827',
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
      }}
    >
      <TrackedStack.Screen name="TrackedList" component={TrackedScreen} options={{ headerShown: false }} />
      <TrackedStack.Screen name="TrackedDetail" component={DealDetailScreen} options={{ title: 'Deal Details' }} />
    </TrackedStack.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          if (route.name === 'Feed') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          } else if (route.name === 'Tracked') {
            iconName = focused ? 'bookmark' : 'bookmark-outline';
          } else {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#111827',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
          paddingBottom: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen name="Feed" component={FeedStackNavigator} />
      <Tab.Screen name="Tracked" component={TrackedStackNavigator} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
