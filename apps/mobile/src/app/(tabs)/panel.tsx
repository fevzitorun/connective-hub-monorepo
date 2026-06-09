import { useState, useCallback } from 'react'
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  SafeAreaView, ActivityIndicator, RefreshControl, Alert,
} from 'react-native'
import { Image } from 'expo-image'
import { useFocusEffect, router } from 'expo-router'
import { agencyApi, formatPrice, listingTypeLabel, type AgencyListingRow } from '../../lib/api'
import { useAuthStore } from '../../store/auth'
import { Colors, Radius, Shadow } from '../../lib/theme'

const PANEL_ROLES = ['agency', 'agent_person', 'admin', 'lawyer', 'bank']

const STATUS_LABELS: Record<string, string> = {
  active: 'Aktif', passive: 'Pasif', sold: 'Satıldı',
  rented: 'Kiralandı', pending: 'Bekliyor', rejected: 'Reddedildi',
}
const STATUS_COLORS: Record<string, string> = {
  active: '#22c55e', passive: '#9ca3af', sold: '#3b82f6',
  rented: '#a78bfa', pending: '#f59e0b', rejected: '#ef4444',
}

export default function PanelScreen() {
  const { accessToken, user } = useAuthStore()
  const [listings, setListings] = useState<AgencyListingRow[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [page, setPage] = useState(1)

  const hasAccess = accessToken && user && PANEL_ROLES.includes(user.role)

  async function load(p: number, reset = false) {
    if (!accessToken || loading) return
    setLoading(true)
    try {
      const res = await agencyApi.getListings(accessToken, p)
      setTotal(res.total)
      setListings((prev) => reset ? res.data : [...prev, ...res.data])
      setPage(p)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(useCallback(() => {
    if (hasAccess) load(1, true)
  }, [accessToken]))

  async function handleRefresh() {
    setRefreshing(true)
    await load(1, true)
    setRefreshing(false)
  }

  async function handleStatusChange(listing: AgencyListingRow) {
    if (!accessToken) return
    const options = listing.status === 'active'
      ? ['Pasife Al', 'İptal']
      : ['Aktifleştir', 'İptal']

    Alert.alert('Durum Değiştir', `"${listing.title}" için yeni durum seçin`, [
      {
        text: options[0] ?? 'Değiştir',
        onPress: async () => {
          const newStatus = listing.status === 'active' ? 'passive' : 'active'
          await agencyApi.updateListingStatus(listing.id, newStatus, accessToken).catch(() => undefined)
          load(1, true)
        },
      },
      { text: options[1] ?? 'İptal', style: 'cancel' },
    ])
  }

  if (!accessToken) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.center}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={styles.title}>Panele Erişim</Text>
          <Text style={styles.subtitle}>Paneli kullanmak için giriş yapın.</Text>
          <TouchableOpacity style={styles.btn} onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.btnText}>Giriş Yap</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  if (!user || !PANEL_ROLES.includes(user.role)) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.center}>
          <Text style={styles.lockIcon}>🏢</Text>
          <Text style={styles.title}>Emlakçı Hesabı Gerekli</Text>
          <Text style={styles.subtitle}>Bu bölüme erişmek için emlak ofisi veya emlakçı hesabı gereklidir.</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>İlanlarım</Text>
          <Text style={styles.headerSub}>{total} ilan</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => Alert.alert('Yeni İlan', 'Web panelinden ilan ekleyebilirsiniz: panel.7fil.com.tr')}
        >
          <Text style={styles.addBtnText}>+ Yeni İlan</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => <PanelListingRow item={item} onStatusChange={handleStatusChange} />}
        onEndReached={() => {
          const pages = Math.ceil(total / 20)
          if (!loading && page < pages) load(page + 1)
        }}
        onEndReachedThreshold={0.3}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={Colors.teal} />}
        ListFooterComponent={
          loading ? <ActivityIndicator color={Colors.teal} style={{ marginVertical: 20 }} /> : null
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.center}>
              <Text style={styles.lockIcon}>📋</Text>
              <Text style={styles.title}>İlan Bulunamadı</Text>
              <Text style={styles.subtitle}>Henüz ilan vermediniz.</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  )
}

function PanelListingRow({ item, onStatusChange }: {
  item: AgencyListingRow
  onStatusChange: (l: AgencyListingRow) => void
}) {
  const cover = item.photos?.find((p) => p.isCover) ?? item.photos?.[0]
  const statusColor = STATUS_COLORS[item.status] ?? Colors.muted
  const statusLabel = STATUS_LABELS[item.status] ?? item.status

  return (
    <TouchableOpacity
      style={[styles.listingRow, Shadow.sm]}
      onPress={() => router.push(`/listing/${item.id}`)}
      activeOpacity={0.9}
    >
      {/* Cover */}
      <View style={styles.coverWrap}>
        {cover ? (
          <Image source={{ uri: cover.url }} style={styles.cover} contentFit="cover" />
        ) : (
          <View style={[styles.cover, { backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={{ fontSize: 22 }}>🏠</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={{ flex: 1 }}>
        <Text style={styles.listingTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.listingCity}>{item.city} · {listingTypeLabel(item.listingType)}</Text>
        <Text style={styles.listingPrice}>{formatPrice(item.price, item.currency)}</Text>

        <View style={styles.listingStats}>
          <Text style={styles.statText}>👁 {item.viewCount}</Text>
          <Text style={styles.statText}>💬 {item.whatsappClicks}</Text>
          <Text style={styles.statText}>♥ {item.favoriteCount}</Text>
        </View>
      </View>

      {/* Status + action */}
      <View style={styles.statusWrap}>
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        <Text style={[styles.statusLabel, { color: statusColor }]}>{statusLabel}</Text>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onStatusChange(item)}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
        >
          <Text style={styles.actionDots}>⋯</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.cream },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#fff', borderBottomWidth: 1, borderColor: Colors.border,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.ink },
  headerSub: { fontSize: 12, color: Colors.muted, marginTop: 1 },
  addBtn: { backgroundColor: Colors.teal, paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  listingRow: {
    flexDirection: 'row', gap: 12, backgroundColor: '#fff',
    marginHorizontal: 16, marginTop: 12, borderRadius: Radius.lg, padding: 12,
  },
  coverWrap: { width: 80, height: 80, borderRadius: Radius.md, overflow: 'hidden' },
  cover: { width: '100%', height: '100%' },
  listingTitle: { fontSize: 13, fontWeight: '600', color: Colors.ink, lineHeight: 18 },
  listingCity: { fontSize: 11, color: Colors.muted, marginTop: 2 },
  listingPrice: { fontSize: 14, fontWeight: '800', color: Colors.ink, marginTop: 4 },
  listingStats: { flexDirection: 'row', gap: 10, marginTop: 6 },
  statText: { fontSize: 11, color: Colors.muted },
  statusWrap: { alignItems: 'center', justifyContent: 'center', gap: 4, paddingLeft: 4 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusLabel: { fontSize: 10, fontWeight: '700', textAlign: 'center' },
  actionBtn: { marginTop: 4 },
  actionDots: { fontSize: 18, color: Colors.muted },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, paddingTop: 80 },
  lockIcon: { fontSize: 52, marginBottom: 16 },
  title: { fontSize: 18, fontWeight: '700', color: Colors.ink, textAlign: 'center' },
  subtitle: { fontSize: 13, color: Colors.muted, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  btn: { backgroundColor: Colors.teal, borderRadius: 12, paddingHorizontal: 32, paddingVertical: 13, marginTop: 24 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
})
