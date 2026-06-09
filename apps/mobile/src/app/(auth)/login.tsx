import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native'
import { Link, router } from 'expo-router'
import { authApi } from '../../lib/api'
import { useAuthStore } from '../../store/auth'
import { Colors, Fonts } from '../../lib/theme'

export default function LoginScreen() {
  const { setAuth } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert('Hata', 'E-posta ve şifre gerekli.')
      return
    }
    setLoading(true)
    try {
      const res = await authApi.login(email.trim().toLowerCase(), password)
      await setAuth(res.user, res.accessToken, res.refreshToken)
      router.replace('/(tabs)/')
    } catch (e) {
      Alert.alert('Giriş Başarısız', e instanceof Error ? e.message : 'Bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.logo}>7<Text style={styles.logoAccent}>fil</Text></Text>
        <Text style={styles.subtitle}>Türkiye'nin Entegre Gayrimenkul Platformu</Text>

        <View style={styles.form}>
          <Text style={styles.label}>E-posta</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="ornek@mail.com"
            placeholderTextColor={Colors.muted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Şifre</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={Colors.muted}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Giriş Yap</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Hesabın yok mu? </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text style={styles.link}>Kayıt Ol</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.ink },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 28 },
  logo: { fontSize: 48, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 4 },
  logoAccent: { color: Colors.gold },
  subtitle: { color: Colors.muted, textAlign: 'center', fontSize: 13, marginBottom: 40 },
  form: { gap: 8 },
  label: { color: Colors.muted, fontSize: 12, fontWeight: '600', marginTop: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    backgroundColor: '#2a2a3e', color: '#fff', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 13, fontSize: 15,
    borderWidth: 1, borderColor: '#3a3a5e',
  },
  btn: {
    backgroundColor: Colors.teal, borderRadius: 12, paddingVertical: 15,
    alignItems: 'center', marginTop: 20,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { color: Colors.muted, fontSize: 13 },
  link: { color: Colors.gold, fontSize: 13, fontWeight: '600' },
})
