import { Tabs, router } from 'expo-router'
import { useEffect } from 'react'
import { useAuthStore } from '../../store/auth'
import { Colors } from '../../lib/theme'

export default function TabsLayout() {
  const { accessToken } = useAuthStore()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.teal,
        tabBarInactiveTintColor: Colors.muted,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#f1f5f9',
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        headerStyle: { backgroundColor: Colors.ink },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Keşfet',
          headerTitle: '7fil',
          tabBarIcon: ({ color }) => <TabIcon emoji="🔍" color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoriler',
          tabBarIcon: ({ color }) => <TabIcon emoji="❤️" color={color} />,
        }}
      />
      <Tabs.Screen
        name="panel"
        options={{
          title: 'Panelim',
          tabBarIcon: ({ color }) => <TabIcon emoji="📊" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <TabIcon emoji="👤" color={color} />,
        }}
      />
    </Tabs>
  )
}

function TabIcon({ emoji, color }: { emoji: string; color: string }) {
  // Simple emoji icon — production would use @expo/vector-icons
  const { Text } = require('react-native') as typeof import('react-native')
  return <Text style={{ fontSize: 20, opacity: color === Colors.teal ? 1 : 0.5 }}>{emoji}</Text>
}
