"use client";
import { useState } from "react";

const allListings = [
  { bg: "linear-gradient(135deg,#667eea,#764ba2)", emoji: "🏠", badge: "Satılık", rent: false, price: "₺4,850,000", extra: "",    title: "Beşiktaş 3+1 Deniz Manzaralı", loc: "Beşiktaş, İstanbul",  meta: ["🛏 3+1","📐 250 m²"] },
  { bg: "linear-gradient(135deg,#f093fb,#f5576c)", emoji: "🏡", badge: "Satılık", rent: false, price: "₺2,750,000", extra: "",    title: "Ataşehir Yeni Proje 3+1",       loc: "Ataşehir, İstanbul", meta: ["🛏 3+1","📐 145 m²"] },
  { bg: "linear-gradient(135deg,#43e97b,#38f9d7)", emoji: "🏢", badge: "Kiralık", rent: true,  price: "₺28,000",    extra: "/ay", title: "Şişli 2+1 Merkezi Konum",       loc: "Şişli, İstanbul",    meta: ["🛏 2+1","📐 95 m²"] },
  { bg: "linear-gradient(135deg,#4facfe,#00f2fe)", emoji: "🏠", badge: "Satılık", rent: false, price: "₺6,200,000", extra: "",    title: "Sarıyer Boğaz Manzaralı Villa",  loc: "Sarıyer, İstanbul",  meta: ["🛏 4+2","📐 320 m²"] },
  { bg: "linear-gradient(135deg,#fa709a,#fee140)", emoji: "🏗", badge: "Satılık", rent: false, price: "₺1,950,000", extra: "",    title: "Kartal 2+1 Metro Yakını",        loc: "Kartal, İstanbul",   meta: ["🛏 2+1","📐 90 m²"] },
  { bg: "linear-gradient(135deg,#a18cd1,#fbc2eb)", emoji: "🏢", badge: "Kiralık", rent: true,  price: "₺65,000",    extra: "/ay", title: "Maslak Premium Ofis Katı",       loc: "Maslak, İstanbul",   meta: ["🏢 Ticari","📐 520 m²"] },
];

export default function IlanlarPage() {
  const [chips, setChips] = useState<Record<string, boolean>>({
    "Satılık": true, "Konut": true, "2+1": true, "3+1": true,
  });

  const toggleChip = (k: string) => setChips(prev => ({ ...prev, [k]: !prev[k] }));

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 60px)" }}>
      {/* Filter Panel */}
      <div style={{ width: 280, background: "#fff", borderRight: "1px solid var(--border)", padding: 20, flexShrink: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Filtreler</div>

        {[
          { label: "İlan Tipi",  keys: ["Satılık","Kiralık"] },
          { label: "Mülk Tipi", keys: ["Konut","Ticari","Arsa","Endüstriyel"] },
          { label: "Oda Sayısı",keys: ["1+0","1+1","2+1","3+1","4+1","5+"] },
          { label: "Özellikler",keys: ["Asansör","Otopark","Balkon","Havuz","Bahçe"] },
        ].map(section => (
          <div key={section.label} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>{section.label}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {section.keys.map(k => (
                <button key={k} onClick={() => toggleChip(k)}
                  style={{ padding: "5px 12px", borderRadius: 20, fontSize: 12, border: "1px solid var(--border)", cursor: "pointer", transition: ".15s", background: chips[k] ? "var(--ink)" : "#fff", color: chips[k] ? "#fff" : "var(--ink)" }}>
                  {k}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Fiyat Aralığı (₺)</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input type="text" placeholder="Min" defaultValue="500.000" style={{ flex: 1, border: "1px solid var(--border)", borderRadius: 8, padding: "6px 10px", fontSize: 12, outline: "none" }} />
            <input type="text" placeholder="Max" defaultValue="10.000.000" style={{ flex: 1, border: "1px solid var(--border)", borderRadius: 8, padding: "6px 10px", fontSize: 12, outline: "none" }} />
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>m² Aralığı</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input type="text" placeholder="Min" defaultValue="80" style={{ flex: 1, border: "1px solid var(--border)", borderRadius: 8, padding: "6px 10px", fontSize: 12, outline: "none" }} />
            <input type="text" placeholder="Max" defaultValue="500" style={{ flex: 1, border: "1px solid var(--border)", borderRadius: 8, padding: "6px 10px", fontSize: 12, outline: "none" }} />
          </div>
        </div>

        <button style={{ width: "100%", marginTop: 8, padding: "8px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none", background: "var(--gold)", color: "var(--ink)" }}>Filtreleri Uygula</button>
        <button style={{ width: "100%", marginTop: 8, padding: "8px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "1px solid var(--border)", background: "#fff", color: "var(--ink)" }}>Temizle</button>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: 24, overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: "var(--muted)", flex: 1 }}><b>1,284</b> ilan bulundu · İstanbul</div>
          <select style={{ border: "1px solid var(--border)", borderRadius: 8, padding: "6px 12px", fontSize: 13, outline: "none", cursor: "pointer" }}>
            <option>En Yeni</option><option>Fiyat ↑</option><option>Fiyat ↓</option><option>m² ↑</option>
          </select>
          <button style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13, cursor: "pointer", background: "#fff" }}>🗺 Harita Görünümü</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 20 }}>
          {allListings.map(l => (
            <div key={l.title} style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid var(--border)", cursor: "pointer", transition: ".2s" }}
              className="hover:shadow-lg hover:-translate-y-[2px]">
              <div style={{ height: 160, background: l.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, position: "relative" }}>
                <div style={{ position: "absolute", top: 10, left: 10, background: l.rent ? "var(--teal)" : "var(--gold)", color: l.rent ? "#fff" : "var(--ink)", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6 }}>{l.badge}</div>
                {l.emoji}
              </div>
              <div style={{ padding: 14 }}>
                <div className="serif" style={{ fontSize: 18, fontWeight: 700 }}>{l.price}{l.extra && <small style={{ fontSize: 12, fontFamily: "system-ui", fontWeight: 400, color: "var(--muted)" }}> {l.extra}</small>}</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.title}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>📍 {l.loc}</div>
                <div style={{ display: "flex", gap: 12, marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border)" }}>
                  {l.meta.map(m => <span key={m} style={{ fontSize: 11, color: "var(--muted)" }}>{m}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Map placeholder */}
        <div style={{ background: "linear-gradient(135deg,#c8d8c8 0%,#d8e8d0 50%,#c0d0c0 100%)", borderRadius: 12, height: 300, display: "flex", alignItems: "center", justifyContent: "center", color: "#4a6a4a", fontSize: 14, position: "relative", overflow: "hidden", marginTop: 20 }}>
          🗺 Harita Görünümü — Koordinat Tabanlı (PostGIS)
          {[
            { top: "30%", left: "40%" }, { top: "50%", left: "60%" },
            { top: "65%", left: "35%" }, { top: "45%", left: "25%" }, { top: "25%", left: "70%" },
          ].map((pos, i) => (
            <div key={i} style={{ position: "absolute", top: pos.top, left: pos.left, fontSize: 24, cursor: "pointer" }}>📍</div>
          ))}
        </div>
      </div>
    </div>
  );
}
