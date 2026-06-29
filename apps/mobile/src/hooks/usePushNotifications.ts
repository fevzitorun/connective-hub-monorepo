import { useEffect, useRef } from 'react'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import Constants from 'expo-constants'
import { Platform } from 'react-native'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

const BASE: string = 'http://localhost:4000/api/v1'

async function registerTokenOnServer(token: string, accessToken: string) {
  const platform = require('react-native').Platform.OS as 'ios' | 'android' | 'web'
  await fetch(`${BASE}/users/push-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ token, platform }),
  }).catch(() => undefined)
}

export function usePushNotifications(onToken?: (token: string) => void, accessToken?: string | null) {
  const notificationListener = useRef<Notifications.Subscription>()
  const responseListener = useRef<Notifications.Subscription>()

  useEffect(() => {
    registerForPushNotifications().then((token) => {
      if (token) {
        onToken?.(token)
        if (accessToken) registerTokenOnServer(token, accessToken)
      }
    })

    notificationListener.current = Notifications.addNotificationReceivedListener(() => {
      // Received while app is foregrounded
    })

    responseListener.current = Notifications.addNotificationResponseReceivedListener((_response) => {
      // User tapped notification
    })

    return () => {
      notificationListener.current?.remove()
      responseListener.current?.remove()
    }
  }, [])
}

async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) return null

  const { status: existing } = await Notifications.getPermissionsAsync()
  let finalStatus = existing

  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== 'granted') return null

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: '7fil Bildirimleri',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    })
  }

  const extra = Constants.expoConfig?.extra as Record<string, unknown> | undefined
  const eas = extra?.eas as Record<string, string> | undefined
  const projectId = eas?.projectId

  const token = await Notifications.getExpoPushTokenAsync(
    projectId ? { projectId } : undefined,
  )
  return token.data
}
