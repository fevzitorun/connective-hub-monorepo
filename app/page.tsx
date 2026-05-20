import Link from "next/link";
import Footer from "@/components/footer";

const featured = [
  { bg: "linear-gradient(135deg,#667eea,#764ba2)", emoji: "🏠", badge: "Satılık", rent: false, price: "₺4,850,000", extra: "/ m² ₺19,400", title: "Beşiktaş'ta 3+1 Deniz Manzaralı Daire", loc: "Beşiktaş, İstanbul",  meta: ["🛏 3+1","📐 250 m²","🏢 5. Kat"] },
  { bg: "linear-gradient(135deg,#f093fb,#f5576c)", emoji: "🏢", badge: "Kiralık",  rent: true,  price: "₺45,000",    extra: "/ay",          title: "Levent Ofis Katı — Hazır Teslim",         loc: "Levent, İstanbul",   meta: ["🏢 Ticari","📐 380 m²","🔑 Hazır"] },
  { bg: "linear-gradient(135deg,#4facfe,#00f2fe)", emoji: "🏡", badge: "Satılık", rent: false, price: "₺12,500,000", extra: "",              title: "Çeşme'de Müstakil Villa — Özel Havuz",    loc: "Çeşme, İzmir",       meta: ["🛏 5+2","📐 420 m²","🏊 Havuzlu"] },
  { bg: "linear-gradient(135deg,#fa709a,#fee140)", emoji: "🏗", badge: "Satılık", rent: false, price: "₺2,200,000",  extra: "",              title: "Kadıköy'de 2+1 Yeni Bina Daire",         loc: "Kadıköy, İstanbul",  meta: ["🛏 2+1","📐 110 m²","🏢 3. Kat"] },
];

const features = [
  { icon: "🤖", title: "Atlas AI Asistan",     desc: "Claude destekli yapay zeka ile piyasa analizi, değerleme ve mahalle raporu alın." },
  { icon: "⚖️", title: "Hukuki Danışmanlık",   desc: "Tapu, ipotek, imar hukuku — platform içi avukat ağıyla anında destek." },
  { icon: "🏦", title: "Kredi & Sigorta",       desc: "BDDK limitleri, İslami finans ve DASK hesaplama. Banka başvurusu tek tıkla." },
  { icon: "🔨", title: "Gayrimenkul Müzayede",  desc: "Canlı müzayede, anlık teklif sistemi ve Socket.IO ile gerçek zamanlı deneyim." },
  { icon: "🎨", title: "Beyaz Etiket Panel",    desc: "Kendi markanızla subdomain, özel renk ve logo. Altyapı bizden, görünüm sizden." },
  { icon: "📱", title: "Mobil Uygulama",        desc: "iOS ve Android native uygulama. Expo ile anlık push bildirimleri." },
];

const plans = [
  { name: "Ücretsiz", price: "₺0",  featured: false, badge: null,          features: ["5 aktif ilan","Temel analitik","WhatsApp entegrasyonu"], btn: "Başla",           gold: false },
  { name: "Pro",      price: "₺499", featured: true,  badge: "⭐ Önerilen", features: ["50 aktif ilan","Gelişmiş analitik + raporlar","Atlas AI asistan","Müzayede oluşturma","Beyaz etiket subdomain"], btn: "Pro'ya Geç", gold: true },
  { name: "Kurumsal", price: "₺999", featured: false, badge: null,          features: ["Sınırsız ilan","Partner API erişimi","Öncelikli destek","Özel entegrasyon","SLA garantisi"], btn: "Kurumsal'a Geç", gold: false },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <div style={{ background: "var(--ink)", padding: "72px 24px 56px", textAlign: "center" }}>
        <h1 className="serif" style={{ fontSize: 48, fontWeight: 700, color: "#fff", lineHeight: 1.15 }}>
          Türkiye&apos;nin Entegre<br />
          <span style={{ color: "var(--gold)" }}>Gayrimenkul</span> Ekosistemi
        </h1>
        <p style={{ color: "rgba(255,255,255,0.55)", marginTop: 14, fontSize: 16 }}>
          İlan, hukuk, finans, müzayede ve yapay zeka — tek platformda.
        </p>

        <div style={{ maxWidth: 680, margin: "32px auto 0", background: "#fff", borderRadius: 16, padding: "6px 6px 6px 20px", display: "flex", gap: 8, alignItems: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          <span style={{ fontSize: 18, color: "var(--muted)" }}>🔍</span>
          <input type="text" placeholder="Şehir, ilçe veya mahalle ara..." style={{ flex: 1, border: "none", outline: "none", fontSize: 15, color: "var(--ink)", background: "transparent" }} />
          <select style={{ border: "none", outline: "none", color: "var(--muted)", fontSize: 13, background: "transparent", cursor: "pointer" }}>
            <option>Satılık</option><option>Kiralık</option>
          </select>
          <select style={{ border: "none", outline: "none", color: "var(--muted)", fontSize: 13, background: "transparent", cursor: "pointer" }}>
            <option>Tüm Tipler</option><option>Konut</option><option>Ticari</option><option>Arsa</option>
          </select>
          <button style={{ background: "var(--gold)", color: "var(--ink)", border: "none", borderRadius: 11, padding: "10px 22px", fontWeight: 700, fontSize: 14, cursor: "pointer", whiteSpace: "nowrap" }}>Ara</button>
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
          {["İstanbul","Ankara","İzmir","Antalya","Bursa","Bodrum"].map(c => (
            <span key={c} style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", padding: "4px 12px", borderRadius: 20, fontSize: 12, cursor: "pointer" }}>{c}</span>
          ))}
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div style={{ background: "var(--ink)", padding: "28px 40px", display: "flex" }}>
        {[
          { num: "124,500", label: "Aktif İlan" },
          { num: "3,840",   label: "Onaylı Ajans" },
          { num: "217",     label: "Canlı Müzayede" },
          { num: "98,000+", label: "Kayıtlı Kullanıcı" },
          { num: "₺2.4T",   label: "Platform İşlem Hacmi" },
        ].map((s, i, arr) => (
          <div key={s.label} style={{ flex: 1, textAlign: "center", borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
            <div className="serif" style={{ fontSize: 32, fontWeight: 700, color: "var(--gold)" }}>{s.num}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Featured Listings ── */}
      <div style={{ padding: "56px 32px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div className="serif" style={{ fontSize: 26, fontWeight: 700 }}>Öne Çıkan İlanlar</div>
            <div style={{ color: "var(--muted)", marginTop: 6 }}>Ajanslar tarafından seçilen premium ilanlar</div>
          </div>
          <Link href="/ilanlar" style={{ padding: "8px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600, border: "1px solid var(--border)", background: "#fff", color: "var(--ink)", textDecoration: "none" }}>
            Tümünü Gör →
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20, marginTop: 28 }}>
          {featured.map(l => (
            <div key={l.title} style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid var(--border)", cursor: "pointer", transition: ".2s" }}
              className="hover:shadow-lg hover:-translate-y-[2px]">
              <div style={{ height: 180, background: l.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, position: "relative" }}>
                <div style={{ position: "absolute", top: 10, left: 10, background: l.rent ? "var(--teal)" : "var(--gold)", color: l.rent ? "#fff" : "var(--ink)", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6 }}>{l.badge}</div>
                {l.emoji}
              </div>
              <div style={{ padding: 14 }}>
                <div className="serif" style={{ fontSize: 20, fontWeight: 700 }}>
                  {l.price} {l.extra && <small style={{ fontSize: 12, fontFamily: "system-ui", fontWeight: 400, color: "var(--muted)" }}>{l.extra}</small>}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.title}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>📍 {l.loc}</div>
                <div style={{ display: "flex", gap: 12, marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border)" }}>
                  {l.meta.map(m => <span key={m} style={{ fontSize: 11, color: "var(--muted)" }}>{m}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <div style={{ background: "var(--ink)", padding: "56px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="serif" style={{ fontSize: 26, fontWeight: 700, color: "#fff" }}>Tek Platformda Her Şey</div>
          <div style={{ color: "rgba(255,255,255,0.45)", marginTop: 6 }}>Türkiye&apos;nin ilk entegre gayrimenkul ekosistemi</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, marginTop: 32 }}>
            {features.map(f => (
              <div key={f.title} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#fff" }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 6, lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Pricing ── */}
      <div style={{ padding: "56px 32px", maxWidth: 1200, margin: "0 auto" }}>
        <div className="serif" style={{ fontSize: 26, fontWeight: 700 }}>Ajans Abonelik Planları</div>
        <div style={{ color: "var(--muted)", marginTop: 6 }}>İlk ay ücretsiz, dilediğiniz zaman iptal</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginTop: 32 }}>
          {plans.map(p => (
            <div key={p.name} style={{ background: "#fff", borderRadius: 20, padding: 28, border: p.featured ? "1px solid var(--gold)" : "1px solid var(--border)", boxShadow: p.featured ? "0 0 0 3px rgba(245,200,66,0.15)" : "none" }}>
              {p.badge && <div style={{ display: "inline-block", background: "var(--gold)", color: "var(--ink)", fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 20, marginBottom: 12 }}>{p.badge}</div>}
              <div className="serif" style={{ fontSize: 20, fontWeight: 700 }}>{p.name}</div>
              <div style={{ fontSize: 36, fontWeight: 700, marginTop: 8 }}>{p.price} <small style={{ fontSize: 14, fontWeight: 400, color: "var(--muted)" }}>/ay</small></div>
              <div style={{ marginTop: 16 }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: "flex", gap: 8, fontSize: 13, padding: "5px 0" }}>
                    <span style={{ color: "var(--teal)", fontWeight: 700, flexShrink: 0 }}>✓</span>{f}
                  </div>
                ))}
              </div>
              <button style={{ width: "100%", marginTop: 20, padding: 12, borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer", border: p.gold ? "none" : "2px solid var(--border)", background: p.gold ? "var(--gold)" : "transparent", color: "var(--ink)" }}>
                {p.btn}
              </button>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
