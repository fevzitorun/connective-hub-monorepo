import { useEffect, useState, useRef } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, Linking, Dimensions, FlatList, Alert,
} from 'react-native'
import { Image } from 'expo-image'
import { useLocalSearchParams, router, Stack } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { listingsApi, formatPrice, listingTypeLabel, propertyTypeLabel, type Listing } from '../../lib/api'
import { useAuthStore } from '../../store/auth'
import { Colors, Radius, Shadow } from '../../lib/theme'

const { width } = Dimensions.get('window')

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { accessToken } = useAuthStore()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFav, setIsFav] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)
  const viewTracked = useRef(false)

  useEffect(() => {
    if (!id) return
    listingsApi.get(id, accessToken).then((res) => {
      setListing(res.data)
    }).catch(() => {
      Alert.alert('Hata', 'İlan yüklenemedi.')
      router.back()
    }).finally(() => setLoading(false))

    if (!viewTracked.current) {
      viewTracked.current = true
      listingsApi.trackView(id)
    }
  }, [id, accessToken])

  async function toggleFavorite() {
    if (!accessToken) {
      Alert.alert('Giriş Gerekli', 'Favorilere eklemek için giriş yapın.', [
        { text: 'Giriş Yap', onPress: () => router.push('/(auth)/login') },
        { text: 'İptal', style: 'cancel' },
      ])
      return
    }
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    const newFav = !isFav
    setIsFav(newFav)
    const fn = newFav ? listingsApi.addFavorite : listingsApi.removeFavorite
    await fn(id!, accessToken).catch(() => setIsFav(!newFav))
  }

  async function handleWhatsApp() {
    if (!listing?.whatsappLink) return
    await listingsApi.trackWaClick(id!)
    await Linking.openURL(listing.whatsappLink)
  }

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={Colors.teal} />
      </View>
    )
  }

  if (!listing) return null

  const photos = listing.photos ?? []
  const hasPhotos = photos.length > 0

  const specs = [
    ...(listing.roomCount ? [{ label: 'Oda', value: listing.roomCount }] : []),
    ...(listing.areaM2 ? [{ label: 'Alan', value: `${listing.areaM2} m²` }] : []),
    ...(listing.floorNo != null ? [{ label: 'Kat', value: String(listing.floorNo) }] : []),
    ...(listing.buildingAge != null ? [{ label: 'Bina Yaşı', value: `${listing.buildingAge} yıl` }] : []),
    { label: 'Otopark', value: listing.hasParking ? 'Var' : 'Yok' },
    { label: 'Asansör', value: listing.hasElevator ? 'Var' : 'Yok' },
  ]

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={toggleFavorite} style={{ marginRight: 4 }}>
              <Text style={{ fontSize: 22 }}>{isFav ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
        {/* Photo carousel */}
        <View style={styles.photoCarousel}>
          {hasPhotos ? (
            <>
              <FlatList
                data={photos}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(p) => p.id}
                onMomentumScrollEnd={(e) => {
                  setPhotoIndex(Math.round(e.nativeEvent.contentOffset.x / width))
                }}
                renderItem={({ item }) => (
                  <Image source={{ uri: item.url }} style={[styles.photo, { width }]} contentFit="cover" transition={200} />
                )}
              />
              {photos.length > 1 && (
                <View style={styles.photoDots}>
                  {photos.map((_, i) => (
                    <View key={i} style={[styles.dot, i === photoIndex && styles.dotActive]} />
                  ))}
                </View>
              )}
            </>
          ) : (
            <View style={[styles.photo, styles.photoPlaceholder, { width }]}>
              <Text style={{ fontSize: 60 }}>🏠</Text>
            </View>
          )}

          {/* Listing type badge */}
          <View style={[styles.photoBadge, { backgroundColor: listing.listingType === 'sale' ? Colors.teal : Colors.rent }]}>
            <Text style={styles.photoBadgeText}>{listingTypeLabel(listing.listingType)}</Text>
          </View>
        </View>

        <View style={styles.body}>
          {/* Title + price */}
          <Text style={styles.propertyType}>{propertyTypeLabel(listing.propertyType)}</Text>
          <Text style={styles.title}>{listing.title}</Text>
          <Text style={styles.location}>
            {listing.neighborhood ? `${listing.neighborhood}, ` : ''}
            {listing.district ? `${listing.district}, ` : ''}{listing.city}
          </Text>
          <Text style={styles.price}>{formatPrice(listing.price, listing.currency)}</Text>
          {listing.areaM2 && listing.price && (
            <Text style={styles.priceM2}>
              {Math.round(listing.price / listing.areaM2).toLocaleString('tr-TR')} ₺/m²
            </Text>
          )}

          {/* Specs */}
          <View style={[styles.card, Shadow.sm]}>
            <View style={styles.specsGrid}>
              {specs.map((s) => (
                <View key={s.label} style={styles.specItem}>
                  <Text style={styles.specLabel}>{s.label}</Text>
                  <Text style={styles.specValue}>{s.value}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Description */}
          {listing.description ? (
            <View style={[styles.card, Shadow.sm]}>
              <Text style={styles.sectionTitle}>Açıklama</Text>
              <Text style={styles.description}>{listing.description}</Text>
            </View>
          ) : null}

          {/* Stats */}
          <View style={styles.statsRow}>
            <StatBadge icon="👁" value={listing.viewCount} label="görüntülenme" />
            <StatBadge icon="💬" value={listing.whatsappClicks} label="WA tıklama" />
            <StatBadge icon="♥" value={listing.favoriteCount} label="favori" />
          </View>

          {/* Listing ID */}
          <Text style={styles.listingId}>İlan No: {listing.id.slice(0, 8).toUpperCase()}</Text>

          {/* Bottom spacer for the CTA */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View style={[styles.cta, Shadow.md]}>
        {listing.whatsappLink ? (
          <TouchableOpacity style={styles.whatsappBtn} onPress={handleWhatsApp} activeOpacity={0.85}>
            <Text style={styles.whatsappText}>💬  WhatsApp ile İletişim</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.noContactWrap}>
            <Text style={styles.noContact}>İletişim bilgisi bulunamadı</Text>
          </View>
        )}
      </View>
    </>
  )
}

function StatBadge({ icon, value, label }: { icon: string; value: number; label: string }) {
  return (
    <View style={styles.statBadge}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value.toLocaleString('tr-TR')}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.cream },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  photoCarousel: { position: 'relative', height: width * 0.65 },
  photo: { height: width * 0.65 },
  photoPlaceholder: { backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
  photoBadge: { position: 'absolute', top: 12, left: 12, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
  photoBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  photoDots: { position: 'absolute', bottom: 10, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotActive: { backgroundColor: '#fff', width: 16 },

  body: { padding: 16 },
  propertyType: { fontSize: 11, color: Colors.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  title: { fontSize: 20, fontWeight: '700', color: Colors.ink, lineHeight: 26 },
  location: { fontSize: 13, color: Colors.muted, marginTop: 4 },
  price: { fontSize: 28, fontWeight: '800', color: Colors.ink, marginTop: 10 },
  priceM2: { fontSize: 12, color: Colors.muted, marginTop: 2 },

  card: { backgroundColor: '#fff', borderRadius: Radius.lg, padding: 16, marginTop: 16 },
  specsGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  specItem: { width: '33.33%', paddingVertical: 8, paddingRight: 8 },
  specLabel: { fontSize: 11, color: Colors.muted },
  specValue: { fontSize: 14, fontWeight: '600', color: Colors.ink, marginTop: 2 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: Colors.ink, marginBottom: 10 },
  description: { fontSize: 14, color: '#374151', lineHeight: 22 },

  statsRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  statBadge: { flex: 1, backgroundColor: '#fff', borderRadius: Radius.md, padding: 10, alignItems: 'center', ...Shadow.sm },
  statIcon: { fontSize: 16 },
  statValue: { fontSize: 16, fontWeight: '700', color: Colors.ink, marginTop: 2 },
  statLabel: { fontSize: 10, color: Colors.muted, marginTop: 1 },

  listingId: { fontSize: 11, color: Colors.muted, textAlign: 'center', marginTop: 16, fontFamily: 'monospace' },

  cta: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12,
    paddingBottom: 28, borderTopWidth: 1, borderColor: Colors.border,
  },
  whatsappBtn: { backgroundColor: '#25D366', borderRadius: Radius.md, paddingVertical: 15, alignItems: 'center' },
  whatsappText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  noContactWrap: { alignItems: 'center', paddingVertical: 12 },
  noContact: { color: Colors.muted, fontSize: 14 },
})
