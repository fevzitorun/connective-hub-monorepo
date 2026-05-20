export default function Footer() {
  return (
    <footer style={{ background: "var(--ink)", color: "rgba(255,255,255,0.4)", padding: "40px 40px 24px", marginTop: 40 }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 32 }}>
        <div>
          <div className="serif" style={{ fontSize: 24, color: "#fff" }}>
            7<span style={{ color: "var(--gold)" }}>fil</span>
          </div>
          <div style={{ fontSize: 12, marginTop: 8, lineHeight: 1.7 }}>
            Türkiye'nin entegre gayrimenkul ekosistemi. İlan, hukuk, finans, müzayede ve yapay zeka — tek platformda.
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            {["𝕏", "in", "📷"].map((s, i) => (
              <span key={i} style={{ background: "rgba(255,255,255,0.08)", width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>{s}</span>
            ))}
          </div>
        </div>

        <div>
          <h4 style={{ color: "#fff", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Platform</h4>
          {["İlanlar", "Müzayede", "Kredi Hesaplama", "DASK Sigorta", "Atlas AI"].map(l => (
            <a key={l} href="#" style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.4)", textDecoration: "none", marginBottom: 6 }}
              className="hover:text-[var(--gold)]">{l}</a>
          ))}
        </div>

        <div>
          <h4 style={{ color: "#fff", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Kurumsal</h4>
          {["Ajans Paneli", "Beyaz Etiket", "Partner Programı", "API Dokümantasyon"].map(l => (
            <a key={l} href="#" style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.4)", textDecoration: "none", marginBottom: 6 }}
              className="hover:text-[var(--gold)]">{l}</a>
          ))}
        </div>

        <div>
          <h4 style={{ color: "#fff", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Hukuki</h4>
          {["Gizlilik Politikası", "KVKK Aydınlatma", "Kullanım Koşulları", "Çerez Politikası"].map(l => (
            <a key={l} href="#" style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.4)", textDecoration: "none", marginBottom: 6 }}
              className="hover:text-[var(--gold)]">{l}</a>
          ))}
        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20, display: "flex", justifyContent: "space-between", fontSize: 11 }}>
        <span>© 2026 Connective Hub Dijital Teknolojiler Ltd. Şti. — Tüm hakları saklıdır.</span>
        <span>v1.0.0 — İstanbul, Türkiye 🇹🇷</span>
      </div>
    </footer>
  );
}
