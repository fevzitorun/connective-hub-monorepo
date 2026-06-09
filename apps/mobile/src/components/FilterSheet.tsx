import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, TextInput } from 'react-native'
import { Colors, Radius } from '../lib/theme'

export type Filters = {
  listingType: 'sale' | 'rent' | ''
  propertyType: string
  city: string
  priceMin: string
  priceMax: string
  areaMin: string
  areaMax: string
}

type Props = {
  visible: boolean
  filters: Filters
  onChange: (f: Filters) => void
  onApply: () => void
  onClose: () => void
  onReset: () => void
}

const LISTING_TYPES = [
  { key: '', label: 'Tümü' },
  { key: 'sale', label: 'Satılık' },
  { key: 'rent', label: 'Kiralık' },
]

const PROPERTY_TYPES = [
  { key: '', label: 'Tümü' },
  { key: 'apartment', label: 'Daire' },
  { key: 'house', label: 'Müstakil' },
  { key: 'villa', label: 'Villa' },
  { key: 'land', label: 'Arsa' },
  { key: 'office', label: 'Ofis' },
  { key: 'shop', label: 'Dükkan' },
]

export function FilterSheet({ visible, filters, onChange, onApply, onClose, onReset }: Props) {
  function set(partial: Partial<Filters>) {
    onChange({ ...filters, ...partial })
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.root}>
        {/* Handle */}
        <View style={styles.handle} />

        <View style={styles.header}>
          <TouchableOpacity onPress={onReset}>
            <Text style={styles.resetText}>Sıfırla</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Filtreler</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          {/* Listing type */}
          <Text style={styles.section}>İlan Türü</Text>
          <View style={styles.chips}>
            {LISTING_TYPES.map((t) => (
              <TouchableOpacity
                key={t.key}
                style={[styles.chip, filters.listingType === t.key && styles.chipActive]}
                onPress={() => set({ listingType: t.key as Filters['listingType'] })}
              >
                <Text style={[styles.chipText, filters.listingType === t.key && styles.chipTextActive]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Property type */}
          <Text style={styles.section}>Emlak Tipi</Text>
          <View style={styles.chips}>
            {PROPERTY_TYPES.map((t) => (
              <TouchableOpacity
                key={t.key}
                style={[styles.chip, filters.propertyType === t.key && styles.chipActive]}
                onPress={() => set({ propertyType: t.key })}
              >
                <Text style={[styles.chipText, filters.propertyType === t.key && styles.chipTextActive]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* City */}
          <Text style={styles.section}>Şehir</Text>
          <TextInput
            style={styles.textInput}
            value={filters.city}
            onChangeText={(v) => set({ city: v })}
            placeholder="Örn: İstanbul"
            placeholderTextColor={Colors.muted}
          />

          {/* Price range */}
          <Text style={styles.section}>Fiyat Aralığı (₺)</Text>
          <View style={styles.rangeRow}>
            <TextInput
              style={[styles.textInput, { flex: 1 }]}
              value={filters.priceMin}
              onChangeText={(v) => set({ priceMin: v })}
              placeholder="Min"
              placeholderTextColor={Colors.muted}
              keyboardType="numeric"
            />
            <Text style={styles.rangeSep}>—</Text>
            <TextInput
              style={[styles.textInput, { flex: 1 }]}
              value={filters.priceMax}
              onChangeText={(v) => set({ priceMax: v })}
              placeholder="Max"
              placeholderTextColor={Colors.muted}
              keyboardType="numeric"
            />
          </View>

          {/* Area range */}
          <Text style={styles.section}>Alan (m²)</Text>
          <View style={styles.rangeRow}>
            <TextInput
              style={[styles.textInput, { flex: 1 }]}
              value={filters.areaMin}
              onChangeText={(v) => set({ areaMin: v })}
              placeholder="Min"
              placeholderTextColor={Colors.muted}
              keyboardType="numeric"
            />
            <Text style={styles.rangeSep}>—</Text>
            <TextInput
              style={[styles.textInput, { flex: 1 }]}
              value={filters.areaMax}
              onChangeText={(v) => set({ areaMax: v })}
              placeholder="Max"
              placeholderTextColor={Colors.muted}
              keyboardType="numeric"
            />
          </View>
        </ScrollView>

        <View style={styles.applyWrap}>
          <TouchableOpacity style={styles.applyBtn} onPress={onApply} activeOpacity={0.85}>
            <Text style={styles.applyText}>Filtrele</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  handle: { width: 40, height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, alignSelf: 'center', marginTop: 10 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  title: { fontSize: 16, fontWeight: '700', color: Colors.ink },
  resetText: { fontSize: 14, color: Colors.error },
  closeText: { fontSize: 18, color: Colors.muted },
  body: { paddingHorizontal: 20, paddingBottom: 24 },
  section: { fontSize: 12, fontWeight: '700', color: Colors.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 20, marginBottom: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border },
  chipActive: { borderColor: Colors.teal, backgroundColor: Colors.teal + '15' },
  chipText: { fontSize: 13, color: Colors.muted },
  chipTextActive: { color: Colors.teal, fontWeight: '600' },
  textInput: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md,
    paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: Colors.ink,
  },
  rangeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rangeSep: { color: Colors.muted, fontSize: 16 },
  applyWrap: { paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1, borderColor: Colors.border },
  applyBtn: { backgroundColor: Colors.teal, borderRadius: Radius.md, paddingVertical: 15, alignItems: 'center' },
  applyText: { color: '#fff', fontWeight: '700', fontSize: 15 },
})
