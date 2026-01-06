// import { HapticTab } from '@/components/HapticTab';
// import TabBarBackground from '@/components/ui/TabBarBackground';
// import { Colors } from '@/constants/Colors';
// import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
  // const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true, 
        headerTitleAlign: 'center', 
        headerStyle: {
            backgroundColor: '#fff',
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
              },
              android: {
                elevation: 2,
              },
            }),
        },
        headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
            color: '#333',
        },
        // tabBarButton: HapticTab,
        // tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: { position: 'absolute' },
          default: {},
        }),
      }}>
      
      <Tabs.Screen
        name="index"
        options={{
          title: 'Daily Log',
          tabBarIcon: ({ color }) => <Ionicons name="clipboard-outline" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color }) => <Ionicons name="stats-chart-outline" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: 'Workout History',
          href: null, // Keeps it out of the bottom bar
          // Removed headerBackTitle to fix the TypeScript error
        }}
      />
    </Tabs>
  );
}