import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable } from 'react-native';

export default function Layout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: '#333',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      {/* 1. Ensure the Tabs are registered */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      
      {/* 2. Target the specific filename with matching casing */}
      <Stack.Screen 
        name="WorkoutHistory" 
        options={{ 
          headerTitle: 'Workout History',
          // The "Nuclear Option": Manually define the back button to kill the "(tabs)" label
          headerLeft: () => (
            <Pressable 
              onPress={() => router.back()} 
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
                paddingLeft: Platform.OS === 'ios' ? 0 : 10,
              })}
            >
              <Ionicons name="chevron-back" size={28} color="#1971c2" />
            </Pressable>
          ),
        }} 
      />
    </Stack>
  );
}