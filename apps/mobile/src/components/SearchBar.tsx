import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { Colors, Radius } from '../lib/theme'

type Props = {
  value: string
  onChangeText: (t: string) => void
  onSubmit: () => void
  onFilterPress?: () => void
  placeholder?: string
}

export function SearchBar({ value, onChangeText, onSubmit, onFilterPress, placeholder }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.inputWrap}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder ?? 'Şehir, ilçe veya başlık ara…'}
          placeholderTextColor={Colors.muted}
          returnKeyType="search"
          onSubmitEditing={onSubmit}
          autoCorrect={false}
        />
      </View>
      {onFilterPress && (
        <TouchableOpacity style={styles.filterBtn} onPress={onFilterPress} activeOpacity={0.8}>
          <View style={styles.filterIcon}>
            {[0, 3, 6].map((y) => (
              <View key={y} style={[styles.line, y === 3 && { width: 14 }, y === 6 && { width: 10 }]} />
            ))}
          </View>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  inputWrap: {
    flex: 1, backgroundColor: '#f3f4f6', borderRadius: Radius.full,
    paddingHorizontal: 16, paddingVertical: 11,
  },
  input: { fontSize: 14, color: Colors.ink },
  filterBtn: {
    width: 44, height: 44, backgroundColor: Colors.teal,
    borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center',
  },
  filterIcon: { gap: 3, alignItems: 'flex-start' },
  line: { width: 18, height: 2, backgroundColor: '#fff', borderRadius: 2 },
})
