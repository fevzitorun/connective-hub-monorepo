import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert, ScrollView,
} from 'react-native'
import { router } from 'expo-router'
import { authApi } from '../../lib/api'
import { useAuthStore } from '../../store/auth'
import { Colors } from '../../lib/theme'

const ROLES = [
  { key: 'buyer', label: 'Alıcı / Kiracı' },
  { key: 'agency', label: 'Emlak Ofisi' },
  { key: 'agent_person', label: 'Bireysel Emlakçı' },
  { key: 'lawyer', label: 'Avukat' },
]

export default function RegisterScreen() {
  const { setAuth } = useAuthStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('buyer')
  const [loading, setLoading] = useState(false)

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert('Hata', 'Ad, e-posta ve şifre zorunludur.')
      return
    }
    if (password.length < 8) {
      Alert.alert('Hata', 'Şifre en az 8 karakter olmalı.')
      return
    }
    setLoading(true)
    try {
      const res = await authApi.register({
        name: name.trim(), email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined, password, role,
      })
      await setAuth(res.user, res.accessToken, res.refreshToken)
      router.replace('/(tabs)/')
    } catch (e) {
      Alert.alert('Kayıt Başarısız', e instanceof Error ? e.message : 'Bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.ink }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>7<Text style={styles.logoAccent}>fil</Text></Text>
        <Text style={styles.subtitle}>Yeni Hesap Oluştur</Text>

        <Text style={styles.label}>Ad Soyad</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName}
          placeholder="Adınız" placeholderTextColor={Colors.muted} />

        <Text style={styles.label}>E-posta</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail}
          placeholder="ornek@mail.com" placeholderTextColor={Colors.muted}
          keyboardType="email-address" autoCapitalize="none" />

        <Text style={styles.label}>Telefon (opsiyonel)</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone}
          placeholder="05XX XXX XX XX" placeholderTextColor={Colors.muted}
          keyboardType="phone-pad" />

        <Text style={styles.label}>Şifre</Text>
        <TextInput style={styles.input} value={password} onChangeText={setPassword}
          placeholder="En az 8 karakter" placeholderTextColor={Colors.muted}
          secureTextEntry />

        <Text style={[styles.label, { marginTop: 16 }]}>Hesap Türü</Text>
        <View style={styles.roleGrid}>
          {ROLES.map((r) => (
            <TouchableOpacity
              key={r.key}
              style={[styles.roleBtn, role === r.key && styles.roleBtnActive]}
              onPress={() => setRole(r.key)}
            >
              <Text style={[styles.roleBtnText, role === r.key && styles.roleBtnTextActive]}>
                {r.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Kayıt Ol</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16, alignItems: 'center' }}>
          <Text style={{ color: Colors.muted, fontSize: 13 }}>
            Hesabın var mı? <Text style={{ color: Colors.gold, fontWeight: '600' }}>Giriş Yap</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 28, paddingVertical: 60 },
  logo: { fontSize: 40, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 4 },
  logoAccent: { color: Colors.gold },
  subtitle: { color: Colors.muted, textAlign: 'center', fontSize: 13, marginBottom: 32 },
  label: { color: Colors.muted, fontSize: 11, fontWeight: '600', marginTop: 12, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    backgroundColor: '#2a2a3e', color: '#fff', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 13, fontSize: 15,
    borderWidth: 1, borderColor: '#3a3a5e',
  },
  roleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  roleBtn: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999,
    borderWidth: 1, borderColor: '#3a3a5e', backgroundColor: '#2a2a3e',
  },
  roleBtnActive: { borderColor: Colors.teal, backgroundColor: Colors.teal + '22' },
  roleBtnText: { color: Colors.muted, fontSize: 13 },
  roleBtnTextActive: { color: Colors.teal, fontWeight: '600' },
  btn: {
    backgroundColor: Colors.teal, borderRadius: 12, paddingVertical: 15,
    alignItems: 'center', marginTop: 28,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
})
