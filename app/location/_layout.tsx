import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function LocationLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/phone');
    }
  }, [isLoading, isAuthenticated]);

  // Don't render anything while checking authentication status
  if (isLoading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="search" />
      <Stack.Screen name="confirm" />
    </Stack>
  );
}
