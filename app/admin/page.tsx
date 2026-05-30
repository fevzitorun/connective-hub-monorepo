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
  country: string;
  isApproved: boolean;
  isActive: boolean;
  createdAt: string;
  subscriptionTier: string;
  owner: { name: string; email: string };
  subscription?: { tier: string; status: string } | null;
}

interface AgentJob {
  id: string;
  agentType: string;
  status: string;
  createdAt: string;
  completedAt?: string;
  startedAt?: string;
  error?: string;
}

interface DashboardData {
  totalAgencies: number;
  pendingAgencies: number;
  totalListings: number;
  activeListings: number;
  totalUsers: number;
  recentAgencies: Agency[];
  agentJobsSummary: { agentType: string; status: string; _count: { id: number } }[];
}

type TabKey = "ozet" | "ajanslar" | "kullanicilar" | "ilanlar" | "agentler";

const navItems: { key: TabKey; label: string }[] = [
  { key: "ozet", label: "Platform Ozeti" },
  { key: "ajanslar", label: "Ajanslar" },
  { key: "kullanicilar", label: "Kullanicilar" },
  { key: "ilanlar", label: "Ilanlar" },
  { key: "agentler", label: "AI Agentler" },
];

function statusBadge(val: boolean, trueLabel: string, falseLabel: string) {
  const style: React.CSSProperties = {
    fontSize: 11, padding: "2px 8px", borderRadius: 6, fontWeight: 600,
    background: val ? "#d1fae5" : "#fee2e2",
    color: val ? "#065f46" : "#991b1b",
  };
  return <span style={style}>{val ? trueLabel : falseLabel}</span>;
}

function jobStatusStyle(status: string): React.CSSProperties {
  const base: React.CSSProperties = { fontSize: 11, padding: "2px 8px", borderRadius: 6, fontWeight: 600 };
  if (status === "completed") return { ...base, background: "#d1fae5", color: "#065f46" };
  if (status === "failed") return { ...base, background: "#fee2e2", color: "#991b1b" };
  if (status === "running") return { ...base, background: "#dbeafe", color: "#1e40af" };
  return { ...base, background: "#f3f4f6", color: "#6b7280" };
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [agentJobs, setAgentJobs] = useState<AgentJob[]>([]);
  const [tab, setTab] = useState<TabKey>("ozet");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [approving, setApproving] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const [dashRes, jobsRes] = await Promise.all([
      fetch("/api/admin/dashboard"),
      fetch("/api/agents/jobs"),
    ]);
    if (dashRes.ok) {
      const data = await dashRes.json();
      setDashboard(data);
    }
    if (jobsRes.ok) {
      const data = await jobsRes.json();
      setAgentJobs(data.jobs || []);
    }
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(data => {
        if (data.ok && data.user.role === "admin") {
          setUser(data.user);
          fetchData();
        }
      })
      .finally(() => setLoading(false));
  }, [fetchData]);

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
      if (data.ok && data.user.role === "admin") {
        setUser(data.user);
        fetchData();
      } else if (data.ok) {
        setLoginError("Bu hesap admin yetkisine sahip değil.");
      } else {
        setLoginError(data.error || "Giriş başarısız.");
      }
    } catch {
      setLoginError("Bir hata oluştu.");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setDashboard(null);
  }

  async function handleApprove(agencyId: string) {
    setApproving(agencyId);
    try {
      await fetch(`/api/admin/agencies/${agencyId}/approve`, { method: "POST" });
      await fetchData();
    } finally {
      setApproving(null);
    }
  }

  async function handleReject(agencyId: string) {
    setApproving(agencyId);
    try {
      await fetch(`/api/admin/agencies/${agencyId}/reject`, { method: "POST" });
      await fetchData();
    } finally {
      setApproving(null);
    }
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 60px)", color: "var(--muted)" }}>
        Yukleniyor...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 60px)", background: "var(--cream)" }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: 40, width: 380, border: "1px solid var(--border)", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <div className="serif" style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
            7<span style={{ color: "var(--gold)" }}>fil</span> Admin
          </div>
          <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 24 }}>Sadece admin hesaplari erisebilir</p>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 6 }}>E-posta</label>
              <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required
                style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                placeholder="admin@7fil.com.tr" />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 6 }}>Sifre</label>
              <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required
                style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                placeholder="••••••••" />
            </div>
            {loginError && <div style={{ color: "#dc2626", fontSize: 13, marginBottom: 14 }}>{loginError}</div>}
            <button type="submit" disabled={loginLoading}
              style={{ width: "100%", background: "var(--gold)", color: "var(--ink)", border: "none", borderRadius: 10, padding: "11px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              {loginLoading ? "Giris yapiliyor..." : "Admin Girisi"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const d = dashboard;
  const pendingAgencies = d?.recentAgencies?.filter(a => !a.isApproved) ?? [];

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 60px)" }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: "#0f0f1e", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", fontFamily: "Georgia,serif", fontSize: 16, fontWeight: 700, color: "#fff", background: "rgba(245,200,66,0.08)" }}>
          7<span style={{ color: "var(--gold)" }}>fil</span>
          <small style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "system-ui", fontWeight: 400, marginLeft: 6 }}>Admin</small>
        </div>
        <div style={{ flex: 1, padding: "12px 8px" }}>
          {navItems.map(item => (
            <div key={item.key} onClick={() => setTab(item.key)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, cursor: "pointer", marginBottom: 2, fontSize: 13,
                background: tab === item.key ? "var(--gold)" : "transparent",
                color: tab === item.key ? "var(--ink)" : "rgba(255,255,255,0.5)",
                fontWeight: tab === item.key ? 600 : 400 }}
              className={tab !== item.key ? "hover:text-white hover:bg-white/10" : ""}>
              {item.label}
              {item.key === "ajanslar" && (d?.pendingAgencies ?? 0) > 0 && (
                <span style={{ marginLeft: "auto", background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 10 }}>
                  {d?.pendingAgencies}
                </span>
              )}
            </div>
          ))}
        </div>
        <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "monospace" }}>{user.email}</div>
          <div style={{ marginTop: 2 }}>Super Admin</div>
          <button onClick={handleLogout} style={{ marginTop: 8, background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.4)", borderRadius: 6, padding: "4px 10px", fontSize: 11, cursor: "pointer" }}>
            Cikis Yap
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 28, background: "var(--cream)", overflowY: "auto" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="serif" style={{ fontSize: 22, fontWeight: 700 }}>
            {navItems.find(i => i.key === tab)?.label || "Platform Ozeti"}
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>7fil.com.tr — Canli istatistikler</p>
        </div>

        {/* Ozet Tab */}
        {tab === "ozet" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
              {[
                { label: "Toplam Ajans", value: d?.totalAgencies ?? 0, sub: `${d?.pendingAgencies ?? 0} onay bekliyor`, color: "var(--teal)" },
                { label: "Toplam Ilan", value: d?.totalListings ?? 0, sub: `${d?.activeListings ?? 0} aktif`, color: "var(--gold)" },
                { label: "Toplam Kullanici", value: d?.totalUsers ?? 0, sub: "Kayitli", color: "#8b5cf6" },
                { label: "Onay Bekleyen", value: d?.pendingAgencies ?? 0, sub: "Ajans", color: "#ef4444" },
              ].map(k => (
                <div key={k.label} style={{ background: "#fff", borderRadius: 16, padding: 18, border: "1px solid var(--border)", borderLeft: `3px solid ${k.color}` }}>
                  <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{k.label}</div>
                  <div className="serif" style={{ fontSize: 32, fontWeight: 700, marginTop: 6 }}>{k.value.toLocaleString()}</div>
                  <div style={{ fontSize: 11, marginTop: 4, color: "var(--muted)" }}>{k.sub}</div>
                </div>
              ))}
            </div>

            {/* Pending agencies on overview */}
            {pendingAgencies.length > 0 && (
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid var(--border)", overflow: "hidden", marginBottom: 20 }}>
                <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", background: "#fef3c7" }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>Onay Bekleyen Ajanslar ({pendingAgencies.length})</div>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {["Ajans","Sahip","Sehir","Plan","Islem"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", background: "#f9fafb", borderBottom: "1px solid var(--border)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pendingAgencies.map((agency, i) => (
                      <tr key={agency.id} className="hover:bg-gray-50">
                        <td style={{ padding: "12px 16px", borderBottom: i < pendingAgencies.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                          <b style={{ fontSize: 13 }}>{agency.name}</b>
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 12, borderBottom: i < pendingAgencies.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                          <div>{agency.owner.name}</div>
                          <div style={{ color: "var(--muted)", fontSize: 11, fontFamily: "monospace" }}>{agency.owner.email}</div>
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--muted)", borderBottom: i < pendingAgencies.length - 1 ? "1px solid #f3f4f6" : "none" }}>{agency.city || "—"}</td>
                        <td style={{ padding: "12px 16px", borderBottom: i < pendingAgencies.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                          <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 6, fontWeight: 600, background: "#dbeafe", color: "#1e40af", textTransform: "capitalize" }}>
                            {agency.subscriptionTier}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", borderBottom: i < pendingAgencies.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => handleApprove(agency.id)} disabled={approving === agency.id}
                              style={{ background: "var(--teal)", color: "#fff", border: "none", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                              Onayla
                            </button>
                            <button onClick={() => handleReject(agency.id)} disabled={approving === agency.id}
                              style={{ background: "#fee2e2", color: "#991b1b", border: "none", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                              Reddet
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Agent jobs summary */}
            {agentJobs.length > 0 && (
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid var(--border)", overflow: "hidden" }}>
                <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>Son AI Agent Isleri</div>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {["Agent Tipi","Durum","Baslangic","Bitis"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", background: "#f9fafb", borderBottom: "1px solid var(--border)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {agentJobs.slice(0, 10).map((job, i) => (
                      <tr key={job.id} className="hover:bg-gray-50">
                        <td style={{ padding: "12px 16px", fontSize: 13, fontFamily: "monospace", borderBottom: i < agentJobs.length - 1 ? "1px solid #f3f4f6" : "none" }}>{job.agentType}</td>
                        <td style={{ padding: "12px 16px", borderBottom: i < agentJobs.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                          <span style={jobStatusStyle(job.status)}>{job.status}</span>
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--muted)", borderBottom: i < agentJobs.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                          {job.startedAt ? new Date(job.startedAt).toLocaleString("tr-TR") : "—"}
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--muted)", borderBottom: i < agentJobs.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                          {job.completedAt ? new Date(job.completedAt).toLocaleString("tr-TR") : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Ajanslar Tab */}
        {tab === "ajanslar" && (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid var(--border)", overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Tum Ajanslar</div>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>{d?.recentAgencies?.length ?? 0} ajans</span>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Ajans","Sahip","Sehir","Plan","Onay","Tarih","Islem"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", background: "#f9fafb", borderBottom: "1px solid var(--border)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(d?.recentAgencies ?? []).map((agency, i) => (
                  <tr key={agency.id} className="hover:bg-gray-50">
                    <td style={{ padding: "12px 16px", borderBottom: i < (d?.recentAgencies?.length ?? 0) - 1 ? "1px solid #f3f4f6" : "none" }}>
                      <b style={{ fontSize: 13 }}>{agency.name}</b>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 12, borderBottom: i < (d?.recentAgencies?.length ?? 0) - 1 ? "1px solid #f3f4f6" : "none" }}>
                      <div>{agency.owner.name}</div>
                      <div style={{ color: "var(--muted)", fontSize: 11 }}>{agency.owner.email}</div>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--muted)", borderBottom: i < (d?.recentAgencies?.length ?? 0) - 1 ? "1px solid #f3f4f6" : "none" }}>{agency.city || "—"}</td>
                    <td style={{ padding: "12px 16px", borderBottom: i < (d?.recentAgencies?.length ?? 0) - 1 ? "1px solid #f3f4f6" : "none" }}>
                      <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 6, fontWeight: 600, background: "#dbeafe", color: "#1e40af", textTransform: "capitalize" }}>
                        {agency.subscriptionTier}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", borderBottom: i < (d?.recentAgencies?.length ?? 0) - 1 ? "1px solid #f3f4f6" : "none" }}>
                      {statusBadge(agency.isApproved, "Onaylandi", "Bekliyor")}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--muted)", borderBottom: i < (d?.recentAgencies?.length ?? 0) - 1 ? "1px solid #f3f4f6" : "none" }}>
                      {new Date(agency.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td style={{ padding: "12px 16px", borderBottom: i < (d?.recentAgencies?.length ?? 0) - 1 ? "1px solid #f3f4f6" : "none" }}>
                      {!agency.isApproved && (
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => handleApprove(agency.id)} disabled={approving === agency.id}
                            style={{ background: "var(--teal)", color: "#fff", border: "none", borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                            Onayla
                          </button>
                          <button onClick={() => handleReject(agency.id)} disabled={approving === agency.id}
                            style={{ background: "#fee2e2", color: "#991b1b", border: "none", borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                            Reddet
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* AI Agentler Tab */}
        {tab === "agentler" && (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid var(--border)", overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>AI Agent Isleri</div>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>Son 20 is</span>
            </div>
            {agentJobs.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>Henuz agent isi yok.</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Agent","Durum","Sure (ms)","Hata","Tarih"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", background: "#f9fafb", borderBottom: "1px solid var(--border)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {agentJobs.map((job, i) => {
                    const duration = job.startedAt && job.completedAt
                      ? new Date(job.completedAt).getTime() - new Date(job.startedAt).getTime()
                      : null;
                    return (
                      <tr key={job.id} className="hover:bg-gray-50">
                        <td style={{ padding: "12px 16px", fontSize: 13, fontFamily: "monospace", borderBottom: i < agentJobs.length - 1 ? "1px solid #f3f4f6" : "none" }}>{job.agentType}</td>
                        <td style={{ padding: "12px 16px", borderBottom: i < agentJobs.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                          <span style={jobStatusStyle(job.status)}>{job.status}</span>
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--muted)", borderBottom: i < agentJobs.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                          {duration !== null ? duration : "—"}
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 12, color: "#dc2626", borderBottom: i < agentJobs.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                          {job.error ? job.error.slice(0, 50) : "—"}
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--muted)", borderBottom: i < agentJobs.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                          {new Date(job.createdAt).toLocaleString("tr-TR")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Placeholders for other tabs */}
        {(tab === "kullanicilar" || tab === "ilanlar") && (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid var(--border)", padding: 40, textAlign: "center" }}>
            <p style={{ color: "var(--muted)", fontSize: 14 }}>{tab === "kullanicilar" ? "Kullanici yonetimi" : "Ilan moderasyonu"} burada gosterilecek.</p>
            <Link href={tab === "ilanlar" ? "/ilanlar" : "#"} style={{ display: "inline-block", marginTop: 12, color: "var(--teal)", fontWeight: 600, fontSize: 13 }}>
              {tab === "ilanlar" ? "Ilanlar sayfasina git" : "Yakinlikta"}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
