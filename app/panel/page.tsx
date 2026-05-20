"use client";
import { useState } from "react";
import Link from "next/link";

const kpis = [
  { label: "Toplam Görüntülenme", value: "24.891", sub: "↑ %18 geçen aya göre", up: true },
  { label: "WhatsApp Tıklama",    value: "1.247",  sub: "↑ %32 geçen aya göre", up: true },
  { label: "Aktif İlan",          value: "23",     sub: "50 hak üzerinden",      up: null },
  { label: "Favorilenme",         value: "384",    sub: "↓ %4 geçen aya göre",  up: false },
];

const topListings = [
  { title: "Beşiktaş 3+1 Deniz", price: "₺4.850.000", views: 4291, wa: 187, fav: 64,  status: "Aktif",    statusClass: "badge-green" },
  { title: "Levent Ofis 380m²",  price: "₺65.000/ay",  views: 3105, wa: 142, fav: 41,  status: "Aktif",    statusClass: "badge-green" },
  { title: "Maslak 2+1 Kiralık", price: "₺32.000/ay",  views: 2880, wa: 98,  fav: 29,  status: "Aktif",    statusClass: "badge-green" },
  { title: "Sarıyer Villa 4+2",  price: "₺12.500.000", views: 1940, wa: 73,  fav: 55,  status: "Beklemede", statusClass: "badge-yellow" },
  { title: "Kadıköy 2+1 Yeni",   price: "₺2.200.000",  views: 1720, wa: 61,  fav: 33,  status: "Pasif",    statusClass: "badge-gray" },
];

const sparkHeights = [45, 55, 48, 62, 70, 65, 82, 100];

const navItems = [
  { icon: "📊", label: "Özet",     key: "ozet" },
  { icon: "📋", label: "İlanlarım", key: "ilanlar" },
  { icon: "📈", label: "Analitik", key: "analitik" },
  { icon: "🤖", label: "Atlas AI", key: "atlas", href: "/atlas" },
  { icon: "🔨", label: "Müzayede", key: "muzayede", href: "/muzayede" },
  { icon: "🏷", label: "Abonelik", key: "abonelik" },
  { icon: "⚙️", label: "Profil",   key: "profil" },
  { icon: "🎨", label: "Marka",    key: "marka" },
];

export default function PanelPage() {
  const [active, setActive] = useState("ozet");

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 60px)" }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: "var(--ink)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", fontFamily: "Georgia,serif", fontSize: 16, fontWeight: 700, color: "#fff" }}>
          7<span style={{ color: "var(--gold)" }}>fil</span>
          <small style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "system-ui", fontWeight: 400, marginLeft: 6 }}>Panel</small>
        </div>
        <div style={{ flex: 1, padding: "12px 8px" }}>
          {navItems.map(item => {
            const isActive = active === item.key;
            if (item.href) {
              return (
                <Link key={item.key} href={item.href}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, textDecoration: "none", marginBottom: 2, fontSize: 13, color: "rgba(255,255,255,0.5)" }}
                  className="hover:text-white hover:bg-white/10">
                  {item.icon} {item.label}
                </Link>
              );
            }
            return (
              <div key={item.key} onClick={() => setActive(item.key)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, cursor: "pointer", marginBottom: 2, fontSize: 13, background: isActive ? "var(--gold)" : "transparent", color: isActive ? "var(--ink)" : "rgba(255,255,255,0.5)", fontWeight: isActive ? 600 : 400 }}
                className={!isActive ? "hover:text-white hover:bg-white/10" : ""}>
                {item.icon} {item.label}
              </div>
            );
          })}
        </div>
        <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>Maslak Gayrimenkul A.Ş.</div>
          <div style={{ marginTop: 2 }}>Pro Plan · 23 Aktif İlan</div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 28, overflowY: "auto", background: "var(--cream)" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="serif" style={{ fontSize: 22, fontWeight: 700 }}>Merhaba, Ahmet Bey 👋</h1>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>Son 30 günün performansı — Maslak Gayrimenkul A.Ş.</p>
        </div>

        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
          {kpis.map(k => (
            <div key={k.label} style={{ background: "#fff", borderRadius: 16, padding: 18, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{k.label}</div>
              <div className="serif" style={{ fontSize: 28, fontWeight: 700, marginTop: 6 }}>{k.value}</div>
              <div style={{ fontSize: 11, marginTop: 4, color: k.up === true ? "var(--green)" : k.up === false ? "var(--red)" : "var(--muted)" }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Trend chart */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid var(--border)", padding: 20, marginTop: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontWeight: 700 }}>Görüntülenme Trendi (Son 8 Hafta)</div>
            <div style={{ fontSize: 12, color: "var(--teal)", fontWeight: 600 }}>↑ 18% büyüme</div>
          </div>
          <div className="sparkline" style={{ height: 80 }}>
            {sparkHeights.map((h, i) => (
              <div key={i} className="spark-bar" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "var(--muted)" }}>
            {["Mar","Mar","Nis","Nis","May","May","Haz","Bu Hafta"].map(l => <span key={l}>{l}</span>)}
          </div>
        </div>

        {/* Top listings table */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid var(--border)", overflow: "hidden", marginTop: 20 }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>En İyi Performanslı İlanlar</div>
            <button style={{ background: "var(--gold)", color: "var(--ink)", border: "none", borderRadius: 10, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>+ Yeni İlan</button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["İlan","Görüntülenme","WA Tıklama","Favori","Durum"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", background: "#f9fafb", borderBottom: "1px solid var(--border)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topListings.map((l, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td style={{ padding: "12px 16px", borderBottom: i < topListings.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                    <b>{l.title}</b><br />
                    <small style={{ color: "var(--muted)" }}>{l.price}</small>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, borderBottom: i < topListings.length - 1 ? "1px solid #f3f4f6" : "none" }}>{l.views.toLocaleString()}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, borderBottom: i < topListings.length - 1 ? "1px solid #f3f4f6" : "none" }}>{l.wa}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, borderBottom: i < topListings.length - 1 ? "1px solid #f3f4f6" : "none" }}>{l.fav}</td>
                  <td style={{ padding: "12px 16px", borderBottom: i < topListings.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                    <span className={`badge ${l.statusClass}`}>{l.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
