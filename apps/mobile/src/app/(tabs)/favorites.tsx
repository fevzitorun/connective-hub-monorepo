import { useState, useCallback } from 'react'
import {
  View, FlatList, Text, StyleSheet, SafeAreaView,
  TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native'
import { useFocusEffect, router } from 'expo-router'
import { listingsApi, type Listing } from '../../lib/api'
import { useAuthStore } from '../../store/auth'
import { ListingCard } from '../../components/ListingCard'
import { Colors } from '../../lib/theme'

export default function FavoritesScreen() {
  const { accessToken } = useAuthStore()
  const [favorites, setFavorites] = useState<Listing[]>([])
  const [favIds, setFavIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  async function load() {
    if (!accessToken) return
    setLoading(true)
    try {
      const res = await listingsApi.getFavorites(accessToken)
      setFavorites(res.data)
      setFavIds(new Set(res.data.map((l) => l.id)))
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(useCallback(() => { load() }, [accessToken]))

  async function handleRefresh() {
    setRefreshing(true)
    await load()
    setRefreshing(false)
  }

  async function toggleFavorite(id: string) {
    if (!accessToken) return
    const isFav = favIds.has(id)
    if (isFav) {
      setFavIds((prev) => { const n = new Set(prev); n.delete(id); return n })
      setFavorites((prev) => prev.filter((l) => l.id !== id))
      await listingsApi.removeFavorite(id, accessToken).catch(() => undefined)
    }
  }

  if (!accessToken) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.center}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={styles.title}>Giriş Yap</Text>
          <Text style={styles.subtitle}>Favori ilanlarınızı görmek için giriş yapın.</Text>
          <TouchableOpacity style={styles.btn} onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.btnText}>Giriş Yap</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorilerim</Text>
        <Text style={styles.headerCount}>{favorites.length} ilan</Text>
      </View>

      {loading && favorites.length === 0 ? (
        <ActivityIndicator color={Colors.teal} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ListingCard
              item={item}
              isFavorite={favIds.has(item.id)}
              onFavoriteToggle={toggleFavorite}
            />
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={Colors.teal} />}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.lockIcon}>🤍</Text>
              <Text style={styles.title}>Henüz favoriniz yok</Text>
              <Text style={styles.subtitle}>İlan sayfasındaki kalp ikonuna tıklayarak favorilerinize ekleyebilirsiniz.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.cream },
  header: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: Colors.border },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.ink },
  headerCount: { fontSize: 13, color: Colors.muted },
  row: { paddingHorizontal: 16, gap: 16, justifyContent: 'space-between' },
  list: { paddingTop: 16, paddingBottom: 24 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, paddingTop: 80 },
  lockIcon: { fontSize: 52, marginBottom: 16 },
  title: { fontSize: 18, fontWeight: '700', color: Colors.ink, textAlign: 'center' },
  subtitle: { fontSize: 13, color: Colors.muted, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  btn: { backgroundColor: Colors.teal, borderRadius: 12, paddingHorizontal: 32, paddingVertical: 13, marginTop: 24 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
})
