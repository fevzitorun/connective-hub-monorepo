'use client'
import { useEffect, useState, useCallback } from 'react'
import { useAuthStore } from '../../../store/auth'
import { partnerApi, ApiKey } from '../../../lib/api'

export default function ApiKeysPage() {
  const { accessToken } = useAuthStore()
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [newKeyName, setNewKeyName] = useState('')
  const [creating, setCreating] = useState(false)
  const [newKeyValue, setNewKeyValue] = useState<string | null>(null)
  const [revoking, setRevoking] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const load = useCallback(async () => {
    if (!accessToken) return
    const res = await partnerApi.listApiKeys(accessToken).catch(() => null)
    if (res) setKeys(res.data)
  }, [accessToken])

  useEffect(() => { load() }, [load])

  async function createKey() {
    if (!accessToken || !newKeyName.trim()) return
    setCreating(true)
    setError(null)
    try {
      const res = await partnerApi.createApiKey(accessToken, newKeyName.trim())
      setNewKeyValue(res.data.key)
      setNewKeyName('')
      load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Hata oluştu')
    } finally {
      setCreating(false)
    }
  }

  async function revokeKey(id: string) {
    if (!accessToken) return
    setRevoking(id)
    await partnerApi.revokeApiKey(accessToken, id).catch(() => null)
    setRevoking(null)
    load()
  }

  function copyKey() {
    if (!newKeyValue) return
    navigator.clipboard.writeText(newKeyValue).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">API Anahtarları</h1>
        <p className="text-muted text-sm mt-0.5">REST API entegrasyonu için anahtar yönetimi</p>
      </div>

      {/* New key revealed */}
      {newKeyValue && (
        <div className="mb-6 bg-teal/10 border border-teal/30 rounded-xl p-5">
          <p className="text-sm font-semibold text-teal mb-2">Yeni API Anahtarı (bir kez gösterilir — kaydedin!)</p>
          <div className="flex items-center gap-3">
            <code className="flex-1 bg-white text-ink text-xs font-mono px-4 py-3 rounded-xl border border-teal/20 break-all">
              {newKeyValue}
            </code>
            <button onClick={copyKey} className="btn-primary text-xs flex-shrink-0">
              {copied ? '✓' : 'Kopyala'}
            </button>
          </div>
          <button onClick={() => setNewKeyValue(null)} className="mt-3 text-xs text-muted hover:text-ink">
            Kapat
          </button>
        </div>
      )}

      {/* Create form */}
      <div className="card p-5 mb-6">
        <h2 className="font-semibold text-ink mb-3">Yeni Anahtar Oluştur</h2>
        <div className="flex gap-3">
          <input
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && createKey()}
            className="input-base flex-1"
            placeholder="Anahtar adı (örn: Web Sitesi, Mobil App)"
          />
          <button onClick={createKey} disabled={creating || !newKeyName.trim()} className="btn-primary">
            {creating ? 'Oluşturuluyor...' : 'Oluştur'}
          </button>
        </div>
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      </div>

      {/* Keys table */}
      <div className="card overflow-hidden">
        {keys.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted">
            Henüz API anahtarı oluşturulmadı.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Ad', 'Prefix', 'Son Kullanım', 'Bitiş', 'Durum', 'İşlem'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {keys.map((k) => (
                <tr key={k.id} className={`hover:bg-gray-50 ${k.revoked_at ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-3 font-medium text-ink">{k.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">{k.key_prefix}…</td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {k.last_used_at ? new Date(k.last_used_at).toLocaleDateString('tr-TR') : 'Hiç'}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {k.expires_at ? new Date(k.expires_at).toLocaleDateString('tr-TR') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${k.revoked_at ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                      {k.revoked_at ? 'İptal Edildi' : 'Aktif'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {!k.revoked_at && (
                      <button
                        disabled={revoking === k.id}
                        onClick={() => revokeKey(k.id)}
                        className="text-xs text-red-600 hover:underline disabled:opacity-50"
                      >
                        {revoking === k.id ? 'İptal ediliyor...' : 'İptal Et'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* API docs */}
      <div className="mt-8 bg-ink/5 rounded-xl p-5 text-sm text-muted">
        <p className="font-semibold text-ink mb-2">Kullanım</p>
        <pre className="text-xs bg-ink text-white rounded-xl p-4 overflow-x-auto">
{`GET https://api.7fil.com.tr/v1/listings
Authorization: Bearer pk_live_xxxxx

# veya
curl -H "Authorization: Bearer pk_live_xxxxx" \\
  https://api.7fil.com.tr/v1/listings?city=İstanbul`}
        </pre>
      </div>
    </div>
  )
}
