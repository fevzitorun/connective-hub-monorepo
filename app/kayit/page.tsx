"use client";
import { useState } from "react";
import Link from "next/link";

type Tab = "agency" | "partner";

const partnerTypes = [
  { value: "lawyer", label: "Avukat / Hukuk Burosu" },
  { value: "bank", label: "Banka (Mortgage)" },
  { value: "participation_bank", label: "Katilim Bankasi" },
  { value: "insurance", label: "Sigorta Sirketi" },
];

export default function KayitPage() {
  const [tab, setTab] = useState<Tab>("agency");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Agency form
  const [agName, setAgName] = useState("");
  const [agAgencyName, setAgAgencyName] = useState("");
  const [agEmail, setAgEmail] = useState("");
  const [agPhone, setAgPhone] = useState("");
  const [agPassword, setAgPassword] = useState("");
  const [agCity, setAgCity] = useState("");
  const [agCountry, setAgCountry] = useState("TR");

  // Partner form
  const [prName, setPrName] = useState("");
  const [prCompany, setPrCompany] = useState("");
  const [prEmail, setPrEmail] = useState("");
  const [prPhone, setPrPhone] = useState("");
  const [prType, setPrType] = useState("lawyer");
  const [prLicense, setPrLicense] = useState("");

  async function handleAgencySubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const slug = agAgencyName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: agName,
          agencyName: agAgencyName,
          agencySlug: slug,
          email: agEmail,
          phone: agPhone,
          password: agPassword,
          role: "agency_owner",
          city: agCity,
          country: agCountry,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setSuccess(true);
      } else {
        setError(data.error || "Kayit basarisiz.");
      }
    } catch {
      setError("Bir hata olustu.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePartnerSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: prName,
          companyName: prCompany,
          email: prEmail,
          phone: prPhone,
          role: "partner",
          partnerType: prType,
          licenseNo: prLicense,
          password: prEmail.split("@")[0] + "Partner2024!",
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setSuccess(true);
      } else {
        setError(data.error || "Kayit basarisiz.");
      }
    } catch {
      setError("Bir hata olustu.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 60px)", background: "var(--cream)" }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: 48, width: 440, border: "1px solid var(--border)", textAlign: "center" }}>
          <div style={{ width: 64, height: 64, background: "#d1fae5", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 28 }}>✓</div>
          <h2 className="serif" style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Basvurunuz Alindi</h2>
          <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
            {tab === "agency"
              ? "Ajans basvurunuz alindi. Ekibimiz en kisa surede inceleyip size e-posta ile bilgi verecektir."
              : "Partner basvurunuz alindi. Kimlik dogrulama surecinden sonra hesabiniz aktif edilecektir."}
          </p>
          <Link href="/giris"
            style={{ display: "inline-block", background: "var(--gold)", color: "var(--ink)", textDecoration: "none", borderRadius: 10, padding: "11px 24px", fontSize: 14, fontWeight: 700 }}>
            Giris Yap
          </Link>
        </div>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: "11px 14px",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    color: "var(--muted)",
    display: "block",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 60px)", background: "var(--cream)", padding: "40px 20px" }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 44, width: 480, border: "1px solid var(--border)", boxShadow: "0 4px 32px rgba(0,0,0,0.07)" }}>
        <div className="serif" style={{ fontSize: 26, fontWeight: 700, marginBottom: 4, color: "var(--ink)" }}>
          7<span style={{ color: "var(--gold)" }}>fil</span>
        </div>
        <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Hesap Olusturun</h1>
        <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 24 }}>
          Zaten hesabiniz var mi?{" "}
          <Link href="/giris" style={{ color: "var(--teal)", fontWeight: 600, textDecoration: "none" }}>Giris yapin</Link>
        </p>

        {/* Tabs */}
        <div style={{ display: "flex", background: "#f3f4f6", borderRadius: 12, padding: 4, marginBottom: 28 }}>
          {([
            { key: "agency" as Tab, label: "Ajans Kaydi" },
            { key: "partner" as Tab, label: "Partner Kaydi" },
          ]).map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setError(""); }}
              style={{ flex: 1, padding: "8px 12px", borderRadius: 9, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer",
                background: tab === t.key ? "#fff" : "transparent",
                color: tab === t.key ? "var(--ink)" : "var(--muted)",
                boxShadow: tab === t.key ? "0 1px 4px rgba(0,0,0,0.1)" : "none" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Agency Form */}
        {tab === "agency" && (
          <form onSubmit={handleAgencySubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={labelStyle}>Adiniz Soyadiniz</label>
                <input type="text" value={agName} onChange={e => setAgName(e.target.value)} required style={inputStyle} placeholder="Ahmet Karahan" />
              </div>
              <div>
                <label style={labelStyle}>Ajans Adi</label>
                <input type="text" value={agAgencyName} onChange={e => setAgAgencyName(e.target.value)} required style={inputStyle} placeholder="Karahan Emlak A.S." />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>E-posta</label>
              <input type="email" value={agEmail} onChange={e => setAgEmail(e.target.value)} required style={inputStyle} placeholder="ahmet@firma.com" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={labelStyle}>Telefon</label>
                <input type="tel" value={agPhone} onChange={e => setAgPhone(e.target.value)} style={inputStyle} placeholder="+90 530 000 0000" />
              </div>
              <div>
                <label style={labelStyle}>Ulke</label>
                <select value={agCountry} onChange={e => setAgCountry(e.target.value)} style={{ ...inputStyle, background: "#fff" }}>
                  <option value="TR">Turkiye (TR)</option>
                  <option value="UK">Birlesik Krallik (UK)</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Sehir</label>
              <input type="text" value={agCity} onChange={e => setAgCity(e.target.value)} style={inputStyle} placeholder="Istanbul" />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Sifre</label>
              <input type="password" value={agPassword} onChange={e => setAgPassword(e.target.value)} required minLength={6} style={inputStyle} placeholder="En az 6 karakter" />
            </div>

            {error && (
              <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#991b1b", marginBottom: 16 }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ width: "100%", background: loading ? "var(--muted)" : "var(--gold)", color: "var(--ink)", border: "none", borderRadius: 10, padding: "12px", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? "Kayit yapiliyor..." : "Ajans Kaydi Yap"}
            </button>

            <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 14, textAlign: "center" }}>
              Ajans hesabiniz admin onayindan sonra aktif edilecektir.
            </p>
          </form>
        )}

        {/* Partner Form */}
        {tab === "partner" && (
          <form onSubmit={handlePartnerSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={labelStyle}>Adiniz Soyadiniz</label>
                <input type="text" value={prName} onChange={e => setPrName(e.target.value)} required style={inputStyle} placeholder="Mehmet Aydin" />
              </div>
              <div>
                <label style={labelStyle}>Sirket / Buro Adi</label>
                <input type="text" value={prCompany} onChange={e => setPrCompany(e.target.value)} required style={inputStyle} placeholder="Aydin Hukuk Burosu" />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Partner Tipi</label>
              <select value={prType} onChange={e => setPrType(e.target.value)} style={{ ...inputStyle, background: "#fff" }}>
                {partnerTypes.map(pt => (
                  <option key={pt.value} value={pt.value}>{pt.label}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>E-posta</label>
              <input type="email" value={prEmail} onChange={e => setPrEmail(e.target.value)} required style={inputStyle} placeholder="avukat@hukuk.av.tr" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={labelStyle}>Telefon</label>
                <input type="tel" value={prPhone} onChange={e => setPrPhone(e.target.value)} style={inputStyle} placeholder="+90 530 000 0000" />
              </div>
              <div>
                <label style={labelStyle}>Lisans / Sicil No</label>
                <input type="text" value={prLicense} onChange={e => setPrLicense(e.target.value)} style={inputStyle} placeholder="Opsiyonel" />
              </div>
            </div>

            {error && (
              <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#991b1b", marginBottom: 16 }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ width: "100%", background: loading ? "var(--muted)" : "var(--teal)", color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", marginBottom: 14 }}>
              {loading ? "Basvuru gonderiliyor..." : "Partner Basvurusu Yap"}
            </button>

            <p style={{ fontSize: 11, color: "var(--muted)", textAlign: "center" }}>
              Partner hesabiniz kimlik dogrulamasindan sonra aktif edilecektir.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
