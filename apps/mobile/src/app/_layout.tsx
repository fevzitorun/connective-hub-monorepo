import { useEffect } from 'react'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useAuthStore } from '../store/auth'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const { hydrate, isHydrated } = useAuthStore()

  useEffect(() => {
    hydrate().then(() => SplashScreen.hideAsync())
  }, [hydrate])

  if (!isHydrated) return null

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="listing/[id]" options={{ headerShown: true, title: 'İlan Detayı', headerBackTitle: 'Geri' }} />
      </Stack>
    </GestureHandlerRootView>
  )
}
