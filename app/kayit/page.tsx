"use client";

import React, { useState } from 'react';
import { BrandMark } from '@/components/icons';
import { IconSparkle, IconShield, IconLayer, IconChart } from '@/components/icons';

type Step = 1 | 2 | 3 | 4;

const CITIES = [
  'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya',
  'Adana', 'Konya', 'Gaziantep', 'Mersin', 'Bodrum',
];

const PLANS = [
  {
    id: 'pro',
    name: 'Pro',
    price: '990 ₺',
    period: '/ay',
    desc: 'Bireysel danışman veya küçük acenta',
    features: ['10 aktif ilan', 'Atlas AI asistan', 'MLS erişimi', 'WhatsApp entegrasyonu', 'Aylık rapor'],
    recommended: false,
  },
  {
    id: 'kurumsal',
    name: 'Kurumsal',
    price: '2.490 ₺',
    period: '/ay',
    desc: 'Büyüyen acentalar için tam paket',
    features: ['Sınırsız ilan', 'Atlas AI öncelikli', 'MLS + PDF Broşür', 'CRM Kanban', 'Beyaz etiket site', 'SCRIBE içerik fabrikası'],
    recommended: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '5.990 ₺',
    period: '/ay',
    desc: 'Çok şubeli kurumsal acentalar',
    features: ['Her şey dahil', 'Özel hesap yöneticisi', 'FILTERRA.AI API', 'Toplu ilan aktarımı', 'SLA garantisi'],
    recommended: false,
  },
];

export default function KayitPage() {
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ agencyName: '', phone: '', city: '', fullName: '' });
  const [plan, setPlan] = useState('kurumsal');
  const [listing, setListing] = useState({ title: '', price: '', kind: 'satilik', city: '', rooms: '', area: '' });

  const handleSendLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    setTimeout(() => setStep(2), 1500);
  };

  const handleProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handleListing = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(4);
  };

  return (
    <div className="onboarding">
      {/* Left panel */}
      <aside className="onboarding-side">
        <div className="onboarding-brand">
          <BrandMark size={40}/>
          <span>7fil</span>
        </div>

        <div className="onboarding-steps">
          {[
            { n: 1, label: 'E-posta Doğrulama' },
            { n: 2, label: 'Acenta Profili' },
            { n: 3, label: 'Paket Seç' },
            { n: 4, label: 'İlk İlanını Gir' },
          ].map(s => (
            <div
              key={s.n}
              className={`onboarding-step ${step === s.n ? 'is-active' : ''} ${step > s.n ? 'is-done' : ''}`}
            >
              <div className="onboarding-step-num">
                {step > s.n ? '✓' : s.n}
              </div>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="onboarding-perks">
          <div className="onboarding-perk"><IconSparkle size={14}/> Atlas AI dahil — Sahibinden'de yok</div>
          <div className="onboarding-perk"><IconLayer size={14}/> Türkiye'nin ilk MLS sistemi</div>
          <div className="onboarding-perk"><IconShield size={14}/> Tapu doğrulama · Hukuki ağ</div>
          <div className="onboarding-perk"><IconChart size={14}/> Gerçek zamanlı ilan analitikleri</div>
        </div>
      </aside>

      {/* Right panel */}
      <main className="onboarding-main">

        {/* Step 1 — Email */}
        {step === 1 && (
          <div className="onboarding-form-wrap">
            <span className="eyebrow eyebrow-gold">Adım 1 / 4</span>
            <h2>7fil'e hoş geldiniz.</h2>
            <p style={{ color: 'var(--muted)', marginBottom: 32 }}>
              E-posta adresinize güvenli giriş bağlantısı gönderelim.
            </p>
            {!sent ? (
              <form onSubmit={handleSendLink} className="onboarding-field-group">
                <div className="onboarding-field">
                  <label>E-posta adresi</label>
                  <input
                    type="email"
                    placeholder="acenta@sirket.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button className="btn btn-primary" style={{ width: '100%', height: 48 }}>
                  Giriş Bağlantısı Gönder
                </button>
                <p style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', marginTop: 12 }}>
                  Şifre yok. Bağlantıya tıklamanız yeterli.
                </p>
              </form>
            ) : (
              <div className="onboarding-sent">
                <div className="onboarding-sent-icon">✉️</div>
                <h3>Bağlantı gönderildi!</h3>
                <p>{email} adresine giriş bağlantısı gönderdik.</p>
                <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 8 }}>Yönlendiriliyor…</p>
              </div>
            )}
          </div>
        )}

        {/* Step 2 — Profile */}
        {step === 2 && (
          <div className="onboarding-form-wrap">
            <span className="eyebrow eyebrow-gold">Adım 2 / 4</span>
            <h2>Acenta profilinizi oluşturun.</h2>
            <p style={{ color: 'var(--muted)', marginBottom: 32 }}>Bu bilgiler ilan sayfalarında müşteriye gösterilecek.</p>
            <form onSubmit={handleProfile} className="onboarding-field-group">
              <div className="onboarding-field">
                <label>Tam adınız</label>
                <input
                  placeholder="Zeynep Aydın"
                  value={form.fullName}
                  onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                  required
                />
              </div>
              <div className="onboarding-field">
                <label>Acenta / Şirket adı</label>
                <input
                  placeholder="Aydın Gayrimenkul"
                  value={form.agencyName}
                  onChange={e => setForm(f => ({ ...f, agencyName: e.target.value }))}
                  required
                />
              </div>
              <div className="onboarding-row">
                <div className="onboarding-field">
                  <label>Telefon</label>
                  <input
                    placeholder="0532 000 00 00"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    required
                  />
                </div>
                <div className="onboarding-field">
                  <label>Faaliyet şehri</label>
                  <select value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} required>
                    <option value="">Seçin</option>
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', height: 48 }}>
                Devam →
              </button>
            </form>
          </div>
        )}

        {/* Step 3 — Plan */}
        {step === 3 && (
          <div className="onboarding-form-wrap" style={{ maxWidth: 760 }}>
            <span className="eyebrow eyebrow-gold">Adım 3 / 4</span>
            <h2>Paketinizi seçin.</h2>
            <p style={{ color: 'var(--muted)', marginBottom: 32 }}>İlk 14 gün ücretsiz. Kredi kartı gerekmez.</p>
            <div className="onboarding-plans">
              {PLANS.map(p => (
                <div
                  key={p.id}
                  className={`onboarding-plan ${plan === p.id ? 'is-selected' : ''} ${p.recommended ? 'is-recommended' : ''}`}
                  onClick={() => setPlan(p.id)}
                >
                  {p.recommended && <div className="onboarding-plan-badge">Önerilen</div>}
                  <div className="onboarding-plan-name">{p.name}</div>
                  <div className="onboarding-plan-price">
                    {p.price}<span>{p.period}</span>
                  </div>
                  <div className="onboarding-plan-desc">{p.desc}</div>
                  <ul className="onboarding-plan-features">
                    {p.features.map(f => <li key={f}>✓ {f}</li>)}
                  </ul>
                </div>
              ))}
            </div>
            <button className="btn btn-primary" style={{ width: '100%', height: 48, marginTop: 24 }} onClick={() => setStep(4)}>
              {PLANS.find(p => p.id === plan)?.name} Paketi ile Devam →
            </button>
          </div>
        )}

        {/* Step 4 — First listing */}
        {step === 4 && (
          <div className="onboarding-form-wrap">
            <span className="eyebrow eyebrow-gold">Adım 4 / 4</span>
            <h2>İlk ilanınızı girin.</h2>
            <p style={{ color: 'var(--muted)', marginBottom: 32 }}>Atlas AI başlık ve açıklama önerecek. Sonra düzenleyebilirsiniz.</p>
            <form onSubmit={handleListing} className="onboarding-field-group">
              <div className="onboarding-row">
                <div className="onboarding-field">
                  <label>İlan türü</label>
                  <select value={listing.kind} onChange={e => setListing(l => ({ ...l, kind: e.target.value }))}>
                    <option value="satilik">Satılık</option>
                    <option value="kiralik">Kiralık</option>
                  </select>
                </div>
                <div className="onboarding-field">
                  <label>Şehir</label>
                  <select value={listing.city} onChange={e => setListing(l => ({ ...l, city: e.target.value }))} required>
                    <option value="">Seçin</option>
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="onboarding-field">
                <label>İlan başlığı</label>
                <input
                  placeholder="Ör: Kadıköy'de balkonlu 3+1 daire"
                  value={listing.title}
                  onChange={e => setListing(l => ({ ...l, title: e.target.value }))}
                  required
                />
              </div>
              <div className="onboarding-row">
                <div className="onboarding-field">
                  <label>Fiyat (₺)</label>
                  <input
                    placeholder="8.500.000"
                    value={listing.price}
                    onChange={e => setListing(l => ({ ...l, price: e.target.value }))}
                    required
                  />
                </div>
                <div className="onboarding-field">
                  <label>Oda sayısı</label>
                  <select value={listing.rooms} onChange={e => setListing(l => ({ ...l, rooms: e.target.value }))} required>
                    <option value="">Seçin</option>
                    {['1+0','1+1','2+1','3+1','4+1','5+2','Ofis'].map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div className="onboarding-field">
                  <label>Alan (m²)</label>
                  <input
                    placeholder="120"
                    value={listing.area}
                    onChange={e => setListing(l => ({ ...l, area: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <button className="btn btn-atlas" style={{ width: '100%', height: 48 }}>
                <IconSparkle size={14}/> Atlas AI ile İlanı Tamamla ve Yayınla
              </button>
              <button type="button" className="btn btn-outline" style={{ width: '100%', height: 44, marginTop: 8 }} onClick={() => window.location.href = '/panel'}>
                Şimdilik atla, Panele git →
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}
