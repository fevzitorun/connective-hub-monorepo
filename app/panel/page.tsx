"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Agency {
  id: string;
  name: string;
  city?: string;
  subscriptionTier: string;
  isApproved: boolean;
}

interface Listing {
  id: string;
  title: string;
  status: string;
  listingType: string;
  propertyType: string;
  priceAmount?: number;
  priceCurrency?: string;
  city: string;
  viewCount: number;
  isFeatured: boolean;
  createdAt: string;
}

interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: string;
  score: number;
  source: string;
  createdAt: string;
}

interface Subscription {
  tier: string;
  status: string;
  giftCredit: number;
}

interface AnalyticsItem {
  date: string;
  listingViews: number;
  leadsReceived: number;
}

interface DashboardData {
  agency: Agency;
  listings: { total: number; active: number; draft: number; featured: number };
  leads: { total: number; new: number; qualified: number };
  subscription: Subscription | null;
  recentLeads: Lead[];
  recentListings: Listing[];
  analytics: AnalyticsItem[];
}

function scoreColor(score: number): string {
  if (score >= 70) return "var(--teal)";
  if (score >= 40) return "#f59e0b";
  return "var(--muted)";
}

function statusBadgeStyle(status: string): React.CSSProperties {
  const base: React.CSSProperties = { fontSize: 11, padding: "2px 8px", borderRadius: 6, fontWeight: 600 };
  if (status === "active") return { ...base, background: "#d1fae5", color: "#065f46" };
  if (status === "draft") return { ...base, background: "#f3f4f6", color: "#6b7280" };
  if (status === "pending") return { ...base, background: "#fef3c7", color: "#92400e" };
  if (status === "expired" || status === "rejected") return { ...base, background: "#fee2e2", color: "#991b1b" };
  return { ...base, background: "#f3f4f6", color: "#6b7280" };
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    active: "Aktif", draft: "Taslak", pending: "Beklemede",
    expired: "Süresi Doldu", rejected: "Reddedildi",
    new: "Yeni", contacted: "İletişimde", qualified: "Nitelikli",
    negotiating: "Müzakere", won: "Kazanıldı", lost: "Kaybedildi",
  };
  return map[status] || status;
}

function Sparkline({ data }: { data: AnalyticsItem[] }) {
  if (!data.length) {
    return <div style={{ height: 60, display: "flex", alignItems: "center", color: "var(--muted)", fontSize: 12 }}>Veri yok</div>;
  }
  const values = data.map(d => d.listingViews);
  const max = Math.max(...values, 1);
  const width = 300;
  const height = 60;
  const points = values.map((v, i) => {
    const x = (i / Math.max(values.length - 1, 1)) * width;
    const y = height - (v / max) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <polyline
        points={points}
        fill="none"
        stroke="var(--teal)"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {values.map((v, i) => {
        const x = (i / Math.max(values.length - 1, 1)) * width;
        const y = height - (v / max) * height;
        return <circle key={i} cx={x} cy={y} r={3} fill="var(--teal)" />;
      })}
    </svg>
  );
}

type TabKey = "genel" | "ilanlar" | "leads" | "kampanyalar" | "ayarlar";

const navTabs: { key: TabKey; label: string }[] = [
  { key: "genel", label: "Genel Bakış" },
  { key: "ilanlar", label: "İlanlar" },
  { key: "leads", label: "Leads" },
  { key: "kampanyalar", label: "Kampanyalar" },
  { key: "ayarlar", label: "Ayarlar" },
];

export default function PanelPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [tab, setTab] = useState<TabKey>("genel");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const fetchDashboard = useCallback(async () => {
    const res = await fetch("/api/agency/dashboard");
    if (res.ok) {
      const data = await res.json();
      setDashboard(data);
    }
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(data => {
        if (data.ok) {
          setUser(data.user);
          fetchDashboard();
        }
      })
      .finally(() => setLoading(false));
  }, [fetchDashboard]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (data.ok) {
        setUser(data.user);
        fetchDashboard();
      } else {
        setLoginError(data.error || "Giriş başarısız.");
      }
    } catch {
      setLoginError("Bir hata oluştu. Tekrar deneyin.");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setDashboard(null);
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 60px)", color: "var(--muted)" }}>
        Yükleniyor...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 60px)", background: "var(--cream)" }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: 40, width: 380, border: "1px solid var(--border)", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <div className="serif" style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
            7<span style={{ color: "var(--gold)" }}>fil</span> Panel
          </div>
          <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 24 }}>Devam etmek için giriş yapın</p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 6 }}>E-posta</label>
              <input
                type="email"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                required
                style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                placeholder="ornek@sirket.com"
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 6 }}>Şifre</label>
              <input
                type="password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                required
                style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                placeholder="••••••••"
              />
            </div>
            {loginError && <div style={{ color: "#dc2626", fontSize: 13, marginBottom: 14 }}>{loginError}</div>}
            <button type="submit" disabled={loginLoading}
              style={{ width: "100%", background: "var(--gold)", color: "var(--ink)", border: "none", borderRadius: 10, padding: "11px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              {loginLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--muted)" }}>
            Hesabınız yok mu?{" "}
            <Link href="/kayit" style={{ color: "var(--teal)", fontWeight: 600 }}>Kayıt olun</Link>
          </div>
        </div>
      </div>
    );
  }

  const d = dashboard;

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 60px)" }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: "var(--ink)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", fontFamily: "Georgia,serif", fontSize: 16, fontWeight: 700, color: "#fff" }}>
          7<span style={{ color: "var(--gold)" }}>fil</span>
          <small style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "system-ui", fontWeight: 400, marginLeft: 6 }}>Panel</small>
        </div>
        <div style={{ flex: 1, padding: "12px 8px" }}>
          {navTabs.map(t => (
            <div key={t.key} onClick={() => setTab(t.key)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, cursor: "pointer", marginBottom: 2, fontSize: 13,
                background: tab === t.key ? "var(--gold)" : "transparent",
                color: tab === t.key ? "var(--ink)" : "rgba(255,255,255,0.5)",
                fontWeight: tab === t.key ? 600 : 400 }}
              className={tab !== t.key ? "hover:text-white hover:bg-white/10" : ""}>
              {t.label}
            </div>
          ))}
          <div style={{ marginTop: 8, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 8 }}>
            <Link href="/ilanlar" style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, textDecoration: "none", marginBottom: 2, fontSize: 13, color: "rgba(255,255,255,0.5)" }}
              className="hover:text-white hover:bg-white/10">
              Atlas AI
            </Link>
            <Link href="/muzayede" style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, textDecoration: "none", marginBottom: 2, fontSize: 13, color: "rgba(255,255,255,0.5)" }}
              className="hover:text-white hover:bg-white/10">
              Müzayede
            </Link>
          </div>
        </div>
        <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600 }}>{user.name}</div>
          {d?.agency && <div style={{ marginTop: 2 }}>{d.agency.name}</div>}
          <button onClick={handleLogout} style={{ marginTop: 8, background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.4)", borderRadius: 6, padding: "4px 10px", fontSize: 11, cursor: "pointer" }}>
            Çıkış Yap
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 28, overflowY: "auto", background: "var(--cream)" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 className="serif" style={{ fontSize: 22, fontWeight: 700 }}>
              Merhaba, {user.name.split(" ")[0]} Bey/Hanım
            </h1>
            <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>
              {d?.agency?.name || "Ajansınız"} — {new Date().toLocaleDateString("tr-TR", { month: "long", year: "numeric" })}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ background: "var(--gold)", color: "var(--ink)", border: "none", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              + Yeni İlan
            </button>
            <button onClick={() => setTab("leads")} style={{ background: "#fff", color: "var(--ink)", border: "1px solid var(--border)", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Leads
            </button>
            <button onClick={() => setTab("kampanyalar")} style={{ background: "#fff", color: "var(--ink)", border: "1px solid var(--border)", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Kampanyalar
            </button>
          </div>
        </div>

        {/* Genel Bakış Tab */}
        {tab === "genel" && (
          <>
            {/* KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
              <div style={{ background: "#fff", borderRadius: 16, padding: 18, border: "1px solid var(--border)", borderLeft: "3px solid var(--teal)" }}>
                <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Toplam İlan</div>
                <div className="serif" style={{ fontSize: 28, fontWeight: 700, marginTop: 6 }}>{d?.listings.total ?? 0}</div>
                <div style={{ fontSize: 11, marginTop: 4, color: "var(--muted)" }}>{d?.listings.active ?? 0} aktif · {d?.listings.draft ?? 0} taslak</div>
              </div>
              <div style={{ background: "#fff", borderRadius: 16, padding: 18, border: "1px solid var(--border)", borderLeft: "3px solid var(--gold)" }}>
                <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Toplam Lead</div>
                <div className="serif" style={{ fontSize: 28, fontWeight: 700, marginTop: 6 }}>{d?.leads.total ?? 0}</div>
                <div style={{ fontSize: 11, marginTop: 4, color: "var(--muted)" }}>{d?.leads.new ?? 0} yeni · {d?.leads.qualified ?? 0} nitelikli</div>
              </div>
              <div style={{ background: "#fff", borderRadius: 16, padding: 18, border: "1px solid var(--border)", borderLeft: "3px solid #8b5cf6" }}>
                <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Öne Çıkan</div>
                <div className="serif" style={{ fontSize: 28, fontWeight: 700, marginTop: 6 }}>{d?.listings.featured ?? 0}</div>
                <div style={{ fontSize: 11, marginTop: 4, color: "var(--muted)" }}>Öne çıkarılmış ilan</div>
              </div>
              <div style={{ background: "#fff", borderRadius: 16, padding: 18, border: "1px solid var(--border)", borderLeft: "3px solid #10b981" }}>
                <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Abonelik</div>
                <div className="serif" style={{ fontSize: 22, fontWeight: 700, marginTop: 6, textTransform: "capitalize" }}>
                  {d?.subscription?.tier ?? "Ücretsiz"}
                </div>
                {d?.subscription?.giftCredit ? (
                  <div style={{ fontSize: 11, marginTop: 4, color: "var(--teal)", fontWeight: 600 }}>₺{d.subscription.giftCredit.toLocaleString()} hediye kredi</div>
                ) : null}
              </div>
            </div>

            {/* Pending approval notice */}
            {d?.agency && !d.agency.isApproved && (
              <div style={{ background: "#fef3c7", border: "1px solid #f59e0b", borderRadius: 12, padding: "12px 16px", marginBottom: 20, fontSize: 13 }}>
                <strong>Ajansınız onay bekliyor.</strong> Onaylandıktan sonra ilanlarınız yayınlanabilir.
              </div>
            )}

            {/* Analytics Sparkline */}
            {d?.analytics && d.analytics.length > 0 && (
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid var(--border)", padding: 20, marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ fontWeight: 700 }}>Son 7 Gün — Görüntülenme</div>
                </div>
                <Sparkline data={d.analytics} />
                {d.analytics.length > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "var(--muted)" }}>
                    {d.analytics.map(a => (
                      <span key={a.date}>{new Date(a.date).toLocaleDateString("tr-TR", { month: "short", day: "numeric" })}</span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Recent Leads */}
            {d?.recentLeads && d.recentLeads.length > 0 && (
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid var(--border)", overflow: "hidden", marginBottom: 20 }}>
                <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>Son Leads</div>
                  <button onClick={() => setTab("leads")} style={{ background: "transparent", border: "none", color: "var(--teal)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Tümünü Gör</button>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {["İsim","Kaynak","Durum","Skor","Tarih"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", background: "#f9fafb", borderBottom: "1px solid var(--border)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {d.recentLeads.map((lead, i) => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td style={{ padding: "12px 16px", borderBottom: i < d.recentLeads.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                          <b style={{ fontSize: 13 }}>{lead.name}</b>
                          {lead.email && <div style={{ fontSize: 11, color: "var(--muted)" }}>{lead.email}</div>}
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--muted)", borderBottom: i < d.recentLeads.length - 1 ? "1px solid #f3f4f6" : "none" }}>{lead.source}</td>
                        <td style={{ padding: "12px 16px", borderBottom: i < d.recentLeads.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                          <span style={statusBadgeStyle(lead.status)}>{statusLabel(lead.status)}</span>
                        </td>
                        <td style={{ padding: "12px 16px", borderBottom: i < d.recentLeads.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: scoreColor(lead.score) }}>{lead.score}</span>
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--muted)", borderBottom: i < d.recentLeads.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                          {new Date(lead.createdAt).toLocaleDateString("tr-TR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Recent Listings */}
            {d?.recentListings && d.recentListings.length > 0 && (
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid var(--border)", overflow: "hidden" }}>
                <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>Son İlanlar</div>
                  <button onClick={() => setTab("ilanlar")} style={{ background: "transparent", border: "none", color: "var(--teal)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Tümünü Gör</button>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {["İlan","Şehir","Fiyat","Görüntülenme","Durum"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", background: "#f9fafb", borderBottom: "1px solid var(--border)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {d.recentListings.map((listing, i) => (
                      <tr key={listing.id} className="hover:bg-gray-50">
                        <td style={{ padding: "12px 16px", borderBottom: i < d.recentListings.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                          <b style={{ fontSize: 13 }}>{listing.title}</b>
                          {listing.isFeatured && <span style={{ marginLeft: 6, fontSize: 10, background: "var(--gold)", color: "var(--ink)", padding: "1px 5px", borderRadius: 4, fontWeight: 700 }}>ONE CIKAN</span>}
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--muted)", borderBottom: i < d.recentListings.length - 1 ? "1px solid #f3f4f6" : "none" }}>{listing.city}</td>
                        <td style={{ padding: "12px 16px", fontSize: 13, borderBottom: i < d.recentListings.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                          {listing.priceAmount ? `${listing.priceCurrency === "TRY" ? "₺" : "£"}${listing.priceAmount.toLocaleString()}` : "—"}
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 13, borderBottom: i < d.recentListings.length - 1 ? "1px solid #f3f4f6" : "none" }}>{listing.viewCount.toLocaleString()}</td>
                        <td style={{ padding: "12px 16px", borderBottom: i < d.recentListings.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                          <span style={statusBadgeStyle(listing.status)}>{statusLabel(listing.status)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* İlanlar Tab */}
        {tab === "ilanlar" && (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid var(--border)", padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>İlanlarım</h2>
              <button style={{ background: "var(--gold)", color: "var(--ink)", border: "none", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                + Yeni İlan Oluştur
              </button>
            </div>
            {d?.recentListings?.length ? (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["İlan Başlığı","Tip","Şehir","Fiyat","Görüntülenme","Durum"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", background: "#f9fafb", borderBottom: "1px solid var(--border)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {d.recentListings.map((listing, i) => (
                    <tr key={listing.id} className="hover:bg-gray-50">
                      <td style={{ padding: "12px 16px", borderBottom: i < d.recentListings.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                        <b style={{ fontSize: 13 }}>{listing.title}</b>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--muted)", borderBottom: i < d.recentListings.length - 1 ? "1px solid #f3f4f6" : "none" }}>{listing.listingType === "sale" ? "Satılık" : "Kiralık"}</td>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--muted)", borderBottom: i < d.recentListings.length - 1 ? "1px solid #f3f4f6" : "none" }}>{listing.city}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, borderBottom: i < d.recentListings.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                        {listing.priceAmount ? `${listing.priceCurrency === "TRY" ? "₺" : "£"}${listing.priceAmount.toLocaleString()}` : "—"}
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 13, borderBottom: i < d.recentListings.length - 1 ? "1px solid #f3f4f6" : "none" }}>{listing.viewCount.toLocaleString()}</td>
                      <td style={{ padding: "12px 16px", borderBottom: i < d.recentListings.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                        <span style={statusBadgeStyle(listing.status)}>{statusLabel(listing.status)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>Henüz ilan yok. İlk ilanınızı oluşturun.</div>
            )}
          </div>
        )}

        {/* Leads Tab */}
        {tab === "leads" && (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid var(--border)", padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Leads</h2>
              <button style={{ background: "var(--gold)", color: "var(--ink)", border: "none", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                + Manuel Lead Ekle
              </button>
            </div>
            {d?.recentLeads?.length ? (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["İsim","İletişim","Kaynak","Durum","Skor","Tarih"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", background: "#f9fafb", borderBottom: "1px solid var(--border)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {d.recentLeads.map((lead, i) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td style={{ padding: "12px 16px", borderBottom: i < d.recentLeads.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                        <b style={{ fontSize: 13 }}>{lead.name}</b>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--muted)", borderBottom: i < d.recentLeads.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                        {lead.email || lead.phone || "—"}
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--muted)", borderBottom: i < d.recentLeads.length - 1 ? "1px solid #f3f4f6" : "none" }}>{lead.source}</td>
                      <td style={{ padding: "12px 16px", borderBottom: i < d.recentLeads.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                        <span style={statusBadgeStyle(lead.status)}>{statusLabel(lead.status)}</span>
                      </td>
                      <td style={{ padding: "12px 16px", borderBottom: i < d.recentLeads.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: scoreColor(lead.score) }}>{lead.score}/100</span>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--muted)", borderBottom: i < d.recentLeads.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                        {new Date(lead.createdAt).toLocaleDateString("tr-TR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>Henüz lead yok.</div>
            )}
          </div>
        )}

        {/* Kampanyalar Tab */}
        {tab === "kampanyalar" && (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid var(--border)", padding: 40, textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>✉</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Email Kampanyaları</h2>
            <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 20 }}>Alıcılarınıza hedefli kampanyalar gönderin.</p>
            <button style={{ background: "var(--gold)", color: "var(--ink)", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              + Yeni Kampanya
            </button>
          </div>
        )}

        {/* Ayarlar Tab */}
        {tab === "ayarlar" && (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid var(--border)", padding: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Hesap Ayarları</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 6 }}>İsim</label>
                <input type="text" defaultValue={user.name} style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 6 }}>E-posta</label>
                <input type="email" defaultValue={user.email} style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>
            <button style={{ marginTop: 20, background: "var(--gold)", color: "var(--ink)", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              Kaydet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
