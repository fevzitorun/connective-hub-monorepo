import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { Colors, Radius, Shadow } from '../lib/theme'
import { formatPrice, listingTypeLabel, propertyTypeLabel } from '../lib/api'
import type { Listing } from '../lib/api'

const { width } = Dimensions.get('window')
const CARD_W = (width - 48) / 2   // 2-column grid with 16px padding + 16px gap

type Props = {
  item: Listing
  onFavoriteToggle?: (id: string) => void
  isFavorite?: boolean
}

export function ListingCard({ item, onFavoriteToggle, isFavorite }: Props) {
  const cover = item.photos?.find((p) => p.isCover) ?? item.photos?.[0]

  return (
    <TouchableOpacity
      style={[styles.card, Shadow.sm]}
      onPress={() => router.push(`/listing/${item.id}`)}
      activeOpacity={0.9}
    >
      {/* Photo */}
      <View style={styles.photoWrap}>
        {cover ? (
          <Image
            source={{ uri: cover.url }}
            style={styles.photo}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={[styles.photo, styles.photoPlaceholder]}>
            <Text style={{ fontSize: 28 }}>🏠</Text>
          </View>
        )}
        {/* Badge */}
        <View style={[styles.badge, { backgroundColor: item.listingType === 'sale' ? Colors.teal : Colors.rent }]}>
          <Text style={styles.badgeText}>{listingTypeLabel(item.listingType)}</Text>
        </View>
        {/* Favorite button */}
        {onFavoriteToggle && (
          <TouchableOpacity
            style={styles.favBtn}
            onPress={() => onFavoriteToggle(item.id)}
            hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          >
            <Text style={{ fontSize: 16 }}>{isFavorite ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.price}>{formatPrice(item.price, item.currency)}</Text>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.location} numberOfLines={1}>
          {item.district ? `${item.district}, ` : ''}{item.city}
        </Text>
        <View style={styles.specs}>
          <Text style={styles.specTag}>{propertyTypeLabel(item.propertyType)}</Text>
          {item.areaM2 ? <Text style={styles.specTag}>{item.areaM2} m²</Text> : null}
          {item.roomCount ? <Text style={styles.specTag}>{item.roomCount}</Text> : null}
        </View>
        <View style={styles.stats}>
          <Text style={styles.stat}>👁 {item.viewCount}</Text>
          <Text style={styles.stat}>💬 {item.whatsappClicks}</Text>
          <Text style={styles.stat}>♥ {item.favoriteCount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    width: CARD_W,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginBottom: 16,
  },
  photoWrap: { position: 'relative', height: CARD_W * 0.65 },
  photo: { width: '100%', height: '100%' },
  photoPlaceholder: { backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute', top: 8, left: 8,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  favBtn: {
    position: 'absolute', top: 6, right: 6,
    backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: Radius.full,
    width: 28, height: 28, alignItems: 'center', justifyContent: 'center',
  },
  info: { padding: 10 },
  price: { fontSize: 14, fontWeight: '800', color: Colors.ink, marginBottom: 2 },
  title: { fontSize: 12, color: Colors.ink, fontWeight: '500', lineHeight: 16 },
  location: { fontSize: 11, color: Colors.muted, marginTop: 2 },
  specs: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 6 },
  specTag: {
    fontSize: 10, color: Colors.muted, backgroundColor: '#f3f4f6',
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: Radius.sm,
  },
  stats: { flexDirection: 'row', gap: 8, marginTop: 6 },
  stat: { fontSize: 10, color: Colors.muted },
})
