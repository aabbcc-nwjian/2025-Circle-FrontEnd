import { useNavigation } from 'expo-router';
import { Stack } from 'expo-router/stack';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="changecipher" options={{ headerShown: false }} />
    </Stack>
  );
}