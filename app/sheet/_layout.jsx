import { Stack } from 'expo-router/stack';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="start" options={{ headerShown: false }} />
      <Stack.Screen name="next" options={{ headerShown: false }} />
      <Stack.Screen name="end" options={{ headerShown: false }} />
      <Stack.Screen name="report" options={{ headerShown: false }} />
    </Stack>
  );
}