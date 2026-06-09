import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ScrollView } from 'react-native'
import { router } from 'expo-router'
import { useAuthStore } from '../../store/auth'
import { Colors, Radius, Shadow } from '../../lib/theme'

const ROLE_LABELS: Record<string, string> = {
  buyer: 'Alıcı / Kiracı',
  agency: 'Emlak Ofisi',
  agent_person: 'Bireysel Emlakçı',
  lawyer: 'Avukat',
  bank: 'Banka',
  admin: 'Yönetici',
}

export default function ProfileScreen() {
  const { user, clearAuth, accessToken } = useAuthStore()

  function handleLogout() {
    Alert.alert('Çıkış Yap', 'Hesabınızdan çıkmak istediğinize emin misiniz?', [
      {
        text: 'Çıkış Yap',
        style: 'destructive',
        onPress: async () => {
          await clearAuth()
          router.replace('/(tabs)/')
        },
      },
      { text: 'İptal', style: 'cancel' },
    ])
  }

  if (!accessToken || !user) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.center}>
          <Text style={styles.lockIcon}>👤</Text>
          <Text style={styles.title}>Hesabınız</Text>
          <Text style={styles.subtitle}>Profil bilgilerini görmek için giriş yapın.</Text>
          <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.loginBtnText}>Giriş Yap</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.registerBtn} onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.registerBtnText}>Hesap Oluştur</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  const initials = user.name.split(' ').map((n) => n[0] ?? '').join('').toUpperCase().slice(0, 2)

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Avatar + name */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{ROLE_LABELS[user.role] ?? user.role}</Text>
          </View>
        </View>

        {/* Info cards */}
        <View style={[styles.card, Shadow.sm]}>
          <InfoRow label="Ad Soyad" value={user.name} />
          <InfoRow label="E-posta" value={user.email} />
          {user.phone && <InfoRow label="Telefon" value={user.phone} />}
          <InfoRow label="Hesap Türü" value={ROLE_LABELS[user.role] ?? user.role} />
        </View>

        {/* Quick links */}
        <View style={[styles.card, Shadow.sm]}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Web Panel', 'Tam panel için: panel.7fil.com.tr')}
          >
            <Text style={styles.menuIcon}>📊</Text>
            <Text style={styles.menuText}>Web Paneli Aç</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Destek', 'Destek için: destek@7fil.com.tr')}
          >
            <Text style={styles.menuIcon}>💬</Text>
            <Text style={styles.menuText}>Destek</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Hakkında', '7fil v1.0.0\nTürkiye\'nin Entegre Gayrimenkul Platformu\n\n© 2025 Connective Hub')}
          >
            <Text style={styles.menuIcon}>ℹ️</Text>
            <Text style={styles.menuText}>Hakkında</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.cream },
  scroll: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.ink, alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { color: Colors.gold, fontSize: 28, fontWeight: '800' },
  name: { fontSize: 20, fontWeight: '700', color: Colors.ink },
  email: { fontSize: 13, color: Colors.muted, marginTop: 2 },
  roleBadge: {
    marginTop: 8, paddingHorizontal: 12, paddingVertical: 4,
    backgroundColor: Colors.teal + '22', borderRadius: Radius.full,
  },
  roleBadgeText: { fontSize: 12, color: Colors.tealDark, fontWeight: '600' },
  card: {
    backgroundColor: '#fff', borderRadius: Radius.lg, marginBottom: 16,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 13,
    borderBottomWidth: 1, borderColor: '#f1f5f9',
  },
  infoLabel: { fontSize: 13, color: Colors.muted },
  infoValue: { fontSize: 13, fontWeight: '500', color: Colors.ink, flex: 1, textAlign: 'right' },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderColor: '#f1f5f9',
  },
  menuIcon: { fontSize: 18, marginRight: 12 },
  menuText: { flex: 1, fontSize: 14, color: Colors.ink },
  menuArrow: { fontSize: 20, color: Colors.muted },
  logoutBtn: {
    borderWidth: 1, borderColor: '#fca5a5', backgroundColor: '#fef2f2',
    borderRadius: Radius.lg, paddingVertical: 14, alignItems: 'center', marginTop: 8,
  },
  logoutText: { color: Colors.error, fontWeight: '700', fontSize: 15 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, paddingTop: 80 },
  lockIcon: { fontSize: 52, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '700', color: Colors.ink },
  subtitle: { fontSize: 13, color: Colors.muted, textAlign: 'center', marginTop: 8 },
  loginBtn: { backgroundColor: Colors.ink, borderRadius: 12, paddingHorizontal: 40, paddingVertical: 13, marginTop: 24, width: '100%', alignItems: 'center' },
  loginBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  registerBtn: { borderWidth: 1.5, borderColor: Colors.teal, borderRadius: 12, paddingHorizontal: 40, paddingVertical: 12, marginTop: 10, width: '100%', alignItems: 'center' },
  registerBtnText: { color: Colors.teal, fontWeight: '700', fontSize: 15 },
})
