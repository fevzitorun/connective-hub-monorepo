"use client";
import { useState } from "react";

const kpis = [
  { label: "Toplam Kullanıcı",   value: "98.241",  sub: "↑ 1.284 bu hafta",      up: true,  color: "var(--blue)" },
  { label: "Toplam İlan",        value: "124.500", sub: "312 beklemede",           up: null,  color: "var(--green)", subBadge: true },
  { label: "Onaylı Ajans",       value: "3.840",   sub: "↑ 4.210 toplam",         up: true,  color: "var(--teal)" },
  { label: "Aktif Abonelik",     value: "1.924",   sub: "↑ %12 bu ay",           up: true,  color: "var(--gold)" },
  { label: "Mortgage Lead",      value: "8.410",   sub: "toplam başvuru",         up: null,  color: "" },
  { label: "Canlı Müzayede",     value: "217",     sub: "↑ 89 tamamlandı",        up: true,  color: "" },
  { label: "Aylık Gelir",        value: "₺962K",   sub: "↑ %23 geçen ay",        up: true,  color: "" },
  { label: "Aktif Kullanıcı",    value: "41.230",  sub: "son 30 gün",             up: null,  color: "" },
];

const users = [
  { email: "ahmet.k@maslak.com",    name: "Ahmet Karahan", role: "agency",  roleBadge: "badge-blue",  agency: "Maslak Gyr. A.Ş.", status: "Aktif",  statusBadge: "badge-green", date: "20 May 2026" },
  { email: "zeynep@hukuk.av.tr",    name: "Zeynep Aydın",  role: "lawyer",  roleBadge: "badge-gold",  agency: "—",                status: "Aktif",  statusBadge: "badge-green", date: "20 May 2026" },
  { email: "m.demir@isbankasi.com", name: "Mehmet Demir",  role: "bank",    roleBadge: "badge-blue",  agency: "—",                status: "Aktif",  statusBadge: "badge-green", date: "19 May 2026" },
  { email: "ali.yilmaz@gmail.com",  name: "Ali Yılmaz",    role: "buyer",   roleBadge: "badge-gray",  agency: "—",                status: "Pasif",  statusBadge: "badge-yellow", date: "18 May 2026" },
];

const pendingAgencies = [
  { name: "Boğaz Emlak Ltd.",   city: "İstanbul", plan: "Pro",       planBadge: "badge-blue" },
  { name: "Ege Taşınmaz A.Ş.", city: "İzmir",    plan: "Ücretsiz",  planBadge: "badge-gray" },
  { name: "Ankara Konut Ltd.",  city: "Ankara",   plan: "Kurumsal",  planBadge: "badge-gold" },
];

const payments = [
  { agency: "Maslak Gyr.",  plan: "Pro",      amount: "₺499", status: "Başarılı",  badge: "badge-green" },
  { agency: "Boğaz Emlak",  plan: "Kurumsal", amount: "₺999", status: "Başarılı",  badge: "badge-green" },
  { agency: "Ege Taşınmaz", plan: "Pro",      amount: "₺499", status: "Başarısız", badge: "badge-red" },
];

const navItems = [
  { icon: "📊", label: "Platform Özeti" },
  { icon: "👥", label: "Kullanıcılar" },
  { icon: "🏢", label: "Ajanslar" },
  { icon: "📋", label: "İlanlar" },
  { icon: "💳", label: "Abonelikler" },
];

export default function AdminPage() {
  const [activeNav, setActiveNav] = useState(0);

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 60px)" }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: "#0f0f1e", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", fontFamily: "Georgia,serif", fontSize: 16, fontWeight: 700, color: "#fff", background: "rgba(245,200,66,0.1)" }}>
          7<span style={{ color: "var(--gold)" }}>fil</span>
          <small style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "system-ui", fontWeight: 400, marginLeft: 6 }}>Admin</small>
        </div>
        <div style={{ flex: 1, padding: "12px 8px" }}>
          {navItems.map((item, i) => (
            <div key={item.label} onClick={() => setActiveNav(i)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, cursor: "pointer", marginBottom: 2, fontSize: 13, background: activeNav === i ? "var(--gold)" : "transparent", color: activeNav === i ? "var(--ink)" : "rgba(255,255,255,0.5)", fontWeight: activeNav === i ? 600 : 400 }}
              className={activeNav !== i ? "hover:text-white hover:bg-white/10" : ""}>
              {item.icon} {item.label}
            </div>
          ))}
        </div>
        <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "monospace" }}>admin@7fil.com.tr</div>
          <div style={{ marginTop: 2 }}>Süper Admin</div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 28, background: "var(--cream)", overflowY: "auto" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="serif" style={{ fontSize: 22, fontWeight: 700 }}>Platform Özeti</h1>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>7fil.com.tr — Canlı istatistikler</p>
        </div>

        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
          {kpis.map(k => (
            <div key={k.label} style={{ background: "#fff", borderRadius: 16, padding: 18, border: "1px solid var(--border)", borderLeft: k.color ? `3px solid ${k.color}` : "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{k.label}</div>
              <div className="serif" style={{ fontSize: 28, fontWeight: 700, marginTop: 6 }}>{k.value}</div>
              <div style={{ fontSize: 11, marginTop: 4, color: k.up === true ? "var(--green)" : k.up === false ? "var(--red)" : "var(--muted)" }}>
                {k.subBadge ? <span className="badge badge-yellow" style={{ fontSize: 10 }}>{k.sub}</span> : k.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Users table */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid var(--border)", overflow: "hidden", marginTop: 20 }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Son Kayıtlı Kullanıcılar</div>
            <input type="search" placeholder="Ara..." style={{ border: "1px solid var(--border)", borderRadius: 8, padding: "6px 12px", fontSize: 13, outline: "none" }} />
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["E-posta","İsim","Rol","Ajans","Durum","Kayıt"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", background: "#f9fafb", borderBottom: "1px solid var(--border)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td style={{ padding: "12px 16px", fontSize: 12, fontFamily: "monospace", color: "var(--muted)", borderBottom: i < users.length - 1 ? "1px solid #f3f4f6" : "none" }}>{u.email}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, borderBottom: i < users.length - 1 ? "1px solid #f3f4f6" : "none" }}><b>{u.name}</b></td>
                  <td style={{ padding: "12px 16px", borderBottom: i < users.length - 1 ? "1px solid #f3f4f6" : "none" }}><span className={`badge ${u.roleBadge}`}>{u.role}</span></td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--muted)", borderBottom: i < users.length - 1 ? "1px solid #f3f4f6" : "none" }}>{u.agency}</td>
                  <td style={{ padding: "12px 16px", borderBottom: i < users.length - 1 ? "1px solid #f3f4f6" : "none" }}><span className={`badge ${u.statusBadge}`}>{u.status}</span></td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--muted)", borderBottom: i < users.length - 1 ? "1px solid #f3f4f6" : "none" }}>{u.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Agencies + Payments */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid var(--border)", overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Onay Bekleyen Ajanslar</div>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>{["Ajans","Plan","İşlem"].map(h => <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", background: "#f9fafb", borderBottom: "1px solid var(--border)" }}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {pendingAgencies.map((a, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td style={{ padding: "12px 16px", borderBottom: i < pendingAgencies.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                      <b>{a.name}</b><br /><small style={{ color: "var(--muted)" }}>{a.city}</small>
                    </td>
                    <td style={{ padding: "12px 16px", borderBottom: i < pendingAgencies.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                      <span className={`badge ${a.planBadge}`}>{a.plan}</span>
                    </td>
                    <td style={{ padding: "12px 16px", borderBottom: i < pendingAgencies.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                      <button style={{ background: "var(--teal)", color: "#fff", border: "none", borderRadius: 10, padding: "4px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Onayla</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid var(--border)", overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Son Ödemeler</div>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>{["Ajans","Plan","Tutar","Durum"].map(h => <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", background: "#f9fafb", borderBottom: "1px solid var(--border)" }}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td style={{ padding: "12px 16px", fontSize: 13, borderBottom: i < payments.length - 1 ? "1px solid #f3f4f6" : "none" }}>{p.agency}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, borderBottom: i < payments.length - 1 ? "1px solid #f3f4f6" : "none" }}>{p.plan}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, borderBottom: i < payments.length - 1 ? "1px solid #f3f4f6" : "none" }}>{p.amount}</td>
                    <td style={{ padding: "12px 16px", borderBottom: i < payments.length - 1 ? "1px solid #f3f4f6" : "none" }}><span className={`badge ${p.badge}`}>{p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
