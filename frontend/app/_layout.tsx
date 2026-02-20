import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useHabitStore } from '../src/store/habitStore';

export default function RootLayout() {
  const settings = useHabitStore((state) => state.settings);

  return (
    <>
      <StatusBar style={settings.isDarkMode ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
