import { useState, useCallback, useRef } from 'react'
import {
  View, FlatList, ActivityIndicator, Text, StyleSheet,
  SafeAreaView, RefreshControl,
} from 'react-native'
import { useFocusEffect } from 'expo-router'
import { SearchBar } from '../../components/SearchBar'
import { ListingCard } from '../../components/ListingCard'
import { FilterSheet, type Filters } from '../../components/FilterSheet'
import { listingsApi, type Listing, type SearchParams } from '../../lib/api'
import { useAuthStore } from '../../store/auth'
import { Colors } from '../../lib/theme'

const DEFAULT_FILTERS: Filters = {
  listingType: '', propertyType: '', city: '',
  priceMin: '', priceMax: '', areaMin: '', areaMax: '',
}

export default function ExploreScreen() {
  const { accessToken } = useAuthStore()
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [filterOpen, setFilterOpen] = useState(false)

  const [listings, setListings] = useState<Listing[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const isFirstLoad = useRef(true)

  function buildParams(p: number): SearchParams {
    const params: SearchParams = { q: query || undefined, page: p, perPage: 20 }
    if (filters.listingType) params.listingType = filters.listingType
    if (filters.propertyType) params.propertyType = filters.propertyType
    if (filters.city) params.city = filters.city
    if (filters.priceMin) params.priceMin = Number(filters.priceMin)
    if (filters.priceMax) params.priceMax = Number(filters.priceMax)
    if (filters.areaMin) params.areaMin = Number(filters.areaMin)
    if (filters.areaMax) params.areaMax = Number(filters.areaMax)
    return params
  }

  async function load(p: number, reset = false) {
    if (loading) return
    setLoading(true)
    try {
      const res = await listingsApi.search(buildParams(p), accessToken)
      setTotal(res.total)
      setListings((prev) => reset ? res.data : [...prev, ...res.data])
      setPage(p)
    } catch {
      // silently ignore
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(useCallback(() => {
    if (isFirstLoad.current) { isFirstLoad.current = false; load(1, true) }
  }, []))

  async function handleRefresh() {
    setRefreshing(true)
    await load(1, true)
    setRefreshing(false)
  }

  function handleSearch() {
    load(1, true)
  }

  function handleApplyFilters() {
    setFilterOpen(false)
    load(1, true)
  }

  function handleLoadMore() {
    const totalPages = Math.ceil(total / 20)
    if (!loading && page < totalPages) load(page + 1)
  }

  async function toggleFavorite(id: string) {
    if (!accessToken) return
    const isFav = favorites.has(id)
    setFavorites((prev) => {
      const next = new Set(prev)
      isFav ? next.delete(id) : next.add(id)
      return next
    })
    try {
      if (isFav) await listingsApi.removeFavorite(id, accessToken)
      else await listingsApi.addFavorite(id, accessToken)
    } catch {
      // revert
      setFavorites((prev) => {
        const next = new Set(prev)
        isFav ? next.add(id) : next.delete(id)
        return next
      })
    }
  }

  return (
    <SafeAreaView style={styles.root}>
      {/* Search bar */}
      <View style={styles.searchWrap}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onSubmit={handleSearch}
          onFilterPress={() => setFilterOpen(true)}
        />
        {total > 0 && (
          <Text style={styles.resultCount}>{total.toLocaleString('tr-TR')} ilan bulundu</Text>
        )}
      </View>

      {/* Listings */}
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ListingCard
            item={item}
            isFavorite={favorites.has(item.id)}
            onFavoriteToggle={accessToken ? toggleFavorite : undefined}
          />
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={Colors.teal} />}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🏠</Text>
              <Text style={styles.emptyText}>İlan bulunamadı</Text>
              <Text style={styles.emptySubtext}>Farklı filtreler deneyebilirsiniz</Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          loading && listings.length > 0 ? (
            <ActivityIndicator color={Colors.teal} style={{ marginVertical: 20 }} />
          ) : null
        }
      />

      {/* Initial loading */}
      {loading && listings.length === 0 && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.teal} />
        </View>
      )}

      {/* Filter sheet */}
      <FilterSheet
        visible={filterOpen}
        filters={filters}
        onChange={setFilters}
        onApply={handleApplyFilters}
        onClose={() => setFilterOpen(false)}
        onReset={() => setFilters(DEFAULT_FILTERS)}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.cream },
  searchWrap: { backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, borderBottomWidth: 1, borderColor: Colors.border },
  resultCount: { fontSize: 11, color: Colors.muted, marginTop: 6 },
  row: { paddingHorizontal: 16, gap: 16, justifyContent: 'space-between' },
  list: { paddingTop: 16, paddingBottom: 24 },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, fontWeight: '700', color: Colors.ink },
  emptySubtext: { fontSize: 13, color: Colors.muted, marginTop: 4 },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.cream },
})
